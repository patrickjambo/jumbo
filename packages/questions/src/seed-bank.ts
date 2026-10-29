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
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Kenya",
    "distractors": [
      "Ethiopia",
      "Tanzania",
      "Uganda"
    ],
    "imageUrl": "https://flagcdn.com/w320/ke.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "France",
    "distractors": [
      "Belgium",
      "Italy",
      "Netherlands"
    ],
    "imageUrl": "https://flagcdn.com/w320/fr.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Japan",
    "distractors": [
      "South Korea",
      "China",
      "Taiwan"
    ],
    "imageUrl": "https://flagcdn.com/w320/jp.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Brazil",
    "distractors": [
      "Argentina",
      "Colombia",
      "Venezuela"
    ],
    "imageUrl": "https://flagcdn.com/w320/br.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Canada",
    "distractors": [
      "Denmark",
      "Switzerland",
      "Peru"
    ],
    "imageUrl": "https://flagcdn.com/w320/ca.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Germany",
    "distractors": [
      "Austria",
      "Belgium",
      "Hungary"
    ],
    "imageUrl": "https://flagcdn.com/w320/de.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "India",
    "distractors": [
      "Pakistan",
      "Bangladesh",
      "Sri Lanka"
    ],
    "imageUrl": "https://flagcdn.com/w320/in.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Mexico",
    "distractors": [
      "Italy",
      "Hungary",
      "Bulgaria"
    ],
    "imageUrl": "https://flagcdn.com/w320/mx.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "China",
    "distractors": [
      "Vietnam",
      "North Korea",
      "Laos"
    ],
    "imageUrl": "https://flagcdn.com/w320/cn.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Australia",
    "distractors": [
      "New Zealand",
      "Fiji",
      "Tuvalu"
    ],
    "imageUrl": "https://flagcdn.com/w320/au.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Argentina",
    "distractors": [
      "Uruguay",
      "Paraguay",
      "Chile"
    ],
    "imageUrl": "https://flagcdn.com/w320/ar.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "South Africa",
    "distractors": [
      "Namibia",
      "Zimbabwe",
      "Botswana"
    ],
    "imageUrl": "https://flagcdn.com/w320/za.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Egypt",
    "distractors": [
      "Syria",
      "Iraq",
      "Yemen"
    ],
    "imageUrl": "https://flagcdn.com/w320/eg.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Greece",
    "distractors": [
      "Cyprus",
      "Israel",
      "Finland"
    ],
    "imageUrl": "https://flagcdn.com/w320/gr.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "South Korea",
    "distractors": [
      "Japan",
      "Singapore",
      "Mongolia"
    ],
    "imageUrl": "https://flagcdn.com/w320/kr.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Spain",
    "distractors": [
      "Portugal",
      "Andorra",
      "Romania"
    ],
    "imageUrl": "https://flagcdn.com/w320/es.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Sweden",
    "distractors": [
      "Norway",
      "Denmark",
      "Finland"
    ],
    "imageUrl": "https://flagcdn.com/w320/se.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Norway",
    "distractors": [
      "Sweden",
      "Iceland",
      "Denmark"
    ],
    "imageUrl": "https://flagcdn.com/w320/no.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Italy",
    "distractors": [
      "Ireland",
      "Mexico",
      "Hungary"
    ],
    "imageUrl": "https://flagcdn.com/w320/it.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Switzerland",
    "distractors": [
      "Austria",
      "Poland",
      "Denmark"
    ],
    "imageUrl": "https://flagcdn.com/w320/ch.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "United Kingdom",
    "distractors": [
      "Australia",
      "New Zealand",
      "Iceland"
    ],
    "imageUrl": "https://flagcdn.com/w320/gb.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "United States",
    "distractors": [
      "Liberia",
      "Malaysia",
      "Cuba"
    ],
    "imageUrl": "https://flagcdn.com/w320/us.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Turkey",
    "distractors": [
      "Tunisia",
      "Algeria",
      "Azerbaijan"
    ],
    "imageUrl": "https://flagcdn.com/w320/tr.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Nigeria",
    "distractors": [
      "Ghana",
      "Cameroon",
      "Senegal"
    ],
    "imageUrl": "https://flagcdn.com/w320/ng.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Jamaica",
    "distractors": [
      "Bahamas",
      "Barbados",
      "Trinidad and Tobago"
    ],
    "imageUrl": "https://flagcdn.com/w320/jm.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Morocco",
    "distractors": [
      "Tunisia",
      "Algeria",
      "Vietnam"
    ],
    "imageUrl": "https://flagcdn.com/w320/ma.png"
  },
  {
    "category": "countries_capitals",
    "text": "What is the capital of Australia?",
    "correct": "Canberra",
    "distractors": [
      "Sydney",
      "Melbourne",
      "Brisbane"
    ]
  },
  {
    "category": "countries_capitals",
    "text": "What is the capital of Brazil?",
    "correct": "Bras\u00edlia",
    "distractors": [
      "S\u00e3o Paulo",
      "Rio de Janeiro",
      "Salvador"
    ]
  },
  {
    "category": "countries_capitals",
    "text": "What is the capital of Japan?",
    "correct": "Tokyo",
    "distractors": [
      "Osaka",
      "Kyoto",
      "Hiroshima"
    ]
  },
  {
    "category": "countries_capitals",
    "text": "What is the capital of Canada?",
    "correct": "Ottawa",
    "distractors": [
      "Toronto",
      "Vancouver",
      "Montreal"
    ]
  },
  {
    "category": "countries_capitals",
    "text": "What is the capital of South Africa?",
    "correct": "Pretoria",
    "distractors": [
      "Cape Town",
      "Johannesburg",
      "Durban"
    ]
  },
  {
    "category": "countries_capitals",
    "text": "What is the capital of India?",
    "correct": "New Delhi",
    "distractors": [
      "Mumbai",
      "Kolkata",
      "Bangalore"
    ]
  },
  {
    "category": "countries_capitals",
    "text": "What is the capital of Germany?",
    "correct": "Berlin",
    "distractors": [
      "Munich",
      "Frankfurt",
      "Hamburg"
    ]
  },
  {
    "category": "countries_capitals",
    "text": "What is the capital of Argentina?",
    "correct": "Buenos Aires",
    "distractors": [
      "C\u00f3rdoba",
      "Rosario",
      "Mendoza"
    ]
  },
  {
    "category": "countries_capitals",
    "text": "What is the capital of Egypt?",
    "correct": "Cairo",
    "distractors": [
      "Alexandria",
      "Giza",
      "Luxor"
    ]
  },
  {
    "category": "countries_capitals",
    "text": "What is the capital of Turkey?",
    "correct": "Ankara",
    "distractors": [
      "Istanbul",
      "Izmir",
      "Antalya"
    ]
  },
  {
    "category": "countries_capitals",
    "text": "What is the capital of Nigeria?",
    "correct": "Abuja",
    "distractors": [
      "Lagos",
      "Kano",
      "Ibadan"
    ]
  },
  {
    "category": "countries_capitals",
    "text": "What is the capital of New Zealand?",
    "correct": "Wellington",
    "distractors": [
      "Auckland",
      "Christchurch",
      "Hamilton"
    ]
  },
  {
    "category": "countries_capitals",
    "text": "What is the capital of Spain?",
    "correct": "Madrid",
    "distractors": [
      "Barcelona",
      "Valencia",
      "Seville"
    ]
  },
  {
    "category": "countries_capitals",
    "text": "What is the capital of Italy?",
    "correct": "Rome",
    "distractors": [
      "Milan",
      "Naples",
      "Florence"
    ]
  },
  {
    "category": "countries_capitals",
    "text": "What is the capital of Morocco?",
    "correct": "Rabat",
    "distractors": [
      "Casablanca",
      "Marrakech",
      "Fez"
    ]
  },
  {
    "category": "countries_capitals",
    "text": "What is the capital of Thailand?",
    "correct": "Bangkok",
    "distractors": [
      "Chiang Mai",
      "Phuket",
      "Pattaya"
    ]
  },
  {
    "category": "countries_capitals",
    "text": "What is the capital of South Korea?",
    "correct": "Seoul",
    "distractors": [
      "Busan",
      "Incheon",
      "Daegu"
    ]
  },
  {
    "category": "countries_capitals",
    "text": "What is the capital of Sweden?",
    "correct": "Stockholm",
    "distractors": [
      "Gothenburg",
      "Malm\u00f6",
      "Uppsala"
    ]
  },
  {
    "category": "countries_capitals",
    "text": "What is the capital of Switzerland?",
    "correct": "Bern",
    "distractors": [
      "Zurich",
      "Geneva",
      "Basel"
    ]
  },
  {
    "category": "countries_capitals",
    "text": "What is the capital of Saudi Arabia?",
    "correct": "Riyadh",
    "distractors": [
      "Jeddah",
      "Mecca",
      "Medina"
    ]
  },
  {
    "category": "countries_capitals",
    "text": "What is the capital of Kenya?",
    "correct": "Nairobi",
    "distractors": [
      "Mombasa",
      "Kisumu",
      "Nakuru"
    ]
  },
  {
    "category": "countries_capitals",
    "text": "What is the capital of Norway?",
    "correct": "Oslo",
    "distractors": [
      "Bergen",
      "Trondheim",
      "Stavanger"
    ]
  },
  {
    "category": "countries_capitals",
    "text": "What is the capital of Portugal?",
    "correct": "Lisbon",
    "distractors": [
      "Porto",
      "Braga",
      "Coimbra"
    ]
  },
  {
    "category": "countries_capitals",
    "text": "What is the capital of Chile?",
    "correct": "Santiago",
    "distractors": [
      "Valpara\u00edso",
      "Concepci\u00f3n",
      "La Serena"
    ]
  },
  {
    "category": "countries_capitals",
    "text": "What is the capital of Colombia?",
    "correct": "Bogot\u00e1",
    "distractors": [
      "Medell\u00edn",
      "Cali",
      "Barranquilla"
    ]
  },
  {
    "category": "countries_capitals",
    "text": "What is the capital of Poland?",
    "correct": "Warsaw",
    "distractors": [
      "Krak\u00f3w",
      "Gda\u0144sk",
      "Wroc\u0142aw"
    ]
  },
  {
    "category": "logos_brands",
    "text": "Which company has a bitten apple as its logo?",
    "correct": "Apple",
    "distractors": [
      "Microsoft",
      "Google",
      "Samsung"
    ]
  },
  {
    "category": "logos_brands",
    "text": "Which brand uses the slogan 'Just Do It'?",
    "correct": "Nike",
    "distractors": [
      "Adidas",
      "Puma",
      "Reebok"
    ]
  },
  {
    "category": "logos_brands",
    "text": "The 'golden arches' logo belongs to which fast food chain?",
    "correct": "McDonald's",
    "distractors": [
      "Burger King",
      "KFC",
      "Wendy's"
    ]
  },
  {
    "category": "logos_brands",
    "text": "Which streaming platform has a red 'N' lettermark?",
    "correct": "Netflix",
    "distractors": [
      "Hulu",
      "Disney+",
      "Prime Video"
    ]
  },
  {
    "category": "logos_brands",
    "text": "Which luxury car brand features a prancing black horse on yellow?",
    "correct": "Ferrari",
    "distractors": [
      "Porsche",
      "Lamborghini",
      "Maserati"
    ]
  },
  {
    "category": "logos_brands",
    "text": "Which coffee chain features a two-tailed mermaid (siren) logo?",
    "correct": "Starbucks",
    "distractors": [
      "Costa Coffee",
      "Dunkin'",
      "Tim Hortons"
    ]
  },
  {
    "category": "logos_brands",
    "text": "Which tech giant uses an arrow smiling from A to Z in its logo?",
    "correct": "Amazon",
    "distractors": [
      "eBay",
      "Alibaba",
      "Shopify"
    ]
  },
  {
    "category": "logos_brands",
    "text": "Which social platform was originally known as the bird app?",
    "correct": "Twitter (X)",
    "distractors": [
      "Snapchat",
      "TikTok",
      "Pinterest"
    ]
  },
  {
    "category": "logos_brands",
    "text": "Which car brand features four interlocking rings?",
    "correct": "Audi",
    "distractors": [
      "BMW",
      "Mercedes-Benz",
      "Volkswagen"
    ]
  },
  {
    "category": "logos_brands",
    "text": "Which sportswear company uses a leaping feline in its emblem?",
    "correct": "Puma",
    "distractors": [
      "Slazenger",
      "Under Armour",
      "Asics"
    ]
  },
  {
    "category": "logos_brands",
    "text": "Which Swedish furniture brand uses a blue and yellow box logo?",
    "correct": "IKEA",
    "distractors": [
      "H&M",
      "Lego",
      "Volvo"
    ]
  },
  {
    "category": "logos_brands",
    "text": "Which airline has a stylized kangaroo on its tail fin?",
    "correct": "Qantas",
    "distractors": [
      "Air New Zealand",
      "Emirates",
      "Singapore Airlines"
    ]
  },
  {
    "category": "logos_brands",
    "text": "Which company owns the Android mobile operating system?",
    "correct": "Google",
    "distractors": [
      "Microsoft",
      "Oracle",
      "Meta"
    ]
  },
  {
    "category": "logos_brands",
    "text": "Which brand is famous for the 'Impossible Is Nothing' slogan?",
    "correct": "Adidas",
    "distractors": [
      "Nike",
      "Reebok",
      "New Balance"
    ]
  },
  {
    "category": "logos_brands",
    "text": "Which ride-hailing company was founded by Travis Kalanick and Garrett Camp?",
    "correct": "Uber",
    "distractors": [
      "Lyft",
      "Bolt",
      "Grab"
    ]
  },
  {
    "category": "logos_brands",
    "text": "Which camera and film company pioneered the Instamatic and color film?",
    "correct": "Kodak",
    "distractors": [
      "Fujifilm",
      "Canon",
      "Nikon"
    ]
  },
  {
    "category": "logos_brands",
    "text": "Which chocolate brand is known for triangular prisms inspired by the Matterhorn?",
    "correct": "Toblerone",
    "distractors": [
      "Milka",
      "Lindt",
      "Cadbury"
    ]
  },
  {
    "category": "logos_brands",
    "text": "Which soft drink was originally invented by pharmacist John Pemberton?",
    "correct": "Coca-Cola",
    "distractors": [
      "Pepsi",
      "Dr Pepper",
      "Sprite"
    ]
  },
  {
    "category": "logos_brands",
    "text": "Which toy brand's name comes from Danish words meaning 'play well'?",
    "correct": "LEGO",
    "distractors": [
      "Hasbro",
      "Mattel",
      "Playmobil"
    ]
  },
  {
    "category": "logos_brands",
    "text": "Which financial network features overlapping red and yellow circles?",
    "correct": "Mastercard",
    "distractors": [
      "Visa",
      "American Express",
      "Discover"
    ]
  },
  {
    "category": "logos_brands",
    "text": "Which automaker uses a three-pointed star enclosed in a circle?",
    "correct": "Mercedes-Benz",
    "distractors": [
      "BMW",
      "Audi",
      "Subaru"
    ]
  },
  {
    "category": "logos_brands",
    "text": "Which gaming console brand uses Triangle, Circle, Cross, and Square symbols?",
    "correct": "PlayStation",
    "distractors": [
      "Xbox",
      "Nintendo",
      "Sega"
    ]
  },
  {
    "category": "logos_brands",
    "text": "Which brand of motorcycles is nicknamed 'The Motor Company' from Milwaukee?",
    "correct": "Harley-Davidson",
    "distractors": [
      "Ducati",
      "Yamaha",
      "Triumph"
    ]
  },
  {
    "category": "logos_brands",
    "text": "Which luxury fashion house has the interlocking double-G monogram?",
    "correct": "Gucci",
    "distractors": [
      "Louis Vuitton",
      "Prada",
      "Chanel"
    ]
  },
  {
    "category": "logos_brands",
    "text": "Which microblogging platform has a white ghost on a yellow background?",
    "correct": "Snapchat",
    "distractors": [
      "Instagram",
      "Discord",
      "Reddit"
    ]
  },
  {
    "category": "logos_brands",
    "text": "Which music streaming company was founded in Stockholm, Sweden in 2006?",
    "correct": "Spotify",
    "distractors": [
      "Deezer",
      "Tidal",
      "Pandora"
    ]
  },
  {
    "category": "animals",
    "text": "What is the fastest land animal on Earth?",
    "correct": "Cheetah",
    "distractors": [
      "Lion",
      "Pronghorn",
      "Gazelle"
    ]
  },
  {
    "category": "animals",
    "text": "What is the largest living mammal?",
    "correct": "Blue Whale",
    "distractors": [
      "African Elephant",
      "Giraffe",
      "Orca"
    ]
  },
  {
    "category": "animals",
    "text": "Which bird is capable of flying backwards?",
    "correct": "Hummingbird",
    "distractors": [
      "Kingfisher",
      "Swallow",
      "Falcon"
    ]
  },
  {
    "category": "animals",
    "text": "How many hearts does an octopus have?",
    "correct": "3",
    "distractors": [
      "1",
      "2",
      "4"
    ]
  },
  {
    "category": "animals",
    "text": "How many legs does a spider have?",
    "correct": "8",
    "distractors": [
      "6",
      "10",
      "12"
    ]
  },
  {
    "category": "animals",
    "text": "What is a group of lions called?",
    "correct": "Pride",
    "distractors": [
      "Pack",
      "Flock",
      "Herd"
    ]
  },
  {
    "category": "animals",
    "text": "Which animal is known as the 'Ship of the Desert'?",
    "correct": "Camel",
    "distractors": [
      "Dromedary",
      "Llama",
      "Horse"
    ]
  },
  {
    "category": "animals",
    "text": "What type of animal is a Komodo dragon?",
    "correct": "Lizard",
    "distractors": [
      "Snake",
      "Crocodile",
      "Amphibian"
    ]
  },
  {
    "category": "animals",
    "text": "Which animal spends roughly 80% of its day eating bamboo?",
    "correct": "Giant Panda",
    "distractors": [
      "Red Panda",
      "Koala",
      "Sloth"
    ]
  },
  {
    "category": "animals",
    "text": "What is the only mammal capable of sustained flight?",
    "correct": "Bat",
    "distractors": [
      "Flying Squirrel",
      "Sugar Glider",
      "Colugo"
    ]
  },
  {
    "category": "animals",
    "text": "What color is the skin of a polar bear underneath its white fur?",
    "correct": "Black",
    "distractors": [
      "Pink",
      "White",
      "Grey"
    ]
  },
  {
    "category": "animals",
    "text": "Which marine animal has the thickest fur of any mammal?",
    "correct": "Sea Otter",
    "distractors": [
      "Polar Bear",
      "Seal",
      "Walrus"
    ]
  },
  {
    "category": "animals",
    "text": "What is a group of flamingos called?",
    "correct": "Flamboyance",
    "distractors": [
      "Colony",
      "Congregation",
      "Symphony"
    ]
  },
  {
    "category": "animals",
    "text": "Which flightless bird is native to New Zealand and lays huge eggs?",
    "correct": "Kiwi",
    "distractors": [
      "Emu",
      "Ostrich",
      "Cassowary"
    ]
  },
  {
    "category": "animals",
    "text": "How many compartments are in a cow's stomach?",
    "correct": "4",
    "distractors": [
      "2",
      "3",
      "5"
    ]
  },
  {
    "category": "animals",
    "text": "Which animal has fingerprints virtually indistinguishable from human prints?",
    "correct": "Koala",
    "distractors": [
      "Chimpanzee",
      "Raccoon",
      "Gorilla"
    ]
  },
  {
    "category": "animals",
    "text": "What is the primary diet of the blue whale?",
    "correct": "Krill",
    "distractors": [
      "Squid",
      "Salmon",
      "Plankton"
    ]
  },
  {
    "category": "animals",
    "text": "What is the tallest living terrestrial animal?",
    "correct": "Giraffe",
    "distractors": [
      "Elephant",
      "Ostrich",
      "Moose"
    ]
  },
  {
    "category": "animals",
    "text": "Which snake is the longest venomous snake in the world?",
    "correct": "King Cobra",
    "distractors": [
      "Black Mamba",
      "Rattlesnake",
      "Taipan"
    ]
  },
  {
    "category": "animals",
    "text": "What creature has the most powerful bite force relative to its size?",
    "correct": "Saltwater Crocodile",
    "distractors": [
      "Great White Shark",
      "Hyena",
      "Jaguar"
    ]
  },
  {
    "category": "animals",
    "text": "Which mammal is known for sleeping while holding hands so they don't drift apart?",
    "correct": "Sea Otter",
    "distractors": [
      "Beaver",
      "Dolphin",
      "Manatee"
    ]
  },
  {
    "category": "animals",
    "text": "What do bees collect from flowers to make honey?",
    "correct": "Nectar",
    "distractors": [
      "Pollen",
      "Sap",
      "Resin"
    ]
  },
  {
    "category": "animals",
    "text": "Which bird has eyes that are larger than its brain?",
    "correct": "Ostrich",
    "distractors": [
      "Owl",
      "Eagle",
      "Penguin"
    ]
  },
  {
    "category": "animals",
    "text": "What is the largest living species of tortoise?",
    "correct": "Gal\u00e1pagos Tortoise",
    "distractors": [
      "Aldabra Giant Tortoise",
      "Sulcata",
      "Leopard Tortoise"
    ]
  },
  {
    "category": "animals",
    "text": "Which animal produces cube-shaped feces?",
    "correct": "Wombat",
    "distractors": [
      "Koala",
      "Tasmanian Devil",
      "Badger"
    ]
  },
  {
    "category": "animals",
    "text": "How do sea otters keep their fur waterproof?",
    "correct": "Natural grooming oils",
    "distractors": [
      "Blubber layer",
      "Scales",
      "Salt secretion"
    ]
  },
  {
    "category": "history",
    "text": "In which year did the Titanic sink?",
    "correct": "1912",
    "distractors": [
      "1905",
      "1918",
      "1923"
    ]
  },
  {
    "category": "history",
    "text": "Who was the first President of the United States?",
    "correct": "George Washington",
    "distractors": [
      "Thomas Jefferson",
      "John Adams",
      "Benjamin Franklin"
    ]
  },
  {
    "category": "history",
    "text": "In which year did World War II end?",
    "correct": "1945",
    "distractors": [
      "1944",
      "1946",
      "1939"
    ]
  },
  {
    "category": "history",
    "text": "Who was the first emperor of the Roman Empire?",
    "correct": "Augustus",
    "distractors": [
      "Julius Caesar",
      "Nero",
      "Tiberius"
    ]
  },
  {
    "category": "history",
    "text": "In which year did the Berlin Wall fall?",
    "correct": "1989",
    "distractors": [
      "1991",
      "1987",
      "1985"
    ]
  },
  {
    "category": "history",
    "text": "Which ancient wonder was located in Alexandria, Egypt?",
    "correct": "Lighthouse of Alexandria",
    "distractors": [
      "Hanging Gardens",
      "Colossus",
      "Temple of Artemis"
    ]
  },
  {
    "category": "history",
    "text": "Who painted the ceiling of the Sistine Chapel?",
    "correct": "Michelangelo",
    "distractors": [
      "Leonardo da Vinci",
      "Raphael",
      "Donatello"
    ]
  },
  {
    "category": "history",
    "text": "In which year did Christopher Columbus first reach the Americas?",
    "correct": "1492",
    "distractors": [
      "1488",
      "1501",
      "1476"
    ]
  },
  {
    "category": "history",
    "text": "Who was the first human to travel into space?",
    "correct": "Yuri Gagarin",
    "distractors": [
      "Neil Armstrong",
      "Buzz Aldrin",
      "John Glenn"
    ]
  },
  {
    "category": "history",
    "text": "Which French queen was famously associated with the phrase 'Let them eat cake'?",
    "correct": "Marie Antoinette",
    "distractors": [
      "Catherine de' Medici",
      "Eleanor of Aquitaine",
      "Joan of Arc"
    ]
  },
  {
    "category": "history",
    "text": "In what year did the Apollo 11 moon landing take place?",
    "correct": "1969",
    "distractors": [
      "1968",
      "1970",
      "1971"
    ]
  },
  {
    "category": "history",
    "text": "Which civilization built Machu Picchu in modern-day Peru?",
    "correct": "Inca",
    "distractors": [
      "Maya",
      "Aztec",
      "Olmec"
    ]
  },
  {
    "category": "history",
    "text": "Who was the leader of the Soviet Union during World War II?",
    "correct": "Joseph Stalin",
    "distractors": [
      "Vladimir Lenin",
      "Nikita Khrushchev",
      "Leon Trotsky"
    ]
  },
  {
    "category": "history",
    "text": "What treaty signed in 1919 formally ended World War I?",
    "correct": "Treaty of Versailles",
    "distractors": [
      "Treaty of Paris",
      "Treaty of Ghent",
      "Treaty of Utrecht"
    ]
  },
  {
    "category": "history",
    "text": "Who was the famous prime minister of Britain during most of World War II?",
    "correct": "Winston Churchill",
    "distractors": [
      "Neville Chamberlain",
      "Clement Attlee",
      "Anthony Eden"
    ]
  },
  {
    "category": "history",
    "text": "Which empire was ruled by Genghis Khan?",
    "correct": "Mongol Empire",
    "distractors": [
      "Ottoman Empire",
      "Persian Empire",
      "Mughal Empire"
    ]
  },
  {
    "category": "history",
    "text": "In what year did the United States sign the Declaration of Independence?",
    "correct": "1776",
    "distractors": [
      "1789",
      "1775",
      "1783"
    ]
  },
  {
    "category": "history",
    "text": "Who was the longest-reigning British monarch before Queen Elizabeth II?",
    "correct": "Queen Victoria",
    "distractors": [
      "King George III",
      "King Henry VIII",
      "Queen Elizabeth I"
    ]
  },
  {
    "category": "history",
    "text": "Which city was destroyed by the eruption of Mount Vesuvius in 79 AD?",
    "correct": "Pompeii",
    "distractors": [
      "Rome",
      "Naples",
      "Carthage"
    ]
  },
  {
    "category": "history",
    "text": "Who led the Salt March in 1930 as a non-violent protest against British colonial rule?",
    "correct": "Mahatma Gandhi",
    "distractors": [
      "Jawaharlal Nehru",
      "Subhas Chandra Bose",
      "Sardar Patel"
    ]
  },
  {
    "category": "history",
    "text": "The Magna Carta was signed in which century?",
    "correct": "13th century (1215)",
    "distractors": [
      "11th century",
      "15th century",
      "14th century"
    ]
  },
  {
    "category": "history",
    "text": "Which dynasty built the majority of the existing Great Wall of China?",
    "correct": "Ming Dynasty",
    "distractors": [
      "Han Dynasty",
      "Qin Dynasty",
      "Tang Dynasty"
    ]
  },
  {
    "category": "history",
    "text": "Who was South Africa's first democratically elected black president?",
    "correct": "Nelson Mandela",
    "distractors": [
      "Desmond Tutu",
      "Thabo Mbeki",
      "Oliver Tambo"
    ]
  },
  {
    "category": "history",
    "text": "What was the primary trade route connecting the East and West called?",
    "correct": "The Silk Road",
    "distractors": [
      "The Spice Route",
      "The Royal Road",
      "The Amber Road"
    ]
  },
  {
    "category": "history",
    "text": "In what year did the Chernobyl nuclear disaster occur?",
    "correct": "1986",
    "distractors": [
      "1984",
      "1988",
      "1991"
    ]
  },
  {
    "category": "history",
    "text": "Who was the first woman to win a Nobel Prize?",
    "correct": "Marie Curie",
    "distractors": [
      "Rosalind Franklin",
      "Ada Lovelace",
      "Mother Teresa"
    ]
  },
  {
    "category": "geography",
    "text": "What is the longest river in the world?",
    "correct": "Nile",
    "distractors": [
      "Amazon",
      "Yangtze",
      "Mississippi"
    ]
  },
  {
    "category": "geography",
    "text": "What is the tallest mountain in the world above sea level?",
    "correct": "Mount Everest",
    "distractors": [
      "K2",
      "Kangchenjunga",
      "Makalu"
    ]
  },
  {
    "category": "geography",
    "text": "Which ocean is the largest by surface area?",
    "correct": "Pacific Ocean",
    "distractors": [
      "Atlantic Ocean",
      "Indian Ocean",
      "Arctic Ocean"
    ]
  },
  {
    "category": "geography",
    "text": "What is the largest hot desert in the world?",
    "correct": "Sahara",
    "distractors": [
      "Arabian",
      "Gobi",
      "Kalahari"
    ]
  },
  {
    "category": "geography",
    "text": "Which continent has the most countries?",
    "correct": "Africa",
    "distractors": [
      "Asia",
      "Europe",
      "South America"
    ]
  },
  {
    "category": "geography",
    "text": "What is the smallest independent state in the world by area?",
    "correct": "Vatican City",
    "distractors": [
      "Monaco",
      "Nauru",
      "San Marino"
    ]
  },
  {
    "category": "geography",
    "text": "Which country has the longest coastline in the world?",
    "correct": "Canada",
    "distractors": [
      "Norway",
      "Russia",
      "Indonesia"
    ]
  },
  {
    "category": "geography",
    "text": "In which mountain range is Mount Everest located?",
    "correct": "Himalayas",
    "distractors": [
      "Andes",
      "Alps",
      "Rockies"
    ]
  },
  {
    "category": "geography",
    "text": "What is the deepest known oceanic trench?",
    "correct": "Mariana Trench",
    "distractors": [
      "Tonga Trench",
      "Puerto Rico Trench",
      "Java Trench"
    ]
  },
  {
    "category": "geography",
    "text": "Which sea has the highest salinity of any natural water body?",
    "correct": "Dead Sea",
    "distractors": [
      "Red Sea",
      "Mediterranean Sea",
      "Baltic Sea"
    ]
  },
  {
    "category": "geography",
    "text": "Which river flows through Paris, France?",
    "correct": "Seine",
    "distractors": [
      "Thames",
      "Danube",
      "Rhine"
    ]
  },
  {
    "category": "geography",
    "text": "What is the capital city of Iceland?",
    "correct": "Reykjav\u00edk",
    "distractors": [
      "Akureyri",
      "Keflav\u00edk",
      "Hafnarfj\u00f6r\u00f0ur"
    ]
  },
  {
    "category": "geography",
    "text": "Which is the only continent covered entirely by an ice sheet?",
    "correct": "Antarctica",
    "distractors": [
      "Arctic",
      "Greenland",
      "Australasia"
    ]
  },
  {
    "category": "geography",
    "text": "Which country contains the most natural lakes in the world?",
    "correct": "Canada",
    "distractors": [
      "Russia",
      "United States",
      "Sweden"
    ]
  },
  {
    "category": "geography",
    "text": "What strait separates Europe and Africa?",
    "correct": "Strait of Gibraltar",
    "distractors": [
      "Bosphorus Strait",
      "Strait of Malacca",
      "Bering Strait"
    ]
  },
  {
    "category": "geography",
    "text": "Which desert covers parts of northern China and southern Mongolia?",
    "correct": "Gobi Desert",
    "distractors": [
      "Taklamakan Desert",
      "Karakum",
      "Thar Desert"
    ]
  },
  {
    "category": "geography",
    "text": "What is the largest island in the world that is not a continent?",
    "correct": "Greenland",
    "distractors": [
      "New Guinea",
      "Borneo",
      "Madagascar"
    ]
  },
  {
    "category": "geography",
    "text": "Which European city is famous for its 150+ canals and gondolas?",
    "correct": "Venice",
    "distractors": [
      "Amsterdam",
      "Bruges",
      "St. Petersburg"
    ]
  },
  {
    "category": "geography",
    "text": "What body of water lies between Australia and New Zealand?",
    "correct": "Tasman Sea",
    "distractors": [
      "Coral Sea",
      "Timor Sea",
      "Arafura Sea"
    ]
  },
  {
    "category": "geography",
    "text": "Which lake is the world's largest freshwater lake by surface area?",
    "correct": "Lake Superior",
    "distractors": [
      "Lake Victoria",
      "Lake Baikal",
      "Lake Huron"
    ]
  },
  {
    "category": "geography",
    "text": "Which lake is the deepest and oldest freshwater lake in the world?",
    "correct": "Lake Baikal",
    "distractors": [
      "Lake Tanganyika",
      "Lake Superior",
      "Lake Michigan"
    ]
  },
  {
    "category": "geography",
    "text": "In which country is the famous Taj Mahal located?",
    "correct": "India",
    "distractors": [
      "Pakistan",
      "Bangladesh",
      "Nepal"
    ]
  },
  {
    "category": "geography",
    "text": "Which country shares the longest international land border with the US?",
    "correct": "Canada",
    "distractors": [
      "Mexico",
      "Russia",
      "Cuba"
    ]
  },
  {
    "category": "geography",
    "text": "What is the capital of Argentina?",
    "correct": "Buenos Aires",
    "distractors": [
      "Rosario",
      "C\u00f3rdoba",
      "Mendoza"
    ]
  },
  {
    "category": "geography",
    "text": "Which African waterfall is known as 'The Smoke That Thunders'?",
    "correct": "Victoria Falls",
    "distractors": [
      "Niagara Falls",
      "Angel Falls",
      "Iguazu Falls"
    ]
  },
  {
    "category": "geography",
    "text": "What is the world's highest uninterrupted waterfall?",
    "correct": "Angel Falls",
    "distractors": [
      "Niagara Falls",
      "Victoria Falls",
      "Tugela Falls"
    ]
  },
  {
    "category": "science",
    "text": "What is the chemical symbol for gold?",
    "correct": "Au",
    "distractors": [
      "Ag",
      "Fe",
      "Cu"
    ]
  },
  {
    "category": "science",
    "text": "What planet is known as the Red Planet?",
    "correct": "Mars",
    "distractors": [
      "Venus",
      "Jupiter",
      "Saturn"
    ]
  },
  {
    "category": "science",
    "text": "What is the hardest known natural mineral?",
    "correct": "Diamond",
    "distractors": [
      "Corundum",
      "Topaz",
      "Quartz"
    ]
  },
  {
    "category": "science",
    "text": "What gas do plants absorb from the atmosphere for photosynthesis?",
    "correct": "Carbon dioxide",
    "distractors": [
      "Oxygen",
      "Nitrogen",
      "Hydrogen"
    ]
  },
  {
    "category": "science",
    "text": "What is the closest star to planet Earth?",
    "correct": "The Sun",
    "distractors": [
      "Proxima Centauri",
      "Sirius",
      "Alpha Centauri A"
    ]
  },
  {
    "category": "science",
    "text": "What is the powerhouse of the cell?",
    "correct": "Mitochondria",
    "distractors": [
      "Nucleus",
      "Ribosome",
      "Endoplasmic reticulum"
    ]
  },
  {
    "category": "science",
    "text": "What is the speed of light in vacuum approximately?",
    "correct": "300,000 km/s",
    "distractors": [
      "150,000 km/s",
      "500,000 km/s",
      "1,000,000 km/s"
    ]
  },
  {
    "category": "science",
    "text": "What element has the atomic number 1?",
    "correct": "Hydrogen",
    "distractors": [
      "Helium",
      "Oxygen",
      "Carbon"
    ]
  },
  {
    "category": "science",
    "text": "What force pulls objects toward the center of the Earth?",
    "correct": "Gravity",
    "distractors": [
      "Magnetism",
      "Centrifugal force",
      "Inertia"
    ]
  },
  {
    "category": "science",
    "text": "Which planet has the most prominent ring system?",
    "correct": "Saturn",
    "distractors": [
      "Jupiter",
      "Uranus",
      "Neptune"
    ]
  },
  {
    "category": "science",
    "text": "What is the normal human body temperature in Celsius?",
    "correct": "37\u00b0C",
    "distractors": [
      "35\u00b0C",
      "39\u00b0C",
      "40\u00b0C"
    ]
  },
  {
    "category": "science",
    "text": "Which blood cells are primarily responsible for fighting infections?",
    "correct": "White blood cells",
    "distractors": [
      "Red blood cells",
      "Platelets",
      "Plasma"
    ]
  },
  {
    "category": "science",
    "text": "What type of galaxy is our Milky Way?",
    "correct": "Spiral",
    "distractors": [
      "Elliptical",
      "Irregular",
      "Lenticular"
    ]
  },
  {
    "category": "science",
    "text": "What is the most abundant gas in the Earth's atmosphere?",
    "correct": "Nitrogen (78%)",
    "distractors": [
      "Oxygen (21%)",
      "Argon (0.9%)",
      "Carbon dioxide (0.04%)"
    ]
  },
  {
    "category": "science",
    "text": "Who proposed the general theory of relativity?",
    "correct": "Albert Einstein",
    "distractors": [
      "Isaac Newton",
      "Niels Bohr",
      "Galileo Galilei"
    ]
  },
  {
    "category": "science",
    "text": "What is the chemical formula for ordinary table salt?",
    "correct": "NaCl",
    "distractors": [
      "KCl",
      "NaOH",
      "HCl"
    ]
  },
  {
    "category": "science",
    "text": "What subatomic particle carries a negative electrical charge?",
    "correct": "Electron",
    "distractors": [
      "Proton",
      "Neutron",
      "Positron"
    ]
  },
  {
    "category": "science",
    "text": "What is the boiling point of pure water at standard sea-level pressure?",
    "correct": "100\u00b0C (212\u00b0F)",
    "distractors": [
      "90\u00b0C (194\u00b0F)",
      "110\u00b0C (230\u00b0F)",
      "120\u00b0C (248\u00b0F)"
    ]
  },
  {
    "category": "science",
    "text": "Which planet in our solar system has the shortest day (fastest rotation)?",
    "correct": "Jupiter (approx 10h)",
    "distractors": [
      "Mars",
      "Earth",
      "Saturn"
    ]
  },
  {
    "category": "science",
    "text": "What is the study of fossils called?",
    "correct": "Paleontology",
    "distractors": [
      "Archaeology",
      "Anthropology",
      "Geology"
    ]
  },
  {
    "category": "science",
    "text": "What state of matter has neither fixed shape nor fixed volume?",
    "correct": "Gas",
    "distractors": [
      "Liquid",
      "Solid",
      "Crystal"
    ]
  },
  {
    "category": "science",
    "text": "What type of bond is formed when electrons are shared between atoms?",
    "correct": "Covalent bond",
    "distractors": [
      "Ionic bond",
      "Hydrogen bond",
      "Metallic bond"
    ]
  },
  {
    "category": "science",
    "text": "Which vitamin is produced in human skin upon exposure to sunlight?",
    "correct": "Vitamin D",
    "distractors": [
      "Vitamin C",
      "Vitamin A",
      "Vitamin B12"
    ]
  },
  {
    "category": "science",
    "text": "What is the universal blood donor type?",
    "correct": "O-negative",
    "distractors": [
      "O-positive",
      "AB-positive",
      "A-negative"
    ]
  },
  {
    "category": "science",
    "text": "Which particle in an atom has no electrical charge?",
    "correct": "Neutron",
    "distractors": [
      "Proton",
      "Electron",
      "Quark"
    ]
  },
  {
    "category": "science",
    "text": "What is the primary constituent of natural gas?",
    "correct": "Methane",
    "distractors": [
      "Ethane",
      "Propane",
      "Butane"
    ]
  },
  {
    "category": "math_formulas",
    "text": "What is the formula for the area of a circle?",
    "correct": "\u03c0r\u00b2",
    "distractors": [
      "2\u03c0r",
      "\u03c0d",
      "\u00bd\u03c0r\u00b2"
    ]
  },
  {
    "category": "math_formulas",
    "text": "What is the Pythagorean theorem formula?",
    "correct": "a\u00b2 + b\u00b2 = c\u00b2",
    "distractors": [
      "a + b = c",
      "a\u00b2 - b\u00b2 = c\u00b2",
      "ab = c\u00b2"
    ]
  },
  {
    "category": "math_formulas",
    "text": "What is Einstein's famous mass-energy equivalence formula?",
    "correct": "E = mc\u00b2",
    "distractors": [
      "E = \u00bdmv\u00b2",
      "F = ma",
      "P = IV"
    ]
  },
  {
    "category": "math_formulas",
    "text": "What is Newton's second law of motion?",
    "correct": "F = ma",
    "distractors": [
      "F = mv",
      "F = m/a",
      "F = \u00bdma\u00b2"
    ]
  },
  {
    "category": "math_formulas",
    "text": "What is the formula for the circumference of a circle?",
    "correct": "2\u03c0r",
    "distractors": [
      "\u03c0r\u00b2",
      "4\u03c0r\u00b2",
      "\u00bdbh"
    ]
  },
  {
    "category": "math_formulas",
    "text": "What is the formula for the area of a triangle?",
    "correct": "\u00bd \u00d7 base \u00d7 height",
    "distractors": [
      "base \u00d7 height",
      "2 \u00d7 base \u00d7 height",
      "base + height"
    ]
  },
  {
    "category": "math_formulas",
    "text": "What is Ohm's law formula connecting Voltage (V), Current (I), and Resistance (R)?",
    "correct": "V = IR",
    "distractors": [
      "V = I/R",
      "V = I\u00b2R",
      "V = R/I"
    ]
  },
  {
    "category": "math_formulas",
    "text": "What is the volume of a sphere formula?",
    "correct": "\u2074\u2044\u2083\u03c0r\u00b3",
    "distractors": [
      "4\u03c0r\u00b2",
      "\u03c0r\u00b2h",
      "2\u03c0r\u00b3"
    ]
  },
  {
    "category": "math_formulas",
    "text": "What is the slope-intercept form equation of a straight line?",
    "correct": "y = mx + b",
    "distractors": [
      "ax + by = c",
      "y - y\u2081 = m(x - x\u2081)",
      "xy = k"
    ]
  },
  {
    "category": "math_formulas",
    "text": "What is the formula for kinetic energy?",
    "correct": "\u00bdmv\u00b2",
    "distractors": [
      "mgh",
      "mv",
      "ma"
    ]
  },
  {
    "category": "math_formulas",
    "text": "What is the formula for gravitational potential energy?",
    "correct": "mgh",
    "distractors": [
      "\u00bdmv\u00b2",
      "F \u00d7 d",
      "\u00bdkx\u00b2"
    ]
  },
  {
    "category": "math_formulas",
    "text": "What is the formula for the volume of a cylinder?",
    "correct": "\u03c0r\u00b2h",
    "distractors": [
      "2\u03c0rh",
      "\u2074\u2044\u2083\u03c0r\u00b3",
      "\u2153\u03c0r\u00b2h"
    ]
  },
  {
    "category": "math_formulas",
    "text": "What is the quadratic formula solution for ax\u00b2 + bx + c = 0?",
    "correct": "(-b \u00b1 \u221a(b\u00b2 - 4ac)) / 2a",
    "distractors": [
      "(-b \u00b1 \u221a(b\u00b2 + 4ac)) / 2a",
      "(b \u00b1 \u221a(b\u00b2 - 4ac)) / a",
      "(-b \u00b1 4ac) / 2a"
    ]
  },
  {
    "category": "math_formulas",
    "text": "What is the formula for calculating speed or velocity?",
    "correct": "distance / time",
    "distractors": [
      "distance \u00d7 time",
      "acceleration \u00d7 time",
      "force / mass"
    ]
  },
  {
    "category": "math_formulas",
    "text": "What is the formula for density (\u03c1)?",
    "correct": "mass / volume",
    "distractors": [
      "volume / mass",
      "mass \u00d7 volume",
      "weight \u00d7 gravity"
    ]
  },
  {
    "category": "math_formulas",
    "text": "What is the formula for work done by a constant force?",
    "correct": "Force \u00d7 Distance",
    "distractors": [
      "Force / Distance",
      "Mass \u00d7 Acceleration",
      "Power \u00d7 Velocity"
    ]
  },
  {
    "category": "math_formulas",
    "text": "What is the formula for electrical power (P)?",
    "correct": "P = IV",
    "distractors": [
      "P = I/V",
      "P = V/R",
      "P = I\u00b2 / R"
    ]
  },
  {
    "category": "math_formulas",
    "text": "What is the sum of interior angles in an n-sided polygon?",
    "correct": "(n - 2) \u00d7 180\u00b0",
    "distractors": [
      "n \u00d7 180\u00b0",
      "(n - 1) \u00d7 180\u00b0",
      "360\u00b0 / n"
    ]
  },
  {
    "category": "math_formulas",
    "text": "What is Euler's identity connecting 5 fundamental mathematical constants?",
    "correct": "e^(i\u03c0) + 1 = 0",
    "distractors": [
      "e^(i\u03c0) - 1 = 0",
      "e^\u03c0 + i = 0",
      "e^(2\u03c0i) = -1"
    ]
  },
  {
    "category": "math_formulas",
    "text": "What is the formula for the perimeter of a rectangle?",
    "correct": "2(l + w)",
    "distractors": [
      "l \u00d7 w",
      "2l \u00d7 2w",
      "l\u00b2 + w\u00b2"
    ]
  },
  {
    "category": "math_formulas",
    "text": "What is the derivative of x\u00b2 with respect to x?",
    "correct": "2x",
    "distractors": [
      "x",
      "2",
      "x\u00b3 / 3"
    ]
  },
  {
    "category": "math_formulas",
    "text": "What is sin\u00b2(\u03b8) + cos\u00b2(\u03b8) equal to?",
    "correct": "1",
    "distractors": [
      "0",
      "2",
      "-1"
    ]
  },
  {
    "category": "math_formulas",
    "text": "What is the formula for pressure (P)?",
    "correct": "Force / Area",
    "distractors": [
      "Force \u00d7 Area",
      "Mass / Volume",
      "Weight \u00d7 Area"
    ]
  },
  {
    "category": "math_formulas",
    "text": "What is the formula for momentum (p)?",
    "correct": "p = mv",
    "distractors": [
      "p = ma",
      "p = \u00bdmv\u00b2",
      "p = m/v"
    ]
  },
  {
    "category": "math_formulas",
    "text": "What is the volume of a cone formula?",
    "correct": "\u2153\u03c0r\u00b2h",
    "distractors": [
      "\u03c0r\u00b2h",
      "\u2074\u2044\u2083\u03c0r\u00b3",
      "\u00bd\u03c0r\u00b2h"
    ]
  },
  {
    "category": "math_formulas",
    "text": "What is the formula for compound interest A = P(...) ?",
    "correct": "P(1 + r/n)^(nt)",
    "distractors": [
      "P(1 + rt)",
      "P \u00d7 r \u00d7 t",
      "P(1 - r)^t"
    ]
  },
  {
    "category": "numbers_logic",
    "text": "What is the next prime number after 7?",
    "correct": "11",
    "distractors": [
      "9",
      "13",
      "10"
    ]
  },
  {
    "category": "numbers_logic",
    "text": "What is 2 raised to the 10th power (2^10)?",
    "correct": "1024",
    "distractors": [
      "512",
      "2048",
      "768"
    ]
  },
  {
    "category": "numbers_logic",
    "text": "How many degrees are in a full circle?",
    "correct": "360\u00b0",
    "distractors": [
      "180\u00b0",
      "270\u00b0",
      "90\u00b0"
    ]
  },
  {
    "category": "numbers_logic",
    "text": "What is the Roman numeral for 50?",
    "correct": "L",
    "distractors": [
      "C",
      "V",
      "X"
    ]
  },
  {
    "category": "numbers_logic",
    "text": "What is the Roman numeral for 100?",
    "correct": "C",
    "distractors": [
      "M",
      "D",
      "L"
    ]
  },
  {
    "category": "numbers_logic",
    "text": "What is the Roman numeral for 1000?",
    "correct": "M",
    "distractors": [
      "D",
      "C",
      "K"
    ]
  },
  {
    "category": "numbers_logic",
    "text": "What is 15% of 200?",
    "correct": "30",
    "distractors": [
      "25",
      "35",
      "40"
    ]
  },
  {
    "category": "numbers_logic",
    "text": "What is the square root of 144?",
    "correct": "12",
    "distractors": [
      "14",
      "11",
      "16"
    ]
  },
  {
    "category": "numbers_logic",
    "text": "What is the square root of 81?",
    "correct": "9",
    "distractors": [
      "8",
      "7",
      "11"
    ]
  },
  {
    "category": "numbers_logic",
    "text": "Which of the following is an irrational number?",
    "correct": "\u03c0 (Pi)",
    "distractors": [
      "\u00be",
      "0.25",
      "\u221a16"
    ]
  },
  {
    "category": "numbers_logic",
    "text": "What is 7 factorial (7!)?",
    "correct": "5040",
    "distractors": [
      "720",
      "2520",
      "40320"
    ]
  },
  {
    "category": "numbers_logic",
    "text": "What is 0! (zero factorial)?",
    "correct": "1",
    "distractors": [
      "0",
      "Undefined",
      "-1"
    ]
  },
  {
    "category": "numbers_logic",
    "text": "What is the smallest positive prime number?",
    "correct": "2",
    "distractors": [
      "1",
      "3",
      "0"
    ]
  },
  {
    "category": "numbers_logic",
    "text": "How many sides does a heptagon have?",
    "correct": "7",
    "distractors": [
      "6",
      "8",
      "9"
    ]
  },
  {
    "category": "numbers_logic",
    "text": "How many sides does a dodecagon have?",
    "correct": "12",
    "distractors": [
      "10",
      "14",
      "20"
    ]
  },
  {
    "category": "numbers_logic",
    "text": "In binary notation, what is the decimal number 10 represented as?",
    "correct": "1010",
    "distractors": [
      "1001",
      "1100",
      "1110"
    ]
  },
  {
    "category": "numbers_logic",
    "text": "What is the sum of angles inside any triangle?",
    "correct": "180\u00b0",
    "distractors": [
      "360\u00b0",
      "90\u00b0",
      "270\u00b0"
    ]
  },
  {
    "category": "numbers_logic",
    "text": "If a clock shows 3:15, what is the angle between hour and minute hands?",
    "correct": "7.5\u00b0",
    "distractors": [
      "0\u00b0",
      "15\u00b0",
      "5\u00b0"
    ]
  },
  {
    "category": "numbers_logic",
    "text": "What is the median of the set: [3, 7, 9, 15, 21]?",
    "correct": "9",
    "distractors": [
      "11",
      "7",
      "15"
    ]
  },
  {
    "category": "numbers_logic",
    "text": "What is 8 cubed (8\u00b3)?",
    "correct": "512",
    "distractors": [
      "256",
      "1024",
      "384"
    ]
  },
  {
    "category": "numbers_logic",
    "text": "How many bits are in a single byte?",
    "correct": "8",
    "distractors": [
      "4",
      "16",
      "32"
    ]
  },
  {
    "category": "numbers_logic",
    "text": "What is the next number in the Fibonacci sequence: 1, 1, 2, 3, 5, 8, 13, ...?",
    "correct": "21",
    "distractors": [
      "19",
      "20",
      "24"
    ]
  },
  {
    "category": "numbers_logic",
    "text": "What is 25 \u00d7 25?",
    "correct": "625",
    "distractors": [
      "525",
      "650",
      "575"
    ]
  },
  {
    "category": "numbers_logic",
    "text": "How many seconds are in 2 hours?",
    "correct": "7200",
    "distractors": [
      "3600",
      "5400",
      "8400"
    ]
  },
  {
    "category": "numbers_logic",
    "text": "What is the base of the hexadecimal number system?",
    "correct": "16",
    "distractors": [
      "8",
      "10",
      "2"
    ]
  },
  {
    "category": "numbers_logic",
    "text": "If x + 5 = 12, what is the value of 2x - 3?",
    "correct": "11",
    "distractors": [
      "14",
      "9",
      "12"
    ]
  },
  {
    "category": "religion_culture",
    "text": "What is the holiest city in Islam?",
    "correct": "Mecca",
    "distractors": [
      "Medina",
      "Jerusalem",
      "Cairo"
    ]
  },
  {
    "category": "religion_culture",
    "text": "How many books are in the Protestant Christian Bible?",
    "correct": "66",
    "distractors": [
      "39",
      "73",
      "60"
    ]
  },
  {
    "category": "religion_culture",
    "text": "What is the sacred scripture of Islam?",
    "correct": "Quran",
    "distractors": [
      "Bible",
      "Torah",
      "Vedas"
    ]
  },
  {
    "category": "religion_culture",
    "text": "In Buddhism, what is the fundamental concept of suffering or unsatisfactoriness called?",
    "correct": "Dukkha",
    "distractors": [
      "Karma",
      "Nirvana",
      "Dharma"
    ]
  },
  {
    "category": "religion_culture",
    "text": "What is the oldest major religion still practiced today?",
    "correct": "Hinduism",
    "distractors": [
      "Judaism",
      "Buddhism",
      "Zoroastrianism"
    ]
  },
  {
    "category": "religion_culture",
    "text": "What Jewish holiday is known as the Day of Atonement?",
    "correct": "Yom Kippur",
    "distractors": [
      "Rosh Hashanah",
      "Passover",
      "Hanukkah"
    ]
  },
  {
    "category": "religion_culture",
    "text": "In Hinduism, what is the spiritual cycle of rebirth and reincarnation called?",
    "correct": "Samsara",
    "distractors": [
      "Moksha",
      "Karma",
      "Brahman"
    ]
  },
  {
    "category": "religion_culture",
    "text": "What is the sacred river in India revered by Hindus?",
    "correct": "Ganges",
    "distractors": [
      "Yamuna",
      "Indus",
      "Brahmaputra"
    ]
  },
  {
    "category": "religion_culture",
    "text": "Which festival of lights is widely celebrated in India across Hinduism, Jainism, and Sikhism?",
    "correct": "Diwali",
    "distractors": [
      "Holi",
      "Navaratri",
      "Eid"
    ]
  },
  {
    "category": "religion_culture",
    "text": "What is the sacred text of Judaism containing the first five books of the Hebrew Bible?",
    "correct": "Torah",
    "distractors": [
      "Talmud",
      "Kabbalah",
      "Mishnah"
    ]
  },
  {
    "category": "religion_culture",
    "text": "What is the ninth month of the Islamic calendar observed by Muslims worldwide as a month of fasting?",
    "correct": "Ramadan",
    "distractors": [
      "Muharram",
      "Shawwal",
      "Rajab"
    ]
  },
  {
    "category": "religion_culture",
    "text": "Who is considered the founder of Buddhism?",
    "correct": "Siddhartha Gautama",
    "distractors": [
      "Ashoka",
      "Mahavira",
      "Confucius"
    ]
  },
  {
    "category": "religion_culture",
    "text": "In which country was the ancient philosophy of Confucianism founded?",
    "correct": "China",
    "distractors": [
      "Japan",
      "India",
      "Korea"
    ]
  },
  {
    "category": "religion_culture",
    "text": "What is the traditional Japanese indigenous religion focused on kami spirits?",
    "correct": "Shinto",
    "distractors": [
      "Buddhism",
      "Daoism",
      "Zen"
    ]
  },
  {
    "category": "religion_culture",
    "text": "What holiday marks the end of the month-long dawn-to-sunset fasting of Ramadan?",
    "correct": "Eid al-Fitr",
    "distractors": [
      "Eid al-Adha",
      "Mawlid",
      "Ashura"
    ]
  },
  {
    "category": "religion_culture",
    "text": "What Christian season of 40 days precedes Easter Sunday?",
    "correct": "Lent",
    "distractors": [
      "Advent",
      "Epiphany",
      "Pentecost"
    ]
  },
  {
    "category": "religion_culture",
    "text": "Who led the Israelites out of slavery in Egypt in biblical tradition?",
    "correct": "Moses",
    "distractors": [
      "Abraham",
      "David",
      "Solomon"
    ]
  },
  {
    "category": "religion_culture",
    "text": "In Sikhism, what is the eternal living guru and sacred scripture called?",
    "correct": "Guru Granth Sahib",
    "distractors": [
      "Dasam Granth",
      "Vedas",
      "Upanishads"
    ]
  },
  {
    "category": "religion_culture",
    "text": "What is the sacred city holy to Judaism, Christianity, and Islam?",
    "correct": "Jerusalem",
    "distractors": [
      "Bethlehem",
      "Nazareth",
      "Istanbul"
    ]
  },
  {
    "category": "religion_culture",
    "text": "What is the Hindu festival of colors celebrating spring, love, and new life?",
    "correct": "Holi",
    "distractors": [
      "Diwali",
      "Raksha Bandhan",
      "Pongal"
    ]
  },
  {
    "category": "religion_culture",
    "text": "What is the eight-branched candelabrum lit during Hanukkah called?",
    "correct": "Menorah (or Hanukkiah)",
    "distractors": [
      "Shofar",
      "Kippah",
      "Tallit"
    ]
  },
  {
    "category": "religion_culture",
    "text": "In Daoism, what symbol represents complementary opposing forces?",
    "correct": "Yin and Yang",
    "distractors": [
      "Lotus flower",
      "Om",
      "Dharmachakra"
    ]
  },
  {
    "category": "religion_culture",
    "text": "What is the supreme divine reality in Hindu philosophy called?",
    "correct": "Brahman",
    "distractors": [
      "Atman",
      "Deva",
      "Vishnu"
    ]
  },
  {
    "category": "religion_culture",
    "text": "Which country celebrates the Day of the Dead (D\u00eda de los Muertos)?",
    "correct": "Mexico",
    "distractors": [
      "Spain",
      "Brazil",
      "Argentina"
    ]
  },
  {
    "category": "religion_culture",
    "text": "What is the primary spiritual goal in Buddhism representing liberation from rebirth?",
    "correct": "Nirvana",
    "distractors": [
      "Moksha",
      "Satori",
      "Ascension"
    ]
  },
  {
    "category": "religion_culture",
    "text": "In Christian tradition, on what day is Pentecost celebrated following Easter?",
    "correct": "50th day",
    "distractors": [
      "40th day",
      "30th day",
      "7th day"
    ]
  },
  {
    "category": "mythology",
    "text": "Who is the Greek god of the sea and earthquakes?",
    "correct": "Poseidon",
    "distractors": [
      "Zeus",
      "Hades",
      "Apollo"
    ]
  },
  {
    "category": "mythology",
    "text": "What creature has the body of a lion and head of a human?",
    "correct": "Sphinx",
    "distractors": [
      "Centaur",
      "Minotaur",
      "Griffin"
    ]
  },
  {
    "category": "mythology",
    "text": "Who is the Norse god of thunder who wields the hammer Mj\u00f6lnir?",
    "correct": "Thor",
    "distractors": [
      "Odin",
      "Loki",
      "Freyr"
    ]
  },
  {
    "category": "mythology",
    "text": "Which Greek hero entered the labyrinth and defeated the Minotaur?",
    "correct": "Theseus",
    "distractors": [
      "Hercules",
      "Perseus",
      "Achilles"
    ]
  },
  {
    "category": "mythology",
    "text": "Who is the Egyptian god of the afterlife and the underworld?",
    "correct": "Osiris",
    "distractors": [
      "Ra",
      "Anubis",
      "Horus"
    ]
  },
  {
    "category": "mythology",
    "text": "Who is the king of the Olympian gods in Greek mythology?",
    "correct": "Zeus",
    "distractors": [
      "Poseidon",
      "Ares",
      "Hermes"
    ]
  },
  {
    "category": "mythology",
    "text": "What mythical bird is known for bursting into flames and being reborn from its ashes?",
    "correct": "Phoenix",
    "distractors": [
      "Roc",
      "Thunderbird",
      "Simurgh"
    ]
  },
  {
    "category": "mythology",
    "text": "In Norse mythology, what is the great hall of Odin where slain warriors feast?",
    "correct": "Valhalla",
    "distractors": [
      "Asgard",
      "Midgard",
      "Folkvangr"
    ]
  },
  {
    "category": "mythology",
    "text": "Who is the Greek goddess of wisdom, war, and craft?",
    "correct": "Athena",
    "distractors": [
      "Aphrodite",
      "Hera",
      "Artemis"
    ]
  },
  {
    "category": "mythology",
    "text": "What creature was half human and half horse in Greek mythology?",
    "correct": "Centaur",
    "distractors": [
      "Satyr",
      "Faun",
      "Minotaur"
    ]
  },
  {
    "category": "mythology",
    "text": "Who was condemned to roll a boulder up a hill for eternity in Greek myth?",
    "correct": "Sisyphus",
    "distractors": [
      "Tantalus",
      "Prometheus",
      "Ixion"
    ]
  },
  {
    "category": "mythology",
    "text": "Which Greek hero was invulnerable everywhere except his heel?",
    "correct": "Achilles",
    "distractors": [
      "Hector",
      "Odysseus",
      "Ajax"
    ]
  },
  {
    "category": "mythology",
    "text": "Who was the Roman god of war, equivalent to the Greek Ares?",
    "correct": "Mars",
    "distractors": [
      "Jupiter",
      "Vulcan",
      "Mercury"
    ]
  },
  {
    "category": "mythology",
    "text": "In Egyptian mythology, which jackal-headed god is associated with mummification?",
    "correct": "Anubis",
    "distractors": [
      "Thoth",
      "Sobek",
      "Set"
    ]
  },
  {
    "category": "mythology",
    "text": "What three-headed hound guards the gates of the Greek Underworld?",
    "correct": "Cerberus",
    "distractors": [
      "Chimera",
      "Hydra",
      "Orthrus"
    ]
  },
  {
    "category": "mythology",
    "text": "In Norse mythology, what is the world-spanning ash tree connecting the nine realms?",
    "correct": "Yggdrasil",
    "distractors": [
      "Bifr\u00f6st",
      "Gungnir",
      "M\u00edmir"
    ]
  },
  {
    "category": "mythology",
    "text": "Who opened a forbidden jar and unleashed evils upon the world in Greek myth?",
    "correct": "Pandora",
    "distractors": [
      "Helen",
      "Medea",
      "Cassandra"
    ]
  },
  {
    "category": "mythology",
    "text": "Which Greek titan stole fire from Mount Olympus and gave it to humans?",
    "correct": "Prometheus",
    "distractors": [
      "Atlas",
      "Cronus",
      "Hyperion"
    ]
  },
  {
    "category": "mythology",
    "text": "Who is the Norse trickster god father of Fenrir, J\u00f6rmungandr, and Hel?",
    "correct": "Loki",
    "distractors": [
      "Baldr",
      "Heimdall",
      "Tyr"
    ]
  },
  {
    "category": "mythology",
    "text": "What is the Roman equivalent of the Greek goddess Aphrodite?",
    "correct": "Venus",
    "distractors": [
      "Minerva",
      "Diana",
      "Juno"
    ]
  },
  {
    "category": "mythology",
    "text": "Which monstrous serpent possessed multiple heads that regrew two-fold when severed?",
    "correct": "Lernaean Hydra",
    "distractors": [
      "Gorgon",
      "Nemean Lion",
      "Scylla"
    ]
  },
  {
    "category": "mythology",
    "text": "In Japanese folklore, what is a shapeshifting nine-tailed magical fox called?",
    "correct": "Kitsune",
    "distractors": [
      "Tanuki",
      "Tengu",
      "Kappa"
    ]
  },
  {
    "category": "mythology",
    "text": "Who is the Greek god of music, poetry, art, and the sun?",
    "correct": "Apollo",
    "distractors": [
      "Hermes",
      "Dionysus",
      "Hephaestus"
    ]
  },
  {
    "category": "mythology",
    "text": "What is the rainbow bridge connecting Asgard and Midgard in Norse myth?",
    "correct": "Bifr\u00f6st",
    "distractors": [
      "Yggdrasil",
      "Gjallarbr\u00fa",
      "Valhalla"
    ]
  },
  {
    "category": "mythology",
    "text": "In Greek mythology, what gaze turned onlookers into stone?",
    "correct": "Medusa's gaze",
    "distractors": [
      "Siren's call",
      "Chimera's breath",
      "Sphinx's riddle"
    ]
  },
  {
    "category": "mythology",
    "text": "Who is the Roman messenger god with winged sandals?",
    "correct": "Mercury",
    "distractors": [
      "Apollo",
      "Jupiter",
      "Neptune"
    ]
  },
  {
    "category": "general_knowledge",
    "text": "How many continents are there on Earth?",
    "correct": "7",
    "distractors": [
      "6",
      "5",
      "8"
    ]
  },
  {
    "category": "general_knowledge",
    "text": "What is the primary currency of the European Union?",
    "correct": "Euro",
    "distractors": [
      "Pound Sterling",
      "Swiss Franc",
      "Krone"
    ]
  },
  {
    "category": "general_knowledge",
    "text": "Which language is spoken by the most native speakers worldwide?",
    "correct": "Mandarin Chinese",
    "distractors": [
      "English",
      "Spanish",
      "Hindi"
    ]
  },
  {
    "category": "general_knowledge",
    "text": "What is the international telephone calling code for the United States and Canada?",
    "correct": "+1",
    "distractors": [
      "+44",
      "+33",
      "+81"
    ]
  },
  {
    "category": "general_knowledge",
    "text": "How many days are in a leap year?",
    "correct": "366",
    "distractors": [
      "365",
      "364",
      "368"
    ]
  },
  {
    "category": "general_knowledge",
    "text": "What is the hardest substance in the human body?",
    "correct": "Tooth enamel",
    "distractors": [
      "Femur bone",
      "Keratin fingernail",
      "Skull"
    ]
  },
  {
    "category": "general_knowledge",
    "text": "Which planet is closest to the Sun?",
    "correct": "Mercury",
    "distractors": [
      "Venus",
      "Earth",
      "Mars"
    ]
  },
  {
    "category": "general_knowledge",
    "text": "What is the standard number of players on a soccer (association football) team on the pitch?",
    "correct": "11",
    "distractors": [
      "9",
      "10",
      "12"
    ]
  },
  {
    "category": "general_knowledge",
    "text": "What is the primary ingredient in traditional hummus?",
    "correct": "Chickpeas",
    "distractors": [
      "Lentils",
      "Black beans",
      "Soybeans"
    ]
  },
  {
    "category": "general_knowledge",
    "text": "Which country gifted the Statue of Liberty to the United States in 1886?",
    "correct": "France",
    "distractors": [
      "United Kingdom",
      "Spain",
      "Germany"
    ]
  },
  {
    "category": "general_knowledge",
    "text": "How many keys are on a standard acoustic piano?",
    "correct": "88",
    "distractors": [
      "76",
      "85",
      "92"
    ]
  },
  {
    "category": "general_knowledge",
    "text": "What is the world's most populous island?",
    "correct": "Java (Indonesia)",
    "distractors": [
      "Great Britain",
      "Honshu (Japan)",
      "Madagascar"
    ]
  },
  {
    "category": "general_knowledge",
    "text": "In what game would you castle, en passant, and promote a pawn?",
    "correct": "Chess",
    "distractors": [
      "Checkers",
      "Go",
      "Backgammon"
    ]
  },
  {
    "category": "general_knowledge",
    "text": "What is the rarest human blood type in the general world population?",
    "correct": "AB-negative",
    "distractors": [
      "O-negative",
      "B-negative",
      "A-negative"
    ]
  },
  {
    "category": "general_knowledge",
    "text": "What color flag is traditionally used as a symbol of surrender or truce?",
    "correct": "White",
    "distractors": [
      "Red",
      "Black",
      "Yellow"
    ]
  },
  {
    "category": "general_knowledge",
    "text": "How many teeth does an adult human typically have including wisdom teeth?",
    "correct": "32",
    "distractors": [
      "28",
      "30",
      "36"
    ]
  },
  {
    "category": "general_knowledge",
    "text": "What is the national flower of Japan, celebrated with Hanami viewing festivals?",
    "correct": "Cherry blossom (Sakura)",
    "distractors": [
      "Lotus",
      "Chrysanthemum",
      "Orchid"
    ]
  },
  {
    "category": "general_knowledge",
    "text": "Which instrument is used to measure atmospheric air pressure?",
    "correct": "Barometer",
    "distractors": [
      "Thermometer",
      "Hygrometer",
      "Anemometer"
    ]
  },
  {
    "category": "general_knowledge",
    "text": "What is the capital of Scotland?",
    "correct": "Edinburgh",
    "distractors": [
      "Glasgow",
      "Aberdeen",
      "Dundee"
    ]
  },
  {
    "category": "general_knowledge",
    "text": "How many stripes are on the national flag of the United States?",
    "correct": "13",
    "distractors": [
      "11",
      "15",
      "50"
    ]
  },
  {
    "category": "general_knowledge",
    "text": "What is the color of an emerald gemstone?",
    "correct": "Green",
    "distractors": [
      "Blue",
      "Red",
      "Yellow"
    ]
  },
  {
    "category": "general_knowledge",
    "text": "Which fruit is known for having seeds on the outside of its skin?",
    "correct": "Strawberry",
    "distractors": [
      "Raspberry",
      "Blueberry",
      "Blackberry"
    ]
  },
  {
    "category": "general_knowledge",
    "text": "What is the name of the author who wrote the Sherlock Holmes detective stories?",
    "correct": "Sir Arthur Conan Doyle",
    "distractors": [
      "Agatha Christie",
      "Edgar Allan Poe",
      "G.K. Chesterton"
    ]
  },
  {
    "category": "general_knowledge",
    "text": "Which chess piece can only move diagonally across squares of the same color?",
    "correct": "Bishop",
    "distractors": [
      "Knight",
      "Rook",
      "Queen"
    ]
  },
  {
    "category": "general_knowledge",
    "text": "What is the most widely consumed beverage in the world after water?",
    "correct": "Tea",
    "distractors": [
      "Coffee",
      "Beer",
      "Orange juice"
    ]
  },
  {
    "category": "general_knowledge",
    "text": "Which planet in our solar system rotates clockwise (retrograde rotation)?",
    "correct": "Venus",
    "distractors": [
      "Mars",
      "Jupiter",
      "Neptune"
    ]
  }
];

// Pre-convert once at module load time (300+ authoritative questions across 12 categories)
export const SEED_BANK: Question[] = RAW_SEEDS.map(seedToQuestion);
