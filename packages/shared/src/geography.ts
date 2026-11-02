// Auto-generated Global Geography & Wonders Dataset
// Covers 84 of the world's most famous, universally recognizable natural wonders, rivers, mountains, and landforms.
// Features authentic high-resolution Wikimedia Commons photography thumbnails.

export type GeographyTheme =
  | 'Wonders & Landmarks'
  | 'Rivers, Lakes & Waterfalls'
  | 'Mountains, Oceans & Seas'
  | 'Deserts, Islands & Continents';

export const GEOGRAPHY_THEMES: GeographyTheme[] = [
  'Wonders & Landmarks',
  'Rivers, Lakes & Waterfalls',
  'Mountains, Oceans & Seas',
  'Deserts, Islands & Continents',
];

export interface GeographyQuestionItem {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  category: GeographyTheme;
  location: string;
  fact: string;
  difficulty: 'easy' | 'medium';
  imageUrl: string;
}

export const WORLD_GEOGRAPHY_QUESTIONS: GeographyQuestionItem[] = [
  {
    id: "geo-01",
    text: "What is the highest mountain peak above sea level in the world, located in the Himalayas on the border of Nepal and China?",
    options: [
      "Mount Everest",
      "K2",
      "Mount Kilimanjaro",
      "Mont Blanc"
],
    correctAnswer: "Mount Everest",
    category: "Wonders & Landmarks",
    location: "Nepal / China",
    fact: "Mount Everest stands at an official elevation of 8,848.86 meters (29,031.7 feet) above sea level.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/15/Mt._Everest_from_Gokyo_Ri_November_5%2C_2012.jpg/330px-Mt._Everest_from_Gokyo_Ri_November_5%2C_2012.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-02",
    text: "Which world-famous natural wonder in Arizona, USA, was carved over millions of years by the Colorado River?",
    options: [
      "The Grand Canyon",
      "Bryce Canyon",
      "Monument Valley",
      "Antelope Canyon"
],
    correctAnswer: "The Grand Canyon",
    category: "Wonders & Landmarks",
    location: "Arizona, USA",
    fact: "The Grand Canyon is 446 km long, up to 29 km wide, and attains a depth of over 1,800 meters.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/31/Canyon_River_Tree_%28165872763%29.jpeg/330px-Canyon_River_Tree_%28165872763%29.jpeg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-03",
    text: "Which spectacular set of three massive waterfalls straddles the international border between Canada and the United States?",
    options: [
      "Niagara Falls",
      "Victoria Falls",
      "Iguazu Falls",
      "Angel Falls"
],
    correctAnswer: "Niagara Falls",
    category: "Wonders & Landmarks",
    location: "Canada / USA",
    fact: "Niagara Falls drains Lake Erie into Lake Ontario, producing over 4 million kilowatts of electricity.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ab/3Falls_Niagara.jpg/330px-3Falls_Niagara.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-04",
    text: "Known locally as 'Mosi-oa-Tunya' (The Smoke that Thunders), Victoria Falls is located on which African river?",
    options: [
      "Zambezi River",
      "Nile River",
      "Congo River",
      "Niger River"
],
    correctAnswer: "Zambezi River",
    category: "Wonders & Landmarks",
    location: "Zambia / Zimbabwe",
    fact: "Victoria Falls forms the largest sheet of falling water in the world based on its combined width and height.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/da/Cataratas_Victoria%2C_Zambia-Zimbabue%2C_2018-07-27%2C_DD_04.jpg/330px-Cataratas_Victoria%2C_Zambia-Zimbabue%2C_2018-07-27%2C_DD_04.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-05",
    text: "Which iconic, snow-capped volcano is the tallest mountain in Japan and a sacred cultural symbol?",
    options: [
      "Mount Fuji",
      "Mount Aso",
      "Mount Ontake",
      "Mount Tate"
],
    correctAnswer: "Mount Fuji",
    category: "Wonders & Landmarks",
    location: "Honshu, Japan",
    fact: "Mount Fuji stands at 3,776 meters tall and is an exceptionally symmetrical volcanic cone visible from Tokyo on clear days.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f8/View_of_Mount_Fuji_from_%C5%8Cwakudani_20211202.jpg/330px-View_of_Mount_Fuji_from_%C5%8Cwakudani_20211202.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-06",
    text: "Off the northeastern coast of Australia, what is the largest coral reef system on planet Earth?",
    options: [
      "The Great Barrier Reef",
      "Belize Barrier Reef",
      "Red Sea Coral Reef",
      "Mesoamerican Reef"
],
    correctAnswer: "The Great Barrier Reef",
    category: "Wonders & Landmarks",
    location: "Queensland, Australia",
    fact: "Composed of over 2,900 individual reefs, it is so immense that it can be seen directly from outer space.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4f/ISS-45_StoryOfWater%2C_Great_Barrier_Reef%2C_Australia.jpg/330px-ISS-45_StoryOfWater%2C_Great_Barrier_Reef%2C_Australia.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-07",
    text: "What natural atmospheric light display, also known as the Northern Lights, illuminates the sky in high-latitude polar regions?",
    options: [
      "Aurora Borealis",
      "Zodiacal Light",
      "Solar Flare",
      "Airglow"
],
    correctAnswer: "Aurora Borealis",
    category: "Wonders & Landmarks",
    location: "Arctic Regions",
    fact: "Auroras are caused by solar wind disturbances in Earth's magnetosphere ionizing atoms in the upper atmosphere.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d3/Aurora_borealis_over_Eielson_Air_Force_Base%2C_Alaska.jpg/330px-Aurora_borealis_over_Eielson_Air_Force_Base%2C_Alaska.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-08",
    text: "Bordering Jordan and Israel, which hypersaline lake has a shoreline that marks Earth's lowest land elevation (-430 m)?",
    options: [
      "The Dead Sea",
      "Lake Baikal",
      "Caspian Sea",
      "Lake Retba"
],
    correctAnswer: "The Dead Sea",
    category: "Wonders & Landmarks",
    location: "Jordan / Israel",
    fact: "With a salinity of roughly 34%, the water is nearly ten times saltier than the ocean, allowing swimmers to float effortlessly.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6f/Dead_Sea_beach_00.JPG/330px-Dead_Sea_beach_00.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-09",
    text: "Covering over 5.5 million square kilometers mostly in Brazil, what is the largest tropical rainforest in the world?",
    options: [
      "The Amazon Rainforest",
      "Congo Rainforest",
      "Daintree Rainforest",
      "Borneo Rainforest"
],
    correctAnswer: "The Amazon Rainforest",
    category: "Wonders & Landmarks",
    location: "South America",
    fact: "The Amazon basin represents over half of the planet's remaining rainforests and houses 1 in 10 known species on Earth.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/56/Amazon17_%285641020319%29.jpg/330px-Amazon17_%285641020319%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-10",
    text: "Rising 5,895 meters above the savannah in Tanzania, what is the highest mountain on the continent of Africa?",
    options: [
      "Mount Kilimanjaro",
      "Mount Kenya",
      "Mount Stanley",
      "Atlas Mountains"
],
    correctAnswer: "Mount Kilimanjaro",
    category: "Wonders & Landmarks",
    location: "Tanzania",
    fact: "Kilimanjaro is the highest single free-standing mountain peak in the world, with three volcanic cones: Kibo, Mawenzi, and Shira.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6c/Kilimanjaro_from_Amboseli.jpg/330px-Kilimanjaro_from_Amboseli.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-11",
    text: "Which Pacific volcanic archipelago belonging to Ecuador is famed for unique wildlife that inspired Charles Darwin's evolutionary theory?",
    options: [
      "The Galápagos Islands",
      "Easter Island",
      "Fiji",
      "Tahiti"
],
    correctAnswer: "The Galápagos Islands",
    category: "Wonders & Landmarks",
    location: "Ecuador",
    fact: "The islands are home to giant tortoises, marine iguanas, flightless cormorants, and Darwin's famous finches.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/64/Lobo_marino_%28Zalophus_californianus_wollebaeki%29%2C_Punta_Pitt%2C_isla_de_San_Crist%C3%B3bal%2C_islas_Gal%C3%A1pagos%2C_Ecuador%2C_2015-07-24%2C_DD_11.JPG/330px-Lobo_marino_%28Zalophus_californianus_wollebaeki%29%2C_Punta_Pitt%2C_isla_de_San_Crist%C3%B3bal%2C_islas_Gal%C3%A1pagos%2C_Ecuador%2C_2015-07-24%2C_DD_11.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-12",
    text: "In Northern Ireland, what famous geological landmark consists of roughly 40,000 interlocking polygonal basalt columns?",
    options: [
      "Giant's Causeway",
      "Fingal's Cave",
      "Devil's Postpile",
      "Cliffs of Moher"
],
    correctAnswer: "Giant's Causeway",
    category: "Wonders & Landmarks",
    location: "Northern Ireland",
    fact: "The columns formed around 50 to 60 million years ago during intense volcanic activity as lava rapidly cooled and contracted.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c0/Causeway-code_poet-4.jpg/330px-Causeway-code_poet-4.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-13",
    text: "Which iconic, flat-topped sandstone mountain overlooks the city of Cape Town in South Africa?",
    options: [
      "Table Mountain",
      "Lion's Head",
      "Drakensberg",
      "Mount Meru"
],
    correctAnswer: "Table Mountain",
    category: "Wonders & Landmarks",
    location: "Cape Town, South Africa",
    fact: "Often covered by a distinctive 'tablecloth' of white cloud, it is one of the oldest mountains on Earth.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dc/Table_Mountain_DanieVDM.jpg/330px-Table_Mountain_DanieVDM.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-14",
    text: "Also known as Ayers Rock, what massive sandstone monolith in Australia's Red Centre is deeply sacred to indigenous Anangu people?",
    options: [
      "Uluru",
      "Kata Tjuta",
      "Mount Augustus",
      "Wave Rock"
],
    correctAnswer: "Uluru",
    category: "Wonders & Landmarks",
    location: "Northern Territory, Australia",
    fact: "Uluru rises 348 meters above the desert plain, with the vast majority of its bulk underground.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a8/ULURU.jpg/330px-ULURU.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-15",
    text: "In northern Vietnam, which UNESCO World Heritage bay is celebrated for emerald waters and thousands of towering limestone islets?",
    options: [
      "Ha Long Bay",
      "Phang Nga Bay",
      "Subic Bay",
      "Manila Bay"
],
    correctAnswer: "Ha Long Bay",
    category: "Wonders & Landmarks",
    location: "Vietnam",
    fact: "The name Hạ Long translates poetically to 'Descending Dragon Bay', rooted in Vietnamese folklore.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/79/Ha_Long_Bay_in_2019.jpg/330px-Ha_Long_Bay_in_2019.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-16",
    text: "Which striking, pyramid-shaped mountain in the Alps straddles the border between Switzerland and Italy?",
    options: [
      "The Matterhorn",
      "Mont Blanc",
      "Jungfrau",
      "Eiger"
],
    correctAnswer: "The Matterhorn",
    category: "Wonders & Landmarks",
    location: "Switzerland / Italy",
    fact: "Its nearly symmetrical chisel peak is one of the most recognized mountain summits in the world, famous on Toblerone chocolate.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/60/Matterhorn_from_Domh%C3%BCtte_-_2.jpg/330px-Matterhorn_from_Domh%C3%BCtte_-_2.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-17",
    text: "Off the coast of Belize, what massive 300-meter-wide circular underwater sinkhole is a world-renowned scuba diving destination?",
    options: [
      "The Great Blue Hole",
      "Dean's Blue Hole",
      "Dragon Hole",
      "Blue Hole of Dahab"
],
    correctAnswer: "The Great Blue Hole",
    category: "Wonders & Landmarks",
    location: "Belize",
    fact: "Jacques Cousteau declared it one of the top five scuba diving sites in the world in 1971.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/61/Great_Blue_Hole.jpg/330px-Great_Blue_Hole.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-18",
    text: "Spanning over 10,000 square kilometers in Bolivia, what is the largest salt flat on Earth, famous for creating a giant mirror effect when wet?",
    options: [
      "Salar de Uyuni",
      "Bonneville Salt Flats",
      "Etosha Pan",
      "Chott el Djerid"
],
    correctAnswer: "Salar de Uyuni",
    category: "Wonders & Landmarks",
    location: "Bolivia",
    fact: "It contains roughly 50% to 70% of the world's known lithium reserves beneath its white salt crust.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4a/Salar_Uyuni_au01.jpg/330px-Salar_Uyuni_au01.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-19",
    text: "Established in 1872 in the US Rocky Mountains, what was the first national park in the world, home to the 'Old Faithful' geyser?",
    options: [
      "Yellowstone National Park",
      "Yosemite National Park",
      "Grand Teton",
      "Zion National Park"
],
    correctAnswer: "Yellowstone National Park",
    category: "Wonders & Landmarks",
    location: "Wyoming, USA",
    fact: "Yellowstone sits atop a colossal volcanic caldera responsible for more than half of all the geysers on Earth.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/60/Grand_Canyon_of_the_Yellowstone_Lower_Falls_%2895819p%29.jpg/330px-Grand_Canyon_of_the_Yellowstone_Lower_Falls_%2895819p%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-20",
    text: "In Argentine Patagonia, which famous advancing glacier is celebrated for dramatically calving massive icebergs into Lake Argentino?",
    options: [
      "Perito Moreno Glacier",
      "Aletsch Glacier",
      "Hubbard Glacier",
      "Fox Glacier"
],
    correctAnswer: "Perito Moreno Glacier",
    category: "Wonders & Landmarks",
    location: "Patagonia, Argentina",
    fact: "Unlike most glaciers retreating due to global warming, Perito Moreno is one of the few glaciers in the world in dynamic equilibrium.",
    difficulty: "medium",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c8/Perito_Moreno_Glacier_2023.jpg/330px-Perito_Moreno_Glacier_2023.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-21",
    text: "Soaring over 200 meters above the Atlantic Ocean in County Clare, what are the most visited sea cliffs in Ireland?",
    options: [
      "Cliffs of Moher",
      "Slieve League",
      "White Cliffs of Dover",
      "Cabo Girão"
],
    correctAnswer: "Cliffs of Moher",
    category: "Wonders & Landmarks",
    location: "Ireland",
    fact: "The cliffs stretch for roughly 14 kilometers and host over 30,000 pairs of nesting seabirds, including Atlantic puffins.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d1/Cliffs-Of-Moher-OBriens-From-South.JPG/330px-Cliffs-Of-Moher-OBriens-From-South.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-22",
    text: "Flowing northward across northeastern Africa into the Mediterranean Sea, which river is traditionally recognized as the longest in the world?",
    options: [
      "The Nile River",
      "The Amazon River",
      "The Congo River",
      "The Yangtze River"
],
    correctAnswer: "The Nile River",
    category: "Rivers, Lakes & Waterfalls",
    location: "Eastern Africa",
    fact: "Stretching approximately 6,650 kilometers (4,130 miles), the Nile is the primary water lifeline for Egypt and Sudan.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4a/Beautiful_nature_along_Nile_River_01.jpg/330px-Beautiful_nature_along_Nile_River_01.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-23",
    text: "Which mighty South American river carries more water volume than the next seven largest rivers combined?",
    options: [
      "The Amazon River",
      "The Orinoco River",
      "The Paraná River",
      "The Magdalena River"
],
    correctAnswer: "The Amazon River",
    category: "Rivers, Lakes & Waterfalls",
    location: "South America",
    fact: "At its mouth, the Amazon discharges roughly 209,000 cubic meters of water per second into the Atlantic Ocean.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f8/Amazon_River_ESA387332.jpg/330px-Amazon_River_ESA387332.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-24",
    text: "Flowing 3,766 kilometers through the central United States to the Gulf of Mexico, what is the chief river of North America?",
    options: [
      "The Mississippi River",
      "The Missouri River",
      "The Ohio River",
      "The Hudson River"
],
    correctAnswer: "The Mississippi River",
    category: "Rivers, Lakes & Waterfalls",
    location: "United States",
    fact: "Together with its tributary the Missouri, it forms the fourth-longest river system on the globe.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d2/Efmo_View_from_Fire_Point.jpg/330px-Efmo_View_from_Fire_Point.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-25",
    text: "Flowing entirely within China for 6,300 kilometers to Shanghai, what is the longest river in Asia?",
    options: [
      "The Yangtze River",
      "The Yellow River",
      "The Mekong River",
      "The Pearl River"
],
    correctAnswer: "The Yangtze River",
    category: "Rivers, Lakes & Waterfalls",
    location: "China",
    fact: "It is home to the colossal Three Gorges Dam, the largest hydroelectric power station in the world.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/58/Dusk_on_the_Yangtze_River.jpg/330px-Dusk_on_the_Yangtze_River.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-26",
    text: "Originating in Germany's Black Forest, which major river flows through or borders ten European countries on its way to the Black Sea?",
    options: [
      "The Danube River",
      "The Rhine River",
      "The Volga River",
      "The Elbe River"
],
    correctAnswer: "The Danube River",
    category: "Rivers, Lakes & Waterfalls",
    location: "Central & Eastern Europe",
    fact: "The Danube passes through four European capital cities: Vienna, Bratislava, Budapest, and Belgrade.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/53/View_from_Gell%C3%A9rt_Hill_to_the_Danube%2C_Hungary_-_Budapest_%2828493220635%29.jpg/330px-View_from_Gell%C3%A9rt_Hill_to_the_Danube%2C_Hungary_-_Budapest_%2828493220635%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-27",
    text: "Which historic English river flows through the heart of London past the Houses of Parliament and Tower Bridge?",
    options: [
      "The River Thames",
      "The River Severn",
      "The River Mersey",
      "The River Trent"
],
    correctAnswer: "The River Thames",
    category: "Rivers, Lakes & Waterfalls",
    location: "London, England",
    fact: "Spanned by over 200 bridges, the Thames has served as a vital trade waterway since Roman Londinium was founded in 43 AD.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6e/London_Thames_Sunset_panorama_-_Feb_2008.jpg/330px-London_Thames_Sunset_panorama_-_Feb_2008.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-28",
    text: "Beginning in the Swiss Alps, which vital 1,230 km European river flows along the German border into the North Sea at Rotterdam?",
    options: [
      "The Rhine River",
      "The Rhone River",
      "The Seine River",
      "The Loire River"
],
    correctAnswer: "The Rhine River",
    category: "Rivers, Lakes & Waterfalls",
    location: "Western Europe",
    fact: "The Rhine has been one of the most heavily trafficked inland waterways in world commerce since the Roman Empire.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/67/Middle_Bridge%2C_Basel%2C_Switzerland.JPG/330px-Middle_Bridge%2C_Basel%2C_Switzerland.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-29",
    text: "Shared by Canada and the United States, what is the largest freshwater lake in the world by surface area?",
    options: [
      "Lake Superior",
      "Lake Michigan",
      "Lake Huron",
      "Lake Erie"
],
    correctAnswer: "Lake Superior",
    category: "Rivers, Lakes & Waterfalls",
    location: "Canada / USA",
    fact: "Lake Superior contains 12,100 cubic km of water, enough to submerge the entire surface of North and South America in 30 cm of water.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/94/Lake_Superior%2C_ISS.jpg/330px-Lake_Superior%2C_ISS.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-30",
    text: "Situated in Siberia, Russia, what is the deepest and oldest freshwater lake in the world, holding 20% of Earth's unfrozen surface fresh water?",
    options: [
      "Lake Baikal",
      "Caspian Sea",
      "Lake Ladoga",
      "Lake Onega"
],
    correctAnswer: "Lake Baikal",
    category: "Rivers, Lakes & Waterfalls",
    location: "Siberia, Russia",
    fact: "Plunging to a depth of 1,642 meters (5,387 ft), it is home to thousands of endemic species, including the freshwater Baikal seal.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6a/Baikal.A2001296.0420.250m-NASA.jpg/330px-Baikal.A2001296.0420.250m-NASA.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-31",
    text: "Bordered by Uganda, Kenya, and Tanzania, what is the largest tropical lake in the world and the main reservoir of the White Nile?",
    options: [
      "Lake Victoria",
      "Lake Tanganyika",
      "Lake Malawi",
      "Lake Chad"
],
    correctAnswer: "Lake Victoria",
    category: "Rivers, Lakes & Waterfalls",
    location: "East Africa",
    fact: "Named in honor of Queen Victoria in 1858 by explorer John Hanning Speke, it is Africa's largest lake by area.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/74/ISS042-E-263206_-_View_of_Earth.jpg/330px-ISS042-E-263206_-_View_of_Earth.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-32",
    text: "Surrounded by Russia, Kazakhstan, Turkmenistan, Iran, and Azerbaijan, what is the largest enclosed inland body of water on Earth?",
    options: [
      "The Caspian Sea",
      "The Black Sea",
      "The Aral Sea",
      "Lake Balkhash"
],
    correctAnswer: "The Caspian Sea",
    category: "Rivers, Lakes & Waterfalls",
    location: "Central Asia / Europe",
    fact: "Covering 371,000 square kilometers, it accounts for 40% to 44% of the total lacustrine waters of the world.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/98/Caspian_Sea_from_orbit.jpg/330px-Caspian_Sea_from_orbit.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-33",
    text: "Plunging 979 meters from a tabletop mountain in Canaima National Park, Venezuela, what is the world's highest uninterrupted waterfall?",
    options: [
      "Angel Falls",
      "Victoria Falls",
      "Tugela Falls",
      "Yosemite Falls"
],
    correctAnswer: "Angel Falls",
    category: "Rivers, Lakes & Waterfalls",
    location: "Venezuela",
    fact: "The drop is so immense that much of the water is atomized into mist before reaching the canyon floor below.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e9/SaltoAngel1.jpg/330px-SaltoAngel1.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-34",
    text: "Consisting of 275 individual waterfalls along a 2.7 km crescent, which massive cataract lies on the border between Argentina and Brazil?",
    options: [
      "Iguazu Falls",
      "Niagara Falls",
      "Angel Falls",
      "Gullfoss"
],
    correctAnswer: "Iguazu Falls",
    category: "Rivers, Lakes & Waterfalls",
    location: "Argentina / Brazil",
    fact: "Upon viewing Iguazu, US First Lady Eleanor Roosevelt reportedly exclaimed: 'Poor Niagara!'",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/91/Aerial_Foz_de_Igua%C3%A7u_26_Nov_2005.jpg/330px-Aerial_Foz_de_Igua%C3%A7u_26_Nov_2005.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-35",
    text: "Perched 3,812 meters high in the Andes between Peru and Bolivia, what is the highest navigable body of water in the world?",
    options: [
      "Lake Titicaca",
      "Lake Poopó",
      "Lake Maracaibo",
      "Lake General Carrera"
],
    correctAnswer: "Lake Titicaca",
    category: "Rivers, Lakes & Waterfalls",
    location: "Peru / Bolivia",
    fact: "It is home to the indigenous Uros people, who live on floating artificial islands constructed from totora reeds.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/73/Lake_Titicaca_ESA22522896.jpeg/330px-Lake_Titicaca_ESA22522896.jpeg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-36",
    text: "Originating in the Himalayas and sacred to over one billion Hindus, which major river flows through India into the Bay of Bengal?",
    options: [
      "The Ganges River",
      "The Indus River",
      "The Brahmaputra",
      "The Godavari"
],
    correctAnswer: "The Ganges River",
    category: "Rivers, Lakes & Waterfalls",
    location: "India / Bangladesh",
    fact: "Its vast combined delta with the Brahmaputra is the largest river delta in the world, covered by the Sundarbans mangrove forest.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b9/Varanasiganga.jpg/330px-Varanasiganga.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-37",
    text: "Which prominent river in the American Southwest carved the Grand Canyon and forms Lake Mead behind the Hoover Dam?",
    options: [
      "The Colorado River",
      "The Rio Grande",
      "The Snake River",
      "The Columbia River"
],
    correctAnswer: "The Colorado River",
    category: "Rivers, Lakes & Waterfalls",
    location: "Southwestern USA",
    fact: "The river provides municipal and agricultural water to roughly 40 million people across seven US states and Mexico.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b9/Horseshoe_Bend_13_February_2023.jpg/330px-Horseshoe_Bend_13_February_2023.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-38",
    text: "Formerly known as the Zaire River, what is the deepest river in the world, reaching depths of over 220 meters in central Africa?",
    options: [
      "The Congo River",
      "The Niger River",
      "The Orange River",
      "The Limpopo River"
],
    correctAnswer: "The Congo River",
    category: "Rivers, Lakes & Waterfalls",
    location: "Central Africa",
    fact: "It is the only major river in the world that crosses the Earth's equator twice during its course.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cb/Aerial_view_of_the_Congo_River_near_Kisangani.jpg/330px-Aerial_view_of_the_Congo_River_near_Kisangani.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-39",
    text: "Which iconic French river flows through Paris under famous bridges like Pont Neuf before emptying into the English Channel?",
    options: [
      "The Seine",
      "The Loire",
      "The Garonne",
      "The Rhone"
],
    correctAnswer: "The Seine",
    category: "Rivers, Lakes & Waterfalls",
    location: "France",
    fact: "The Seine bisects Paris into the historic Rive Droite (Right Bank) and Rive Gauche (Left Bank).",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ed/Bercy%2C_Paris_01.jpg/330px-Bercy%2C_Paris_01.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-40",
    text: "In the Scottish Highlands, which large freshwater lake holds more fresh water than all the lakes in England and Wales combined?",
    options: [
      "Loch Ness",
      "Loch Lomond",
      "Loch Morar",
      "Loch Tay"
],
    correctAnswer: "Loch Ness",
    category: "Rivers, Lakes & Waterfalls",
    location: "Scotland",
    fact: "World-famous for folklore surrounding the mythical 'Nessie', the lake reaches a depth of 230 meters (755 ft).",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/51/LochNessUrquhart.jpg/330px-LochNessUrquhart.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-41",
    text: "Which crescent-shaped Alpine lake, one of the largest in Western Europe, is shared by Switzerland and France?",
    options: [
      "Lake Geneva (Lac Léman)",
      "Lake Lucerne",
      "Lake Zurich",
      "Lake Como"
],
    correctAnswer: "Lake Geneva (Lac Léman)",
    category: "Rivers, Lakes & Waterfalls",
    location: "Switzerland / France",
    fact: "The city of Geneva at the lake's southwestern tip hosts the famous Jet d'Eau, pumping 500 liters of water per second 140 meters high.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1b/Lake_Geneva_by_Sentinel-2.jpg/330px-Lake_Geneva_by_Sentinel-2.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-42",
    text: "Which major river in southern Africa flows over Victoria Falls before traversing Mozambique to empty into the Indian Ocean?",
    options: [
      "The Zambezi River",
      "The Limpopo River",
      "The Orange River",
      "The Okavango River"
],
    correctAnswer: "The Zambezi River",
    category: "Rivers, Lakes & Waterfalls",
    location: "Southern Africa",
    fact: "It is the fourth-longest river in Africa and powers two of the continent's largest hydroelectric dams: Kariba and Cahora Bassa.",
    difficulty: "medium",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/be/Zambezi_River_at_junction_of_Namibia%2C_Zambia%2C_Zimbabwe_%26_Botswana.jpg/330px-Zambezi_River_at_junction_of_Namibia%2C_Zambia%2C_Zimbabwe_%26_Botswana.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-43",
    text: "What is the largest and deepest ocean on Earth, covering more than 30% of the planet's entire surface area?",
    options: [
      "The Pacific Ocean",
      "The Atlantic Ocean",
      "The Indian Ocean",
      "The Arctic Ocean"
],
    correctAnswer: "The Pacific Ocean",
    category: "Mountains, Oceans & Seas",
    location: "Global",
    fact: "The Pacific Ocean is larger than all of Earth's land area combined and contains approximately 25,000 islands.",
    difficulty: "easy",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Pacific_Ocean_-_en.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled"
  },
  {
    id: "geo-44",
    text: "Which S-shaped ocean is the second-largest in the world, separating the Americas from Europe and Africa?",
    options: [
      "The Atlantic Ocean",
      "The Pacific Ocean",
      "The Indian Ocean",
      "The Southern Ocean"
],
    correctAnswer: "The Atlantic Ocean",
    category: "Mountains, Oceans & Seas",
    location: "Global",
    fact: "The Mid-Atlantic Ridge, a gigantic underwater mountain range, runs along its floor where tectonic plates spread apart.",
    difficulty: "easy",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/47/Atlantic_Ocean_-_en.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled"
  },
  {
    id: "geo-45",
    text: "Bounded by Asia to the north, Africa to the west, and Australia to the east, what is the third-largest ocean on Earth?",
    options: [
      "The Indian Ocean",
      "The Atlantic Ocean",
      "The Southern Ocean",
      "The Arctic Ocean"
],
    correctAnswer: "The Indian Ocean",
    category: "Mountains, Oceans & Seas",
    location: "Global",
    fact: "It covers about 20% of the world's ocean surface and handles over 80% of global seaborne trade in oil transit.",
    difficulty: "easy",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Indian_Ocean-CIA_WFB_Map.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled"
  },
  {
    id: "geo-46",
    text: "Surrounding the North Pole, what is the smallest, coldest, and shallowest of the world's five oceans?",
    options: [
      "The Arctic Ocean",
      "The Southern Ocean",
      "The Indian Ocean",
      "The Baltic Sea"
],
    correctAnswer: "The Arctic Ocean",
    category: "Mountains, Oceans & Seas",
    location: "North Pole",
    fact: "Much of its surface is covered by floating sea ice year-round, which expands significantly during winter months.",
    difficulty: "easy",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/59/Arctic_Ocean_-_en.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled"
  },
  {
    id: "geo-47",
    text: "Which almost completely enclosed intercontinental sea connects to the Atlantic Ocean through the narrow Strait of Gibraltar?",
    options: [
      "The Mediterranean Sea",
      "The Black Sea",
      "The Baltic Sea",
      "The Red Sea"
],
    correctAnswer: "The Mediterranean Sea",
    category: "Mountains, Oceans & Seas",
    location: "Southern Europe / North Africa",
    fact: "Its name derives from the Latin 'mediterraneus', meaning 'in the middle of the land'.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1c/Mediterranean_Sea_16.61811E_38.99124N.jpg/330px-Mediterranean_Sea_16.61811E_38.99124N.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-48",
    text: "Lying between northeast Africa and the Arabian Peninsula, which inlet of the Indian Ocean is connected to the Mediterranean via the Suez Canal?",
    options: [
      "The Red Sea",
      "The Persian Gulf",
      "The Gulf of Aden",
      "The Arabian Sea"
],
    correctAnswer: "The Red Sea",
    category: "Mountains, Oceans & Seas",
    location: "Africa / Middle East",
    fact: "It contains some of the warmest and saltiest seawater in the world, with vibrant coral reefs supporting over 1,200 fish species.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/21/Red_Sea_topographic_map-en.svg/330px-Red_Sea_topographic_map-en.svg.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-49",
    text: "Which tropical sea of the Atlantic Ocean is bounded by Mexico, Central America, the Greater Antilles, and South America?",
    options: [
      "The Caribbean Sea",
      "The Coral Sea",
      "The Gulf of Mexico",
      "The Sargasso Sea"
],
    correctAnswer: "The Caribbean Sea",
    category: "Mountains, Oceans & Seas",
    location: "The Americas",
    fact: "It contains roughly 7,000 islands, islets, and cays, famous for turquoise waters and coral atolls.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/44/Karibik_NASA_World_Wind_Globe.jpg/330px-Karibik_NASA_World_Wind_Globe.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-50",
    text: "Which arm of the Atlantic Ocean in Northern Europe is bordered by Sweden, Finland, Poland, Germany, and the Baltic States?",
    options: [
      "The Baltic Sea",
      "The North Sea",
      "The Norwegian Sea",
      "The Barents Sea"
],
    correctAnswer: "The Baltic Sea",
    category: "Mountains, Oceans & Seas",
    location: "Northern Europe",
    fact: "It is one of the largest brackish water bodies on Earth, fed by over 250 rivers.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/83/The_Baltic_Sea.png/330px-The_Baltic_Sea.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-51",
    text: "Which marginal sea bordered by Ukraine, Russia, Georgia, Turkey, Bulgaria, and Romania is connected to the Mediterranean through the Bosporus?",
    options: [
      "The Black Sea",
      "The Caspian Sea",
      "The Aegean Sea",
      "The Sea of Azov"
],
    correctAnswer: "The Black Sea",
    category: "Mountains, Oceans & Seas",
    location: "Eastern Europe / Western Asia",
    fact: "Below 150 meters, the Black Sea is anoxic (lacking oxygen), which preserves ancient wooden shipwrecks in pristine condition.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fb/Black_Sea_Nasa_May_25_2004.jpg/330px-Black_Sea_Nasa_May_25_2004.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-52",
    text: "Home to the world's highest peaks, which massive Asian mountain range separates the Indian subcontinent from the Tibetan Plateau?",
    options: [
      "The Himalayas",
      "The Urals",
      "The Tian Shan",
      "The Altai Mountains"
],
    correctAnswer: "The Himalayas",
    category: "Mountains, Oceans & Seas",
    location: "Asia",
    fact: "The name Himalaya comes from Sanskrit meaning 'Abode of Snow'. It contains all 14 of the world's 8,000-meter peaks.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c8/Himalayas_and_allied_ranges_NASA_Landsat_showing_the_eight_thousanders%2C_annotated_with_major_rivers.jpg/330px-Himalayas_and_allied_ranges_NASA_Landsat_showing_the_eight_thousanders%2C_annotated_with_major_rivers.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-53",
    text: "Stretching over 7,000 kilometers along the western edge of South America, what is the longest continental mountain range in the world?",
    options: [
      "The Andes",
      "The Rocky Mountains",
      "The Alps",
      "The Atlas Mountains"
],
    correctAnswer: "The Andes",
    category: "Mountains, Oceans & Seas",
    location: "South America",
    fact: "Its highest peak, Mount Aconcagua in Argentina (6,961 m), is the highest mountain outside of Asia.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f3/Panoramic_view_Andes-Chile.jpg/330px-Panoramic_view_Andes-Chile.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-54",
    text: "Extending over 4,800 kilometers from northern British Columbia in Canada to New Mexico in the USA, what is North America's premier mountain range?",
    options: [
      "The Rocky Mountains",
      "The Sierra Nevada",
      "The Appalachians",
      "The Cascades"
],
    correctAnswer: "The Rocky Mountains",
    category: "Mountains, Oceans & Seas",
    location: "North America",
    fact: "The Continental Divide runs along the crest of the Rockies, separating waters flowing to the Atlantic from those to the Pacific.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/53/Maroon_Bells_%2811553%29a.jpg/330px-Maroon_Bells_%2811553%29a.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-55",
    text: "What is the highest and most extensive mountain range system entirely located in Europe, spanning across eight countries?",
    options: [
      "The Alps",
      "The Pyrenees",
      "The Carpathians",
      "The Apennines"
],
    correctAnswer: "The Alps",
    category: "Mountains, Oceans & Seas",
    location: "Central Europe",
    fact: "Mont Blanc, rising 4,809 meters on the French-Italian border, is the highest summit in the Alps.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/ba/Alps_2007-03-13_10.10UTC_1px-250m.jpg/330px-Alps_2007-03-13_10.10UTC_1px-250m.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-56",
    text: "Rising 8,611 meters on the Pakistan-China border in the Karakoram Range, what is the second-highest mountain in the world?",
    options: [
      "K2 (Mount Godwin-Austen)",
      "Kangchenjunga",
      "Lhotse",
      "Makalu"
],
    correctAnswer: "K2 (Mount Godwin-Austen)",
    category: "Mountains, Oceans & Seas",
    location: "Pakistan / China",
    fact: "Known as the 'Savage Mountain', K2 is considered by elite mountaineers to be far more technically difficult and dangerous than Mount Everest.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c9/Chogori.jpg/330px-Chogori.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-57",
    text: "Located in the western Pacific Ocean, what is the deepest oceanic trench on Earth, with the Challenger Deep reaching nearly 11,000 meters down?",
    options: [
      "The Mariana Trench",
      "The Puerto Rico Trench",
      "The Java Trench",
      "The Tonga Trench"
],
    correctAnswer: "The Mariana Trench",
    category: "Mountains, Oceans & Seas",
    location: "Western Pacific",
    fact: "If Mount Everest were placed at the bottom of the Mariana Trench, its summit would still be submerged under more than 2,000 meters of water.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1b/Marianatrenchmap.png/330px-Marianatrenchmap.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-58",
    text: "What horseshoe-shaped zone encircling the Pacific Ocean basin is home to roughly 75% of the world's active volcanoes and 90% of earthquakes?",
    options: [
      "The Pacific Ring of Fire",
      "The Mid-Atlantic Rift",
      "The Alpine Fault",
      "The Great Rift Valley"
],
    correctAnswer: "The Pacific Ring of Fire",
    category: "Mountains, Oceans & Seas",
    location: "Pacific Basin",
    fact: "It stretches roughly 40,000 kilometers and is produced by the continuous subduction of oceanic tectonic plates.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Pacific_Ring_of_Fire.svg/330px-Pacific_Ring_of_Fire.svg.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-59",
    text: "Which narrow 14-kilometer-wide strait separates southern Spain from Morocco and connects the Atlantic Ocean to the Mediterranean Sea?",
    options: [
      "The Strait of Gibraltar",
      "The Strait of Hormuz",
      "The Bosporus",
      "The Dardanelles"
],
    correctAnswer: "The Strait of Gibraltar",
    category: "Mountains, Oceans & Seas",
    location: "Spain / Morocco",
    fact: "In antiquity, the prominent promontories flanking the entrance were famously known as the 'Pillars of Hercules'.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e8/STS059-238-074_Strait_of_Gibraltar.jpg/330px-STS059-238-074_Strait_of_Gibraltar.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-60",
    text: "On the Italian island of Sicily, what is the highest and most frequently active volcano in Europe?",
    options: [
      "Mount Etna",
      "Mount Vesuvius",
      "Stromboli",
      "Vulcano"
],
    correctAnswer: "Mount Etna",
    category: "Mountains, Oceans & Seas",
    location: "Sicily, Italy",
    fact: "Standing over 3,357 meters tall, Mount Etna has one of the world's longest documented records of volcanic eruptions, dating back 3,500 years.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/39/Mt_Etna_and_Catania1.jpg/330px-Mt_Etna_and_Catania1.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-61",
    text: "Which ancient mountain chain runs parallel to the Atlantic coast of North America from Newfoundland in Canada to central Alabama in the USA?",
    options: [
      "The Appalachian Mountains",
      "The Ozarks",
      "The Cascades",
      "The Adirondacks"
],
    correctAnswer: "The Appalachian Mountains",
    category: "Mountains, Oceans & Seas",
    location: "Eastern North America",
    fact: "Formed around 480 million years ago, the Appalachians were once as tall as the modern Alps and Rockies before eons of natural erosion.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/42/Blue_Ridge_Parkway_Sunset_%2843691100%29.jpeg/330px-Blue_Ridge_Parkway_Sunset_%2843691100%29.jpeg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-62",
    text: "Located between the Canadian provinces of Nova Scotia and New Brunswick, which body of water boasts the highest tides in the world (up to 16 meters)?",
    options: [
      "The Bay of Fundy",
      "Hudson Bay",
      "James Bay",
      "Chesapeake Bay"
],
    correctAnswer: "The Bay of Fundy",
    category: "Mountains, Oceans & Seas",
    location: "Canada",
    fact: "During every 12-hour tide cycle, roughly 160 billion tons of seawater flows in and out of the bay.",
    difficulty: "medium",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/74/Wpdms_nasa_topo_bay_of_fundy_-_en.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled"
  },
  {
    id: "geo-63",
    text: "Which narrow 82-kilometer-wide waterway separates mainland Russia's Chukchi Peninsula from the state of Alaska in the USA?",
    options: [
      "The Bering Strait",
      "The Davis Strait",
      "The Cook Strait",
      "The Bass Strait"
],
    correctAnswer: "The Bering Strait",
    category: "Mountains, Oceans & Seas",
    location: "Russia / USA",
    fact: "During ice ages, lowered sea levels exposed the Bering Land Bridge, allowing early humans to migrate from Asia into the Americas.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/16/Bering_Strait.jpeg/330px-Bering_Strait.jpeg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-64",
    text: "Covering roughly 9.2 million square kilometers across northern Africa, what is the largest hot desert on Earth?",
    options: [
      "The Sahara Desert",
      "The Arabian Desert",
      "The Gobi Desert",
      "The Kalahari Desert"
],
    correctAnswer: "The Sahara Desert",
    category: "Deserts, Islands & Continents",
    location: "North Africa",
    fact: "The Sahara is roughly the size of the entire United States or China, spanning across eleven African nations.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4a/Sahara_real_color.jpg/330px-Sahara_real_color.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-65",
    text: "Covered by a colossal ice sheet containing roughly 90% of the world's ice, what is the coldest, driest, and windiest continent on Earth?",
    options: [
      "Antarctica",
      "Australia",
      "Europe",
      "South America"
],
    correctAnswer: "Antarctica",
    category: "Deserts, Islands & Continents",
    location: "South Pole",
    fact: "Because it receives less than 200 mm of precipitation per year along the coast and even less inland, Antarctica is technically a polar desert.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f2/Antarctica_%28orthographic_projection%29.svg/330px-Antarctica_%28orthographic_projection%29.svg.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-66",
    text: "An autonomous territory of Denmark located between the Arctic and Atlantic oceans, what is the largest island in the world that is not a continent?",
    options: [
      "Greenland",
      "New Guinea",
      "Borneo",
      "Madagascar"
],
    correctAnswer: "Greenland",
    category: "Deserts, Islands & Continents",
    location: "North Atlantic",
    fact: "About 80% of Greenland's 2.16 million square kilometer surface is covered by an ice sheet up to 3 kilometers thick.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/09/Flag_of_Greenland.svg/330px-Flag_of_Greenland.svg.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-67",
    text: "Located 400 km off the southeastern coast of Africa, what is the fourth-largest island in the world, famed for unique wildlife like lemurs?",
    options: [
      "Madagascar",
      "Mauritius",
      "Seychelles",
      "Zanzibar"
],
    correctAnswer: "Madagascar",
    category: "Deserts, Islands & Continents",
    location: "Indian Ocean",
    fact: "Because it separated from the Indian subcontinent roughly 88 million years ago, over 90% of its wildlife is found nowhere else on Earth.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2f/Madagascar_%28centered_orthographic_projection%29.svg/330px-Madagascar_%28centered_orthographic_projection%29.svg.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-68",
    text: "Spanning parts of northern China and southern Mongolia, what large cold desert is famous for dunes, rocky plateaus, and historic dinosaur fossil finds?",
    options: [
      "The Gobi Desert",
      "The Taklamakan Desert",
      "The Karakum Desert",
      "The Thar Desert"
],
    correctAnswer: "The Gobi Desert",
    category: "Deserts, Islands & Continents",
    location: "China / Mongolia",
    fact: "The Gobi Desert is a cold desert where frost and occasional snow appear on its dunes during freezing winter months.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/79/Gobi_Desert.jpg/330px-Gobi_Desert.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-69",
    text: "Located west of the Andes in northern Chile, what coastal plateau is recognized as the driest non-polar desert on Earth?",
    options: [
      "The Atacama Desert",
      "The Patagonian Desert",
      "The Mojave Desert",
      "The Sonoran Desert"
],
    correctAnswer: "The Atacama Desert",
    category: "Deserts, Islands & Continents",
    location: "Chile",
    fact: "Some weather stations in the Atacama have never recorded a single drop of rain in their entire operating history, making it a prime Mars-analog testing ground.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7f/Atacama.png/330px-Atacama.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-70",
    text: "Occupying almost the entire Arabian Peninsula, which vast desert region contains the Rub' al Khali (the Empty Quarter)?",
    options: [
      "The Arabian Desert",
      "The Syrian Desert",
      "The Sinai Desert",
      "The Dasht-e Kavir"
],
    correctAnswer: "The Arabian Desert",
    category: "Deserts, Islands & Continents",
    location: "Middle East",
    fact: "The Rub' al Khali is the largest continuous sand desert (erg) in the world, covering 650,000 square kilometers.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8e/Arabian_Desert_-_panoramio.jpg/330px-Arabian_Desert_-_panoramio.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-71",
    text: "Located 3,200 km southwest of the US mainland in the central Pacific, which volcanic archipelago comprises the 50th state of the USA?",
    options: [
      "Hawaii",
      "Guam",
      "Puerto Rico",
      "Samoa"
],
    correctAnswer: "Hawaii",
    category: "Deserts, Islands & Continents",
    location: "Central Pacific Ocean",
    fact: "Mauna Kea on the Big Island of Hawaii, measured from its oceanic base to its summit, is over 10,210 meters tall—taller than Mount Everest.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ef/Flag_of_Hawaii.svg/330px-Flag_of_Hawaii.svg.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-72",
    text: "Situated just south of the Arctic Circle on the Mid-Atlantic Ridge, which island nation is famous for its dramatic mix of glaciers and active volcanoes?",
    options: [
      "Iceland",
      "Ireland",
      "Faroe Islands",
      "Svalbard"
],
    correctAnswer: "Iceland",
    category: "Deserts, Islands & Continents",
    location: "North Atlantic",
    fact: "Often called the 'Land of Fire and Ice', Iceland generates nearly 100% of its electricity from renewable geothermal and hydroelectric sources.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ce/Flag_of_Iceland.svg/330px-Flag_of_Iceland.svg.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-73",
    text: "Comprising two main landmasses (the North Island and the South Island) in the southwestern Pacific, what island country has its capital at Wellington?",
    options: [
      "New Zealand",
      "Fiji",
      "Papua New Guinea",
      "Solomon Islands"
],
    correctAnswer: "New Zealand",
    category: "Deserts, Islands & Continents",
    location: "Southwestern Pacific",
    fact: "Known in Māori as Aotearoa ('Land of the Long White Cloud'), no point in New Zealand is more than 130 km from the ocean.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3e/Flag_of_New_Zealand.svg/330px-Flag_of_New_Zealand.svg.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-74",
    text: "Covered by ancient 140-million-year-old rainforest, which third-largest island in the world is shared by Malaysia, Indonesia, and Brunei?",
    options: [
      "Borneo",
      "Sumatra",
      "Java",
      "Sulawesi"
],
    correctAnswer: "Borneo",
    category: "Deserts, Islands & Continents",
    location: "Southeast Asia",
    fact: "Borneo's dense tropical jungles are one of the last natural refuges for the critically endangered Bornean orangutan and pygmy elephant.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/40/Administrative_map_of_Borneo_%28Indonesian%29.png/330px-Administrative_map_of_Borneo_%28Indonesian%29.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-75",
    text: "In California's Mojave Desert, which below-sea-level basin recorded the hottest air temperature ever reliably measured on Earth (56.7°C / 134°F)?",
    options: [
      "Death Valley",
      "Badwater Basin",
      "Salton Sink",
      "Imperial Valley"
],
    correctAnswer: "Death Valley",
    category: "Deserts, Islands & Continents",
    location: "California, USA",
    fact: "Badwater Basin in Death Valley is the lowest point in North America, at 86 meters (282 ft) below sea level.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/98/Death_Valley_from_space.JPG/330px-Death_Valley_from_space.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-76",
    text: "What fundamental imaginary line of latitude at 0 degrees circles the globe, dividing Earth into the Northern and Southern Hemispheres?",
    options: [
      "The Equator",
      "The Prime Meridian",
      "Tropic of Cancer",
      "Tropic of Capricorn"
],
    correctAnswer: "The Equator",
    category: "Deserts, Islands & Continents",
    location: "0° Latitude",
    fact: "Earth's equatorial circumference is approximately 40,075 kilometers (24,901 miles), passing through 13 countries.",
    difficulty: "easy",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Solstice_revolving_earth.gif?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled"
  },
  {
    id: "geo-77",
    text: "Passing through the Royal Observatory in Greenwich, London, what is the internationally defined reference line of 0 degrees longitude?",
    options: [
      "The Prime Meridian",
      "The International Date Line",
      "The Equator",
      "The Tropic of Cancer"
],
    correctAnswer: "The Prime Meridian",
    category: "Deserts, Islands & Continents",
    location: "0° Longitude",
    fact: "Adopted in 1884 at the International Meridian Conference in Washington, D.C., it serves as the baseline for world time zones (UTC).",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1c/Equator_and_Prime_Meridian.svg/330px-Equator_and_Prime_Meridian.svg.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-78",
    text: "Located in the middle of the shifting pack ice of the Arctic Ocean, what is the northernmost point on the surface of Earth?",
    options: [
      "The North Pole",
      "The South Pole",
      "Magnetic North",
      "Cape Morris Jesup"
],
    correctAnswer: "The North Pole",
    category: "Deserts, Islands & Continents",
    location: "90° N Latitude",
    fact: "At the geographic North Pole, all directions point south, and the sun rises and sets only once per year.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5d/Arctic_Ocean_SVG.svg/330px-Arctic_Ocean_SVG.svg.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-79",
    text: "Situated at an altitude of 2,835 meters on the high polar ice plateau of Antarctica, what is the southernmost point on Earth?",
    options: [
      "The South Pole",
      "The North Pole",
      "Cape Horn",
      "Mount Vinson"
],
    correctAnswer: "The South Pole",
    category: "Deserts, Islands & Continents",
    location: "90° S Latitude",
    fact: "Norwegian explorer Roald Amundsen and his team became the first humans to reach the geographic South Pole on December 14, 1911.",
    difficulty: "easy",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/59/Pole-south.gif?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled"
  },
  {
    id: "geo-80",
    text: "Covering 900,000 square kilometers across Botswana, Namibia, and South Africa, what large semi-arid sandy basin is home to the San Bushmen?",
    options: [
      "The Kalahari Desert",
      "The Namib Desert",
      "The Karoo",
      "The Danakil Depression"
],
    correctAnswer: "The Kalahari Desert",
    category: "Deserts, Islands & Continents",
    location: "Southern Africa",
    fact: "Unlike hyper-arid deserts, the Kalahari receives sufficient seasonal rainfall to support acacia woodlands, grasses, and abundant wildlife.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/55/Kalahari.png/330px-Kalahari.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-81",
    text: "Located 240 km south of the Australian mainland across the Bass Strait, what is the island state of Australia?",
    options: [
      "Tasmania",
      "Kangaroo Island",
      "Fraser Island",
      "Lord Howe Island"
],
    correctAnswer: "Tasmania",
    category: "Deserts, Islands & Continents",
    location: "Australia",
    fact: "Almost 42% of Tasmania's land area is protected in national parks and reserves, famously home to the unique carnivorous Tasmanian devil.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/46/Flag_of_Tasmania.svg/330px-Flag_of_Tasmania.svg.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-82",
    text: "Stretching along the Atlantic coast of Namibia for over 2,000 km, which coastal desert is considered the oldest desert in the world (55+ million years)?",
    options: [
      "The Namib Desert",
      "The Kalahari Desert",
      "The Sahara Desert",
      "The Gibson Desert"
],
    correctAnswer: "The Namib Desert",
    category: "Deserts, Islands & Continents",
    location: "Namibia",
    fact: "Its giant red dunes at Sossusvlei are among the tallest in the world, with some reaching over 300 meters high.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bc/Namib_desert_MODIS.jpg/330px-Namib_desert_MODIS.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-83",
    text: "Comprising Superior, Michigan, Huron, Erie, and Ontario, what group of interconnected North American lakes contains 21% of Earth's surface fresh water?",
    options: [
      "The Great Lakes",
      "The Finger Lakes",
      "The Canadian Shield Lakes",
      "The African Great Lakes"
],
    correctAnswer: "The Great Lakes",
    category: "Deserts, Islands & Continents",
    location: "North America",
    fact: "They form the largest group of freshwater lakes on Earth by total surface area, spanning over 244,000 square kilometers.",
    difficulty: "easy",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b3/Great_Lakes%2C_No_Clouds_%284968915002%29_Brighter.jpg/330px-Great_Lakes%2C_No_Clouds_%284968915002%29_Brighter.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    id: "geo-84",
    text: "By traditional geography, how many primary continents are recognized on planet Earth?",
    options: [
      "7 Continents",
      "5 Continents",
      "6 Continents",
      "8 Continents"
],
    correctAnswer: "7 Continents",
    category: "Deserts, Islands & Continents",
    location: "Global",
    fact: "The seven continents are Asia, Africa, North America, South America, Antarctica, Europe, and Australia.",
    difficulty: "easy",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Solstice_revolving_earth.gif?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled"
  }
];

export function getGeographyQuestionsByTheme(
  theme?: GeographyTheme | GeographyTheme[] | Set<GeographyTheme> | 'all',
): GeographyQuestionItem[] {
  if (!theme || theme === 'all') {
    return WORLD_GEOGRAPHY_QUESTIONS;
  }
  if (Array.isArray(theme)) {
    const set = new Set(theme);
    return WORLD_GEOGRAPHY_QUESTIONS.filter((q) => set.has(q.category));
  }
  if (theme instanceof Set) {
    return WORLD_GEOGRAPHY_QUESTIONS.filter((q) => theme.has(q.category));
  }
  return WORLD_GEOGRAPHY_QUESTIONS.filter((q) => q.category === theme);
}
