import type { Question, AnswerOption, QuestionType } from '@jumbo/shared';

/** Patterns that indicate the start of a new question */
const Q_START = /^(?:Q\d+[:.)]|\d{1,3}[\.\)]\s+\S|\bQuestion\s+\d+)/i;
/** Patterns that indicate an answer option (A. B. C. D. or 1. 2. 3. 4.) */
const OPT_LINE = /^[A-Da-d][\.\)]\s+\S|^\([A-Da-d]\)\s+\S|^[1-4][\.\)]\s+\S/;
/** Answer key lines */
const ANS_LINE = /^(?:Answer|Ans|Key|Correct)\s*:/i;

/**
 * Extract text from a user-uploaded PDF file in the browser.
 * Items from each page are joined with smart newlines so question
 * structures are preserved even when PDF text streams have no linebreaks.
 */
export async function extractTextFromPdfFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();

  try {
    const pdfjsLib = await import('pdfjs-dist');
    if (pdfjsLib.GlobalWorkerOptions && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${
        pdfjsLib.version || '4.0.379'
      }/build/pdf.worker.min.mjs`;
    }

    const pdf = await (await pdfjsLib.getDocument({ data: arrayBuffer }).promise as any);
    let fullText = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const items: string[] = textContent.items
        .map((item: any) => ('str' in item ? (item.str as string).trim() : ''))
        .filter((s: string) => s.length > 0);

      // Smart joining: insert a newline before tokens that look like new
      // questions or option labels so the block splitter works even when
      // the PDF layer has no real line breaks.
      const pageLines: string[] = [];
      let current = '';

      for (const token of items) {
        const isNewQ = Q_START.test(token);
        const isOpt  = OPT_LINE.test(token);
        const isAns  = ANS_LINE.test(token);

        if ((isNewQ || isOpt || isAns) && current.trim()) {
          pageLines.push(current.trim());
          current = token;
        } else {
          current = current ? current + ' ' + token : token;
        }
      }
      if (current.trim()) pageLines.push(current.trim());

      fullText += '\n' + pageLines.join('\n');
    }

    if (fullText.trim().length > 20) {
      return fullText;
    }
  } catch (err) {
    console.warn('pdfjs-dist failed, falling back to ASCII extraction:', err);
  }

  return extractAsciiStrings(arrayBuffer);
}

/** Basic ASCII/UTF-8 string extractor for uncompressed PDFs */
function extractAsciiStrings(buffer: ArrayBuffer): string {
  const uint8 = new Uint8Array(buffer);
  let result = '';
  let currentString = '';

  for (let i = 0; i < uint8.length; i++) {
    const code = uint8[i]!;
    if ((code >= 32 && code <= 126) || code === 10 || code === 13 || code === 9) {
      currentString += String.fromCharCode(code);
    } else {
      if (currentString.length >= 4) result += currentString + ' ';
      currentString = '';
    }
  }
  return result;
}

/**
 * Heuristic intelligent parser that extracts questions, options, and answer keys
 * from the raw text returned by extractTextFromPdfFile.
 */
export function parseQuestionsFromRawText(rawText: string): Question[] {
  const questions: Question[] = [];
  if (!rawText || rawText.trim().length === 0) return questions;

  // ---------- Pre-process: insert newlines at question/option boundaries ------
  // This handles PDFs where even our smart join above may have missed some
  const preprocessed = rawText
    // Insert newline before "1. Text", "2. Text", "Q1.", "Question 1" etc.
    .replace(/(?<!\n)(?=(?:Q\d+[:.)]|\d{1,3}[\.\)]\s+[A-Za-z("]|\bQuestion\s+\d+))/g, '\n')
    // Insert newline before option lines like "A. ", "B) ", "(C) "
    .replace(/(?<!\n)(?=[A-Da-d][\.\)]\s+\S|\([A-Da-d]\)\s+)/g, '\n')
    // Insert newline before Answer: lines
    .replace(/(?<!\n)(?=(?:Answer|Ans|Key|Correct)\s*:)/gi, '\n')
    // Collapse multiple blank lines
    .replace(/\n{3,}/g, '\n\n');

  // ---------- Split into question blocks -------------------------------------
  const blockSplitRe = /\n(?=(?:Q\d+[:.)]|\d{1,3}[\.\)]\s|\bQuestion\s+\d+))/i;
  const blocks = preprocessed
    .split(blockSplitRe)
    .map((b) => b.trim())
    .filter((b) => b.length > 0 && /\S/.test(b));

  let fallbackIdx = 1;
  for (const block of blocks) {
    const parsed = parseSingleQuestionBlock(block, fallbackIdx);
    if (parsed) {
      questions.push(parsed);
      fallbackIdx++;
    }
  }

  return questions;
}

function parseSingleQuestionBlock(block: string, index: number): Question | null {
  const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return null;

  // ── Extract question prompt ──────────────────────────────────────────────
  let prompt = lines[0]!
    .replace(/^(?:Q\d+[:.)]|\d{1,3}[\.\)]\s*|Question\s+\d+[:.]\s*)/i, '')
    .trim();

  if (!prompt && lines.length === 1) return null; // skip empty blocks

  // ── Detect question type hints ──────────────────────────────────────────
  const isTFHint = /\b(?:true\s*or\s*false|t\s*\/\s*f)\b/i.test(block);
  const isPuzzleHint = /\b(?:order|arrange|chronological|sequence|rank|sort)\b/i.test(prompt);

  // ── Extract marked answer ────────────────────────────────────────────────
  let markedAnswer = '';
  const answerMatch = block.match(
    /(?:Answer|Ans|Key|Correct)\s*:\s*([A-D]|True|False|T|F|\d(?:\s*,\s*\d)*)/i,
  );
  if (answerMatch?.[1]) {
    markedAnswer = answerMatch[1].trim().toUpperCase();
  }

  // ── Parse option lines ───────────────────────────────────────────────────
  const optionRe = /^(?:\(([A-Da-d])\)|([A-Da-d])[\.\)])\s+(.*)|^([1-4])[\.\)]\s+(.*)/;
  const parsedOptions: { id: string; text: string; isCorrect: boolean }[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]!;
    if (ANS_LINE.test(line)) continue; // skip answer key lines

    const m = line.match(optionRe);
    if (m) {
      let optText = (m[3] ?? m[5] ?? '').trim();
      let isCorrect = false;

      if (
        optText.includes('(Correct)') ||
        optText.startsWith('*') ||
        optText.includes('[x]') ||
        optText.includes('✓')
      ) {
        isCorrect = true;
        optText = optText.replace(/\(Correct\)|\*|\[x\]|✓/gi, '').trim();
      }

      parsedOptions.push({
        id: `opt_${index}_${parsedOptions.length + 1}`,
        text: optText,
        isCorrect,
      });
    } else if (parsedOptions.length === 0) {
      // Still part of the question prompt (multi-line question)
      prompt += ' ' + line;
    }
  }

  // ── Determine question type ──────────────────────────────────────────────
  let questionType: QuestionType = 'multiple_choice';
  if (isPuzzleHint && parsedOptions.length >= 3) {
    questionType = 'puzzle';
  } else if (isTFHint || (parsedOptions.length === 2 && isBooleanOptions(parsedOptions))) {
    questionType = 'true_false';
  }

  // ── Build final options ──────────────────────────────────────────────────
  let finalOptions: AnswerOption[] = [];

  if (questionType === 'true_false') {
    const trueCorrect =
      markedAnswer === 'TRUE' ||
      markedAnswer === 'T' ||
      markedAnswer === 'A';
    finalOptions = [
      { id: `opt_${index}_true`, text: 'True', isCorrect: trueCorrect },
      { id: `opt_${index}_false`, text: 'False', isCorrect: !trueCorrect },
    ];
  } else if (parsedOptions.length >= 2) {
    // Apply marked letter answer
    if (markedAnswer.length === 1 && markedAnswer >= 'A' && markedAnswer <= 'D') {
      const targetIdx = markedAnswer.charCodeAt(0) - 65;
      parsedOptions.forEach((o, idx) => { o.isCorrect = idx === targetIdx; });
    }
    // Ensure at least one correct option
    if (!parsedOptions.some((o) => o.isCorrect)) {
      parsedOptions[0]!.isCorrect = true;
    }
    finalOptions = parsedOptions.slice(0, 4);
  } else {
    // Fallback options when none were parsed
    if (isTFHint) {
      questionType = 'true_false';
      finalOptions = [
        { id: `opt_${index}_true`, text: 'True', isCorrect: true },
        { id: `opt_${index}_false`, text: 'False', isCorrect: false },
      ];
    } else {
      finalOptions = [
        { id: `opt_${index}_1`, text: 'Option A', isCorrect: true },
        { id: `opt_${index}_2`, text: 'Option B', isCorrect: false },
        { id: `opt_${index}_3`, text: 'Option C', isCorrect: false },
        { id: `opt_${index}_4`, text: 'Option D', isCorrect: false },
      ];
    }
  }

  const correctOrder =
    questionType === 'puzzle' ? finalOptions.map((o) => o.id) : undefined;

  return {
    id: `extracted_${index}_${Date.now()}`,
    type: questionType,
    text: prompt || `Question ${index}`,
    options: finalOptions,
    timeLimit: 20,
    category: 'Custom & Imported',
    difficulty: 'medium',
    points: 1000,
    correctOrder,
  };
}

function isBooleanOptions(opts: { text: string }[]): boolean {
  if (opts.length !== 2) return false;
  const t1 = opts[0]!.text.toLowerCase();
  const t2 = opts[1]!.text.toLowerCase();
  return (
    (t1.includes('true') && t2.includes('false')) ||
    (t1.includes('false') && t2.includes('true'))
  );
}
