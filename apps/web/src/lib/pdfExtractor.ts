import type { Question, AnswerOption, QuestionType } from '@jumbo/shared';

/**
 * Extract text from a user-uploaded PDF file in the browser.
 */
export async function extractTextFromPdfFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();

  try {
    const pdfjsLib = await import('pdfjs-dist');
    // Set worker source to CDN matching the pdfjs version
    if (pdfjsLib.GlobalWorkerOptions && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || '4.0.379'}/build/pdf.worker.min.mjs`;
    }

    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageStrings = textContent.items
        .map((item: any) => ('str' in item ? item.str : ''))
        .filter(Boolean);
      fullText += `\n\n--- Page ${pageNum} ---\n\n` + pageStrings.join(' ');
    }

    if (fullText.trim().length > 20) {
      return fullText;
    }
  } catch (err) {
    console.warn('pdfjs-dist worker failed, attempting basic stream fallback:', err);
  }

  // Fallback: extract visible text streams from raw buffer
  return extractAsciiStrings(arrayBuffer);
}

/**
 * Basic ASCII/UTF-8 string extractor for PDFs where text streams are uncompressed
 */
function extractAsciiStrings(buffer: ArrayBuffer): string {
  const uint8 = new Uint8Array(buffer);
  let result = '';
  let currentString = '';

  for (let i = 0; i < uint8.length; i++) {
    const code = uint8[i]!;
    // Printable ASCII + newline / tab
    if ((code >= 32 && code <= 126) || code === 10 || code === 13 || code === 9) {
      currentString += String.fromCharCode(code);
    } else {
      if (currentString.length >= 4) {
        result += currentString + ' ';
      }
      currentString = '';
    }
  }
  return result;
}

/**
 * Heuristic intelligent parser that extracts questions, options, and answer keys.
 */
export function parseQuestionsFromRawText(rawText: string): Question[] {
  const questions: Question[] = [];
  if (!rawText || rawText.trim().length === 0) return questions;

  // Normalize line endings and remove page headers
  const cleanText = rawText
    .replace(/--- Page \d+ ---/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');

  // Split into candidate blocks based on numbered patterns like "1.", "Q1:", "Question 1", etc.
  const questionSplitRegex = /(?:^|\n)(?=(?:Q\d+[:.]|\d+[\.\)]|Question\s+\d+[:.]))/i;
  const blocks = cleanText.split(questionSplitRegex).map((b) => b.trim()).filter(Boolean);

  let fallbackIdx = 1;

  for (const block of blocks) {
    // Check if block contains at least a question mark or options
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

  // Extract question prompt
  let prompt = lines[0]!.replace(/^(?:Q\d+[:.]|\d+[\.\)]|Question\s+\d+[:.])\s*/i, '').trim();

  // Look for True/False indicators
  const isTrueFalsePrompt = /\b(?:true\s*or\s*false|t\/f)\b/i.test(block);

  // Look for Puzzle / Ordering indicators
  const isPuzzlePrompt = /\b(?:order|arrange|chronological|sequence|rank|sort)\b/i.test(prompt);

  // Extract answer key line if present (e.g. "Answer: B", "Ans: True", "Correct: A")
  let markedAnswer = '';
  const answerLineMatch = block.match(/(?:Answer|Ans|Key|Correct):\s*([A-D]|True|False|T|F|\d(?:,\s*\d)*)/i);
  if (answerLineMatch && answerLineMatch[1]) {
    markedAnswer = answerLineMatch[1].trim().toUpperCase();
  }

  // Parse options
  const optionRegex = /^[A-Da-d][\.\)]\s*(.*)$|^[1-4][\.\)]\s*(.*)$/;
  const parsedOptions: { id: string; text: string; isCorrect: boolean }[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]!;

    // Ignore explicit Answer: lines
    if (/^(?:Answer|Ans|Key|Correct):/i.test(line)) continue;

    const optMatch = line.match(optionRegex);
    if (optMatch) {
      let optText = (optMatch[1] ?? optMatch[2] ?? line).trim();
      let isCorrect = false;

      // Check for inline correct indicators like "*Option" or "Option (Correct)"
      if (optText.includes('(Correct)') || optText.startsWith('*') || optText.includes('[x]')) {
        isCorrect = true;
        optText = optText.replace(/\(Correct\)|\*|\[x\]/gi, '').trim();
      }

      parsedOptions.push({
        id: `opt_${index}_${parsedOptions.length + 1}`,
        text: optText,
        isCorrect,
      });
    } else if (parsedOptions.length === 0) {
      // Continuation of the question prompt
      prompt += ' ' + line;
    }
  }

  // Determine question type
  let questionType: QuestionType = 'multiple_choice';

  if (isPuzzlePrompt && parsedOptions.length >= 3) {
    questionType = 'puzzle';
  } else if (isTrueFalsePrompt || (parsedOptions.length === 2 && isBooleanOptions(parsedOptions))) {
    questionType = 'true_false';
  }

  // Format options based on determined type
  let finalOptions: AnswerOption[] = [];

  if (questionType === 'true_false') {
    const isTrueCorrect = markedAnswer === 'A' || markedAnswer === 'TRUE' || markedAnswer === 'T';
    finalOptions = [
      { id: `opt_${index}_true`, text: 'True', isCorrect: isTrueCorrect },
      { id: `opt_${index}_false`, text: 'False', isCorrect: !isTrueCorrect },
    ];
  } else if (parsedOptions.length >= 2) {
    // If markedAnswer is letter (A, B, C, D)
    if (markedAnswer && markedAnswer.length === 1 && markedAnswer >= 'A' && markedAnswer <= 'D') {
      const targetIdx = markedAnswer.charCodeAt(0) - 65;
      parsedOptions.forEach((o, idx) => {
        o.isCorrect = idx === targetIdx;
      });
    }

    // Ensure at least one option is marked correct
    if (!parsedOptions.some((o) => o.isCorrect)) {
      parsedOptions[0]!.isCorrect = true;
    }

    finalOptions = parsedOptions.slice(0, 4);
  } else {
    // Fallback: If no distinct option lines were found, create default True/False or 4 dummy choices
    if (isTrueFalsePrompt) {
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

  const correctOrder = questionType === 'puzzle' ? finalOptions.map((o) => o.id) : undefined;

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
