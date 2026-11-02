// Auto-generated World History & Turning Points Dataset
// Covers 84 of humanity's most iconic historical events, leaders, discoveries, monuments, and documents.
// Features authentic high-resolution Wikimedia Commons public domain artwork, architecture, and photography.

export type HistoryEra =
  | 'Ancient Civilizations & Wonders'
  | 'Middle Ages & Renaissance'
  | 'Age of Discovery & Revolutions'
  | 'Modern Era & World Wars';

export const HISTORY_ERAS: HistoryEra[] = [
  'Ancient Civilizations & Wonders',
  'Middle Ages & Renaissance',
  'Age of Discovery & Revolutions',
  'Modern Era & World Wars',
];

export interface HistoryQuestionItem {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  category: HistoryEra;
  year?: string;
  fact: string;
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl: string;
}

export const WORLD_HISTORY_QUESTIONS: HistoryQuestionItem[] = [
  {
    id: "hist-01",
    text: "For which Pharaoh was the Great Pyramid of Giza, the oldest of the Seven Ancient Wonders, constructed?",
    options: [
      "Khufu (Cheops)",
      "Ramses II",
      "Tutankhamun",
      "Akhenaten"
],
    correctAnswer: "Khufu (Cheops)",
    category: "Ancient Civilizations & Wonders",
    year: "c. 2560 BC",
    fact: "Standing over 146 meters tall originally, it was the tallest man-made structure in the world for over 3,800 years.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e7/Great_Pyramid_of_Giza_-_Pyramid_of_Khufu.jpg/330px-Great_Pyramid_of_Giza_-_Pyramid_of_Khufu.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-02",
    text: "On the fateful 'Ides of March' in 44 BC, which famous Roman dictator was assassinated in the Theatre of Pompey?",
    options: [
      "Julius Caesar",
      "Mark Antony",
      "Cicero",
      "Caligula"
],
    correctAnswer: "Julius Caesar",
    category: "Ancient Civilizations & Wonders",
    year: "44 BC",
    fact: "Caesar was assassinated by a conspiracy of up to 60 senators led by Marcus Junius Brutus and Gaius Cassius Longinus.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/62/Retrato_de_Julio_C%C3%A9sar_%2826724093101%29_%28cropped%29.jpg/330px-Retrato_de_Julio_C%C3%A9sar_%2826724093101%29_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-03",
    text: "In ancient Rome, which iconic monumental amphitheatre was commissioned by Emperor Vespasian for gladiatorial games?",
    options: [
      "The Colosseum",
      "Circus Maximus",
      "Pantheon",
      "Baths of Caracalla"
],
    correctAnswer: "The Colosseum",
    category: "Ancient Civilizations & Wonders",
    year: "70-80 AD",
    fact: "Also known as the Flavian Amphitheatre, it could hold an estimated 50,000 to 80,000 spectators.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/330px-Colosseo_2020.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-04",
    text: "Which youthful king of Macedonia conquered the mighty Persian Empire and created an empire stretching from Greece to India?",
    options: [
      "Alexander the Great",
      "Philip II",
      "Pericles",
      "Pyrrhus of Epirus"
],
    correctAnswer: "Alexander the Great",
    category: "Ancient Civilizations & Wonders",
    year: "336-323 BC",
    fact: "Tutored by philosopher Aristotle, Alexander remained undefeated in battle throughout his entire military career.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/49/Alexander_Mosaic_detail_of_Alexander_the_Great_%283x4_cropped%29.jpg/330px-Alexander_Mosaic_detail_of_Alexander_the_Great_%283x4_cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-05",
    text: "Who was the last active queen and ruler of the Ptolemaic Kingdom of Egypt before it fell to Rome?",
    options: [
      "Cleopatra VII",
      "Nefertiti",
      "Hatshepsut",
      "Arsinoe IV"
],
    correctAnswer: "Cleopatra VII",
    category: "Ancient Civilizations & Wonders",
    year: "51-30 BC",
    fact: "Cleopatra was famously fluent in multiple languages, including Egyptian, Greek, and Ethiopian.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3e/Kleopatra-VII.-Altes-Museum-Berlin1.jpg/330px-Kleopatra-VII.-Altes-Museum-Berlin1.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-06",
    text: "Which first emperor of unified China initiated the construction of the Great Wall to protect his empire from northern nomads?",
    options: [
      "Qin Shi Huang",
      "Han Wudi",
      "Kublai Khan",
      "Sun Yat-sen"
],
    correctAnswer: "Qin Shi Huang",
    category: "Ancient Civilizations & Wonders",
    year: "221 BC",
    fact: "Qin Shi Huang also standardized Chinese weights, measures, coinage, and script across the empire.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/23/The_Great_Wall_of_China_at_Jinshanling-edit.jpg/330px-The_Great_Wall_of_China_at_Jinshanling-edit.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-07",
    text: "Carved into a diorite stele in ancient Babylon, which famous legal code proclaimed the principle of 'an eye for an eye'?",
    options: [
      "Code of Hammurabi",
      "Twelve Tables",
      "Justinian Code",
      "Edict of Milan"
],
    correctAnswer: "Code of Hammurabi",
    category: "Ancient Civilizations & Wonders",
    year: "c. 1750 BC",
    fact: "The code consists of 282 edicts regulating commerce, property, contracts, and personal liability.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/64/P1050763_Louvre_code_Hammurabi_face_rwk.JPG/330px-P1050763_Louvre_code_Hammurabi_face_rwk.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-08",
    text: "Discovered in 1799 in Egypt, what famous artifact provided the key to deciphering ancient Egyptian hieroglyphics?",
    options: [
      "The Rosetta Stone",
      "Dead Sea Scrolls",
      "Narmer Palette",
      "Cyrus Cylinder"
],
    correctAnswer: "The Rosetta Stone",
    category: "Ancient Civilizations & Wonders",
    year: "196 BC",
    fact: "It contained the same royal decree written in three distinct scripts: Ancient Greek, Demotic, and Egyptian Hieroglyphs.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/23/Rosetta_Stone.JPG/330px-Rosetta_Stone.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-09",
    text: "Perched atop the Acropolis in Athens, what celebrated classical temple was dedicated to the patron goddess Athena?",
    options: [
      "The Parthenon",
      "Temple of Zeus",
      "Erechtheion",
      "Temple of Apollo"
],
    correctAnswer: "The Parthenon",
    category: "Ancient Civilizations & Wonders",
    year: "447-432 BC",
    fact: "Built under statesman Pericles, the Parthenon originally housed a massive 12-meter ivory and gold statue of Athena Parthenos.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/da/The_Parthenon_in_Athens.jpg/330px-The_Parthenon_in_Athens.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-10",
    text: "Discovered in 1974 by local farmers in Shaanxi, what vast subterranean army of life-sized sculptures was buried with China's first emperor?",
    options: [
      "The Terracotta Army",
      "Ming Tombs",
      "Shaolin Monks",
      "Forbidden City Guard"
],
    correctAnswer: "The Terracotta Army",
    category: "Ancient Civilizations & Wonders",
    year: "c. 210 BC",
    fact: "Over 8,000 soldiers, 130 chariots, and 670 horses were sculpted, each with completely unique facial features and hairstyles.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/88/51714-Terracota-Army.jpg/330px-51714-Terracota-Army.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-11",
    text: "Which British archaeologist made worldwide headlines in November 1922 by uncovering the intact tomb of Pharaoh Tutankhamun?",
    options: [
      "Howard Carter",
      "Heinrich Schliemann",
      "Arthur Evans",
      "Flinders Petrie"
],
    correctAnswer: "Howard Carter",
    category: "Ancient Civilizations & Wonders",
    year: "1922",
    fact: "When asked if he could see anything through the tiny breach in the door, Carter famously replied: 'Yes, wonderful things!'",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/24/Howard_carter.jpg/330px-Howard_carter.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-12",
    text: "Crafted from 11 kilograms of solid gold, the iconic funerary death mask belonged to which youthful Egyptian pharaoh?",
    options: [
      "Tutankhamun",
      "Ramses the Great",
      "Amenhotep III",
      "Seti I"
],
    correctAnswer: "Tutankhamun",
    category: "Ancient Civilizations & Wonders",
    year: "c. 1323 BC",
    fact: "Tutankhamun ascended the throne around age nine and reigned for only about ten years before his untimely death.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/27/CairoEgMuseumTaaMaskMostlyPhotographed.jpg/330px-CairoEgMuseumTaaMaskMostlyPhotographed.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-13",
    text: "Which Persian emperor founded the Achaemenid Empire and issued an ancient clay cylinder recognized as a pioneer declaration of human rights?",
    options: [
      "Cyrus the Great",
      "Darius I",
      "Xerxes I",
      "Artaxerxes"
],
    correctAnswer: "Cyrus the Great",
    category: "Ancient Civilizations & Wonders",
    year: "c. 539 BC",
    fact: "Cyrus famously liberated Jewish exiles in Babylon, allowing them to return to Jerusalem and rebuild their Temple.",
    difficulty: "medium",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/57/Cyrus_II_%28The_Great%29_%28cropped%29.jpg/330px-Cyrus_II_%28The_Great%29_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-14",
    text: "Born Gaius Octavius, who became the very first emperor of the Roman Empire and ushered in the two-century Pax Romana?",
    options: [
      "Augustus",
      "Nero",
      "Tiberius",
      "Marcus Aurelius"
],
    correctAnswer: "Augustus",
    category: "Ancient Civilizations & Wonders",
    year: "27 BC - 14 AD",
    fact: "Augustus famously claimed he found Rome a city of bricks and left it a city of marble.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b0/Augustus_of_Prima_Porta.jpg/330px-Augustus_of_Prima_Porta.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-15",
    text: "In 79 AD, which Roman seaside cities were completely buried and preserved under volcanic pumice and ash by Mount Vesuvius?",
    options: [
      "Pompeii and Herculaneum",
      "Ostia and Syracuse",
      "Carthage and Utica",
      "Ravenna and Verona"
],
    correctAnswer: "Pompeii and Herculaneum",
    category: "Ancient Civilizations & Wonders",
    year: "79 AD",
    fact: "The catastrophic eruption occurred during the reign of Emperor Titus and was documented in letters by Pliny the Younger.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f5/Aerial_image_of_Pompeii_and_Mount_Vesuvius_%28view_from_the_southeast%29.jpg/330px-Aerial_image_of_Pompeii_and_Mount_Vesuvius_%28view_from_the_southeast%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-16",
    text: "At which legendary narrow coastal pass did 300 Spartans under King Leonidas courageously fight to the death against Xerxes' Persian army?",
    options: [
      "Thermopylae",
      "Marathon",
      "Salamis",
      "Plataea"
],
    correctAnswer: "Thermopylae",
    category: "Ancient Civilizations & Wonders",
    year: "480 BC",
    fact: "The heroic last stand delayed the Persian advance and inspired the Greek city-states to unite and achieve ultimate victory.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/91/L%C3%A9onidas_aux_Thermopyles_-_Jacques-Louis_David_-_Mus%C3%A9e_du_Louvre_Peintures_INV_3690_%3B_L_3711.jpg/330px-L%C3%A9onidas_aux_Thermopyles_-_Jacques-Louis_David_-_Mus%C3%A9e_du_Louvre_Peintures_INV_3690_%3B_L_3711.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-17",
    text: "Which prehistoric monument of standing megalithic stones on England's Salisbury Plain aligns with the summer and winter solstices?",
    options: [
      "Stonehenge",
      "Carnac Stones",
      "Newgrange",
      "Avebury"
],
    correctAnswer: "Stonehenge",
    category: "Ancient Civilizations & Wonders",
    year: "c. 3000-2000 BC",
    fact: "Some of the smaller bluestones weighing up to four tons were transported over 240 kilometers from the Preseli Hills in Wales.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3c/Stonehenge2007_07_30.jpg/330px-Stonehenge2007_07_30.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-18",
    text: "Following the Athenian victory at which 490 BC battle did herald Pheidippides legendarily run 26 miles to Athens before collapsing?",
    options: [
      "Battle of Marathon",
      "Battle of Actium",
      "Battle of Cannae",
      "Battle of Chaeronea"
],
    correctAnswer: "Battle of Marathon",
    category: "Ancient Civilizations & Wonders",
    year: "490 BC",
    fact: "This dramatic legendary run gave its name to the modern 42.195 km Olympic marathon race.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/99/Scene_of_the_Battle_of_Marathon.jpg/330px-Scene_of_the_Battle_of_Marathon.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-19",
    text: "Which ancient Greek polymath in Syracuse discovered the principle of water displacement in a bathtub and shouted 'Eureka!'?",
    options: [
      "Archimedes",
      "Pythagoras",
      "Euclid",
      "Eratosthenes"
],
    correctAnswer: "Archimedes",
    category: "Ancient Civilizations & Wonders",
    year: "c. 287-212 BC",
    fact: "Archimedes also calculated an accurate approximation of pi and invented the Archimedes screw pump still used today.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/da/The_Parthenon_in_Athens.jpg/330px-The_Parthenon_in_Athens.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-20",
    text: "What vast historic network of trade routes linked ancient Chang'an in China with the Mediterranean world and Europe?",
    options: [
      "The Silk Road",
      "The Amber Road",
      "The Incense Route",
      "The Royal Road"
],
    correctAnswer: "The Silk Road",
    category: "Ancient Civilizations & Wonders",
    year: "c. 130 BC - 1453 AD",
    fact: "The route transported not only silk, porcelain, and spices, but also facilitated the spread of paper, gunpowder, and religion.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/23/The_Great_Wall_of_China_at_Jinshanling-edit.jpg/330px-The_Great_Wall_of_China_at_Jinshanling-edit.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-21",
    text: "Which Babylonian king, according to legend, built the terraced Hanging Gardens of Babylon to please his homesick wife Amytis?",
    options: [
      "Nebuchadnezzar II",
      "Hammurabi",
      "Sargon of Akkad",
      "Ashurbanipal"
],
    correctAnswer: "Nebuchadnezzar II",
    category: "Ancient Civilizations & Wonders",
    year: "c. 600 BC",
    fact: "The Hanging Gardens are the only one of the Seven Ancient Wonders whose exact physical location has never been definitively confirmed.",
    difficulty: "medium",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/64/P1050763_Louvre_code_Hammurabi_face_rwk.JPG/330px-P1050763_Louvre_code_Hammurabi_face_rwk.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-22",
    text: "In June 1215 at Runnymede, which English king was compelled by rebel barons to seal the historic Magna Carta?",
    options: [
      "King John",
      "Richard the Lionheart",
      "Henry II",
      "Edward I"
],
    correctAnswer: "King John",
    category: "Middle Ages & Renaissance",
    year: "1215",
    fact: "Magna Carta established the fundamental principle that even the monarch is bound by the rule of law.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ee/Magna_Carta_%28British_Library_Cotton_MS_Augustus_II.106%29.jpg/330px-Magna_Carta_%28British_Library_Cotton_MS_Augustus_II.106%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-23",
    text: "Which 17-year-old French peasant maiden led royal armies to relieve the Siege of Orléans during the Hundred Years' War?",
    options: [
      "Joan of Arc",
      "Eleanor of Aquitaine",
      "Catherine de' Medici",
      "Marie Antoinette"
],
    correctAnswer: "Joan of Arc",
    category: "Middle Ages & Renaissance",
    year: "1429",
    fact: "Canonized as a saint in 1920, Joan of Arc remains one of the patron saints and greatest national heroines of France.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c3/Joan_of_Arc_miniature_graded.jpg/330px-Joan_of_Arc_miniature_graded.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-24",
    text: "Which Renaissance genius painted both the enigmatic portrait 'Mona Lisa' and the iconic mural 'The Last Supper'?",
    options: [
      "Leonardo da Vinci",
      "Michelangelo",
      "Raphael",
      "Donatello"
],
    correctAnswer: "Leonardo da Vinci",
    category: "Middle Ages & Renaissance",
    year: "c. 1503",
    fact: "In addition to art, Leonardo sketched early conceptual designs for helicopters, parachutes, armored tanks, and solar power.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/330px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-25",
    text: "In Mainz around 1440, who revolutionized the spread of knowledge in Europe by inventing the movable-type printing press?",
    options: [
      "Johannes Gutenberg",
      "William Caxton",
      "Albrecht Dürer",
      "Desiderius Erasmus"
],
    correctAnswer: "Johannes Gutenberg",
    category: "Middle Ages & Renaissance",
    year: "c. 1440",
    fact: "His major work, the 42-line Gutenberg Bible, printed around 1455, marked the dawn of mass media in the West.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5b/Mainz_Gutenbergdenkmal_2016_%28cropped%29.jpg/330px-Mainz_Gutenbergdenkmal_2016_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-26",
    text: "In 1453, which 21-year-old Ottoman Sultan captured Constantinople, bringing a dramatic end to the 1,100-year Byzantine Empire?",
    options: [
      "Mehmed II (The Conqueror)",
      "Suleiman the Magnificent",
      "Osman I",
      "Selim I"
],
    correctAnswer: "Mehmed II (The Conqueror)",
    category: "Middle Ages & Renaissance",
    year: "1453",
    fact: "Mehmed used massive super-cannons engineered by Urban to shatter Constantinople's previously impregnable Theodosian Walls.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e2/Le_si%C3%A8ge_de_Constantinople_%281453%29_by_Jean_Le_Tavernier_after_1455.jpg/330px-Le_si%C3%A8ge_de_Constantinople_%281453%29_by_Jean_Le_Tavernier_after_1455.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-27",
    text: "Between 1346 and 1353, what devastating bubonic plague pandemic killed an estimated 30% to 60% of Europe's entire population?",
    options: [
      "The Black Death",
      "The Spanish Flu",
      "Justinian Plague",
      "Great Plague of London"
],
    correctAnswer: "The Black Death",
    category: "Middle Ages & Renaissance",
    year: "1346-1353",
    fact: "Caused by the bacterium Yersinia pestis carried by fleas on black rats, it fundamentally reorganized European medieval society.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4e/1346-1353_spread_of_the_Black_Death_in_Europe_map.svg/330px-1346-1353_spread_of_the_Black_Death_in_Europe_map.svg.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-28",
    text: "Which Venetian merchant and explorer spent 24 years traveling across Asia and served at the imperial court of Kublai Khan?",
    options: [
      "Marco Polo",
      "Amerigo Vespucci",
      "John Cabot",
      "Ibn Battuta"
],
    correctAnswer: "Marco Polo",
    category: "Middle Ages & Renaissance",
    year: "1271-1295",
    fact: "His book 'The Travels of Marco Polo' introduced Europeans to paper money, coal, and the riches of China.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/ff/Frontispice_%C3%A9dition_de_Nuremberg_1477_%28cropped%29.png/330px-Frontispice_%C3%A9dition_de_Nuremberg_1477_%28cropped%29.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-29",
    text: "In 1206, which charismatic leader united the nomadic tribes of the steppe to found the colossal Mongol Empire?",
    options: [
      "Genghis Khan",
      "Kublai Khan",
      "Tamerlane",
      "Attila the Hun"
],
    correctAnswer: "Genghis Khan",
    category: "Middle Ages & Renaissance",
    year: "1206",
    fact: "By his death, the Mongol Empire was the largest contiguous land empire in world history, practicing meritocracy and religious tolerance.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/35/YuanEmperorAlbumGenghisPortrait.jpg/330px-YuanEmperorAlbumGenghisPortrait.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-30",
    text: "On Christmas Day in the year 800 in Rome, who was crowned by Pope Leo III as the first Holy Roman Emperor?",
    options: [
      "Charlemagne",
      "Otto the Great",
      "Clovis I",
      "Charles Martel"
],
    correctAnswer: "Charlemagne",
    category: "Middle Ages & Renaissance",
    year: "800 AD",
    fact: "Known as 'Father of Europe', Charlemagne united most of Western and Central Europe for the first time since the classical Roman Empire.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fb/Charlemagne_denier_Mayence_812_814.jpg/330px-Charlemagne_denier_Mayence_812_814.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-31",
    text: "Who spent four grueling years (1508-1512) painting the breathtaking frescoes of Genesis on the ceiling of the Sistine Chapel?",
    options: [
      "Michelangelo Buonarroti",
      "Leonardo da Vinci",
      "Sandro Botticelli",
      "Titian"
],
    correctAnswer: "Michelangelo Buonarroti",
    category: "Middle Ages & Renaissance",
    year: "1508-1512",
    fact: "Michelangelo painted the ceiling standing on custom wooden scaffolding rather than lying on his back as popular myth claims.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1d/Sistine_Chapel_ceiling_02_%28brightened%29.jpg/330px-Sistine_Chapel_ceiling_02_%28brightened%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-32",
    text: "In 1517, which German monk ignited the Protestant Reformation by posting his Ninety-five Theses in Wittenberg?",
    options: [
      "Martin Luther",
      "John Calvin",
      "Huldrych Zwingli",
      "Thomas More"
],
    correctAnswer: "Martin Luther",
    category: "Middle Ages & Renaissance",
    year: "1517",
    fact: "Luther translated the Bible into the German vernacular, heavily standardizing the modern German language.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/90/Lucas_Cranach_d.%C3%84._-_Martin_Luther%2C_1528_%28Veste_Coburg%29.jpg/330px-Lucas_Cranach_d.%C3%84._-_Martin_Luther%2C_1528_%28Veste_Coburg%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-33",
    text: "At the Battle of Hastings on October 14, 1066, which Norman Duke defeated English King Harold Godwinson to claim the English crown?",
    options: [
      "William the Conqueror",
      "Robert Curthose",
      "Edward the Confessor",
      "Canute the Great"
],
    correctAnswer: "William the Conqueror",
    category: "Middle Ages & Renaissance",
    year: "1066",
    fact: "The decisive Norman conquest of England was famously depicted in the 70-meter-long embroidered Bayeux Tapestry.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bb/Bayeux_Tapestry_scene57_Harold_death.jpg/330px-Bayeux_Tapestry_scene57_Harold_death.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-34",
    text: "In Constantinople, which monumental Byzantine cathedral with a 31-meter dome was built by Emperor Justinian I in 537 AD?",
    options: [
      "Hagia Sophia",
      "St. Mark's Basilica",
      "Basilica of Sant'Apollinare",
      "Church of the Holy Sepulchre"
],
    correctAnswer: "Hagia Sophia",
    category: "Middle Ages & Renaissance",
    year: "537 AD",
    fact: "Upon entering the completed cathedral, Justinian reportedly proclaimed: 'Solomon, I have surpassed thee!'",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4a/Hagia_Sophia_%28228968325%29.jpeg/330px-Hagia_Sophia_%28228968325%29.jpeg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-35",
    text: "Which medieval Gothic masterpiece cathedral on the Île de la Cité in Paris was celebrated in Victor Hugo's famous 1831 novel?",
    options: [
      "Notre-Dame de Paris",
      "Sainte-Chapelle",
      "Chartres Cathedral",
      "Reims Cathedral"
],
    correctAnswer: "Notre-Dame de Paris",
    category: "Middle Ages & Renaissance",
    year: "1163-1345",
    fact: "It was one of the very first buildings in the world to implement exterior flying buttresses to support soaring vaulted ceilings.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f7/Notre-Dame_de_Paris%2C_4_October_2017.jpg/330px-Notre-Dame_de_Paris%2C_4_October_2017.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-36",
    text: "Which High Renaissance master painted the celebrated Vatican fresco 'The School of Athens' depicting Plato and Aristotle?",
    options: [
      "Raphael",
      "Michelangelo",
      "Caravaggio",
      "Giorgione"
],
    correctAnswer: "Raphael",
    category: "Middle Ages & Renaissance",
    year: "1509-1511",
    fact: "Raphael modeled the central figure of Plato after his elder contemporary Leonardo da Vinci.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/49/%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg/330px-%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-37",
    text: "Which Ottoman Sultan presided over the imperial golden age from 1520 to 1566, known in the West as 'The Magnificent'?",
    options: [
      "Suleiman I",
      "Selim II",
      "Murad IV",
      "Bayezid II"
],
    correctAnswer: "Suleiman I",
    category: "Middle Ages & Renaissance",
    year: "1520-1566",
    fact: "Known within his empire as Kanuni ('The Lawgiver'), he instituted widespread judicial reforms that endured for centuries.",
    difficulty: "medium",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e9/EmperorSuleiman.jpg/330px-EmperorSuleiman.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-38",
    text: "In Cambodia, which massive 12th-century temple complex built by King Suryavarman II is the largest religious structure in the world?",
    options: [
      "Angkor Wat",
      "Borobudur",
      "Prambanan",
      "Bagan"
],
    correctAnswer: "Angkor Wat",
    category: "Middle Ages & Renaissance",
    year: "12th century",
    fact: "Originally constructed as a Hindu temple dedicated to Vishnu, it gradually transformed into a major Buddhist pilgrimage site.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/41/Angkor_Wat.jpg/330px-Angkor_Wat.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-39",
    text: "Which Italian astronomer used his improved telescope in 1609 to discover Jupiter's four largest moons, confirming heliocentrism?",
    options: [
      "Galileo Galilei",
      "Nicolaus Copernicus",
      "Johannes Kepler",
      "Tycho Brahe"
],
    correctAnswer: "Galileo Galilei",
    category: "Middle Ages & Renaissance",
    year: "1609-1610",
    fact: "Galileo's observation of the four moons proved that not all celestial bodies revolve around the Earth.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fc/Galileo_Galilei_%281564-1642%29_RMG_BHC2700.tiff/lossy-page1-330px-Galileo_Galilei_%281564-1642%29_RMG_BHC2700.tiff.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-40",
    text: "Which English Tudor monarch delivered the defiant Speech to the Troops at Tilbury as England defeated the Spanish Armada in 1588?",
    options: [
      "Queen Elizabeth I",
      "Queen Mary I",
      "Queen Anne",
      "Mary Queen of Scots"
],
    correctAnswer: "Queen Elizabeth I",
    category: "Middle Ages & Renaissance",
    year: "1588",
    fact: "She famously declared: 'I know I have the body but of a weak and feeble woman; but I have the heart and stomach of a king!'",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/af/Darnley_stage_3.jpg/330px-Darnley_stage_3.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-41",
    text: "In 1620, what famous English merchant ship carried the Pilgrims across the stormy Atlantic to establish Plymouth Colony?",
    options: [
      "The Mayflower",
      "The Santa Maria",
      "The Golden Hind",
      "The Endeavour"
],
    correctAnswer: "The Mayflower",
    category: "Middle Ages & Renaissance",
    year: "1620",
    fact: "Before disembarking, the passengers signed the Mayflower Compact, one of the earliest frameworks of self-governance in the New World.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9d/Copyrighted_and_Published_by_A_S_Burbank%2C_The_Mayflower_at_Sea_%28NBY_21340%29.jpg/330px-Copyrighted_and_Published_by_A_S_Burbank%2C_The_Mayflower_at_Sea_%28NBY_21340%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-42",
    text: "In Agra, India, which Mughal Emperor commissioned the magnificent white marble Taj Mahal as a tomb for his beloved wife Mumtaz Mahal?",
    options: [
      "Shah Jahan",
      "Akbar the Great",
      "Babur",
      "Aurangzeb"
],
    correctAnswer: "Shah Jahan",
    category: "Middle Ages & Renaissance",
    year: "1631-1648",
    fact: "Over 20,000 artisans and workers from across India, Persia, and the Ottoman Empire collaborated to build the monument.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/330px-Taj_Mahal_%28Edited%29.jpeg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-43",
    text: "Sponsored by Queen Isabella and King Ferdinand of Spain, who made landfall in the Bahamas in October 1492?",
    options: [
      "Christopher Columbus",
      "Amerigo Vespucci",
      "Hernán Cortés",
      "Francisco Pizarro"
],
    correctAnswer: "Christopher Columbus",
    category: "Age of Discovery & Revolutions",
    year: "1492",
    fact: "His voyage aboard the Santa María, Pinta, and Niña initiated centuries of transatlantic exploration, contact, and colonization.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c2/Portrait_of_a_Man%2C_Said_to_be_Christopher_Columbus.jpg/330px-Portrait_of_a_Man%2C_Said_to_be_Christopher_Columbus.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-44",
    text: "Which Portuguese explorer sailed around Africa's Cape of Good Hope to arrive at Calicut in 1498, linking Europe and India by sea?",
    options: [
      "Vasco da Gama",
      "Bartolomeu Dias",
      "Afonso de Albuquerque",
      "Prince Henry the Navigator"
],
    correctAnswer: "Vasco da Gama",
    category: "Age of Discovery & Revolutions",
    year: "1498",
    fact: "This maritime passage broke the Venetian and Ottoman monopoly over the highly lucrative spice trade.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2e/Ignoto_portoghese%2C_ritratto_di_un_cavaliere_dell%27ordine_di_cristo%2C_1525-50_ca._02.jpg/330px-Ignoto_portoghese%2C_ritratto_di_un_cavaliere_dell%27ordine_di_cristo%2C_1525-50_ca._02.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-45",
    text: "Whose Spanish expedition of 1519-1522 achieved the very first recorded circumnavigation of planet Earth?",
    options: [
      "Ferdinand Magellan (completed by Juan Sebastián Elcano)",
      "Francis Drake",
      "James Cook",
      "Vasco Núñez de Balboa"
],
    correctAnswer: "Ferdinand Magellan (completed by Juan Sebastián Elcano)",
    category: "Age of Discovery & Revolutions",
    year: "1519-1522",
    fact: "Although Magellan was killed in the Philippines in 1521, his navigator Juan Sebastián Elcano guided the Victoria safely back to Spain.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9c/Ferdinand_Magellan.jpg/330px-Ferdinand_Magellan.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-46",
    text: "Who was the primary draftsman of the United States Declaration of Independence adopted by the Continental Congress on July 4, 1776?",
    options: [
      "Thomas Jefferson",
      "John Adams",
      "Benjamin Franklin",
      "Alexander Hamilton"
],
    correctAnswer: "Thomas Jefferson",
    category: "Age of Discovery & Revolutions",
    year: "1776",
    fact: "The document famously proclaimed that all men are created equal, endowed with rights to 'Life, Liberty and the pursuit of Happiness.'",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8f/United_States_Declaration_of_Independence.jpg/330px-United_States_Declaration_of_Independence.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-47",
    text: "On July 14, 1789, the storming of which medieval royal fortress and armory in Paris marked the violent outbreak of the French Revolution?",
    options: [
      "The Bastille",
      "Tuileries Palace",
      "Château de Vincennes",
      "Conciergerie"
],
    correctAnswer: "The Bastille",
    category: "Age of Discovery & Revolutions",
    year: "1789",
    fact: "Today, July 14 is celebrated annually across France as Bastille Day (La Fête Nationale), the French national day.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/57/Anonymous_-_Prise_de_la_Bastille.jpg/330px-Anonymous_-_Prise_de_la_Bastille.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-48",
    text: "Which brilliant military commander crowned himself Emperor of the French in 1804 and reorganized European law with the Napoleonic Code?",
    options: [
      "Napoleon Bonaparte",
      "Louis-Philippe",
      "Robespierre",
      "Talleyrand"
],
    correctAnswer: "Napoleon Bonaparte",
    category: "Age of Discovery & Revolutions",
    year: "1804",
    fact: "His Napoleonic Code replaced feudal statutes with a clear legal framework and remains the foundation of civil law in over 70 nations.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/50/Jacques-Louis_David_-_The_Emperor_Napoleon_in_His_Study_at_the_Tuileries_-_Google_Art_Project.jpg/330px-Jacques-Louis_David_-_The_Emperor_Napoleon_in_His_Study_at_the_Tuileries_-_Google_Art_Project.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-49",
    text: "In June 1815 in present-day Belgium, at which decisive battle was Napoleon Bonaparte definitively defeated by Wellington and Blücher?",
    options: [
      "Battle of Waterloo",
      "Battle of Austerlitz",
      "Battle of Leipzig",
      "Battle of Trafalgar"
],
    correctAnswer: "Battle of Waterloo",
    category: "Age of Discovery & Revolutions",
    year: "1815",
    fact: "Following his defeat at Waterloo, Napoleon was exiled to the remote South Atlantic island of Saint Helena, where he died in 1821.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/72/Battle_of_Waterloo_1815.PNG/330px-Battle_of_Waterloo_1815.PNG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-50",
    text: "Where did the Industrial Revolution begin in the mid-18th century, driven by coal, iron, textile machinery, and steam power?",
    options: [
      "Great Britain",
      "Germany",
      "United States",
      "France"
],
    correctAnswer: "Great Britain",
    category: "Age of Discovery & Revolutions",
    year: "c. 1760",
    fact: "James Watt's 1776 improvements to the steam engine radically magnified mechanical productivity and inaugurated modern industry.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dc/Powerloom_weaving_in_1835.jpg/330px-Powerloom_weaving_in_1835.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-51",
    text: "Known as 'El Libertador', which visionary leader championed the independence of Venezuela, Colombia, Ecuador, Peru, and Bolivia from Spain?",
    options: [
      "Simón Bolívar",
      "José de San Martín",
      "Bernardo O'Higgins",
      "Miguel Hidalgo"
],
    correctAnswer: "Simón Bolívar",
    category: "Age of Discovery & Revolutions",
    year: "1810-1830",
    fact: "The modern sovereign nation of Bolivia was named directly in honor of Simón Bolívar.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/Sim%C3%B3n_Bol%C3%ADvar._Toro_Moreno%2C_Luis._1922%2C_Legislative_Palace%2C_La_Paz.png/330px-Sim%C3%B3n_Bol%C3%ADvar._Toro_Moreno%2C_Luis._1922%2C_Legislative_Palace%2C_La_Paz.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-52",
    text: "In December 1773, which famous Boston harbor protest against British taxation without representation saw 342 chests of tea cast into the sea?",
    options: [
      "The Boston Tea Party",
      "The Stamp Act Riot",
      "The Boston Massacre",
      "Whiskey Rebellion"
],
    correctAnswer: "The Boston Tea Party",
    category: "Age of Discovery & Revolutions",
    year: "1773",
    fact: "The direct British retaliation with the Coercive (Intolerable) Acts galvanized the colonies to convene the First Continental Congress.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e6/Boston_Tea_Party_w.jpg/330px-Boston_Tea_Party_w.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-53",
    text: "In 1781, at which Virginia coastal siege did American forces under George Washington and French allies compel General Cornwallis to surrender?",
    options: [
      "Siege of Yorktown",
      "Battle of Bunker Hill",
      "Battle of Saratoga",
      "Battle of Trenton"
],
    correctAnswer: "Siege of Yorktown",
    category: "Age of Discovery & Revolutions",
    year: "1781",
    fact: "The surrender of Cornwallis's army effectively ended major combat operations in North America and led to the 1783 Treaty of Paris.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b8/Surrender_of_Lord_Cornwallis.jpg/330px-Surrender_of_Lord_Cornwallis.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-54",
    text: "Which 16th US President led the nation through the American Civil War, issued the Emancipation Proclamation, and preserved the Union?",
    options: [
      "Abraham Lincoln",
      "Andrew Jackson",
      "Ulysses S. Grant",
      "James Polk"
],
    correctAnswer: "Abraham Lincoln",
    category: "Age of Discovery & Revolutions",
    year: "1861-1865",
    fact: "Lincoln delivered the immortal two-minute Gettysburg Address in November 1863, dedicating a battlefield to 'government of the people, by the people, for the people.'",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ab/Abraham_Lincoln_O-77_matte_collodion_print.jpg/330px-Abraham_Lincoln_O-77_matte_collodion_print.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-55",
    text: "Which fearless abolitionist escaped enslavement and returned south on roughly 13 missions to rescue dozens of enslaved people via the Underground Railroad?",
    options: [
      "Harriet Tubman",
      "Sojourner Truth",
      "Frederick Douglass",
      "Ida B. Wells"
],
    correctAnswer: "Harriet Tubman",
    category: "Age of Discovery & Revolutions",
    year: "c. 1850-1860",
    fact: "Tubman also served as an armed scout and spy for the Union Army during the Civil War, never losing a single passenger.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b4/Carte-de-visite_portrait_of_Harriet_Tubman_%28cropped%29.jpg/330px-Carte-de-visite_portrait_of_Harriet_Tubman_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-56",
    text: "In 1687, who published 'Philosophiae Naturalis Principia Mathematica', laying the foundations of classical physics with the laws of motion and universal gravity?",
    options: [
      "Sir Isaac Newton",
      "René Descartes",
      "Robert Hooke",
      "Gottfried Wilhelm Leibniz"
],
    correctAnswer: "Sir Isaac Newton",
    category: "Age of Discovery & Revolutions",
    year: "1687",
    fact: "Newton's three laws of motion and gravitational equations unified terrestrial physics with the motion of the planets.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f7/Portrait_of_Sir_Isaac_Newton%2C_1689_%28brightened%29.jpg/330px-Portrait_of_Sir_Isaac_Newton%2C_1689_%28brightened%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-57",
    text: "Which English naturalist published 'On the Origin of Species' in 1859 after observing unique finches and tortoises in the Galápagos Islands?",
    options: [
      "Charles Darwin",
      "Alfred Russel Wallace",
      "Jean-Baptiste Lamarck",
      "Gregor Mendel"
],
    correctAnswer: "Charles Darwin",
    category: "Age of Discovery & Revolutions",
    year: "1859",
    fact: "Darwin proposed that all species of life have descended over time from common ancestors through the mechanism of natural selection.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2e/Charles_Darwin_seated_crop.jpg/330px-Charles_Darwin_seated_crop.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-58",
    text: "Which French monarch, known as the 'Sun King', built the extravagant Palace of Versailles and famously asserted 'L'État, c'est moi'?",
    options: [
      "Louis XIV",
      "Louis XVI",
      "Henry IV",
      "Francis I"
],
    correctAnswer: "Louis XIV",
    category: "Age of Discovery & Revolutions",
    year: "1643-1715",
    fact: "Louis XIV reigned for 72 years and 110 days, the longest recorded sovereign reign of any monarch in European history.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b2/Versailles_Palace_%28FRA%29_%E2%80%93_Equestrian_Olympic_Venue.jpg/330px-Versailles_Palace_%28FRA%29_%E2%80%93_Equestrian_Olympic_Venue.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-59",
    text: "In 1876, which Scottish-born inventor was awarded the first US patent for the electrical telephone?",
    options: [
      "Alexander Graham Bell",
      "Thomas Edison",
      "Nikola Tesla",
      "Samuel Morse"
],
    correctAnswer: "Alexander Graham Bell",
    category: "Age of Discovery & Revolutions",
    year: "1876",
    fact: "His first historic words spoken over the device to his assistant were: 'Mr. Watson, come here, I want to see you.'",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9c/Alexander_Graham_Bell_1895_NPG_77_363.jpg/330px-Alexander_Graham_Bell_1895_NPG_77_363.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-60",
    text: "Opened in November 1869 across Egypt, which strategic artificial waterway connected the Mediterranean Sea directly to the Red Sea?",
    options: [
      "The Suez Canal",
      "The Panama Canal",
      "Kiel Canal",
      "Corinth Canal"
],
    correctAnswer: "The Suez Canal",
    category: "Age of Discovery & Revolutions",
    year: "1869",
    fact: "Designed by French diplomat Ferdinand de Lesseps, the 193 km canal eliminated the arduous journey around Africa's southern cape.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c9/Iss016e019375.jpg/330px-Iss016e019375.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-61",
    text: "Rediscovered in 1911 by American explorer Hiram Bingham, which 15th-century mountain citadel was constructed by the Inca Empire?",
    options: [
      "Machu Picchu",
      "Cusco",
      "Chichen Itza",
      "Tikal"
],
    correctAnswer: "Machu Picchu",
    category: "Age of Discovery & Revolutions",
    year: "c. 1450",
    fact: "Perched 2,430 meters above sea level in the Peruvian Andes, it was built using polished dry-stone walls fitted together without mortar.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bb/Machu_Picchu%2C_2023_%28012%29.jpg/330px-Machu_Picchu%2C_2023_%28012%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-62",
    text: "On the night of April 14-15, 1912, which supposedly 'unsinkable' British White Star ocean liner struck an iceberg on its maiden voyage?",
    options: [
      "RMS Titanic",
      "RMS Lusitania",
      "HMHS Britannic",
      "RMS Olympic"
],
    correctAnswer: "RMS Titanic",
    category: "Age of Discovery & Revolutions",
    year: "1912",
    fact: "The maritime tragedy led to major international safety reforms, including 24-hour radio watches and lifeboat capacity for all passengers.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6d/RMS_Titanic_3_%28cropped_to_ship%29.jpg/330px-RMS_Titanic_3_%28cropped_to_ship%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-63",
    text: "Known as 'The Lady with the Lamp' during the Crimean War (1853-1856), who pioneered modern evidence-based sanitary nursing?",
    options: [
      "Florence Nightingale",
      "Clara Barton",
      "Mary Seacole",
      "Dorothea Dix"
],
    correctAnswer: "Florence Nightingale",
    category: "Age of Discovery & Revolutions",
    year: "1854",
    fact: "Nightingale was also a brilliant statistician who invented the polar area diagram (rose chart) to visualize wartime causes of mortality.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ab/Florence_Nightingale_%28H_Hering_NPG_x82368%29.jpg/330px-Florence_Nightingale_%28H_Hering_NPG_x82368%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-64",
    text: "On December 17, 1903 at Kitty Hawk, North Carolina, which brothers achieved the world's first powered, controlled airplane flight?",
    options: [
      "Orville and Wilbur Wright",
      "Montgolfier Brothers",
      "Lumière Brothers",
      "Short Brothers"
],
    correctAnswer: "Orville and Wilbur Wright",
    category: "Modern Era & World Wars",
    year: "1903",
    fact: "Orville piloted the first flight of the Wright Flyer, staying airborne for 12 seconds and covering 120 feet.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/86/First_flight2.jpg/330px-First_flight2.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-65",
    text: "On June 28, 1914 in Sarajevo, the assassination of which heir to the Austro-Hungarian throne triggered World War I?",
    options: [
      "Archduke Franz Ferdinand",
      "Crown Prince Rudolf",
      "Archduke Otto",
      "Kaiser Wilhelm II"
],
    correctAnswer: "Archduke Franz Ferdinand",
    category: "Modern Era & World Wars",
    year: "1914",
    fact: "He and his wife Sophie were assassinated by 19-year-old Gavrilo Princip, a member of the nationalist movement Young Bosnia.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ea/DC-1914-27-d-Sarajevo-cropped.jpg/330px-DC-1914-27-d-Sarajevo-cropped.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-66",
    text: "Signed in June 1919 at the Hall of Mirrors in France, what treaty officially concluded World War I and established the League of Nations?",
    options: [
      "Treaty of Versailles",
      "Treaty of Brest-Litovsk",
      "Treaty of Ghent",
      "Treaty of Paris"
],
    correctAnswer: "Treaty of Versailles",
    category: "Modern Era & World Wars",
    year: "1919",
    fact: "The treaty imposed heavy territorial, military, and financial reparations on Germany under the famous 'War Guilt' clause.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b8/Treaty_of_Versailles%2C_English_version.jpg/330px-Treaty_of_Versailles%2C_English_version.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-67",
    text: "On December 7, 1941, 'a date which will live in infamy', which US naval base in Hawaii was attacked by the Imperial Japanese Navy?",
    options: [
      "Pearl Harbor",
      "Midway Atoll",
      "Guam",
      "Subic Bay"
],
    correctAnswer: "Pearl Harbor",
    category: "Modern Era & World Wars",
    year: "1941",
    fact: "The devastating surprise attack galvanized American public opinion and brought the United States directly into World War II.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c7/Attack_on_Pearl_Harbor_Japanese_planes_view.jpg/330px-Attack_on_Pearl_Harbor_Japanese_planes_view.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-68",
    text: "On June 6, 1944 (D-Day), Allied forces under General Dwight D. Eisenhower launched Operation Overlord on the beaches of which region in France?",
    options: [
      "Normandy",
      "Brittany",
      "Dunkirk",
      "Calais"
],
    correctAnswer: "Normandy",
    category: "Modern Era & World Wars",
    year: "1944",
    fact: "It was the largest amphibious invasion in human history, deploying over 156,000 Allied troops across five code-named beachheads.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a5/Into_the_Jaws_of_Death_23-0455M_edit.jpg/330px-Into_the_Jaws_of_Death_23-0455M_edit.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-69",
    text: "Fought between August 1942 and February 1943, which epic battle on the Volga River marked the catastrophic turning point of WWII in Europe?",
    options: [
      "Battle of Stalingrad",
      "Battle of Kursk",
      "Battle of Moscow",
      "Battle of the Bulge"
],
    correctAnswer: "Battle of Stalingrad",
    category: "Modern Era & World Wars",
    year: "1942-1943",
    fact: "The entire German Sixth Army was encircled and surrendered, permanently shifting strategic momentum in favor of the Allies.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5e/%D0%A0%D0%B0%D1%81%D1%87%D0%B5%D1%82_%D1%81%D0%BE%D0%B2%D0%B5%D1%82%D1%81%D0%BA%D0%BE%D0%B9_76%2C2-%D0%BC%D0%BC_%D0%BF%D1%83%D1%88%D0%BA%D0%B8_%D0%97%D0%B8%D0%A1-3_%D0%B2%D0%B5%D0%B4%D0%B5%D1%82_%D0%BE%D0%B3%D0%BE%D0%BD%D1%8C_%D0%B2_%D0%A1%D1%82%D0%B0%D0%BB%D0%B8%D0%BD%D0%B3%D1%80%D0%B0%D0%B4%D0%B5._%D0%9D%D0%BE%D1%8F%D0%B1%D1%80%D1%8C_1942_%D0%B3.jpg/330px-%D0%A0%D0%B0%D1%81%D1%87%D0%B5%D1%82_%D1%81%D0%BE%D0%B2%D0%B5%D1%82%D1%81%D0%BA%D0%BE%D0%B9_76%2C2-%D0%BC%D0%BC_%D0%BF%D1%83%D1%88%D0%BA%D0%B8_%D0%97%D0%B8%D0%A1-3_%D0%B2%D0%B5%D0%B4%D0%B5%D1%82_%D0%BE%D0%B3%D0%BE%D0%BD%D1%8C_%D0%B2_%D0%A1%D1%82%D0%B0%D0%BB%D0%B8%D0%BD%D0%B3%D1%80%D0%B0%D0%B4%D0%B5._%D0%9D%D0%BE%D1%8F%D0%B1%D1%80%D1%8C_1942_%D0%B3.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-70",
    text: "Which British Prime Minister rallied his nation during the Blitz with speeches promising to 'never surrender' and fight 'on the beaches'?",
    options: [
      "Winston Churchill",
      "Neville Chamberlain",
      "Clement Attlee",
      "Anthony Eden"
],
    correctAnswer: "Winston Churchill",
    category: "Modern Era & World Wars",
    year: "1940-1945",
    fact: "In addition to leading the UK to wartime victory, Churchill won the 1953 Nobel Prize in Literature for his historical writings.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/02/Sir_Winston_Churchill_-_19086236948_%28restored%29.jpg/330px-Sir_Winston_Churchill_-_19086236948_%28restored%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-71",
    text: "Which German-born Jewish girl posthumously moved the world through the published diary she kept while hiding from Nazis in Amsterdam?",
    options: [
      "Anne Frank",
      "Hannah Senesh",
      "Sophie Scholl",
      "Edith Stein"
],
    correctAnswer: "Anne Frank",
    category: "Modern Era & World Wars",
    year: "1942-1944",
    fact: "Her diary, published by her father Otto Frank in 1947, has been translated into over 70 languages and sold over 30 million copies.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6b/Anne_Frank_passport_photo%2C_May_1942_%28cropped%29.jpg/330px-Anne_Frank_passport_photo%2C_May_1942_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-72",
    text: "Which American theoretical physicist served as scientific director of the Manhattan Project's Los Alamos Laboratory, developing the atomic bomb?",
    options: [
      "J. Robert Oppenheimer",
      "Enrico Fermi",
      "Richard Feynman",
      "Ernest Lawrence"
],
    correctAnswer: "J. Robert Oppenheimer",
    category: "Modern Era & World Wars",
    year: "1942-1945",
    fact: "Witnessing the Trinity nuclear test in July 1945, Oppenheimer famously recalled the Hindu text: 'Now I am become Death, the destroyer of worlds.'",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/Oppenheimer_%28cropped%29.jpg/330px-Oppenheimer_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-73",
    text: "Founded in San Francisco in 1945 by 51 nations after World War II, what global body was created to maintain international peace and security?",
    options: [
      "The United Nations (UN)",
      "The League of Nations",
      "NATO",
      "The World Bank"
],
    correctAnswer: "The United Nations (UN)",
    category: "Modern Era & World Wars",
    year: "1945",
    fact: "The UN Charter was signed on June 26, 1945, and its headquarters was established along the East River in New York City.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2f/Flag_of_the_United_Nations.svg/330px-Flag_of_the_United_Nations.svg.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-74",
    text: "Which iconic physicist transformed modern science with his special and general theories of relativity and the equation E=mc²?",
    options: [
      "Albert Einstein",
      "Max Planck",
      "Niels Bohr",
      "Erwin Schrödinger"
],
    correctAnswer: "Albert Einstein",
    category: "Modern Era & World Wars",
    year: "1905-1915",
    fact: "Einstein won the 1921 Nobel Prize in Physics specifically for his discovery of the law of the photoelectric effect.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/28/Albert_Einstein_Head_cleaned.jpg/330px-Albert_Einstein_Head_cleaned.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-75",
    text: "Who was the first woman to win a Nobel Prize and remains the only person to win Nobel Prizes in two different scientific fields (Physics and Chemistry)?",
    options: [
      "Marie Curie",
      "Lise Meitner",
      "Rosalind Franklin",
      "Dorothy Hodgkin"
],
    correctAnswer: "Marie Curie",
    category: "Modern Era & World Wars",
    year: "1903 / 1911",
    fact: "Curie coined the term 'radioactivity' and discovered two new chemical elements: polonium and radium.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c8/Marie_Curie_c._1920s.jpg/330px-Marie_Curie_c._1920s.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-76",
    text: "In 1928 at St. Mary's Hospital in London, which Scottish bacteriologist accidentally discovered the wonder antibiotic penicillin?",
    options: [
      "Alexander Fleming",
      "Louis Pasteur",
      "Robert Koch",
      "Joseph Lister"
],
    correctAnswer: "Alexander Fleming",
    category: "Modern Era & World Wars",
    year: "1928",
    fact: "Fleming observed that a green mould, Penicillium notatum, had contaminated a Petri dish and destroyed the surrounding Staphylococcus bacteria.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bf/Synthetic_Production_of_Penicillin_TR1468.jpg/330px-Synthetic_Production_of_Penicillin_TR1468.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-77",
    text: "Which pioneer of satyagraha (nonviolent resistance) led India's freedom struggle from British rule and championed the 1930 Salt March?",
    options: [
      "Mahatma Gandhi",
      "Jawaharlal Nehru",
      "Subhas Chandra Bose",
      "Sardar Patel"
],
    correctAnswer: "Mahatma Gandhi",
    category: "Modern Era & World Wars",
    year: "1930",
    fact: "Gandhi's philosophy of nonviolent mass civil disobedience profoundly inspired civil rights movements worldwide.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7a/Mahatma-Gandhi%2C_studio%2C_1931.jpg/330px-Mahatma-Gandhi%2C_studio%2C_1931.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-78",
    text: "At the 1963 March on Washington, which civil rights leader delivered the immortal 'I Have a Dream' speech before 250,000 people?",
    options: [
      "Dr. Martin Luther King Jr.",
      "Malcolm X",
      "John Lewis",
      "Medgar Evers"
],
    correctAnswer: "Dr. Martin Luther King Jr.",
    category: "Modern Era & World Wars",
    year: "1963",
    fact: "Dr. King won the Nobel Peace Prize in 1964 for combating racial inequality through nonviolent resistance.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8b/Martin_Luther_King_Jr_National_Historic_Site_%2836233249121%29.jpg/330px-Martin_Luther_King_Jr_National_Historic_Site_%2836233249121%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-79",
    text: "In December 1955 in Montgomery, Alabama, whose refusal to give up her bus seat to a white passenger ignited the Montgomery Bus Boycott?",
    options: [
      "Rosa Parks",
      "Claudette Colvin",
      "Fannie Lou Hamer",
      "Coretta Scott King"
],
    correctAnswer: "Rosa Parks",
    category: "Modern Era & World Wars",
    year: "1955",
    fact: "Known as 'the first lady of civil rights', her courage resulted in the Supreme Court declaring segregated buses unconstitutional.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b1/Rosa_Parks%2C_November_1956_%28cropped%29.jpg/330px-Rosa_Parks%2C_November_1956_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-80",
    text: "After 27 years of imprisonment on Robben Island and elsewhere, who was elected South Africa's first democratically elected Black president in 1994?",
    options: [
      "Nelson Mandela",
      "Desmond Tutu",
      "Steve Biko",
      "Oliver Tambo"
],
    correctAnswer: "Nelson Mandela",
    category: "Modern Era & World Wars",
    year: "1994",
    fact: "Mandela was awarded the 1993 Nobel Peace Prize jointly with F. W. de Klerk for peacefully dismantling apartheid.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/02/Nelson_Mandela_1994.jpg/330px-Nelson_Mandela_1994.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-81",
    text: "On October 4, 1957, which beach-ball sized artificial satellite was launched into orbit by the Soviet Union, inaugurating the Space Race?",
    options: [
      "Sputnik 1",
      "Vostok 1",
      "Explorer 1",
      "Luna 2"
],
    correctAnswer: "Sputnik 1",
    category: "Modern Era & World Wars",
    year: "1957",
    fact: "Sputnik orbited Earth every 96 minutes, transmitting radio beeps that were picked up by amateur radio operators worldwide.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b7/%D0%9F%D0%B5%D1%80%D0%B2%D1%8B%D0%B9_%D0%B2_%D0%BC%D0%B8%D1%80%D0%B5_%D0%B8%D1%81%D0%BA%D1%83%D1%81%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B9_%D1%81%D0%BF%D1%83%D1%82%D0%BD%D0%B8%D0%BA_%D0%97%D0%B5%D0%BC%D0%BB%D0%B8.jpg/330px-%D0%9F%D0%B5%D1%80%D0%B2%D1%8B%D0%B9_%D0%B2_%D0%BC%D0%B8%D1%80%D0%B5_%D0%B8%D1%81%D0%BA%D1%83%D1%81%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B9_%D1%81%D0%BF%D1%83%D1%82%D0%BD%D0%B8%D0%BA_%D0%97%D0%B5%D0%BC%D0%BB%D0%B8.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-82",
    text: "On July 20, 1969, who became the first human being to step onto the lunar surface during NASA's Apollo 11 mission?",
    options: [
      "Neil Armstrong",
      "Buzz Aldrin",
      "Michael Collins",
      "Alan Shepard"
],
    correctAnswer: "Neil Armstrong",
    category: "Modern Era & World Wars",
    year: "1969",
    fact: "As he stepped onto the Sea of Tranquility, Armstrong declared: 'That\\'s one small step for [a] man, one giant leap for mankind.'",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/41/A_Man_on_the_Moon%2C_AS11-40-5903_%28cropped%29.jpg/330px-A_Man_on_the_Moon%2C_AS11-40-5903_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-83",
    text: "In October 1962, which intense 13-day superpower standoff over Soviet nuclear missiles stationed 90 miles from Florida brought the world to the brink of nuclear war?",
    options: [
      "The Cuban Missile Crisis",
      "The Berlin Blockade",
      "The Suez Crisis",
      "The Gulf of Tonkin"
],
    correctAnswer: "The Cuban Missile Crisis",
    category: "Modern Era & World Wars",
    year: "1962",
    fact: "The crisis was defused through secret diplomacy between US President John F. Kennedy and Soviet Premier Nikita Khrushchev.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8a/PGM-19A_Jupiter_missile-02.jpg/330px-PGM-19A_Jupiter_missile-02.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "hist-84",
    text: "On the night of November 9, 1989, which iconic barrier dividing East and West Berlin was breached and torn down, heralding the end of the Cold War?",
    options: [
      "The Berlin Wall",
      "The Iron Curtain",
      "The Maginot Line",
      "The Siegfried Line"
],
    correctAnswer: "The Berlin Wall",
    category: "Modern Era & World Wars",
    year: "1989",
    fact: "Erected in 1961, the 155 km concrete wall stood for 28 years before being dismantled amid joyous celebrations.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1c/West_and_East_Germans_at_the_Brandenburg_Gate_in_1989.jpg/330px-West_and_East_Germans_at_the_Brandenburg_Gate_in_1989.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  }
];

export function getHistoryQuestionsByEra(
  era?: HistoryEra | HistoryEra[] | Set<HistoryEra> | 'all',
): HistoryQuestionItem[] {
  if (!era || era === 'all') {
    return WORLD_HISTORY_QUESTIONS;
  }
  if (Array.isArray(era)) {
    const set = new Set(era);
    return WORLD_HISTORY_QUESTIONS.filter((q) => set.has(q.category));
  }
  if (era instanceof Set) {
    return WORLD_HISTORY_QUESTIONS.filter((q) => era.has(q.category));
  }
  return WORLD_HISTORY_QUESTIONS.filter((q) => q.category === era);
}
