import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gamepad2, Zap, SlidersHorizontal, ChevronRight, AlertCircle,
  FileSpreadsheet, Plus, Trash2, CheckCircle2, Sparkles, Loader2,
  Flag, Globe, Tag, PawPrint, BookOpen, MapPin, FlaskConical,
  Calculator, Binary, Landmark, Lightbulb, Check, X,
  User, KeyRound, Play, ArrowLeft, ArrowRight,
  Triangle, Diamond, Circle, Square,
  FileText, Upload, Library, Download, ArrowUp, ArrowDown,
  ListOrdered, Scale, Edit3, FolderOpen,
} from 'lucide-react';
import { QUESTION_CATEGORIES, type Question, type QuestionType } from '@jumbo/shared';
import { useQuizSocket } from '../hooks/useQuizSocket';
import { AppNavbar } from '../components/AppNavbar';
import { extractTextFromPdfFile, parseQuestionsFromRawText } from '../lib/pdfExtractor';
import {
  getSavedQuizLibrary,
  saveQuizDeckToLibrary,
  deleteQuizDeckFromLibrary,
  exportQuizDeckToJson,
  parseImportedQuizJson,
  type SavedQuizDeck,
} from '../lib/quizLibrary';

// Category icon map — 100% Lucide SVG vector icons, NO emojis
const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  flags: Flag,
  countries_capitals: Globe,
  logos_brands: Tag,
  animals: PawPrint,
  history: BookOpen,
  geography: MapPin,
  science: FlaskConical,
  math_formulas: Calculator,
  numbers_logic: Binary,
  religion_culture: Landmark,
  mythology: Zap,
  general_knowledge: Lightbulb,
};

const CATEGORY_LABELS: Record<string, string> = {
  flags: 'Flags & Banners',
  countries_capitals: 'World Capitals',
  logos_brands: 'Logos & Brands',
  animals: 'Fauna & Animals',
  history: 'World History',
  geography: 'Global Geography',
  science: 'Science & Physics',
  math_formulas: 'Math & Formulas',
  numbers_logic: 'Logic & Numbers',
  religion_culture: 'Culture & Heritage',
  mythology: 'Myth & Legends',
  general_knowledge: 'General Trivia',
};

const OPTION_META = [
  { label: 'A', icon: Triangle, color: 'text-red-400 bg-red-500/20 border-red-500/40' },
  { label: 'B', icon: Diamond,  color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40' },
  { label: 'C', icon: Circle,   color: 'text-amber-400 bg-amber-500/20 border-amber-500/40' },
  { label: 'D', icon: Square,   color: 'text-blue-400 bg-blue-500/20 border-blue-500/40' },
];

interface CustomDraftQuestion {
  id: string;
  type: QuestionType;
  text: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  timeLimit: number;
  points: number;
  correctOrder?: string[];
}

export default function QuizLauncher() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlPin = searchParams.get('pin');
  const { connected, error, createGame, joinGame } = useQuizSocket();

  const [mode, setMode] = useState<'auto' | 'categories' | 'builder' | 'library' | null>(null);
  const [selectedCats, setSelectedCats] = useState<Set<string>>(new Set(['general_knowledge', 'science', 'geography']));
  const [questionCount, setQuestionCount] = useState(15);
  const [displayName, setDisplayName] = useState(() => localStorage.getItem('jumbo-display-name') ?? '');
  const [joinPin, setJoinPin] = useState(() => urlPin ?? '');
  const [joining, setJoining] = useState(false);
  const [creating, setCreating] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (urlPin) setJoinPin(urlPin);
  }, [urlPin]);

  // Library state
  const [savedDecks, setSavedDecks] = useState<SavedQuizDeck[]>(() => getSavedQuizLibrary());
  const [librarySearch, setLibrarySearch] = useState('');
  const [showSaveDeckModal, setShowSaveDeckModal] = useState(false);
  const [saveDeckTitle, setSaveDeckTitle] = useState('');
  const [saveDeckDesc, setSaveDeckDesc] = useState('');

  // Custom question builder state
  const [customQuestions, setCustomQuestions] = useState<CustomDraftQuestion[]>([]);
  const [qType, setQType] = useState<QuestionType>('multiple_choice');
  const [newText, setNewText] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);
  const [correctOptIdx, setCorrectOptIdx] = useState(0);
  const [newTimeLimit, setNewTimeLimit] = useState(20);
  const [newPoints, setNewPoints] = useState(1000);
  // Puzzle order items in builder
  const [puzzleSteps, setPuzzleSteps] = useState(['Step 1 (First)', 'Step 2 (Second)', 'Step 3 (Third)', 'Step 4 (Fourth)']);
  // True/False in builder
  const [tfAnswer, setTfAnswer] = useState<boolean>(true);

  // CSV Modal
  const [csvText, setCsvText] = useState('');
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [builderError, setBuilderError] = useState<string | null>(null);

  // PDF Extraction Modal
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfExtracting, setPdfExtracting] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [extractedQuestions, setExtractedQuestions] = useState<Question[] | null>(null);
  const [rawPastedText, setRawPastedText] = useState('');
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const jsonImportRef = useRef<HTMLInputElement>(null);

  // Refresh saved decks on load
  useEffect(() => {
    setSavedDecks(getSavedQuizLibrary());
  }, [mode]);

  function toggleCat(cat: string) {
    setSelectedCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) { if (next.size > 1) next.delete(cat); }
      else next.add(cat);
      return next;
    });
  }

  const handleCreateAuto = useCallback(() => {
    const trimmed = displayName.trim();
    if (!trimmed) {
      setJoinError('Please enter your nickname first');
      nameInputRef.current?.focus();
      return;
    }
    setCreating(true);
    localStorage.setItem('jumbo-display-name', trimmed);
    createGame(
      {
        categories: [...selectedCats],
        questionCount,
        leaderboardVisibility: 'live',
        streakBonus: true,
        strictMode: false,
        soundEffects: false,
      },
      undefined,
      (pin) => {
        setCreating(false);
        navigate(`/quiz/lobby/${pin}`);
      },
      trimmed,
    );
    setTimeout(() => { setCreating(false); }, 8000);
  }, [displayName, selectedCats, questionCount, createGame, navigate]);

  const handleLaunchWithQuestions = useCallback((questions: Question[]) => {
    const trimmed = displayName.trim();
    if (!trimmed) {
      setJoinError('Please enter your nickname first');
      nameInputRef.current?.focus();
      return;
    }
    if (questions.length === 0) return;
    setCreating(true);
    localStorage.setItem('jumbo-display-name', trimmed);

    // Deep sanitize and ensure every question is 100% compliant with QuestionSchema
    const sanitizedQuestions: Question[] = questions.map((q, idx) => {
      const qId = q.id || `q_${idx}_${Date.now()}`;
      const qType: QuestionType = q.type || 'multiple_choice';
      const rawText = (q.text || `Question ${idx + 1}`).trim();

      let rawOptions = Array.isArray(q.options) && q.options.length >= 2 ? q.options : [
        { id: `opt_${idx}_1`, text: 'Option A', isCorrect: true },
        { id: `opt_${idx}_2`, text: 'Option B', isCorrect: false },
      ];

      const opts = rawOptions.slice(0, 10).map((opt, oIdx) => ({
        id: opt.id || `opt_${idx}_${oIdx + 1}`,
        text: (opt.text || `Option ${oIdx + 1}`).trim().slice(0, 1000),
        isCorrect: Boolean(opt.isCorrect),
      }));

      if (qType !== 'puzzle' && !opts.some((o) => o.isCorrect)) {
        opts[0]!.isCorrect = true;
      }

      const correctOrder = qType === 'puzzle'
        ? (q.correctOrder && q.correctOrder.length >= 2 ? q.correctOrder : opts.map((o) => o.id))
        : undefined;

      return {
        id: qId,
        type: qType,
        text: rawText.slice(0, 3000),
        options: opts,
        timeLimit: Math.max(5, Math.min(180, q.timeLimit || 20)),
        category: (q.category || 'Custom Quiz').slice(0, 100),
        difficulty: (['easy', 'medium', 'hard'].includes(q.difficulty) ? q.difficulty : 'medium') as 'easy' | 'medium' | 'hard',
        points: q.points || 1000,
        correctOrder,
      };
    });

    const safeCount = Math.max(1, Math.min(200, sanitizedQuestions.length));

    createGame(
      {
        categories: ['general_knowledge'],
        questionCount: safeCount,
        leaderboardVisibility: 'live',
        streakBonus: true,
        strictMode: false,
        soundEffects: false,
      },
      sanitizedQuestions,
      (pin) => {
        setCreating(false);
        navigate(`/quiz/lobby/${pin}`);
      },
      trimmed,
    );
    setTimeout(() => { setCreating(false); }, 10000);
  }, [displayName, createGame, navigate]);

  const handleCreateCustom = useCallback(() => {
    if (customQuestions.length === 0) return;
    const formattedQuestions: Question[] = customQuestions.map((q) => ({
      id: q.id,
      text: q.text,
      category: 'Custom Quiz',
      type: q.type,
      difficulty: 'medium',
      timeLimit: q.timeLimit,
      points: q.points,
      correctOrder: q.correctOrder,
      options: q.options.map((opt) => ({
        id: opt.id,
        text: opt.text,
        isCorrect: opt.isCorrect,
      })),
    }));

    handleLaunchWithQuestions(formattedQuestions);
  }, [customQuestions, handleLaunchWithQuestions]);

  function handleAddQuestion() {
    setBuilderError(null);
    if (!newText.trim()) {
      setBuilderError('Please type question prompt');
      return;
    }

    let draftOptions: { id: string; text: string; isCorrect: boolean }[] = [];
    let correctOrder: string[] | undefined;

    if (qType === 'true_false') {
      draftOptions = [
        { id: 'opt_true', text: 'True', isCorrect: tfAnswer === true },
        { id: 'opt_false', text: 'False', isCorrect: tfAnswer === false },
      ];
    } else if (qType === 'puzzle') {
      const validSteps = puzzleSteps.map((s) => s.trim()).filter(Boolean);
      if (validSteps.length < 3) {
        setBuilderError('Please provide at least 3 steps to arrange');
        return;
      }
      draftOptions = validSteps.map((step, idx) => ({
        id: `puz_step_${idx + 1}`,
        text: step,
        isCorrect: true,
      }));
      correctOrder = draftOptions.map((o) => o.id);
    } else {
      const validOpts = newOptions.map((o) => o.trim()).filter(Boolean);
      if (validOpts.length < 2) {
        setBuilderError('Please provide at least 2 distinct answer options');
        return;
      }
      draftOptions = newOptions.map((text, idx) => ({
        id: `opt-${idx + 1}`,
        text: text.trim(),
        isCorrect: idx === correctOptIdx,
      })).filter((o) => o.text.length > 0);
    }

    const draft: CustomDraftQuestion = {
      id: crypto.randomUUID(),
      type: qType,
      text: newText.trim(),
      timeLimit: newTimeLimit,
      points: newPoints,
      options: draftOptions,
      correctOrder,
    };

    setCustomQuestions((prev) => [...prev, draft]);
    setNewText('');
    setNewOptions(['', '', '', '']);
    setCorrectOptIdx(0);
  }

  function handleSaveCurrentDeck() {
    if (customQuestions.length === 0) return;
    const title = saveDeckTitle.trim() || `My Quiz (${customQuestions.length} Questions)`;
    const description = saveDeckDesc.trim() || 'Created with Jumbo Quiz Builder';

    const formattedQuestions: Question[] = customQuestions.map((q) => ({
      id: q.id,
      text: q.text,
      category: 'Custom Deck',
      type: q.type,
      difficulty: 'medium',
      timeLimit: q.timeLimit,
      points: q.points,
      correctOrder: q.correctOrder,
      options: q.options,
    }));

    saveQuizDeckToLibrary({
      title,
      description,
      questions: formattedQuestions,
      tags: ['Custom'],
    });

    setSavedDecks(getSavedQuizLibrary());
    setShowSaveDeckModal(false);
    setSaveDeckTitle('');
    setSaveDeckDesc('');
  }

  function handleImportCsv() {
    setBuilderError(null);
    if (!csvText.trim()) return;

    const lines = csvText.trim().split('\n');
    const imported: CustomDraftQuestion[] = [];

    for (const line of lines) {
      const parts = line.split(',').map((p) => p.trim());
      if (parts.length >= 3) {
        const text = parts[0]!;
        const rawCorrect = parseInt(parts[parts.length - 1] ?? '1', 10);
        const correctIdx = isNaN(rawCorrect) ? 0 : Math.max(0, Math.min(parts.length - 3, rawCorrect - 1));
        const opts = parts.slice(1, parts.length - 1);

        imported.push({
          id: crypto.randomUUID(),
          type: 'multiple_choice',
          text,
          timeLimit: 20,
          points: 1000,
          options: opts.map((optText, idx) => ({
            id: `opt-${idx + 1}`,
            text: optText,
            isCorrect: idx === correctIdx,
          })),
        });
      }
    }

    if (imported.length > 0) {
      setCustomQuestions((prev) => [...prev, ...imported]);
      setCsvText('');
      setShowCsvModal(false);
    } else {
      setBuilderError('Invalid CSV. Expected: Question, Option 1, Option 2, Option 3, Option 4, CorrectOption(1-4)');
    }
  }

  // Handle PDF file upload & smart text parsing
  async function handlePdfUpload(file: File) {
    setPdfExtracting(true);
    setPdfError(null);
    try {
      const text = await extractTextFromPdfFile(file);
      const questions = parseQuestionsFromRawText(text);
      if (questions.length === 0) {
        setPdfError('No clear questions found in PDF. Try pasting text below.');
      } else {
        setExtractedQuestions(questions);
      }
    } catch (err) {
      setPdfError((err as Error).message || 'Failed to read PDF file');
    } finally {
      setPdfExtracting(false);
    }
  }

  function handleParsePastedText() {
    if (!rawPastedText.trim()) return;
    setPdfExtracting(true);
    try {
      const questions = parseQuestionsFromRawText(rawPastedText);
      if (questions.length === 0) {
        setPdfError('Could not detect question patterns. Example: 1. Question? A) Yes B) No Answer: A');
      } else {
        setExtractedQuestions(questions);
      }
    } catch (err) {
      setPdfError((err as Error).message);
    } finally {
      setPdfExtracting(false);
    }
  }

  function handleApplyExtractedQuestions() {
    if (!extractedQuestions || extractedQuestions.length === 0) return;
    const drafts: CustomDraftQuestion[] = extractedQuestions.map((q) => ({
      id: q.id,
      type: q.type,
      text: q.text,
      timeLimit: q.timeLimit,
      points: q.points,
      correctOrder: q.correctOrder,
      options: q.options.map((opt) => ({
        id: opt.id,
        text: opt.text,
        isCorrect: opt.isCorrect ?? false,
      })),
    }));

    setCustomQuestions((prev) => [...prev, ...drafts]);
    setExtractedQuestions(null);
    setShowPdfModal(false);
    setMode('builder');
  }

  function handleImportJsonFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const deck = parseImportedQuizJson(content);
        setSavedDecks(getSavedQuizLibrary());
        setMode('library');
      } catch (err) {
        alert('Failed to import JSON: ' + (err as Error).message);
      }
    };
    reader.readAsText(file);
  }

  function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    setJoinError(null);

    const name = displayName.trim();
    if (!name) {
      setJoinError('Please enter your nickname above to join the game');
      nameInputRef.current?.focus();
      return;
    }

    if (joinPin.length !== 6) {
      setJoinError('Please enter a full 6-digit game PIN');
      return;
    }

    setJoining(true);
    localStorage.setItem('jumbo-display-name', name);

    joinGame(joinPin, name, (res) => {
      setJoining(false);
      if (res?.success) {
        if (res.status === 'active' || res.status === 'reveal') {
          navigate(`/quiz/play/${joinPin}`);
        } else {
          navigate(`/quiz/lobby/${joinPin}`);
        }
      } else {
        setJoinError(res?.error ?? 'Game not found. Please verify the 6-digit PIN.');
      }
    });
  }

  const filteredDecks = savedDecks.filter(
    (d) =>
      d.title.toLowerCase().includes(librarySearch.toLowerCase()) ||
      d.description.toLowerCase().includes(librarySearch.toLowerCase()) ||
      d.tags.some((t) => t.toLowerCase().includes(librarySearch.toLowerCase())),
  );

  return (
    <div className="relative min-h-dvh flex flex-col bg-[#080b13] text-white selection:bg-violet-500/30 selection:text-white overflow-x-hidden pb-12">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-violet-600/20 via-indigo-600/10 to-transparent blur-[120px] rounded-full" />
        <div className="absolute -bottom-32 left-1/4 w-[400px] h-[300px] bg-cyan-600/10 blur-[100px] rounded-full" />
      </div>

      {/* Global Navbar */}
      <AppNavbar showBack backTo="/home" backLabel="Home" />

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center px-4 py-4 sm:py-8 z-10">
        <motion.div
          className="w-full max-w-2xl rounded-3xl bg-[#0f1422]/90 border border-white/10 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.8)] backdrop-blur-2xl p-5 sm:p-8 relative overflow-hidden"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          {/* Top gradient highlight line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400" />

          {/* Header */}
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-600/30 ring-1 ring-white/20 flex-shrink-0">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  <span>Jumbo Quiz</span>
                </h1>
                <p className="text-xs text-slate-400 font-medium">Multiplayer Trivia & Kahoot-Style Games</p>
              </div>
            </div>

            {/* Quick Action: My Library */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMode(mode === 'library' ? null : 'library')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                  mode === 'library'
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-lg shadow-amber-500/20'
                    : 'bg-[#151c2e] border-white/10 text-slate-300 hover:text-white hover:border-amber-500/40'
                }`}
              >
                <Library className="w-3.5 h-3.5 text-amber-400" />
                <span>My Library ({savedDecks.length})</span>
              </button>

              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                  connected
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span>{connected ? 'Live Ready' : 'Connecting...'}</span>
              </div>
            </div>
          </div>

          {/* Nickname input card */}
          <div className="mb-6 rounded-2xl bg-[#141b2c] border border-white/5 p-4 shadow-inner">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
              <span className="flex items-center gap-1.5 text-indigo-300">
                <User className="w-3.5 h-3.5" />
                <span>YOUR PLAYER NICKNAME</span>
              </span>
              <span className="text-[11px] text-slate-500">{displayName.length}/50</span>
            </div>
            <div className="relative">
              <input
                ref={nameInputRef}
                type="text"
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                  localStorage.setItem('jumbo-display-name', e.target.value);
                }}
                placeholder="Enter your name (e.g. Alex, Captain_Quiz)..."
                maxLength={50}
                className="w-full h-11 px-3.5 rounded-xl bg-[#0b101c] border border-white/10 text-white placeholder-slate-500 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* ─── VIEW 1: MY QUIZ LIBRARY ────────────────────────────────────────── */}
          {mode === 'library' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setMode(null)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Game Modes</span>
                </button>

                <div className="flex items-center gap-2">
                  <input
                    ref={jsonImportRef}
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleImportJsonFile(e.target.files[0])}
                  />
                  <button
                    type="button"
                    onClick={() => jsonImportRef.current?.click()}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white"
                  >
                    <Download className="w-3 h-3 rotate-180" />
                    <span>Import JSON</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('builder');
                      setCustomQuestions([]);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white shadow"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Quiz</span>
                  </button>
                </div>
              </div>

              {/* Search */}
              <input
                type="text"
                value={librarySearch}
                onChange={(e) => setLibrarySearch(e.target.value)}
                placeholder="Search saved quizzes by title or category..."
                className="w-full h-9 px-3 rounded-xl bg-[#0b101c] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />

              {/* Decks Grid */}
              <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                {filteredDecks.map((deck) => (
                  <div
                    key={deck.id}
                    className="p-3.5 rounded-2xl bg-[#141b2c] border border-white/10 hover:border-amber-500/40 transition-all flex flex-col gap-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <span>{deck.title}</span>
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-extrabold">
                            {deck.questionCount} Questions
                          </span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{deck.description}</p>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => exportQuizDeckToJson(deck)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                          title="Export as JSON"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete "${deck.title}"?`)) {
                              setSavedDecks(deleteQuizDeckFromLibrary(deck.id));
                            }
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400"
                          title="Delete quiz"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Breakdown and actions */}
                    <div className="flex items-center justify-between pt-1 border-t border-white/5">
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
                        {deck.typeBreakdown.multiple_choice > 0 && (
                          <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                            {deck.typeBreakdown.multiple_choice} Quiz
                          </span>
                        )}
                        {deck.typeBreakdown.true_false > 0 && (
                          <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                            {deck.typeBreakdown.true_false} T/F
                          </span>
                        )}
                        {deck.typeBreakdown.puzzle > 0 && (
                          <span className="px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-300 border border-violet-500/20">
                            {deck.typeBreakdown.puzzle} Puzzle
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setCustomQuestions(
                              deck.questions.map((q) => ({
                                id: q.id,
                                type: q.type,
                                text: q.text,
                                timeLimit: q.timeLimit,
                                points: q.points,
                                correctOrder: q.correctOrder,
                                options: q.options.map((o) => ({
                                  id: o.id,
                                  text: o.text,
                                  isCorrect: o.isCorrect ?? false,
                                })),
                              })),
                            );
                            setSaveDeckTitle(deck.title);
                            setSaveDeckDesc(deck.description);
                            setMode('builder');
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          disabled={creating}
                          onClick={() => handleLaunchWithQuestions(deck.questions)}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/30"
                        >
                          <Play className="w-3 h-3 fill-white" />
                          <span>Play Now</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ─── VIEW 2: MODE SELECTOR ─────────────────────────────────────────── */}
          {!mode && (
            <div className="space-y-4">
              {/* Join PIN Card */}
              <div className="rounded-2xl bg-gradient-to-br from-[#1a1c35] to-[#121526] border border-violet-500/20 p-4 shadow-xl">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-violet-300 uppercase tracking-wider">
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>JOIN AN ONGOING GAME</span>
                </div>
                <form onSubmit={handleJoin} className="flex gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={joinPin}
                    onChange={(e) => setJoinPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit Game PIN..."
                    className="flex-1 h-11 px-3.5 rounded-xl bg-[#0b0e1a] border border-violet-500/30 text-white font-mono text-base tracking-widest placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <button
                    type="submit"
                    disabled={joining || joinPin.length !== 6}
                    className="h-11 px-5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:pointer-events-none text-white font-bold text-sm shadow-lg shadow-violet-600/30 flex items-center gap-1.5 transition-all"
                  >
                    {joining ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
                    <span>Join</span>
                  </button>
                </form>
                {joinError && (
                  <p className="mt-2 text-xs text-rose-400 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{joinError}</span>
                  </p>
                )}
              </div>

              {/* Host Mode Cards */}
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider pt-2">
                OR HOST A NEW GAME
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Quick Auto */}
                <button
                  type="button"
                  onClick={handleCreateAuto}
                  disabled={creating}
                  className="group p-4 rounded-2xl bg-[#141b2c] border border-white/5 hover:border-violet-500/50 hover:bg-[#1a2238] transition-all text-left flex flex-col justify-between shadow-lg"
                >
                  <div className="w-9 h-9 rounded-xl bg-violet-500/20 border border-violet-500/40 text-violet-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Zap className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-0.5">Quick Blitz</h3>
                    <p className="text-xs text-slate-400">1-click random 15-question trivia game</p>
                  </div>
                </button>

                {/* 2. Choose Categories */}
                <button
                  type="button"
                  onClick={() => setMode('categories')}
                  className="group p-4 rounded-2xl bg-[#141b2c] border border-white/5 hover:border-cyan-500/50 hover:bg-[#1a2238] transition-all text-left flex flex-col justify-between shadow-lg"
                >
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-0.5">Pick Categories</h3>
                    <p className="text-xs text-slate-400">Filter science, flags, history & questions</p>
                  </div>
                </button>

                {/* 3. Custom Builder & PDF Import */}
                <button
                  type="button"
                  onClick={() => setMode('builder')}
                  className="group p-4 rounded-2xl bg-[#141b2c] border border-white/5 hover:border-amber-500/50 hover:bg-[#1a2238] transition-all text-left flex flex-col justify-between shadow-lg"
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <FileText className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-0.5">Custom / PDF</h3>
                    <p className="text-xs text-slate-400">Create mixed Kahoot quizzes or import PDF</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* ─── VIEW 3: CATEGORIES PICKER ────────────────────────────────────── */}
          {mode === 'categories' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setMode(null)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Game Modes</span>
                </button>
                <span className="text-xs text-slate-400 font-semibold">{selectedCats.size} selected</span>
              </div>

              {/* Category pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {QUESTION_CATEGORIES.map((cat) => {
                  const Icon = CATEGORY_ICONS[cat] ?? Sparkles;
                  const active = selectedCats.has(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCat(cat)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        active
                          ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-200 ring-1 ring-cyan-500/30'
                          : 'bg-[#141b2c] border-white/5 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${active ? 'text-cyan-400' : 'text-slate-500'}`} />
                      <span className="truncate">{CATEGORY_LABELS[cat] ?? cat}</span>
                    </button>
                  );
                })}
              </div>

              {/* Question Count Slider */}
              <div className="p-3.5 rounded-2xl bg-[#141b2c] border border-white/5 space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>Questions in Game:</span>
                  <span className="text-cyan-400">{questionCount}</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={30}
                  step={5}
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <button
                type="button"
                disabled={creating}
                onClick={handleCreateAuto}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-violet-600 text-white font-extrabold text-sm shadow-lg shadow-indigo-600/30 hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
                <span>Launch Quiz with {selectedCats.size} Categories</span>
              </button>
            </motion.div>
          )}

          {/* ─── VIEW 4: CUSTOM BUILDER (MIXED KAHOOT STYLES + PDF IMPORT) ────── */}
          {mode === 'builder' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setMode(null)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Game Modes</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPdfModal(true)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold hover:brightness-110 shadow-sm"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span>Import PDF / Doc</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowCsvModal(true)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>CSV</span>
                  </button>

                  {customQuestions.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowSaveDeckModal(true)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 hover:text-white text-xs font-bold"
                    >
                      <Library className="w-3.5 h-3.5" />
                      <span>Save to Library</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Question Creator Box */}
              <div className="p-4 rounded-2xl bg-[#141b2c] border border-white/10 space-y-3.5">
                {/* Kahoot Question Type Selector */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Question Type (Kahoot Style)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setQType('multiple_choice')}
                      className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        qType === 'multiple_choice'
                          ? 'bg-blue-600/20 border-blue-500 text-blue-300 ring-1 ring-blue-500/30'
                          : 'bg-[#0b101c] border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Triangle className="w-3.5 h-3.5 text-red-400" />
                      <span>4 Choices</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setQType('true_false')}
                      className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        qType === 'true_false'
                          ? 'bg-cyan-600/20 border-cyan-500 text-cyan-300 ring-1 ring-cyan-500/30'
                          : 'bg-[#0b101c] border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Scale className="w-3.5 h-3.5 text-cyan-400" />
                      <span>True / False</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setQType('puzzle')}
                      className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        qType === 'puzzle'
                          ? 'bg-violet-600/20 border-violet-500 text-violet-300 ring-1 ring-violet-500/30'
                          : 'bg-[#0b101c] border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      <ListOrdered className="w-3.5 h-3.5 text-violet-400" />
                      <span>Puzzle (Order)</span>
                    </button>
                  </div>
                </div>

                {/* Prompt */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1.5">
                    <span>Question Prompt #{customQuestions.length + 1}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">Time:</span>
                      {[10, 20, 30].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setNewTimeLimit(t)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            newTimeLimit === t ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {t}s
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    type="text"
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    placeholder={
                      qType === 'puzzle'
                        ? 'e.g. Arrange these historical events in chronological order...'
                        : qType === 'true_false'
                        ? 'e.g. Mount Everest is the tallest mountain in the world...'
                        : 'e.g. What is the capital of Rwanda?...'
                    }
                    className="w-full h-10 px-3 rounded-xl bg-[#0b101c] border border-white/10 text-white text-xs font-medium placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>

                {/* Question Type Options */}
                {qType === 'true_false' ? (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setTfAnswer(true)}
                      className={`p-3 rounded-xl border text-sm font-extrabold flex items-center justify-center gap-2 transition-all ${
                        tfAnswer === true
                          ? 'bg-blue-600/30 border-cyan-400 text-cyan-300 ring-2 ring-cyan-400/40'
                          : 'bg-[#0b101c] border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Diamond className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                      <span>True {tfAnswer === true && '(Correct)'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTfAnswer(false)}
                      className={`p-3 rounded-xl border text-sm font-extrabold flex items-center justify-center gap-2 transition-all ${
                        tfAnswer === false
                          ? 'bg-rose-600/30 border-red-400 text-red-300 ring-2 ring-red-400/40'
                          : 'bg-[#0b101c] border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Triangle className="w-4 h-4 text-red-400 fill-red-400" />
                      <span>False {tfAnswer === false && '(Correct)'}</span>
                    </button>
                  </div>
                ) : qType === 'puzzle' ? (
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-semibold text-slate-400">
                      Specify items in their authoritative CORRECT sequence (1st to 4th):
                    </span>
                    {puzzleSteps.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-violet-600/20 border border-violet-500/40 text-violet-300 text-xs font-black flex items-center justify-center flex-shrink-0">
                          #{idx + 1}
                        </div>
                        <input
                          type="text"
                          value={step}
                          onChange={(e) => {
                            const next = [...puzzleSteps];
                            next[idx] = e.target.value;
                            setPuzzleSteps(next);
                          }}
                          placeholder={`Item #${idx + 1}...`}
                          className="flex-1 h-9 px-3 rounded-xl bg-[#0b101c] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Multiple Choice 4 Options */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {newOptions.map((opt, idx) => {
                      const meta = OPTION_META[idx]!;
                      const Icon = meta.icon;
                      const isCorrect = correctOptIdx === idx;
                      return (
                        <div
                          key={idx}
                          onClick={() => setCorrectOptIdx(idx)}
                          className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition-all ${
                            isCorrect
                              ? 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500/40'
                              : 'bg-[#0b101c] border-white/5 hover:border-slate-700'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${meta.color}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const next = [...newOptions];
                              next[idx] = e.target.value;
                              setNewOptions(next);
                            }}
                            placeholder={`Option ${meta.label} ${isCorrect ? '(Correct)' : ''}`}
                            className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                          />
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                              isCorrect ? 'border-emerald-400 bg-emerald-500' : 'border-slate-600'
                            }`}
                          >
                            {isCorrect && <Check className="w-2.5 h-2.5 text-black stroke-[3]" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {builderError && <p className="text-xs text-rose-400">{builderError}</p>}

                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow flex items-center justify-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Question to Deck</span>
                </button>
              </div>

              {/* Questions in Deck list */}
              {customQuestions.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span>Questions in Current Deck ({customQuestions.length})</span>
                    <button
                      type="button"
                      onClick={() => setCustomQuestions([])}
                      className="text-rose-400 hover:underline text-[11px]"
                    >
                      Clear all
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {customQuestions.map((q, idx) => (
                      <div
                        key={q.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-[#141b2c] border border-white/5 text-xs"
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          <span className="font-bold text-slate-400">#{idx + 1}</span>
                          <span className="truncate text-white font-medium">{q.text}</span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-300 font-bold border border-indigo-500/20">
                            {q.type === 'puzzle' ? 'Puzzle' : q.type === 'true_false' ? 'T/F' : 'Quiz'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setCustomQuestions((prev) => prev.filter((_, i) => i !== idx))}
                          className="p-1 text-slate-500 hover:text-rose-400 flex-shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    disabled={creating}
                    onClick={handleCreateCustom}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 hover:brightness-110 transition-all flex items-center justify-center gap-2"
                  >
                    {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
                    <span>Start My Custom Quiz ({customQuestions.length} Questions)</span>
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* ─── MODAL 1: PDF IMPORT & EXTRACTOR ─────────────────────────────── */}
          <AnimatePresence>
            {showPdfModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-xl max-h-[85vh] flex flex-col rounded-3xl bg-[#0f1422] border border-white/10 p-5 shadow-2xl overflow-hidden"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-bold text-white">Import Questions from PDF or Document</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPdfModal(false);
                        setExtractedQuestions(null);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {!extractedQuestions ? (
                    <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                      {/* PDF Dropzone */}
                      <input
                        ref={pdfInputRef}
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handlePdfUpload(e.target.files[0])}
                      />
                      <div
                        onClick={() => pdfInputRef.current?.click()}
                        className="border-2 border-dashed border-amber-500/30 hover:border-amber-500/60 rounded-2xl p-6 bg-amber-500/5 cursor-pointer text-center flex flex-col items-center justify-center transition-all group"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                          <Upload className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-bold text-white mb-1">Click to upload PDF Question Sheet</span>
                        <p className="text-xs text-slate-400 max-w-xs">
                          Upload exam papers, test sheets, or question banks with Multiple Choice or True/False.
                        </p>
                      </div>

                      {/* Text paste fallback */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                          <span>Or paste question text directly:</span>
                          <span className="text-[10px] text-slate-500">Supports 1. Question A) ... B) ... Answer: A</span>
                        </label>
                        <textarea
                          rows={4}
                          value={rawPastedText}
                          onChange={(e) => setRawPastedText(e.target.value)}
                          placeholder="Paste questions here... Example:&#10;1. What is the fastest land animal?&#10;A) Lion&#10;B) Cheetah&#10;C) Gazelle&#10;Answer: B"
                          className="w-full p-3 rounded-xl bg-[#080b13] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                        <button
                          type="button"
                          onClick={handleParsePastedText}
                          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-all"
                        >
                          Extract from Pasted Text
                        </button>
                      </div>

                      {pdfExtracting && (
                        <div className="flex items-center justify-center gap-2 py-4 text-xs font-bold text-amber-400">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Extracting & analyzing questions...</span>
                        </div>
                      )}

                      {pdfError && (
                        <p className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                          {pdfError}
                        </p>
                      )}
                    </div>
                  ) : (
                    /* Review Extracted Questions */
                    <div className="flex-1 flex flex-col min-h-0 space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-emerald-400 bg-emerald-950/30 border border-emerald-500/30 p-2.5 rounded-xl">
                        <span>Extracted {extractedQuestions.length} Questions</span>
                        <span className="text-slate-400 font-normal">Click any option to change correct answer</span>
                      </div>

                      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[360px]">
                        {extractedQuestions.map((q, qIdx) => (
                          <div key={q.id} className="p-3 rounded-xl bg-[#141b2c] border border-white/10 space-y-2 text-xs">
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-bold text-white">
                                #{qIdx + 1}. {q.text}
                              </span>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-violet-500/20 text-violet-300 border border-violet-500/30 font-bold uppercase">
                                  {q.type}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setExtractedQuestions((prev) => prev?.filter((_, i) => i !== qIdx) || null)}
                                  className="text-slate-500 hover:text-rose-400"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-1.5">
                              {q.options.map((opt, optIdx) => (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => {
                                    setExtractedQuestions((prev) => {
                                      if (!prev) return null;
                                      const next = [...prev];
                                      const updatedQ = { ...next[qIdx]! };
                                      updatedQ.options = updatedQ.options.map((o, i) => ({
                                        ...o,
                                        isCorrect: i === optIdx,
                                      }));
                                      next[qIdx] = updatedQ;
                                      return next;
                                    });
                                  }}
                                  className={`p-1.5 rounded-lg border text-left text-[11px] truncate flex items-center justify-between ${
                                    opt.isCorrect
                                      ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-bold'
                                      : 'bg-[#0b101c] border-white/5 text-slate-400 hover:text-white'
                                  }`}
                                >
                                  <span className="truncate">{opt.text}</span>
                                  {opt.isCorrect && <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => setExtractedQuestions(null)}
                          className="px-3 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={handleApplyExtractedQuestions}
                          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Add All {extractedQuestions.length} to Custom Deck</span>
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* ─── MODAL 2: SAVE DECK TO LIBRARY ───────────────────────────────── */}
          <AnimatePresence>
            {showSaveDeckModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-md rounded-3xl bg-[#0f1422] border border-white/10 p-5 shadow-2xl space-y-4"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Library className="w-4 h-4 text-amber-400" />
                      <span>Save Quiz to My Library</span>
                    </h3>
                    <button type="button" onClick={() => setShowSaveDeckModal(false)} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 mb-1 block">Quiz Title</label>
                      <input
                        type="text"
                        value={saveDeckTitle}
                        onChange={(e) => setSaveDeckTitle(e.target.value)}
                        placeholder="e.g. Science Term 1 Exam, Team Trivia #4..."
                        className="w-full h-10 px-3 rounded-xl bg-[#0b101c] border border-white/10 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 mb-1 block">Description</label>
                      <input
                        type="text"
                        value={saveDeckDesc}
                        onChange={(e) => setSaveDeckDesc(e.target.value)}
                        placeholder="Brief summary or subject notes..."
                        className="w-full h-10 px-3 rounded-xl bg-[#0b101c] border border-white/10 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center justify-between">
                      <span>Total Questions:</span>
                      <span className="font-extrabold">{customQuestions.length}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowSaveDeckModal(false)}
                      className="flex-1 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveCurrentDeck}
                      className="flex-1 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30"
                    >
                      Save to Library
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* ─── MODAL 3: CSV IMPORT ─────────────────────────────────────────── */}
          <AnimatePresence>
            {showCsvModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-lg rounded-3xl bg-[#0f1422] border border-white/10 p-5 shadow-2xl space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                      <span>Paste CSV Questions</span>
                    </h3>
                    <button type="button" onClick={() => setShowCsvModal(false)} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-400">Format per line: Question, Option 1, Option 2, Option 3, Option 4, CorrectOption(1-4)</p>
                  <textarea
                    rows={6}
                    value={csvText}
                    onChange={(e) => setCsvText(e.target.value)}
                    placeholder="Capital of Japan, Tokyo, Kyoto, Osaka, Nagoya, 1&#10;Fastest animal, Cheetah, Falcon, Sailfish, Horse, 1"
                    className="w-full p-3 rounded-xl bg-[#080b13] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowCsvModal(false)}
                      className="flex-1 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleImportCsv}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                    >
                      Import Rows
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
