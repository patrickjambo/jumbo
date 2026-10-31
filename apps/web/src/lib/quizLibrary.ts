import type { Question } from '@jumbo/shared';

export interface SavedQuizDeck {
  id: string;
  title: string;
  description: string;
  createdAt: number;
  updatedAt: number;
  questions: Question[];
  questionCount: number;
  typeBreakdown: {
    multiple_choice: number;
    true_false: number;
    puzzle: number;
  };
  tags: string[];
}

const STORAGE_KEY = 'jumbo_quiz_library_v1';

export const DEFAULT_SAMPLE_DECKS: SavedQuizDeck[] = [
  {
    id: 'deck_rwanda_heritage',
    title: 'Rwanda & East African Heritage',
    description: 'Explore Rwandan history, geography, wildlife, and achievements in this mixed quiz.',
    createdAt: 1730300000000,
    updatedAt: 1730300000000,
    tags: ['Geography', 'Culture', 'History'],
    questionCount: 4,
    typeBreakdown: { multiple_choice: 2, true_false: 1, puzzle: 1 },
    questions: [
      {
        id: 'rw_q1',
        type: 'multiple_choice',
        text: 'What is the capital and largest economic hub of Rwanda?',
        category: 'Rwanda',
        difficulty: 'easy',
        timeLimit: 20,
        points: 1000,
        options: [
          { id: 'rw_opt_1a', text: 'Kigali', isCorrect: true },
          { id: 'rw_opt_1b', text: 'Huye', isCorrect: false },
          { id: 'rw_opt_1c', text: 'Musanze', isCorrect: false },
          { id: 'rw_opt_1d', text: 'Rubavu', isCorrect: false },
        ],
      },
      {
        id: 'rw_q2',
        type: 'true_false',
        text: 'Volcanoes National Park in Rwanda is home to endangered Mountain Gorillas.',
        category: 'Rwanda',
        difficulty: 'easy',
        timeLimit: 15,
        points: 1000,
        options: [
          { id: 'rw_opt_2a', text: 'True', isCorrect: true },
          { id: 'rw_opt_2b', text: 'False', isCorrect: false },
        ],
      },
      {
        id: 'rw_q3',
        type: 'puzzle',
        text: 'Arrange these major bodies of water in East Africa from largest to smallest surface area:',
        category: 'Geography',
        difficulty: 'medium',
        timeLimit: 30,
        points: 1000,
        correctOrder: ['puz_lake_vic', 'puz_lake_tan', 'puz_lake_kivu', 'puz_lake_muhazi'],
        options: [
          { id: 'puz_lake_vic', text: '1. Lake Victoria (Largest)', isCorrect: true },
          { id: 'puz_lake_tan', text: '2. Lake Tanganyika', isCorrect: true },
          { id: 'puz_lake_kivu', text: '3. Lake Kivu', isCorrect: true },
          { id: 'puz_lake_muhazi', text: '4. Lake Muhazi', isCorrect: true },
        ],
      },
      {
        id: 'rw_q4',
        type: 'multiple_choice',
        text: 'Which national celebration in Rwanda is dedicated to naming baby mountain gorillas?',
        category: 'Culture',
        difficulty: 'medium',
        timeLimit: 20,
        points: 1000,
        options: [
          { id: 'rw_opt_4a', text: 'Kwita Izina', isCorrect: true },
          { id: 'rw_opt_4b', text: 'Umuganda', isCorrect: false },
          { id: 'rw_opt_4c', text: 'FESPAD', isCorrect: false },
          { id: 'rw_opt_4d', text: 'Umuganura', isCorrect: false },
        ],
      },
    ],
  },
  {
    id: 'deck_tech_innovators',
    title: 'Tech Giants & Internet Milestones',
    description: 'Mixed challenge covering programming languages, AI breakthroughs, and tech history.',
    createdAt: 1730305000000,
    updatedAt: 1730305000000,
    tags: ['Technology', 'Computing', 'Web'],
    questionCount: 4,
    typeBreakdown: { multiple_choice: 2, true_false: 1, puzzle: 1 },
    questions: [
      {
        id: 'tech_q1',
        type: 'multiple_choice',
        text: 'Who created the Linux operating system kernel in 1991?',
        category: 'Technology',
        difficulty: 'easy',
        timeLimit: 20,
        points: 1000,
        options: [
          { id: 'tech_opt_1a', text: 'Linus Torvalds', isCorrect: true },
          { id: 'tech_opt_1b', text: 'Steve Jobs', isCorrect: false },
          { id: 'tech_opt_1c', text: 'Bill Gates', isCorrect: false },
          { id: 'tech_opt_1d', text: 'Dennis Ritchie', isCorrect: false },
        ],
      },
      {
        id: 'tech_q2',
        type: 'true_false',
        text: 'HTTP status code 404 indicates "Server Internal Error".',
        category: 'Technology',
        difficulty: 'easy',
        timeLimit: 15,
        points: 1000,
        options: [
          { id: 'tech_opt_2a', text: 'True', isCorrect: false },
          { id: 'tech_opt_2b', text: 'False (It means Not Found)', isCorrect: true },
        ],
      },
      {
        id: 'tech_q3',
        type: 'puzzle',
        text: 'Arrange these programming languages in chronological order of first public release:',
        category: 'Computing',
        difficulty: 'hard',
        timeLimit: 30,
        points: 1000,
        correctOrder: ['puz_c', 'puz_python', 'puz_js', 'puz_rust'],
        options: [
          { id: 'puz_c', text: '1. C (1972)', isCorrect: true },
          { id: 'puz_python', text: '2. Python (1991)', isCorrect: true },
          { id: 'puz_js', text: '3. JavaScript (1995)', isCorrect: true },
          { id: 'puz_rust', text: '4. Rust (2015)', isCorrect: true },
        ],
      },
      {
        id: 'tech_q4',
        type: 'multiple_choice',
        text: 'Which protocol powers real-time bidirectional WebRTC video and audio communications?',
        category: 'Networking',
        difficulty: 'medium',
        timeLimit: 20,
        points: 1000,
        options: [
          { id: 'tech_opt_4a', text: 'SRTP / UDP', isCorrect: true },
          { id: 'tech_opt_4b', text: 'SMTP / TCP', isCorrect: false },
          { id: 'tech_opt_4c', text: 'FTP / IP', isCorrect: false },
          { id: 'tech_opt_4d', text: 'Telnet', isCorrect: false },
        ],
      },
    ],
  },
];

/**
 * Retrieve all saved quiz decks from localStorage, seeding with defaults if empty.
 */
export function getSavedQuizLibrary(): SavedQuizDeck[] {
  if (typeof window === 'undefined') return DEFAULT_SAMPLE_DECKS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SAMPLE_DECKS));
      return DEFAULT_SAMPLE_DECKS;
    }
    const parsed = JSON.parse(raw) as SavedQuizDeck[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_SAMPLE_DECKS;
  } catch (err) {
    console.warn('Failed to parse quiz library from localStorage:', err);
    return DEFAULT_SAMPLE_DECKS;
  }
}

/**
 * Save or update a quiz deck in the user's persistent library.
 */
export function saveQuizDeckToLibrary(deck: Omit<SavedQuizDeck, 'id' | 'createdAt' | 'updatedAt' | 'questionCount' | 'typeBreakdown'> & { id?: string; createdAt?: number }): SavedQuizDeck {
  const current = getSavedQuizLibrary();
  const now = Date.now();
  const id = deck.id || `deck_${now}_${Math.random().toString(36).substring(2, 7)}`;

  // Calculate question type breakdown
  const typeBreakdown = {
    multiple_choice: deck.questions.filter((q) => q.type === 'multiple_choice').length,
    true_false: deck.questions.filter((q) => q.type === 'true_false').length,
    puzzle: deck.questions.filter((q) => q.type === 'puzzle').length,
  };

  const newDeck: SavedQuizDeck = {
    ...deck,
    id,
    createdAt: deck.createdAt || now,
    updatedAt: now,
    questionCount: deck.questions.length,
    typeBreakdown,
    tags: deck.tags || ['Custom'],
  };

  const existsIdx = current.findIndex((d) => d.id === id);
  let updatedList: SavedQuizDeck[];
  if (existsIdx >= 0) {
    updatedList = [...current];
    updatedList[existsIdx] = newDeck;
  } else {
    updatedList = [newDeck, ...current];
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  return newDeck;
}

/**
 * Delete a quiz deck from the library.
 */
export function deleteQuizDeckFromLibrary(id: string): SavedQuizDeck[] {
  const current = getSavedQuizLibrary();
  const filtered = current.filter((d) => d.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return filtered;
}

/**
 * Export a deck as a downloadable JSON file.
 */
export function exportQuizDeckToJson(deck: SavedQuizDeck) {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(deck, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `${deck.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_quiz.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Parse an imported JSON file string into a SavedQuizDeck.
 */
export function parseImportedQuizJson(jsonContent: string): SavedQuizDeck {
  const parsed = JSON.parse(jsonContent);
  if (!parsed.questions || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
    throw new Error('Invalid quiz file: must contain an array of questions');
  }

  return saveQuizDeckToLibrary({
    title: parsed.title || 'Imported Quiz',
    description: parsed.description || 'Imported from JSON',
    questions: parsed.questions,
    tags: parsed.tags || ['Imported'],
  });
}
