// Auto-generated Holy Bible and Jesus Christ Scripture Dataset
// 100% Biblically Accurate, Reverent, and Engaging for Believers & Scholars

export type BibleCategory =
  | 'Gospels & Jesus'
  | 'Old Testament'
  | 'New Testament & Acts'
  | 'Verses & Wisdom';

export const BIBLE_CATEGORIES: BibleCategory[] = [
  'Gospels & Jesus',
  'Old Testament',
  'New Testament & Acts',
  'Verses & Wisdom',
];

export interface BibleQuestionItem {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  category: BibleCategory;
  verseRef?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl?: string;
}

export const WORLD_BIBLE_QUESTIONS: BibleQuestionItem[] = [
  {
    "id": "bible-01",
    "text": "In which town was Jesus Christ born, fulfilling the prophecy of Micah 5:2?",
    "options": [
      "Bethlehem",
      "Nazareth",
      "Jerusalem",
      "Capernaum"
    ],
    "correctAnswer": "Bethlehem",
    "category": "Gospels & Jesus",
    "verseRef": "Luke 2:4-7 / Micah 5:2",
    "difficulty": "easy",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f9/Adoration_of_the_sheperds_-_Matthias_Stomer.jpg/330px-Adoration_of_the_sheperds_-_Matthias_Stomer.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "id": "bible-02",
    "text": "In what town did Jesus grow up and spend His youth with Mary and Joseph?",
    "options": [
      "Nazareth",
      "Bethlehem",
      "Jericho",
      "Bethany"
    ],
    "correctAnswer": "Nazareth",
    "category": "Gospels & Jesus",
    "verseRef": "Matthew 2:23 / Luke 2:51",
    "difficulty": "easy"
  },
  {
    "id": "bible-03",
    "text": "Who baptized Jesus in the Jordan River, declaring 'Behold! The Lamb of God'?",
    "options": [
      "John the Baptist",
      "Simon Peter",
      "The Prophet Elijah",
      "James the Apostle"
    ],
    "correctAnswer": "John the Baptist",
    "category": "Gospels & Jesus",
    "verseRef": "Matthew 3:13-17 / John 1:29",
    "difficulty": "easy"
  },
  {
    "id": "bible-04",
    "text": "What was the very first miracle performed by Jesus recorded in the Gospel of John?",
    "options": [
      "Turning water into wine at the wedding in Cana",
      "Healing the blind man at the pool of Siloam",
      "Walking on the waters of the Sea of Galilee",
      "Feeding the 5,000 with loaves and fish"
    ],
    "correctAnswer": "Turning water into wine at the wedding in Cana",
    "category": "Gospels & Jesus",
    "verseRef": "John 2:1-11",
    "difficulty": "easy"
  },
  {
    "id": "bible-05",
    "text": "How many days and nights did Jesus fast in the wilderness while resisting the devil's temptations?",
    "options": [
      "40 days and 40 nights",
      "7 days and 7 nights",
      "12 days and 12 nights",
      "50 days and 50 nights"
    ],
    "correctAnswer": "40 days and 40 nights",
    "category": "Gospels & Jesus",
    "verseRef": "Matthew 4:1-2",
    "difficulty": "easy"
  },
  {
    "id": "bible-06",
    "text": "On which body of water did Jesus walk during the night and invite Peter to step out of the boat?",
    "options": [
      "Sea of Galilee",
      "Dead Sea",
      "River Jordan",
      "Mediterranean Sea"
    ],
    "correctAnswer": "Sea of Galilee",
    "category": "Gospels & Jesus",
    "verseRef": "Matthew 14:22-33",
    "difficulty": "easy",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f3/Rembrandt_Christ_in_the_Storm_on_the_Lake_of_Galilee.jpg/330px-Rembrandt_Christ_in_the_Storm_on_the_Lake_of_Galilee.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "id": "bible-07",
    "text": "With what food did Jesus miraculously feed a multitude of 5,000 men besides women and children?",
    "options": [
      "5 loaves of bread and 2 fish",
      "7 loaves of bread and 3 fish",
      "12 loaves of barley and 4 fish",
      "3 loaves of bread and 5 fish"
    ],
    "correctAnswer": "5 loaves of bread and 2 fish",
    "category": "Gospels & Jesus",
    "verseRef": "Matthew 14:13-21",
    "difficulty": "easy"
  },
  {
    "id": "bible-08",
    "text": "What friend of Jesus was raised from the dead in Bethany after being in the tomb for four days?",
    "options": [
      "Lazarus",
      "Nicodemus",
      "Jairus",
      "Zacchaeus"
    ],
    "correctAnswer": "Lazarus",
    "category": "Gospels & Jesus",
    "verseRef": "John 11:1-44",
    "difficulty": "easy"
  },
  {
    "id": "bible-09",
    "text": "In the Sermon on the Mount, what series of blessings did Jesus teach, beginning with 'Blessed are the poor in spirit'?",
    "options": [
      "The Beatitudes",
      "The Decalogue",
      "The Canticles",
      "The Levitical Blessings"
    ],
    "correctAnswer": "The Beatitudes",
    "category": "Gospels & Jesus",
    "verseRef": "Matthew 5:3-12",
    "difficulty": "easy",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/96/Bloch-SermonOnTheMount.jpg/330px-Bloch-SermonOnTheMount.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "id": "bible-10",
    "text": "When the disciples asked Jesus 'Lord, teach us to pray', what prayer did He give them?",
    "options": [
      "The Lord's Prayer (Our Father)",
      "The Shema",
      "The Magnificat",
      "The Prayer of Jabez"
    ],
    "correctAnswer": "The Lord's Prayer (Our Father)",
    "category": "Gospels & Jesus",
    "verseRef": "Matthew 6:9-13 / Luke 11:1-4",
    "difficulty": "easy"
  },
  {
    "id": "bible-11",
    "text": "In the Parable of the Good Samaritan, who showed true mercy to the beaten traveler on the road to Jericho?",
    "options": [
      "A Samaritan",
      "A Priest",
      "A Levite",
      "A Roman Soldier"
    ],
    "correctAnswer": "A Samaritan",
    "category": "Gospels & Jesus",
    "verseRef": "Luke 10:25-37",
    "difficulty": "easy"
  },
  {
    "id": "bible-12",
    "text": "In the Parable of the Prodigal Son, what did the father do when he saw his returning son from afar?",
    "options": [
      "He was filled with compassion, ran to him, and embraced him",
      "He sent his servants to turn him away at the gate",
      "He commanded him to pay back every lost penny first",
      "He ordered him to live outside the household as a stranger"
    ],
    "correctAnswer": "He was filled with compassion, ran to him, and embraced him",
    "category": "Gospels & Jesus",
    "verseRef": "Luke 15:11-32",
    "difficulty": "easy",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/93/Rembrandt_Harmensz_van_Rijn_-_Return_of_the_Prodigal_Son_-_Google_Art_Project.jpg/330px-Rembrandt_Harmensz_van_Rijn_-_Return_of_the_Prodigal_Son_-_Google_Art_Project.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "id": "bible-13",
    "text": "What type of tree did the short tax collector Zacchaeus climb in Jericho in order to see Jesus?",
    "options": [
      "Sycamore-fig tree",
      "Olive tree",
      "Cedar of Lebanon",
      "Pomegranate tree"
    ],
    "correctAnswer": "Sycamore-fig tree",
    "category": "Gospels & Jesus",
    "verseRef": "Luke 19:1-10",
    "difficulty": "medium"
  },
  {
    "id": "bible-14",
    "text": "How many apostles did Jesus select as His inner foundational circle of followers?",
    "options": [
      "12",
      "7",
      "10",
      "70"
    ],
    "correctAnswer": "12",
    "category": "Gospels & Jesus",
    "verseRef": "Matthew 10:1-4",
    "difficulty": "easy"
  },
  {
    "id": "bible-15",
    "text": "Which disciple betrayed Jesus in the Garden of Gethsemane with a kiss for thirty silver coins?",
    "options": [
      "Judas Iscariot",
      "Thomas",
      "Simon the Zealot",
      "Bartholomew"
    ],
    "correctAnswer": "Judas Iscariot",
    "category": "Gospels & Jesus",
    "verseRef": "Matthew 26:14-16, 47-50",
    "difficulty": "easy"
  },
  {
    "id": "bible-16",
    "text": "Which apostle denied knowing Jesus three times before the rooster crowed, weeping bitterly afterward?",
    "options": [
      "Peter",
      "John",
      "Andrew",
      "Philip"
    ],
    "correctAnswer": "Peter",
    "category": "Gospels & Jesus",
    "verseRef": "Matthew 26:69-75",
    "difficulty": "easy"
  },
  {
    "id": "bible-17",
    "text": "In which garden on the Mount of Olives did Jesus pray with agonized sweat before His arrest?",
    "options": [
      "Garden of Gethsemane",
      "Garden of Eden",
      "Garden of Bethany",
      "Garden of Siloam"
    ],
    "correctAnswer": "Garden of Gethsemane",
    "category": "Gospels & Jesus",
    "verseRef": "Matthew 26:36 / Luke 22:44",
    "difficulty": "easy"
  },
  {
    "id": "bible-18",
    "text": "What meal did Jesus share with His disciples where He instituted the bread and cup of the New Covenant?",
    "options": [
      "The Last Supper",
      "The Feast of Tabernacles",
      "The Wedding Feast of Cana",
      "The Breakfast on the Shore"
    ],
    "correctAnswer": "The Last Supper",
    "category": "Gospels & Jesus",
    "verseRef": "Matthew 26:26-29 / Luke 22:19-20",
    "difficulty": "easy",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/48/The_Last_Supper_-_Leonardo_Da_Vinci_-_High_Resolution_32x16.jpg/330px-The_Last_Supper_-_Leonardo_Da_Vinci_-_High_Resolution_32x16.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "id": "bible-19",
    "text": "What was the name of the Roman governor who washed his hands and handed Jesus over to be crucified?",
    "options": [
      "Pontius Pilate",
      "Herod Antipas",
      "Felix",
      "Festus"
    ],
    "correctAnswer": "Pontius Pilate",
    "category": "Gospels & Jesus",
    "verseRef": "Matthew 27:1-26",
    "difficulty": "easy"
  },
  {
    "id": "bible-20",
    "text": "What is the Hebrew/Aramaic name of the place outside Jerusalem where Jesus was crucified, meaning 'The Place of the Skull'?",
    "options": [
      "Golgotha",
      "Gethsemane",
      "Bethesda",
      "Moriah"
    ],
    "correctAnswer": "Golgotha",
    "category": "Gospels & Jesus",
    "verseRef": "John 19:17",
    "difficulty": "medium"
  },
  {
    "id": "bible-21",
    "text": "On which day after His crucifixion did Jesus rise triumphantly from the dead?",
    "options": [
      "The third day",
      "The seventh day",
      "The fortieth day",
      "The second day"
    ],
    "correctAnswer": "The third day",
    "category": "Gospels & Jesus",
    "verseRef": "Luke 24:1-7 / 1 Corinthians 15:3-4",
    "difficulty": "easy",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ef/Rafael_-_ressureicaocristo01.jpg/330px-Rafael_-_ressureicaocristo01.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "id": "bible-22",
    "text": "Who was the first person to encounter the risen Jesus outside the empty garden tomb on Easter morning?",
    "options": [
      "Mary Magdalene",
      "Simon Peter",
      "John the Apostle",
      "Nicodemus"
    ],
    "correctAnswer": "Mary Magdalene",
    "category": "Gospels & Jesus",
    "verseRef": "John 20:11-18",
    "difficulty": "easy"
  },
  {
    "id": "bible-23",
    "text": "Which disciple insisted that he would not believe unless he saw and touched the nail marks in Jesus's hands?",
    "options": [
      "Thomas",
      "Matthew",
      "Thaddaeus",
      "Nathanael"
    ],
    "correctAnswer": "Thomas",
    "category": "Gospels & Jesus",
    "verseRef": "John 20:24-29",
    "difficulty": "easy"
  },
  {
    "id": "bible-24",
    "text": "According to John 14:6, how did Jesus famously describe His identity?",
    "options": [
      "'I am the way, the truth, and the life; no one comes to the Father except through Me'",
      "'I am the conqueror of empires and kingdoms'",
      "'I am the high judge of earthly wealth'",
      "'I am the lawgiver like Moses of old'"
    ],
    "correctAnswer": "'I am the way, the truth, and the life; no one comes to the Father except through Me'",
    "category": "Gospels & Jesus",
    "verseRef": "John 14:6",
    "difficulty": "easy"
  },
  {
    "id": "bible-25",
    "text": "According to John 10:11, how does Jesus describe Himself as the protector of believers?",
    "options": [
      "'I am the good shepherd. The good shepherd gives His life for the sheep.'",
      "'I am the builder who makes towering cities'",
      "'I am the master of merchants and trade'",
      "'I am the general over legions of chariots'"
    ],
    "correctAnswer": "'I am the good shepherd. The good shepherd gives His life for the sheep.'",
    "category": "Gospels & Jesus",
    "verseRef": "John 10:11",
    "difficulty": "easy",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/15/Rom%2C_Domitilla-Katakomben%2C_Der_gute_Hirte.jpg/330px-Rom%2C_Domitilla-Katakomben%2C_Der_gute_Hirte.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "id": "bible-26",
    "text": "What miracle did Jesus perform when a violent squall threatened to drown His disciples on the lake?",
    "options": [
      "He rebuked the wind and sea, saying 'Peace, be still!' and there was a great calm",
      "He told them to throw their cargo into the deep",
      "He swam to shore dragging the boat behind Him",
      "He called down rain to dilute the waves"
    ],
    "correctAnswer": "He rebuked the wind and sea, saying 'Peace, be still!' and there was a great calm",
    "category": "Gospels & Jesus",
    "verseRef": "Mark 4:35-41",
    "difficulty": "easy"
  },
  {
    "id": "bible-27",
    "text": "How many days after His resurrection did Jesus ascend into Heaven in the sight of His disciples?",
    "options": [
      "40 days",
      "3 days",
      "7 days",
      "50 days"
    ],
    "correctAnswer": "40 days",
    "category": "Gospels & Jesus",
    "verseRef": "Acts 1:3",
    "difficulty": "medium"
  },
  {
    "id": "bible-28",
    "text": "In the Parable of the Lost Sheep, what does the shepherd do when one of his hundred sheep wanders away?",
    "options": [
      "He leaves the ninety-nine in the open country to search for the lost one until he finds it",
      "He writes off the loss and buys another sheep",
      "He scolds the flock and closes the pen",
      "He waits until nightfall to see if it returns alone"
    ],
    "correctAnswer": "He leaves the ninety-nine in the open country to search for the lost one until he finds it",
    "category": "Gospels & Jesus",
    "verseRef": "Luke 15:3-7",
    "difficulty": "easy"
  },
  {
    "id": "bible-29",
    "text": "What words of forgiveness did Jesus speak from the cross regarding His executioners in Luke 23:34?",
    "options": [
      "'Father, forgive them, for they do not know what they do.'",
      "'May judgment fall swiftly upon this land.'",
      "'Remember my disciples in Galilee.'",
      "'Behold, my kingdom has departed from you.'"
    ],
    "correctAnswer": "'Father, forgive them, for they do not know what they do.'",
    "category": "Gospels & Jesus",
    "verseRef": "Luke 23:34",
    "difficulty": "easy"
  },
  {
    "id": "bible-30",
    "text": "What Roman centurion who stood at the foot of the cross exclaimed at Jesus's death: 'Truly this was the Son of God!'?",
    "options": [
      "The Roman centurion guarding the crucifixion",
      "Pontius Pilate the governor",
      "Nicodemus the Pharisee",
      "Joseph of Arimathea"
    ],
    "correctAnswer": "The Roman centurion guarding the crucifixion",
    "category": "Gospels & Jesus",
    "verseRef": "Matthew 27:54 / Mark 15:39",
    "difficulty": "medium"
  },
  {
    "id": "bible-31",
    "text": "In Genesis chapter 1, on how many days did God complete the creation of the heavens, earth, and all life before resting on the seventh day?",
    "options": [
      "6 days",
      "7 days",
      "10 days",
      "40 days"
    ],
    "correctAnswer": "6 days",
    "category": "Old Testament",
    "verseRef": "Genesis 1:1 - 2:3",
    "difficulty": "easy",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5b/Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg/330px-Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "id": "bible-32",
    "text": "Who was the first man created by God in the Garden of Eden?",
    "options": [
      "Adam",
      "Noah",
      "Abraham",
      "Enoch"
    ],
    "correctAnswer": "Adam",
    "category": "Old Testament",
    "verseRef": "Genesis 2:7",
    "difficulty": "easy"
  },
  {
    "id": "bible-33",
    "text": "What sign in the clouds did God give to Noah as an everlasting covenant promise never to destroy all life by flood again?",
    "options": [
      "The Rainbow",
      "A pillar of cloud",
      "A shooting star",
      "A golden halo"
    ],
    "correctAnswer": "The Rainbow",
    "category": "Old Testament",
    "verseRef": "Genesis 9:12-17",
    "difficulty": "easy"
  },
  {
    "id": "bible-34",
    "text": "Who is known as the 'Father of Faith', to whom God promised that his descendants would be as numerous as the stars of heaven?",
    "options": [
      "Abraham",
      "Moses",
      "David",
      "Solomon"
    ],
    "correctAnswer": "Abraham",
    "category": "Old Testament",
    "verseRef": "Genesis 15:5-6 / Genesis 17:5",
    "difficulty": "easy"
  },
  {
    "id": "bible-35",
    "text": "What son was miraculously born to Abraham and Sarah in their old age according to God's promise?",
    "options": [
      "Isaac",
      "Ishmael",
      "Jacob",
      "Esau"
    ],
    "correctAnswer": "Isaac",
    "category": "Old Testament",
    "verseRef": "Genesis 21:1-3",
    "difficulty": "easy"
  },
  {
    "id": "bible-36",
    "text": "Which son of Jacob was given an ornate coat of many colors and was later sold by his brothers into Egypt?",
    "options": [
      "Joseph",
      "Judah",
      "Benjamin",
      "Reuben"
    ],
    "correctAnswer": "Joseph",
    "category": "Old Testament",
    "verseRef": "Genesis 37:3-28",
    "difficulty": "easy"
  },
  {
    "id": "bible-37",
    "text": "Through what miraculous sight in the desert of Horeb did God first call Moses to deliver His people?",
    "options": [
      "A bush that burned with fire yet was not consumed",
      "A whirlwind carrying a chariot of fire",
      "A pillar of light rising from a mountain spring",
      "A golden tablet falling from the clouds"
    ],
    "correctAnswer": "A bush that burned with fire yet was not consumed",
    "category": "Old Testament",
    "verseRef": "Exodus 3:1-4",
    "difficulty": "easy"
  },
  {
    "id": "bible-38",
    "text": "How many plagues did God send upon Egypt before Pharaoh finally allowed the Israelites to leave?",
    "options": [
      "10 plagues",
      "7 plagues",
      "12 plagues",
      "40 plagues"
    ],
    "correctAnswer": "10 plagues",
    "category": "Old Testament",
    "verseRef": "Exodus 7 - 12",
    "difficulty": "easy"
  },
  {
    "id": "bible-39",
    "text": "What body of water did Moses stretch out his hand over, which God divided so the Israelites crossed on dry ground?",
    "options": [
      "The Red Sea",
      "The Jordan River",
      "The Dead Sea",
      "The Nile River"
    ],
    "correctAnswer": "The Red Sea",
    "category": "Old Testament",
    "verseRef": "Exodus 14:21-22",
    "difficulty": "easy"
  },
  {
    "id": "bible-40",
    "text": "On which holy mountain did God give Moses the Ten Commandments inscribed on two tablets of stone?",
    "options": [
      "Mount Sinai",
      "Mount Nebo",
      "Mount Carmel",
      "Mount Ararat"
    ],
    "correctAnswer": "Mount Sinai",
    "category": "Old Testament",
    "verseRef": "Exodus 19 - 20",
    "difficulty": "easy",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/58/0001_FL9694984.jpg/330px-0001_FL9694984.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "id": "bible-41",
    "text": "What miraculous bread from heaven did God rain down daily to nourish the Israelites during their 40 years in the desert?",
    "options": [
      "Manna",
      "Unleavened cakes",
      "Coriander bread",
      "Showbread"
    ],
    "correctAnswer": "Manna",
    "category": "Old Testament",
    "verseRef": "Exodus 16:14-31",
    "difficulty": "easy"
  },
  {
    "id": "bible-42",
    "text": "The massive fortified walls of which city fell flat after Joshua and the Israelites marched around them for seven days?",
    "options": [
      "Jericho",
      "Ai",
      "Hebron",
      "Gibeon"
    ],
    "correctAnswer": "Jericho",
    "category": "Old Testament",
    "verseRef": "Joshua 6:1-20",
    "difficulty": "easy"
  },
  {
    "id": "bible-43",
    "text": "What young shepherd boy defeated the nine-foot Philistine champion Goliath using only a sling and five smooth stones?",
    "options": [
      "David",
      "Jonathan",
      "Saul",
      "Gideon"
    ],
    "correctAnswer": "David",
    "category": "Old Testament",
    "verseRef": "1 Samuel 17:40-50",
    "difficulty": "easy",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f6/David_with_the_Head_of_Goliath-Caravaggio_%281610%29.jpg/330px-David_with_the_Head_of_Goliath-Caravaggio_%281610%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "id": "bible-44",
    "text": "What musical instrument did young David play skillfully to bring peace to King Saul when troubled by a distressing spirit?",
    "options": [
      "The Harp (Lyre)",
      "The Trumpet",
      "The Flute",
      "The Cymbals"
    ],
    "correctAnswer": "The Harp (Lyre)",
    "category": "Old Testament",
    "verseRef": "1 Samuel 16:23",
    "difficulty": "medium"
  },
  {
    "id": "bible-45",
    "text": "Which son of King David asked God for wisdom and understanding to govern His people, and built the First Temple in Jerusalem?",
    "options": [
      "King Solomon",
      "Absalom",
      "Adonijah",
      "Rehoboam"
    ],
    "correctAnswer": "King Solomon",
    "category": "Old Testament",
    "verseRef": "1 Kings 3:5-14 / 1 Kings 6:1",
    "difficulty": "easy"
  },
  {
    "id": "bible-46",
    "text": "Which prophet confronted 450 false prophets of Baal on Mount Carmel, where God answered with consuming fire from heaven?",
    "options": [
      "Elijah",
      "Elisha",
      "Isaiah",
      "Jeremiah"
    ],
    "correctAnswer": "Elijah",
    "category": "Old Testament",
    "verseRef": "1 Kings 18:20-40",
    "difficulty": "easy"
  },
  {
    "id": "bible-47",
    "text": "Which prophet was swallowed by a great fish after trying to flee from God's instruction to preach in Nineveh?",
    "options": [
      "Jonah",
      "Amos",
      "Micah",
      "Habakkuk"
    ],
    "correctAnswer": "Jonah",
    "category": "Old Testament",
    "verseRef": "Jonah 1 - 2",
    "difficulty": "easy"
  },
  {
    "id": "bible-48",
    "text": "Which Hebrew prophet was cast into a den of hungry lions for praying to God, but was unharmed because God shut the lions' mouths?",
    "options": [
      "Daniel",
      "Ezekiel",
      "Jeremiah",
      "Nehemiah"
    ],
    "correctAnswer": "Daniel",
    "category": "Old Testament",
    "verseRef": "Daniel 6:1-24",
    "difficulty": "easy"
  },
  {
    "id": "bible-49",
    "text": "What were the Babylonian names of Daniel's three companions who were thrown into the blazing furnace and walked out unburned?",
    "options": [
      "Shadrach, Meshach, and Abednego",
      "Shem, Ham, and Japheth",
      "Peter, James, and John",
      "Caleb, Joshua, and Phinehas"
    ],
    "correctAnswer": "Shadrach, Meshach, and Abednego",
    "category": "Old Testament",
    "verseRef": "Daniel 3:1-30",
    "difficulty": "easy"
  },
  {
    "id": "bible-50",
    "text": "Which brave Jewish queen risked her life to plead before the Persian King Xerxes to save her people from Haman's plot?",
    "options": [
      "Queen Esther",
      "Ruth",
      "Deborah",
      "Hannah"
    ],
    "correctAnswer": "Queen Esther",
    "category": "Old Testament",
    "verseRef": "Esther 4 - 8",
    "difficulty": "easy"
  },
  {
    "id": "bible-51",
    "text": "Which devoted Moabite daughter-in-law declared to Naomi: 'Your people shall be my people, and your God, my God'?",
    "options": [
      "Ruth",
      "Orpah",
      "Rahab",
      "Michal"
    ],
    "correctAnswer": "Ruth",
    "category": "Old Testament",
    "verseRef": "Ruth 1:16",
    "difficulty": "easy"
  },
  {
    "id": "bible-52",
    "text": "Who was the mighty judge of Israel whose supernatural physical strength was bound to his Nazarite vow and uncut hair?",
    "options": [
      "Samson",
      "Gideon",
      "Jephthah",
      "Barak"
    ],
    "correctAnswer": "Samson",
    "category": "Old Testament",
    "verseRef": "Judges 16:17",
    "difficulty": "easy"
  },
  {
    "id": "bible-53",
    "text": "Which judge of Israel laid out a fleece of wool on the threshing floor to confirm God's sign that he would save Israel?",
    "options": [
      "Gideon",
      "Samson",
      "Othniel",
      "Ehud"
    ],
    "correctAnswer": "Gideon",
    "category": "Old Testament",
    "verseRef": "Judges 6:36-40",
    "difficulty": "medium"
  },
  {
    "id": "bible-54",
    "text": "Who was taken up to heaven in a whirlwind accompanied by a chariot and horses of fire?",
    "options": [
      "Elijah",
      "Elisha",
      "Moses",
      "Samuel"
    ],
    "correctAnswer": "Elijah",
    "category": "Old Testament",
    "verseRef": "2 Kings 2:11",
    "difficulty": "medium"
  },
  {
    "id": "bible-55",
    "text": "What faithful man lost his livestock, family, and health, yet blessed God saying 'The Lord gave, and the Lord has taken away; blessed be the name of the Lord'?",
    "options": [
      "Job",
      "Jeremiah",
      "Habakkuk",
      "Hosea"
    ],
    "correctAnswer": "Job",
    "category": "Old Testament",
    "verseRef": "Job 1:20-22",
    "difficulty": "easy"
  },
  {
    "id": "bible-56",
    "text": "On what feast day in Jerusalem was the Holy Spirit poured out with the sound of a rushing mighty wind and divided tongues of fire?",
    "options": [
      "The Day of Pentecost",
      "The Feast of Passover",
      "The Feast of Trumpets",
      "The Day of Atonement"
    ],
    "correctAnswer": "The Day of Pentecost",
    "category": "New Testament & Acts",
    "verseRef": "Acts 2:1-4",
    "difficulty": "easy"
  },
  {
    "id": "bible-57",
    "text": "What Roman citizen and persecutor of the church saw a blinding light and heard the voice of Jesus on the road to Damascus?",
    "options": [
      "Saul of Tarsus (Paul)",
      "Barnabas",
      "Silas",
      "Cornelius"
    ],
    "correctAnswer": "Saul of Tarsus (Paul)",
    "category": "New Testament & Acts",
    "verseRef": "Acts 9:1-19",
    "difficulty": "easy"
  },
  {
    "id": "bible-58",
    "text": "Who was the first Christian deacon and martyr, who prayed 'Lord Jesus, receive my spirit' as he was being stoned?",
    "options": [
      "Stephen",
      "Philip",
      "Prochorus",
      "Nicanor"
    ],
    "correctAnswer": "Stephen",
    "category": "New Testament & Acts",
    "verseRef": "Acts 7:54-60",
    "difficulty": "easy"
  },
  {
    "id": "bible-59",
    "text": "What devout Roman centurion in Caesarea became the first Gentile convert to receive the Holy Spirit after Peter preached in his home?",
    "options": [
      "Cornelius",
      "Julius",
      "Claudius Lysias",
      "Sergius Paulus"
    ],
    "correctAnswer": "Cornelius",
    "category": "New Testament & Acts",
    "verseRef": "Acts 10:1-48",
    "difficulty": "medium"
  },
  {
    "id": "bible-60",
    "text": "In what major Syrian city were the disciples of Jesus first called 'Christians'?",
    "options": [
      "Antioch",
      "Jerusalem",
      "Rome",
      "Ephesus"
    ],
    "correctAnswer": "Antioch",
    "category": "New Testament & Acts",
    "verseRef": "Acts 11:26",
    "difficulty": "medium"
  },
  {
    "id": "bible-61",
    "text": "What young co-worker of the Apostle Paul was commended for the genuine faith he inherited from his grandmother Lois and mother Eunice?",
    "options": [
      "Timothy",
      "Titus",
      "Philemon",
      "Epaphroditus"
    ],
    "correctAnswer": "Timothy",
    "category": "New Testament & Acts",
    "verseRef": "2 Timothy 1:5",
    "difficulty": "medium"
  },
  {
    "id": "bible-62",
    "text": "How many total books are in the New Testament of the Christian Bible?",
    "options": [
      "27 books",
      "39 books",
      "66 books",
      "12 books"
    ],
    "correctAnswer": "27 books",
    "category": "New Testament & Acts",
    "verseRef": "Biblical Canon",
    "difficulty": "easy"
  },
  {
    "id": "bible-63",
    "text": "Which apostle was in exile on the island of Patmos when he received and wrote down the Book of Revelation?",
    "options": [
      "John the Apostle",
      "Peter",
      "Paul",
      "Jude"
    ],
    "correctAnswer": "John the Apostle",
    "category": "New Testament & Acts",
    "verseRef": "Revelation 1:9",
    "difficulty": "easy"
  },
  {
    "id": "bible-64",
    "text": "According to 1 Corinthians 13:13, what three virtues abide, and which of them is explicitly named the greatest?",
    "options": [
      "Faith, hope, and love; but the greatest of these is love",
      "Patience, peace, and truth; the greatest is truth",
      "Righteousness, fasting, and almsgiving; the greatest is fasting",
      "Wisdom, courage, and zeal; the greatest is zeal"
    ],
    "correctAnswer": "Faith, hope, and love; but the greatest of these is love",
    "category": "New Testament & Acts",
    "verseRef": "1 Corinthians 13:13",
    "difficulty": "easy"
  },
  {
    "id": "bible-65",
    "text": "According to Galatians 5:22-23, what is the very first characteristic named in the Fruit of the Spirit?",
    "options": [
      "Love",
      "Joy",
      "Peace",
      "Self-control"
    ],
    "correctAnswer": "Love",
    "category": "New Testament & Acts",
    "verseRef": "Galatians 5:22-23",
    "difficulty": "easy"
  },
  {
    "id": "bible-66",
    "text": "In Ephesians 6:11-17, what spiritual armor are believers urged to put on to withstand the schemes of darkness?",
    "options": [
      "The Whole Armor of God (Belt of Truth, Breastplate of Righteousness, Shield of Faith, Sword of the Spirit)",
      "The Robe of David and Crown of Solomon",
      "The Chariots of Elijah and Fire of Mount Carmel",
      "The Staff of Moses and Ark of the Covenant"
    ],
    "correctAnswer": "The Whole Armor of God (Belt of Truth, Breastplate of Righteousness, Shield of Faith, Sword of the Spirit)",
    "category": "New Testament & Acts",
    "verseRef": "Ephesians 6:11-17",
    "difficulty": "easy"
  },
  {
    "id": "bible-67",
    "text": "Which physician traveled with the Apostle Paul on missionary journeys and authored both a Gospel and the Book of Acts?",
    "options": [
      "Luke",
      "Mark",
      "Matthew",
      "Apollos"
    ],
    "correctAnswer": "Luke",
    "category": "New Testament & Acts",
    "verseRef": "Colossians 4:14 / Luke 1:1-4",
    "difficulty": "medium"
  },
  {
    "id": "bible-68",
    "text": "What miraculous event shook the Philippian jail at midnight while Paul and Silas were singing praises to God in chains?",
    "options": [
      "A great earthquake opened all doors and unfastened everyone's chains",
      "A lightning bolt struck down the guards",
      "An angel carried them away in secret to Athens",
      "A sudden flood washed through the cells"
    ],
    "correctAnswer": "A great earthquake opened all doors and unfastened everyone's chains",
    "category": "New Testament & Acts",
    "verseRef": "Acts 16:25-26",
    "difficulty": "easy"
  },
  {
    "id": "bible-69",
    "text": "In 2 Timothy 4:7, what victorious words did the Apostle Paul write as he neared the completion of his earthly life?",
    "options": [
      "'I have fought the good fight, I have finished the race, I have kept the faith.'",
      "'I have gathered great renown across Rome and Greece.'",
      "'My work on earth is done without any trial or tribulation.'",
      "'I look to the kingdoms of the world with pride.'"
    ],
    "correctAnswer": "'I have fought the good fight, I have finished the race, I have kept the faith.'",
    "category": "New Testament & Acts",
    "verseRef": "2 Timothy 4:7",
    "difficulty": "easy"
  },
  {
    "id": "bible-70",
    "text": "On the Island of Malta, what creature fastened onto Paul's hand from the firewood, yet caused him no harm by God's protection?",
    "options": [
      "A poisonous viper",
      "A desert scorpion",
      "A rabid dog",
      "A venomous spider"
    ],
    "correctAnswer": "A poisonous viper",
    "category": "New Testament & Acts",
    "verseRef": "Acts 28:3-5",
    "difficulty": "medium"
  },
  {
    "id": "bible-71",
    "text": "Complete the beloved declaration of God's love in John 3:16: 'For God so loved the world that He gave His only begotten Son, that whoever believes in Him should not perish but have...'",
    "options": [
      "Everlasting life",
      "Worldly wealth",
      "Temporal power",
      "Earthly honor"
    ],
    "correctAnswer": "Everlasting life",
    "category": "Verses & Wisdom",
    "verseRef": "John 3:16",
    "difficulty": "easy"
  },
  {
    "id": "bible-72",
    "text": "How does the famous Psalm of comfort and assurance, Psalm 23, open?",
    "options": [
      "'The Lord is my shepherd; I shall not want.'",
      "'The earth is the Lord's, and all its fullness.'",
      "'I will lift up my eyes to the hills.'",
      "'God is our refuge and strength, a very present help in trouble.'"
    ],
    "correctAnswer": "'The Lord is my shepherd; I shall not want.'",
    "category": "Verses & Wisdom",
    "verseRef": "Psalm 23:1",
    "difficulty": "easy"
  },
  {
    "id": "bible-73",
    "text": "Complete Proverbs 3:5-6: 'Trust in the Lord with all your heart, and lean not on your own understanding; in all your ways acknowledge Him, and He shall...'",
    "options": [
      "Direct your paths",
      "Multiply your gold",
      "Remove every challenge",
      "Grant you worldly fame"
    ],
    "correctAnswer": "Direct your paths",
    "category": "Verses & Wisdom",
    "verseRef": "Proverbs 3:5-6",
    "difficulty": "easy"
  },
  {
    "id": "bible-74",
    "text": "In Matthew 28:19, in whose Name did Jesus command His followers to baptize all nations?",
    "options": [
      "In the name of the Father and of the Son and of the Holy Spirit",
      "In the name of Moses, Elijah, and the Prophets",
      "In the name of the holy city of Jerusalem",
      "In the name of the Twelve Apostles"
    ],
    "correctAnswer": "In the name of the Father and of the Son and of the Holy Spirit",
    "category": "Verses & Wisdom",
    "verseRef": "Matthew 28:19",
    "difficulty": "easy"
  },
  {
    "id": "bible-75",
    "text": "Complete the declaration of spiritual strength in Philippians 4:13: 'I can do all things through Christ who...'",
    "options": [
      "Strengthens me",
      "Replaces me",
      "Exalts my status",
      "Enriches my treasury"
    ],
    "correctAnswer": "Strengthens me",
    "category": "Verses & Wisdom",
    "verseRef": "Philippians 4:13",
    "difficulty": "easy"
  },
  {
    "id": "bible-76",
    "text": "What comforting invitation did Jesus offer in Matthew 11:28: 'Come to Me, all you who labor and are heavy laden, and I will give you...'",
    "options": [
      "Rest",
      "Wealth",
      "Vengeance",
      "Political victory"
    ],
    "correctAnswer": "Rest",
    "category": "Verses & Wisdom",
    "verseRef": "Matthew 11:28",
    "difficulty": "easy"
  },
  {
    "id": "bible-77",
    "text": "What are the first 10 words of the entire Holy Bible in Genesis 1:1?",
    "options": [
      "'In the beginning God created the heavens and the earth.'",
      "'The earth was formless and void, and darkness was over the deep.'",
      "'Let there be light, and there was light upon the earth.'",
      "'Praise the Lord, all nations; laud Him, all you peoples.'"
    ],
    "correctAnswer": "'In the beginning God created the heavens and the earth.'",
    "category": "Verses & Wisdom",
    "verseRef": "Genesis 1:1",
    "difficulty": "easy"
  },
  {
    "id": "bible-78",
    "text": "According to Romans 8:38-39, what power in heaven, earth, death, or life can separate believers from the love of God in Christ Jesus?",
    "options": [
      "Nothing can separate us",
      "Only our deepest trials",
      "The ruler of this world",
      "Hardship and poverty"
    ],
    "correctAnswer": "Nothing can separate us",
    "category": "Verses & Wisdom",
    "verseRef": "Romans 8:38-39",
    "difficulty": "easy"
  },
  {
    "id": "bible-79",
    "text": "What does Micah 6:8 say that the Lord requires of you: 'to act justly, to love mercy, and to...'",
    "options": [
      "Walk humbly with your God",
      "Conquer many kingdoms",
      "Build temples of cedar and gold",
      "Perform great public signs"
    ],
    "correctAnswer": "Walk humbly with your God",
    "category": "Verses & Wisdom",
    "verseRef": "Micah 6:8",
    "difficulty": "medium"
  },
  {
    "id": "bible-80",
    "text": "Complete Jeremiah 29:11: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you...'",
    "options": [
      "A future and a hope",
      "Immediate ease and wealth",
      "Power over your adversaries",
      "Exemption from every challenge"
    ],
    "correctAnswer": "A future and a hope",
    "category": "Verses & Wisdom",
    "verseRef": "Jeremiah 29:11",
    "difficulty": "easy"
  },
  {
    "id": "bible-81",
    "text": "What assurance did God give Joshua as he prepared to lead the people into the Promised Land in Joshua 1:9?",
    "options": [
      "'Be strong and of good courage; do not be afraid... for the Lord your God is with you wherever you go.'",
      "'Lean on your mighty warriors and trust in their spears.'",
      "'Wait on the mountain until all dangers have passed.'",
      "'Build high stone walls before you cross over.'"
    ],
    "correctAnswer": "'Be strong and of good courage; do not be afraid... for the Lord your God is with you wherever you go.'",
    "category": "Verses & Wisdom",
    "verseRef": "Joshua 1:9",
    "difficulty": "easy"
  },
  {
    "id": "bible-82",
    "text": "According to Matthew 6:33, what did Jesus say we should seek first above all food, clothing, and worry?",
    "options": [
      "Seek first the kingdom of God and His righteousness",
      "Seek first earthly security and stored grain",
      "Seek first the favor of governors and rulers",
      "Seek first knowledge of worldly affairs"
    ],
    "correctAnswer": "Seek first the kingdom of God and His righteousness",
    "category": "Verses & Wisdom",
    "verseRef": "Matthew 6:33",
    "difficulty": "easy"
  }
];

export function getBibleQuestionsByCategory(
  category?: BibleCategory | BibleCategory[] | Set<BibleCategory> | 'all',
): BibleQuestionItem[] {
  if (!category || category === 'all') {
    return WORLD_BIBLE_QUESTIONS;
  }
  if (Array.isArray(category)) {
    const set = new Set(category);
    return WORLD_BIBLE_QUESTIONS.filter((q) => set.has(q.category));
  }
  if (category instanceof Set) {
    return WORLD_BIBLE_QUESTIONS.filter((q) => category.has(q.category));
  }
  return WORLD_BIBLE_QUESTIONS.filter((q) => q.category === category);
}

