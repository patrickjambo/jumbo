import { QuestionSchema, type Question } from '@jumbo/shared';

function randomId(): string { return crypto.randomUUID(); }
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i]!, a[j]!] = [a[j]!, a[i]!];
  }
  return a;
}

interface SeedEntry {
  category: string;
  text: string;
  correct: string;
  distractors: [string, string, string];
  imageUrl?: string;
}

function seedToQuestion(entry: SeedEntry): Question {
  const optTexts = shuffle([entry.correct, ...entry.distractors]);
  const options = optTexts.map((text) => ({
    id: randomId(),
    text,
    isCorrect: text === entry.correct,
  }));
  return QuestionSchema.parse({
    id: randomId(),
    category: entry.category,
    text: entry.text,
    imageUrl: entry.imageUrl,
    options,
    timeLimit: entry.imageUrl ? 15 : 20,
    difficulty: 'medium' as const,
    source: 'seed',
    points: 1000,
  });
}

const RAW_SEEDS: SeedEntry[] = [
  // ── Flags ──────────────────────────────────────────────────────────────────
  { category: 'flags', text: 'Which country does this flag belong to?', correct: 'Kenya', distractors: ['Ethiopia', 'Tanzania', 'Uganda'], imageUrl: 'https://flagcdn.com/w320/ke.png' },
  { category: 'flags', text: 'Which country does this flag belong to?', correct: 'France', distractors: ['Belgium', 'Italy', 'Netherlands'], imageUrl: 'https://flagcdn.com/w320/fr.png' },
  { category: 'flags', text: 'Which country does this flag belong to?', correct: 'Japan', distractors: ['South Korea', 'China', 'Taiwan'], imageUrl: 'https://flagcdn.com/w320/jp.png' },
  { category: 'flags', text: 'Which country does this flag belong to?', correct: 'Brazil', distractors: ['Argentina', 'Colombia', 'Venezuela'], imageUrl: 'https://flagcdn.com/w320/br.png' },
  { category: 'flags', text: 'Which country does this flag belong to?', correct: 'Canada', distractors: ['Denmark', 'Switzerland', 'Peru'], imageUrl: 'https://flagcdn.com/w320/ca.png' },
  { category: 'flags', text: 'Which country does this flag belong to?', correct: 'Germany', distractors: ['Austria', 'Belgium', 'Hungary'], imageUrl: 'https://flagcdn.com/w320/de.png' },
  { category: 'flags', text: 'Which country does this flag belong to?', correct: 'India', distractors: ['Pakistan', 'Bangladesh', 'Sri Lanka'], imageUrl: 'https://flagcdn.com/w320/in.png' },
  { category: 'flags', text: 'Which country does this flag belong to?', correct: 'Mexico', distractors: ['Italy', 'Hungary', 'Bulgaria'], imageUrl: 'https://flagcdn.com/w320/mx.png' },
  { category: 'flags', text: 'Which country does this flag belong to?', correct: 'China', distractors: ['Vietnam', 'North Korea', 'Laos'], imageUrl: 'https://flagcdn.com/w320/cn.png' },
  { category: 'flags', text: 'Which country does this flag belong to?', correct: 'Australia', distractors: ['New Zealand', 'Fiji', 'Tuvalu'], imageUrl: 'https://flagcdn.com/w320/au.png' },

  // ── Capitals ────────────────────────────────────────────────────────────────
  { category: 'countries_capitals', text: 'What is the capital of Australia?', correct: 'Canberra', distractors: ['Sydney', 'Melbourne', 'Brisbane'] },
  { category: 'countries_capitals', text: 'What is the capital of Brazil?', correct: 'Brasília', distractors: ['São Paulo', 'Rio de Janeiro', 'Salvador'] },
  { category: 'countries_capitals', text: 'What is the capital of Japan?', correct: 'Tokyo', distractors: ['Osaka', 'Kyoto', 'Hiroshima'] },
  { category: 'countries_capitals', text: 'What is the capital of Canada?', correct: 'Ottawa', distractors: ['Toronto', 'Vancouver', 'Montreal'] },
  { category: 'countries_capitals', text: 'What is the capital of South Africa?', correct: 'Pretoria', distractors: ['Cape Town', 'Johannesburg', 'Durban'] },
  { category: 'countries_capitals', text: 'What is the capital of India?', correct: 'New Delhi', distractors: ['Mumbai', 'Kolkata', 'Bangalore'] },
  { category: 'countries_capitals', text: 'What is the capital of Egypt?', correct: 'Cairo', distractors: ['Alexandria', 'Luxor', 'Giza'] },
  { category: 'countries_capitals', text: 'What is the capital of Argentina?', correct: 'Buenos Aires', distractors: ['Córdoba', 'Rosario', 'Mendoza'] },
  { category: 'countries_capitals', text: 'What is the capital of Turkey?', correct: 'Ankara', distractors: ['Istanbul', 'Izmir', 'Bursa'] },
  { category: 'countries_capitals', text: 'What is the capital of Nigeria?', correct: 'Abuja', distractors: ['Lagos', 'Kano', 'Ibadan'] },

  // ── Science ─────────────────────────────────────────────────────────────────
  { category: 'science', text: 'What is the chemical symbol for gold?', correct: 'Au', distractors: ['Ag', 'Fe', 'Cu'] },
  { category: 'science', text: 'How many bones are in the adult human body?', correct: '206', distractors: ['196', '216', '226'] },
  { category: 'science', text: 'What planet is known as the Red Planet?', correct: 'Mars', distractors: ['Venus', 'Jupiter', 'Saturn'] },
  { category: 'science', text: 'What gas do plants absorb during photosynthesis?', correct: 'Carbon dioxide', distractors: ['Oxygen', 'Nitrogen', 'Hydrogen'] },
  { category: 'science', text: 'What is the powerhouse of the cell?', correct: 'Mitochondria', distractors: ['Nucleus', 'Ribosome', 'Golgi apparatus'] },
  { category: 'science', text: 'What is the atomic number of hydrogen?', correct: '1', distractors: ['2', '6', '8'] },
  { category: 'science', text: 'Which planet has the most moons?', correct: 'Saturn', distractors: ['Jupiter', 'Uranus', 'Neptune'] },
  { category: 'science', text: 'What is the most abundant gas in Earth\'s atmosphere?', correct: 'Nitrogen', distractors: ['Oxygen', 'Carbon dioxide', 'Argon'] },

  // ── History ─────────────────────────────────────────────────────────────────
  { category: 'history', text: 'In what year did World War II end?', correct: '1945', distractors: ['1943', '1947', '1941'] },
  { category: 'history', text: 'Who was the first person to walk on the Moon?', correct: 'Neil Armstrong', distractors: ['Buzz Aldrin', 'Yuri Gagarin', 'John Glenn'] },
  { category: 'history', text: 'Which empire was the largest in history by land area?', correct: 'Mongol Empire', distractors: ['British Empire', 'Roman Empire', 'Ottoman Empire'] },
  { category: 'history', text: 'In what year did the Berlin Wall fall?', correct: '1989', distractors: ['1987', '1991', '1985'] },
  { category: 'history', text: 'Who wrote the Declaration of Independence?', correct: 'Thomas Jefferson', distractors: ['George Washington', 'Benjamin Franklin', 'John Adams'] },
  { category: 'history', text: 'In what year did the Titanic sink?', correct: '1912', distractors: ['1910', '1914', '1916'] },

  // ── Geography ───────────────────────────────────────────────────────────────
  { category: 'geography', text: 'What is the longest river in the world?', correct: 'Nile', distractors: ['Amazon', 'Yangtze', 'Mississippi'] },
  { category: 'geography', text: 'What is the largest ocean?', correct: 'Pacific', distractors: ['Atlantic', 'Indian', 'Arctic'] },
  { category: 'geography', text: 'What is the largest desert in the world?', correct: 'Antarctic Desert', distractors: ['Sahara', 'Arabian', 'Gobi'] },
  { category: 'geography', text: 'What is the tallest mountain in the world?', correct: 'Mount Everest', distractors: ['K2', 'Kangchenjunga', 'Mont Blanc'] },
  { category: 'geography', text: 'Which country has the most natural lakes?', correct: 'Canada', distractors: ['Russia', 'USA', 'Finland'] },

  // ── Math ────────────────────────────────────────────────────────────────────
  { category: 'math_formulas', text: 'What is the formula for the area of a circle?', correct: 'πr²', distractors: ['2πr', 'πd', 'r²/2'] },
  { category: 'math_formulas', text: 'What is 15% of 200?', correct: '30', distractors: ['25', '35', '20'] },
  { category: 'math_formulas', text: 'What is the square root of 144?', correct: '12', distractors: ['11', '13', '14'] },
  { category: 'math_formulas', text: 'What is 7 × 8?', correct: '56', distractors: ['54', '58', '48'] },
  { category: 'math_formulas', text: 'What is 2 to the power of 10?', correct: '1024', distractors: ['512', '2048', '1000'] },

  // ── General Knowledge ───────────────────────────────────────────────────────
  { category: 'general_knowledge', text: 'How many sides does a hexagon have?', correct: '6', distractors: ['5', '7', '8'] },
  { category: 'general_knowledge', text: 'What language has the most native speakers?', correct: 'Mandarin Chinese', distractors: ['English', 'Spanish', 'Hindi'] },
  { category: 'general_knowledge', text: 'In what sport would you perform a slam dunk?', correct: 'Basketball', distractors: ['Volleyball', 'Tennis', 'Handball'] },
  { category: 'general_knowledge', text: 'How many strings does a standard guitar have?', correct: '6', distractors: ['4', '5', '7'] },
  { category: 'general_knowledge', text: 'What is the largest planet in our solar system?', correct: 'Jupiter', distractors: ['Saturn', 'Uranus', 'Neptune'] },

  // ── Animals ─────────────────────────────────────────────────────────────────
  { category: 'animals', text: 'What is the fastest land animal?', correct: 'Cheetah', distractors: ['Lion', 'Leopard', 'Greyhound'] },
  { category: 'animals', text: 'How many hearts does an octopus have?', correct: '3', distractors: ['1', '2', '4'] },
  { category: 'animals', text: 'What is the largest living animal?', correct: 'Blue Whale', distractors: ['Elephant', 'Giraffe', 'Colossal Squid'] },
  { category: 'animals', text: 'Which animal cannot jump?', correct: 'Elephant', distractors: ['Hippopotamus', 'Rhinoceros', 'Giraffe'] },
  { category: 'animals', text: 'How many legs does a spider have?', correct: '8', distractors: ['6', '10', '12'] },

  // ── Mythology ───────────────────────────────────────────────────────────────
  { category: 'mythology', text: 'Who is the Greek god of the sea?', correct: 'Poseidon', distractors: ['Zeus', 'Hades', 'Apollo'] },
  { category: 'mythology', text: 'What creature has the body of a lion and head of a human?', correct: 'Sphinx', distractors: ['Centaur', 'Minotaur', 'Griffin'] },
  { category: 'mythology', text: 'Who is the Norse god of thunder?', correct: 'Thor', distractors: ['Odin', 'Loki', 'Freyr'] },
  { category: 'mythology', text: 'Which hero killed the Minotaur?', correct: 'Theseus', distractors: ['Hercules', 'Perseus', 'Achilles'] },
  { category: 'mythology', text: 'What is the name of the Egyptian god of the dead?', correct: 'Osiris', distractors: ['Ra', 'Anubis', 'Horus'] },

  // ── Religion & Culture ──────────────────────────────────────────────────────
  { category: 'religion_culture', text: 'What is the holiest city in Islam?', correct: 'Mecca', distractors: ['Medina', 'Jerusalem', 'Cairo'] },
  { category: 'religion_culture', text: 'How many books are in the Protestant Bible?', correct: '66', distractors: ['39', '73', '60'] },
  { category: 'religion_culture', text: 'What is the sacred text of Islam?', correct: 'Quran', distractors: ['Bible', 'Torah', 'Vedas'] },
  { category: 'religion_culture', text: 'In Buddhism, what is the concept of suffering called?', correct: 'Dukkha', distractors: ['Karma', 'Nirvana', 'Dharma'] },

  // ── Numbers & Logic ──────────────────────────────────────────────────────────
  { category: 'numbers_logic', text: 'What is the next prime number after 7?', correct: '11', distractors: ['9', '13', '10'] },
  { category: 'numbers_logic', text: 'What is 2^10?', correct: '1024', distractors: ['512', '2048', '768'] },
  { category: 'numbers_logic', text: 'How many degrees are in a full circle?', correct: '360', distractors: ['180', '270', '90'] },
  { category: 'numbers_logic', text: 'What is the Roman numeral for 50?', correct: 'L', distractors: ['C', 'V', 'X'] },

  // ── Logos & Brands ───────────────────────────────────────────────────────────
  { category: 'logos_brands', text: 'Which company has a bitten apple as its logo?', correct: 'Apple', distractors: ['Microsoft', 'Google', 'Samsung'] },
  { category: 'logos_brands', text: 'Which brand uses the slogan "Just Do It"?', correct: 'Nike', distractors: ['Adidas', 'Puma', 'Reebok'] },
  { category: 'logos_brands', text: 'The "golden arches" logo belongs to which fast food chain?', correct: 'McDonald\'s', distractors: ['Burger King', 'KFC', 'Wendy\'s'] },
];

// Pre-convert once at module load time
export const SEED_BANK: Question[] = RAW_SEEDS.map(seedToQuestion);
