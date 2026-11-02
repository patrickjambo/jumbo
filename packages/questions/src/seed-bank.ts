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
    "correct": "Andorra",
    "distractors": [
      "Moldova",
      "Italy",
      "Liechtenstein"
    ],
    "imageUrl": "https://flagcdn.com/w320/ad.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "United Arab Emirates",
    "distractors": [
      "Hong Kong",
      "Indonesia",
      "Turkmenistan"
    ],
    "imageUrl": "https://flagcdn.com/w320/ae.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Afghanistan",
    "distractors": [
      "Kazakhstan",
      "Cambodia",
      "Indonesia"
    ],
    "imageUrl": "https://flagcdn.com/w320/af.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Antigua and Barbuda",
    "distractors": [
      "Belize",
      "Saint Kitts and Nevis",
      "Barbados"
    ],
    "imageUrl": "https://flagcdn.com/w320/ag.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Albania",
    "distractors": [
      "Kosovo",
      "Switzerland",
      "Germany"
    ],
    "imageUrl": "https://flagcdn.com/w320/al.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Armenia",
    "distractors": [
      "Pakistan",
      "Azerbaijan",
      "South Korea"
    ],
    "imageUrl": "https://flagcdn.com/w320/am.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Angola",
    "distractors": [
      "Liberia",
      "Uganda",
      "Cameroon"
    ],
    "imageUrl": "https://flagcdn.com/w320/ao.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Argentina",
    "distractors": [
      "Jamaica",
      "Aruba",
      "Saint Lucia"
    ],
    "imageUrl": "https://flagcdn.com/w320/ar.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Austria",
    "distractors": [
      "Vatican City",
      "Italy",
      "San Marino"
    ],
    "imageUrl": "https://flagcdn.com/w320/at.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Australia",
    "distractors": [
      "Tonga",
      "Guam",
      "Fiji"
    ],
    "imageUrl": "https://flagcdn.com/w320/au.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Aruba",
    "distractors": [
      "Guatemala",
      "Bermuda",
      "Haiti"
    ],
    "imageUrl": "https://flagcdn.com/w320/aw.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Azerbaijan",
    "distractors": [
      "Jordan",
      "Brunei",
      "Afghanistan"
    ],
    "imageUrl": "https://flagcdn.com/w320/az.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Bosnia and Herzegovina",
    "distractors": [
      "Gibraltar",
      "Spain",
      "Czech Republic"
    ],
    "imageUrl": "https://flagcdn.com/w320/ba.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Barbados",
    "distractors": [
      "Haiti",
      "Argentina",
      "Venezuela"
    ],
    "imageUrl": "https://flagcdn.com/w320/bb.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Bangladesh",
    "distractors": [
      "Singapore",
      "Malaysia",
      "Afghanistan"
    ],
    "imageUrl": "https://flagcdn.com/w320/bd.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Belgium",
    "distractors": [
      "Iceland",
      "Gibraltar",
      "Bulgaria"
    ],
    "imageUrl": "https://flagcdn.com/w320/be.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Burkina Faso",
    "distractors": [
      "Gabon",
      "Mozambique",
      "Malawi"
    ],
    "imageUrl": "https://flagcdn.com/w320/bf.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Bulgaria",
    "distractors": [
      "North Macedonia",
      "Malta",
      "Austria"
    ],
    "imageUrl": "https://flagcdn.com/w320/bg.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Bahrain",
    "distractors": [
      "Thailand",
      "United Arab Emirates",
      "Singapore"
    ],
    "imageUrl": "https://flagcdn.com/w320/bh.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Burundi",
    "distractors": [
      "Tunisia",
      "Sudan",
      "Eritrea"
    ],
    "imageUrl": "https://flagcdn.com/w320/bi.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Benin",
    "distractors": [
      "Chad",
      "Madagascar",
      "Libya"
    ],
    "imageUrl": "https://flagcdn.com/w320/bj.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Bermuda",
    "distractors": [
      "Bahamas",
      "Chile",
      "Dominican Republic"
    ],
    "imageUrl": "https://flagcdn.com/w320/bm.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Brunei",
    "distractors": [
      "Thailand",
      "North Korea",
      "Hong Kong"
    ],
    "imageUrl": "https://flagcdn.com/w320/bn.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Bolivia",
    "distractors": [
      "Nicaragua",
      "Suriname",
      "Cuba"
    ],
    "imageUrl": "https://flagcdn.com/w320/bo.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Brazil",
    "distractors": [
      "Barbados",
      "Saint Lucia",
      "Canada"
    ],
    "imageUrl": "https://flagcdn.com/w320/br.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Bahamas",
    "distractors": [
      "Saint Kitts and Nevis",
      "Belize",
      "Costa Rica"
    ],
    "imageUrl": "https://flagcdn.com/w320/bs.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Bhutan",
    "distractors": [
      "India",
      "Saudi Arabia",
      "Malaysia"
    ],
    "imageUrl": "https://flagcdn.com/w320/bt.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Botswana",
    "distractors": [
      "Ivory Coast",
      "Sierra Leone",
      "Senegal"
    ],
    "imageUrl": "https://flagcdn.com/w320/bw.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Belarus",
    "distractors": [
      "Norway",
      "Latvia",
      "Romania"
    ],
    "imageUrl": "https://flagcdn.com/w320/by.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Belize",
    "distractors": [
      "Cuba",
      "Grenada",
      "Aruba"
    ],
    "imageUrl": "https://flagcdn.com/w320/bz.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Canada",
    "distractors": [
      "Peru",
      "Nicaragua",
      "Ecuador"
    ],
    "imageUrl": "https://flagcdn.com/w320/ca.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "DR Congo",
    "distractors": [
      "Madagascar",
      "Nigeria",
      "South Sudan"
    ],
    "imageUrl": "https://flagcdn.com/w320/cd.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Central African Republic",
    "distractors": [
      "Equatorial Guinea",
      "Tunisia",
      "Zimbabwe"
    ],
    "imageUrl": "https://flagcdn.com/w320/cf.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Republic of the Congo",
    "distractors": [
      "Benin",
      "Ivory Coast",
      "Eswatini"
    ],
    "imageUrl": "https://flagcdn.com/w320/cg.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Switzerland",
    "distractors": [
      "Faroe Islands",
      "Slovenia",
      "Ireland"
    ],
    "imageUrl": "https://flagcdn.com/w320/ch.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Ivory Coast",
    "distractors": [
      "Cameroon",
      "Angola",
      "Algeria"
    ],
    "imageUrl": "https://flagcdn.com/w320/ci.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Chile",
    "distractors": [
      "Guatemala",
      "Bahamas",
      "Jamaica"
    ],
    "imageUrl": "https://flagcdn.com/w320/cl.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Cameroon",
    "distractors": [
      "Angola",
      "Ghana",
      "Chad"
    ],
    "imageUrl": "https://flagcdn.com/w320/cm.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "China",
    "distractors": [
      "United Arab Emirates",
      "Nepal",
      "Qatar"
    ],
    "imageUrl": "https://flagcdn.com/w320/cn.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Colombia",
    "distractors": [
      "Argentina",
      "Haiti",
      "Bolivia"
    ],
    "imageUrl": "https://flagcdn.com/w320/co.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Costa Rica",
    "distractors": [
      "Brazil",
      "Bermuda",
      "Suriname"
    ],
    "imageUrl": "https://flagcdn.com/w320/cr.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Cuba",
    "distractors": [
      "Belize",
      "Haiti",
      "Jamaica"
    ],
    "imageUrl": "https://flagcdn.com/w320/cu.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Cabo Verde",
    "distractors": [
      "South Sudan",
      "Cameroon",
      "Madagascar"
    ],
    "imageUrl": "https://flagcdn.com/w320/cv.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Cura\u00e7ao",
    "distractors": [
      "Antigua and Barbuda",
      "Uruguay",
      "El Salvador"
    ],
    "imageUrl": "https://flagcdn.com/w320/cw.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Cyprus",
    "distractors": [
      "Belarus",
      "France",
      "Moldova"
    ],
    "imageUrl": "https://flagcdn.com/w320/cy.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Czech Republic",
    "distractors": [
      "Norway",
      "Belarus",
      "Ukraine"
    ],
    "imageUrl": "https://flagcdn.com/w320/cz.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Germany",
    "distractors": [
      "Spain",
      "Norway",
      "Bosnia and Herzegovina"
    ],
    "imageUrl": "https://flagcdn.com/w320/de.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Djibouti",
    "distractors": [
      "Algeria",
      "Namibia",
      "Liberia"
    ],
    "imageUrl": "https://flagcdn.com/w320/dj.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Denmark",
    "distractors": [
      "Liechtenstein",
      "Netherlands",
      "Greece"
    ],
    "imageUrl": "https://flagcdn.com/w320/dk.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Dominica",
    "distractors": [
      "Guyana",
      "Aruba",
      "Panama"
    ],
    "imageUrl": "https://flagcdn.com/w320/dm.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Dominican Republic",
    "distractors": [
      "Cuba",
      "Mexico",
      "Antigua and Barbuda"
    ],
    "imageUrl": "https://flagcdn.com/w320/do.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Algeria",
    "distractors": [
      "DR Congo",
      "Guinea-Bissau",
      "Madagascar"
    ],
    "imageUrl": "https://flagcdn.com/w320/dz.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Ecuador",
    "distractors": [
      "Barbados",
      "Bermuda",
      "Cura\u00e7ao"
    ],
    "imageUrl": "https://flagcdn.com/w320/ec.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Estonia",
    "distractors": [
      "Austria",
      "Vatican City",
      "Switzerland"
    ],
    "imageUrl": "https://flagcdn.com/w320/ee.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Egypt",
    "distractors": [
      "Chad",
      "Algeria",
      "Botswana"
    ],
    "imageUrl": "https://flagcdn.com/w320/eg.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Eritrea",
    "distractors": [
      "Sudan",
      "Senegal",
      "Ethiopia"
    ],
    "imageUrl": "https://flagcdn.com/w320/er.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Spain",
    "distractors": [
      "Liechtenstein",
      "Serbia",
      "Montenegro"
    ],
    "imageUrl": "https://flagcdn.com/w320/es.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Ethiopia",
    "distractors": [
      "Namibia",
      "South Sudan",
      "Cabo Verde"
    ],
    "imageUrl": "https://flagcdn.com/w320/et.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Finland",
    "distractors": [
      "Russia",
      "Albania",
      "Bulgaria"
    ],
    "imageUrl": "https://flagcdn.com/w320/fi.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Fiji",
    "distractors": [
      "Samoa",
      "Vanuatu",
      "Australia"
    ],
    "imageUrl": "https://flagcdn.com/w320/fj.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Micronesia",
    "distractors": [
      "Tuvalu",
      "Palau",
      "Solomon Islands"
    ],
    "imageUrl": "https://flagcdn.com/w320/fm.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Faroe Islands",
    "distractors": [
      "Croatia",
      "Albania",
      "Switzerland"
    ],
    "imageUrl": "https://flagcdn.com/w320/fo.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "France",
    "distractors": [
      "Russia",
      "Bosnia and Herzegovina",
      "Ireland"
    ],
    "imageUrl": "https://flagcdn.com/w320/fr.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Gabon",
    "distractors": [
      "Zimbabwe",
      "Malawi",
      "Seychelles"
    ],
    "imageUrl": "https://flagcdn.com/w320/ga.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "United Kingdom",
    "distractors": [
      "Belarus",
      "Russia",
      "Luxembourg"
    ],
    "imageUrl": "https://flagcdn.com/w320/gb.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Grenada",
    "distractors": [
      "Haiti",
      "Belize",
      "Cura\u00e7ao"
    ],
    "imageUrl": "https://flagcdn.com/w320/gd.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Georgia",
    "distractors": [
      "North Korea",
      "Japan",
      "Yemen"
    ],
    "imageUrl": "https://flagcdn.com/w320/ge.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Ghana",
    "distractors": [
      "Mauritania",
      "Mozambique",
      "Liberia"
    ],
    "imageUrl": "https://flagcdn.com/w320/gh.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Gibraltar",
    "distractors": [
      "Cyprus",
      "Poland",
      "Albania"
    ],
    "imageUrl": "https://flagcdn.com/w320/gi.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Greenland",
    "distractors": [
      "Brazil",
      "Dominica",
      "Ecuador"
    ],
    "imageUrl": "https://flagcdn.com/w320/gl.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "The Gambia",
    "distractors": [
      "South Africa",
      "Eritrea",
      "Algeria"
    ],
    "imageUrl": "https://flagcdn.com/w320/gm.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Guinea",
    "distractors": [
      "Ivory Coast",
      "Zambia",
      "Mozambique"
    ],
    "imageUrl": "https://flagcdn.com/w320/gn.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Equatorial Guinea",
    "distractors": [
      "Chad",
      "Liberia",
      "Sudan"
    ],
    "imageUrl": "https://flagcdn.com/w320/gq.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Greece",
    "distractors": [
      "North Macedonia",
      "Andorra",
      "Bosnia and Herzegovina"
    ],
    "imageUrl": "https://flagcdn.com/w320/gr.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Guatemala",
    "distractors": [
      "United States",
      "Argentina",
      "Nicaragua"
    ],
    "imageUrl": "https://flagcdn.com/w320/gt.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Guam",
    "distractors": [
      "Tonga",
      "Australia",
      "Samoa"
    ],
    "imageUrl": "https://flagcdn.com/w320/gu.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Guinea-Bissau",
    "distractors": [
      "Botswana",
      "Zimbabwe",
      "Libya"
    ],
    "imageUrl": "https://flagcdn.com/w320/gw.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Guyana",
    "distractors": [
      "Belize",
      "Haiti",
      "Cuba"
    ],
    "imageUrl": "https://flagcdn.com/w320/gy.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Hong Kong",
    "distractors": [
      "Myanmar",
      "Taiwan",
      "Vietnam"
    ],
    "imageUrl": "https://flagcdn.com/w320/hk.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Honduras",
    "distractors": [
      "Suriname",
      "Trinidad and Tobago",
      "Cura\u00e7ao"
    ],
    "imageUrl": "https://flagcdn.com/w320/hn.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Croatia",
    "distractors": [
      "Belarus",
      "Netherlands",
      "Latvia"
    ],
    "imageUrl": "https://flagcdn.com/w320/hr.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Haiti",
    "distractors": [
      "Puerto Rico",
      "Costa Rica",
      "Grenada"
    ],
    "imageUrl": "https://flagcdn.com/w320/ht.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Hungary",
    "distractors": [
      "Ireland",
      "San Marino",
      "Austria"
    ],
    "imageUrl": "https://flagcdn.com/w320/hu.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Indonesia",
    "distractors": [
      "Nepal",
      "Iraq",
      "Tajikistan"
    ],
    "imageUrl": "https://flagcdn.com/w320/id.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Ireland",
    "distractors": [
      "Liechtenstein",
      "Belarus",
      "Belgium"
    ],
    "imageUrl": "https://flagcdn.com/w320/ie.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Israel",
    "distractors": [
      "Japan",
      "Myanmar",
      "Malaysia"
    ],
    "imageUrl": "https://flagcdn.com/w320/il.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "India",
    "distractors": [
      "Macau",
      "Mongolia",
      "Myanmar"
    ],
    "imageUrl": "https://flagcdn.com/w320/in.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Iraq",
    "distractors": [
      "Macau",
      "Japan",
      "Bhutan"
    ],
    "imageUrl": "https://flagcdn.com/w320/iq.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Iran",
    "distractors": [
      "Yemen",
      "Brunei",
      "Pakistan"
    ],
    "imageUrl": "https://flagcdn.com/w320/ir.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Iceland",
    "distractors": [
      "Romania",
      "Sweden",
      "Denmark"
    ],
    "imageUrl": "https://flagcdn.com/w320/is.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Italy",
    "distractors": [
      "Bulgaria",
      "Lithuania",
      "Cyprus"
    ],
    "imageUrl": "https://flagcdn.com/w320/it.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Jamaica",
    "distractors": [
      "Guyana",
      "Guatemala",
      "Saint Vincent and the Grenadines"
    ],
    "imageUrl": "https://flagcdn.com/w320/jm.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Jordan",
    "distractors": [
      "Yemen",
      "Saudi Arabia",
      "Kuwait"
    ],
    "imageUrl": "https://flagcdn.com/w320/jo.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Japan",
    "distractors": [
      "North Korea",
      "Maldives",
      "Uzbekistan"
    ],
    "imageUrl": "https://flagcdn.com/w320/jp.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Kenya",
    "distractors": [
      "Cameroon",
      "The Gambia",
      "Equatorial Guinea"
    ],
    "imageUrl": "https://flagcdn.com/w320/ke.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Kyrgyzstan",
    "distractors": [
      "Nepal",
      "Laos",
      "Armenia"
    ],
    "imageUrl": "https://flagcdn.com/w320/kg.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Cambodia",
    "distractors": [
      "Myanmar",
      "India",
      "Armenia"
    ],
    "imageUrl": "https://flagcdn.com/w320/kh.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Kiribati",
    "distractors": [
      "Australia",
      "New Zealand",
      "Tonga"
    ],
    "imageUrl": "https://flagcdn.com/w320/ki.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Comoros",
    "distractors": [
      "Ivory Coast",
      "Niger",
      "Ghana"
    ],
    "imageUrl": "https://flagcdn.com/w320/km.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Saint Kitts and Nevis",
    "distractors": [
      "Panama",
      "Cura\u00e7ao",
      "El Salvador"
    ],
    "imageUrl": "https://flagcdn.com/w320/kn.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "North Korea",
    "distractors": [
      "Taiwan",
      "Cambodia",
      "Myanmar"
    ],
    "imageUrl": "https://flagcdn.com/w320/kp.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "South Korea",
    "distractors": [
      "Kazakhstan",
      "Armenia",
      "Bangladesh"
    ],
    "imageUrl": "https://flagcdn.com/w320/kr.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Kuwait",
    "distractors": [
      "Cambodia",
      "Myanmar",
      "Syria"
    ],
    "imageUrl": "https://flagcdn.com/w320/kw.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Cayman Islands",
    "distractors": [
      "Guatemala",
      "Canada",
      "Dominican Republic"
    ],
    "imageUrl": "https://flagcdn.com/w320/ky.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Kazakhstan",
    "distractors": [
      "Uzbekistan",
      "Qatar",
      "Kyrgyzstan"
    ],
    "imageUrl": "https://flagcdn.com/w320/kz.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Laos",
    "distractors": [
      "Tajikistan",
      "Iran",
      "China"
    ],
    "imageUrl": "https://flagcdn.com/w320/la.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Lebanon",
    "distractors": [
      "Pakistan",
      "Tajikistan",
      "Turkey"
    ],
    "imageUrl": "https://flagcdn.com/w320/lb.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Saint Lucia",
    "distractors": [
      "Guyana",
      "Bermuda",
      "Mexico"
    ],
    "imageUrl": "https://flagcdn.com/w320/lc.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Liechtenstein",
    "distractors": [
      "North Macedonia",
      "Russia",
      "Vatican City"
    ],
    "imageUrl": "https://flagcdn.com/w320/li.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Sri Lanka",
    "distractors": [
      "Lebanon",
      "Nepal",
      "Kazakhstan"
    ],
    "imageUrl": "https://flagcdn.com/w320/lk.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Liberia",
    "distractors": [
      "Botswana",
      "Uganda",
      "South Africa"
    ],
    "imageUrl": "https://flagcdn.com/w320/lr.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Lesotho",
    "distractors": [
      "Malawi",
      "Guinea",
      "Mozambique"
    ],
    "imageUrl": "https://flagcdn.com/w320/ls.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Lithuania",
    "distractors": [
      "Vatican City",
      "Hungary",
      "Ireland"
    ],
    "imageUrl": "https://flagcdn.com/w320/lt.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Luxembourg",
    "distractors": [
      "United Kingdom",
      "Russia",
      "Latvia"
    ],
    "imageUrl": "https://flagcdn.com/w320/lu.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Latvia",
    "distractors": [
      "Kosovo",
      "Spain",
      "Finland"
    ],
    "imageUrl": "https://flagcdn.com/w320/lv.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Libya",
    "distractors": [
      "Zimbabwe",
      "Guinea",
      "Nigeria"
    ],
    "imageUrl": "https://flagcdn.com/w320/ly.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Morocco",
    "distractors": [
      "The Gambia",
      "Zimbabwe",
      "Nigeria"
    ],
    "imageUrl": "https://flagcdn.com/w320/ma.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Monaco",
    "distractors": [
      "Vatican City",
      "Ukraine",
      "Ireland"
    ],
    "imageUrl": "https://flagcdn.com/w320/mc.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Moldova",
    "distractors": [
      "Germany",
      "Croatia",
      "North Macedonia"
    ],
    "imageUrl": "https://flagcdn.com/w320/md.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Montenegro",
    "distractors": [
      "Germany",
      "Belgium",
      "Greece"
    ],
    "imageUrl": "https://flagcdn.com/w320/me.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Madagascar",
    "distractors": [
      "Zambia",
      "Republic of the Congo",
      "The Gambia"
    ],
    "imageUrl": "https://flagcdn.com/w320/mg.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Marshall Islands",
    "distractors": [
      "French Polynesia",
      "Vanuatu",
      "Samoa"
    ],
    "imageUrl": "https://flagcdn.com/w320/mh.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "North Macedonia",
    "distractors": [
      "Belgium",
      "Bulgaria",
      "Montenegro"
    ],
    "imageUrl": "https://flagcdn.com/w320/mk.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Mali",
    "distractors": [
      "Cameroon",
      "Seychelles",
      "Chad"
    ],
    "imageUrl": "https://flagcdn.com/w320/ml.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Myanmar",
    "distractors": [
      "North Korea",
      "Afghanistan",
      "Laos"
    ],
    "imageUrl": "https://flagcdn.com/w320/mm.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Mongolia",
    "distractors": [
      "South Korea",
      "Syria",
      "North Korea"
    ],
    "imageUrl": "https://flagcdn.com/w320/mn.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Macau",
    "distractors": [
      "United Arab Emirates",
      "Philippines",
      "Azerbaijan"
    ],
    "imageUrl": "https://flagcdn.com/w320/mo.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Mauritania",
    "distractors": [
      "Rwanda",
      "Nigeria",
      "Chad"
    ],
    "imageUrl": "https://flagcdn.com/w320/mr.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Malta",
    "distractors": [
      "Estonia",
      "Bulgaria",
      "Croatia"
    ],
    "imageUrl": "https://flagcdn.com/w320/mt.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Mauritius",
    "distractors": [
      "Rwanda",
      "Senegal",
      "Republic of the Congo"
    ],
    "imageUrl": "https://flagcdn.com/w320/mu.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Maldives",
    "distractors": [
      "Palestine",
      "Thailand",
      "Tajikistan"
    ],
    "imageUrl": "https://flagcdn.com/w320/mv.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Malawi",
    "distractors": [
      "Somalia",
      "Liberia",
      "Cameroon"
    ],
    "imageUrl": "https://flagcdn.com/w320/mw.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Mexico",
    "distractors": [
      "Guatemala",
      "Greenland",
      "Saint Vincent and the Grenadines"
    ],
    "imageUrl": "https://flagcdn.com/w320/mx.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Malaysia",
    "distractors": [
      "Oman",
      "Tajikistan",
      "Japan"
    ],
    "imageUrl": "https://flagcdn.com/w320/my.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Mozambique",
    "distractors": [
      "Angola",
      "Morocco",
      "Cameroon"
    ],
    "imageUrl": "https://flagcdn.com/w320/mz.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Namibia",
    "distractors": [
      "Benin",
      "Tunisia",
      "Guinea-Bissau"
    ],
    "imageUrl": "https://flagcdn.com/w320/na.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Niger",
    "distractors": [
      "Ethiopia",
      "Senegal",
      "Zambia"
    ],
    "imageUrl": "https://flagcdn.com/w320/ne.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Nigeria",
    "distractors": [
      "Somalia",
      "Zimbabwe",
      "Madagascar"
    ],
    "imageUrl": "https://flagcdn.com/w320/ng.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Nicaragua",
    "distractors": [
      "Suriname",
      "Cuba",
      "United States"
    ],
    "imageUrl": "https://flagcdn.com/w320/ni.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Netherlands",
    "distractors": [
      "Serbia",
      "Faroe Islands",
      "Liechtenstein"
    ],
    "imageUrl": "https://flagcdn.com/w320/nl.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Norway",
    "distractors": [
      "Croatia",
      "Ukraine",
      "Andorra"
    ],
    "imageUrl": "https://flagcdn.com/w320/no.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Nepal",
    "distractors": [
      "Saudi Arabia",
      "Cambodia",
      "Timor-Leste"
    ],
    "imageUrl": "https://flagcdn.com/w320/np.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Nauru",
    "distractors": [
      "Tuvalu",
      "Vanuatu",
      "Australia"
    ],
    "imageUrl": "https://flagcdn.com/w320/nr.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "New Zealand",
    "distractors": [
      "Solomon Islands",
      "Micronesia",
      "French Polynesia"
    ],
    "imageUrl": "https://flagcdn.com/w320/nz.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Oman",
    "distractors": [
      "Bahrain",
      "Cambodia",
      "Azerbaijan"
    ],
    "imageUrl": "https://flagcdn.com/w320/om.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Panama",
    "distractors": [
      "Canada",
      "Uruguay",
      "Cuba"
    ],
    "imageUrl": "https://flagcdn.com/w320/pa.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Peru",
    "distractors": [
      "Nicaragua",
      "Guyana",
      "Aruba"
    ],
    "imageUrl": "https://flagcdn.com/w320/pe.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "French Polynesia",
    "distractors": [
      "Nauru",
      "Tonga",
      "Kiribati"
    ],
    "imageUrl": "https://flagcdn.com/w320/pf.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Papua New Guinea",
    "distractors": [
      "Tuvalu",
      "French Polynesia",
      "Guam"
    ],
    "imageUrl": "https://flagcdn.com/w320/pg.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Philippines",
    "distractors": [
      "United Arab Emirates",
      "Macau",
      "Saudi Arabia"
    ],
    "imageUrl": "https://flagcdn.com/w320/ph.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Pakistan",
    "distractors": [
      "Maldives",
      "Bangladesh",
      "Malaysia"
    ],
    "imageUrl": "https://flagcdn.com/w320/pk.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Poland",
    "distractors": [
      "Luxembourg",
      "Italy",
      "Finland"
    ],
    "imageUrl": "https://flagcdn.com/w320/pl.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Puerto Rico",
    "distractors": [
      "Saint Vincent and the Grenadines",
      "Bahamas",
      "Grenada"
    ],
    "imageUrl": "https://flagcdn.com/w320/pr.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Palestine",
    "distractors": [
      "Tajikistan",
      "Kuwait",
      "Iraq"
    ],
    "imageUrl": "https://flagcdn.com/w320/ps.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Portugal",
    "distractors": [
      "San Marino",
      "Albania",
      "France"
    ],
    "imageUrl": "https://flagcdn.com/w320/pt.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Palau",
    "distractors": [
      "Vanuatu",
      "Tonga",
      "Nauru"
    ],
    "imageUrl": "https://flagcdn.com/w320/pw.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Paraguay",
    "distractors": [
      "Saint Lucia",
      "Bermuda",
      "Guatemala"
    ],
    "imageUrl": "https://flagcdn.com/w320/py.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Qatar",
    "distractors": [
      "Sri Lanka",
      "Yemen",
      "Afghanistan"
    ],
    "imageUrl": "https://flagcdn.com/w320/qa.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Romania",
    "distractors": [
      "Monaco",
      "Bulgaria",
      "Finland"
    ],
    "imageUrl": "https://flagcdn.com/w320/ro.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Serbia",
    "distractors": [
      "Liechtenstein",
      "Belarus",
      "Czech Republic"
    ],
    "imageUrl": "https://flagcdn.com/w320/rs.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Russia",
    "distractors": [
      "Estonia",
      "Denmark",
      "Belarus"
    ],
    "imageUrl": "https://flagcdn.com/w320/ru.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Rwanda",
    "distractors": [
      "Chad",
      "Burkina Faso",
      "South Sudan"
    ],
    "imageUrl": "https://flagcdn.com/w320/rw.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Saudi Arabia",
    "distractors": [
      "Bahrain",
      "Uzbekistan",
      "Thailand"
    ],
    "imageUrl": "https://flagcdn.com/w320/sa.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Solomon Islands",
    "distractors": [
      "Australia",
      "French Polynesia",
      "Papua New Guinea"
    ],
    "imageUrl": "https://flagcdn.com/w320/sb.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Seychelles",
    "distractors": [
      "DR Congo",
      "Somalia",
      "Sudan"
    ],
    "imageUrl": "https://flagcdn.com/w320/sc.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Sudan",
    "distractors": [
      "Zambia",
      "Libya",
      "Zimbabwe"
    ],
    "imageUrl": "https://flagcdn.com/w320/sd.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Sweden",
    "distractors": [
      "Serbia",
      "Spain",
      "Czech Republic"
    ],
    "imageUrl": "https://flagcdn.com/w320/se.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Singapore",
    "distractors": [
      "Laos",
      "Taiwan",
      "Pakistan"
    ],
    "imageUrl": "https://flagcdn.com/w320/sg.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Slovenia",
    "distractors": [
      "Belgium",
      "Belarus",
      "France"
    ],
    "imageUrl": "https://flagcdn.com/w320/si.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Slovakia",
    "distractors": [
      "Greece",
      "Belarus",
      "Belgium"
    ],
    "imageUrl": "https://flagcdn.com/w320/sk.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Sierra Leone",
    "distractors": [
      "Zambia",
      "Libya",
      "Gabon"
    ],
    "imageUrl": "https://flagcdn.com/w320/sl.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "San Marino",
    "distractors": [
      "Monaco",
      "Cyprus",
      "Estonia"
    ],
    "imageUrl": "https://flagcdn.com/w320/sm.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Senegal",
    "distractors": [
      "Central African Republic",
      "Republic of the Congo",
      "Equatorial Guinea"
    ],
    "imageUrl": "https://flagcdn.com/w320/sn.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Somalia",
    "distractors": [
      "South Sudan",
      "Sudan",
      "Mali"
    ],
    "imageUrl": "https://flagcdn.com/w320/so.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Suriname",
    "distractors": [
      "Haiti",
      "Bolivia",
      "Belize"
    ],
    "imageUrl": "https://flagcdn.com/w320/sr.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "South Sudan",
    "distractors": [
      "Lesotho",
      "Morocco",
      "Mozambique"
    ],
    "imageUrl": "https://flagcdn.com/w320/ss.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "S\u00e3o Tom\u00e9 and Pr\u00edncipe",
    "distractors": [
      "South Africa",
      "Botswana",
      "Egypt"
    ],
    "imageUrl": "https://flagcdn.com/w320/st.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "El Salvador",
    "distractors": [
      "Ecuador",
      "Saint Lucia",
      "Costa Rica"
    ],
    "imageUrl": "https://flagcdn.com/w320/sv.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Syria",
    "distractors": [
      "Hong Kong",
      "Japan",
      "Brunei"
    ],
    "imageUrl": "https://flagcdn.com/w320/sy.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Eswatini",
    "distractors": [
      "Eritrea",
      "Guinea-Bissau",
      "Morocco"
    ],
    "imageUrl": "https://flagcdn.com/w320/sz.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Chad",
    "distractors": [
      "Equatorial Guinea",
      "Ivory Coast",
      "South Africa"
    ],
    "imageUrl": "https://flagcdn.com/w320/td.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Togo",
    "distractors": [
      "Cabo Verde",
      "Ethiopia",
      "Equatorial Guinea"
    ],
    "imageUrl": "https://flagcdn.com/w320/tg.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Thailand",
    "distractors": [
      "Syria",
      "Taiwan",
      "Yemen"
    ],
    "imageUrl": "https://flagcdn.com/w320/th.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Tajikistan",
    "distractors": [
      "Qatar",
      "South Korea",
      "Afghanistan"
    ],
    "imageUrl": "https://flagcdn.com/w320/tj.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Timor-Leste",
    "distractors": [
      "Nepal",
      "Palestine",
      "Tajikistan"
    ],
    "imageUrl": "https://flagcdn.com/w320/tl.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Turkmenistan",
    "distractors": [
      "Japan",
      "India",
      "Tajikistan"
    ],
    "imageUrl": "https://flagcdn.com/w320/tm.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Tunisia",
    "distractors": [
      "Egypt",
      "Sierra Leone",
      "Cameroon"
    ],
    "imageUrl": "https://flagcdn.com/w320/tn.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Tonga",
    "distractors": [
      "French Polynesia",
      "Palau",
      "New Zealand"
    ],
    "imageUrl": "https://flagcdn.com/w320/to.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Turkey",
    "distractors": [
      "Turkmenistan",
      "Timor-Leste",
      "Yemen"
    ],
    "imageUrl": "https://flagcdn.com/w320/tr.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Trinidad and Tobago",
    "distractors": [
      "Suriname",
      "Panama",
      "Bolivia"
    ],
    "imageUrl": "https://flagcdn.com/w320/tt.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Tuvalu",
    "distractors": [
      "Papua New Guinea",
      "French Polynesia",
      "Vanuatu"
    ],
    "imageUrl": "https://flagcdn.com/w320/tv.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Taiwan",
    "distractors": [
      "Hong Kong",
      "Indonesia",
      "Philippines"
    ],
    "imageUrl": "https://flagcdn.com/w320/tw.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Tanzania",
    "distractors": [
      "Botswana",
      "Malawi",
      "Sierra Leone"
    ],
    "imageUrl": "https://flagcdn.com/w320/tz.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Ukraine",
    "distractors": [
      "San Marino",
      "Slovakia",
      "Vatican City"
    ],
    "imageUrl": "https://flagcdn.com/w320/ua.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Uganda",
    "distractors": [
      "South Africa",
      "Burundi",
      "Djibouti"
    ],
    "imageUrl": "https://flagcdn.com/w320/ug.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "United States",
    "distractors": [
      "Trinidad and Tobago",
      "Saint Kitts and Nevis",
      "Uruguay"
    ],
    "imageUrl": "https://flagcdn.com/w320/us.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Uruguay",
    "distractors": [
      "Grenada",
      "Antigua and Barbuda",
      "Venezuela"
    ],
    "imageUrl": "https://flagcdn.com/w320/uy.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Uzbekistan",
    "distractors": [
      "Singapore",
      "United Arab Emirates",
      "Saudi Arabia"
    ],
    "imageUrl": "https://flagcdn.com/w320/uz.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Vatican City",
    "distractors": [
      "North Macedonia",
      "France",
      "Norway"
    ],
    "imageUrl": "https://flagcdn.com/w320/va.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Saint Vincent and the Grenadines",
    "distractors": [
      "Greenland",
      "Cura\u00e7ao",
      "El Salvador"
    ],
    "imageUrl": "https://flagcdn.com/w320/vc.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Venezuela",
    "distractors": [
      "Greenland",
      "United States",
      "Chile"
    ],
    "imageUrl": "https://flagcdn.com/w320/ve.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Vietnam",
    "distractors": [
      "Kuwait",
      "Iraq",
      "Philippines"
    ],
    "imageUrl": "https://flagcdn.com/w320/vn.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Vanuatu",
    "distractors": [
      "Palau",
      "Tuvalu",
      "French Polynesia"
    ],
    "imageUrl": "https://flagcdn.com/w320/vu.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Samoa",
    "distractors": [
      "Tonga",
      "Australia",
      "Kiribati"
    ],
    "imageUrl": "https://flagcdn.com/w320/ws.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Kosovo",
    "distractors": [
      "Serbia",
      "Bulgaria",
      "Belarus"
    ],
    "imageUrl": "https://flagcdn.com/w320/xk.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Yemen",
    "distractors": [
      "United Arab Emirates",
      "Lebanon",
      "Kazakhstan"
    ],
    "imageUrl": "https://flagcdn.com/w320/ye.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "South Africa",
    "distractors": [
      "Nigeria",
      "Zimbabwe",
      "The Gambia"
    ],
    "imageUrl": "https://flagcdn.com/w320/za.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Zambia",
    "distractors": [
      "Rwanda",
      "S\u00e3o Tom\u00e9 and Pr\u00edncipe",
      "Lesotho"
    ],
    "imageUrl": "https://flagcdn.com/w320/zm.png"
  },
  {
    "category": "flags",
    "text": "Which country does this flag belong to?",
    "correct": "Zimbabwe",
    "distractors": [
      "S\u00e3o Tom\u00e9 and Pr\u00edncipe",
      "Sierra Leone",
      "Mauritania"
    ],
    "imageUrl": "https://flagcdn.com/w320/zw.png"
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
    "text": "Which brand or company does this logo represent?",
    "correct": "Apple",
    "distractors": [
          "Microsoft",
          "Google",
          "Samsung"
    ],
    "imageUrl": "https://cdn.simpleicons.org/apple"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Google",
    "distractors": [
          "Microsoft",
          "Yahoo",
          "Baidu"
    ],
    "imageUrl": "https://cdn.simpleicons.org/google"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Amazon",
    "distractors": [
          "Alibaba",
          "eBay",
          "Walmart"
    ],
    "imageUrl": "https://cdn.simpleicons.org/amazon"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Meta",
    "distractors": [
          "Twitter",
          "ByteDance",
          "Snapchat"
    ],
    "imageUrl": "https://cdn.simpleicons.org/meta"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Netflix",
    "distractors": [
          "Hulu",
          "Disney+",
          "HBO Max"
    ],
    "imageUrl": "https://cdn.simpleicons.org/netflix"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Spotify",
    "distractors": [
          "Deezer",
          "Tidal",
          "Pandora"
    ],
    "imageUrl": "https://cdn.simpleicons.org/spotify"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "YouTube",
    "distractors": [
          "Vimeo",
          "Dailymotion",
          "Twitch"
    ],
    "imageUrl": "https://cdn.simpleicons.org/youtube"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Twitter / X",
    "distractors": [
          "Threads",
          "Mastodon",
          "Bluesky"
    ],
    "imageUrl": "https://cdn.simpleicons.org/x"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Instagram",
    "distractors": [
          "Pinterest",
          "Snapchat",
          "TikTok"
    ],
    "imageUrl": "https://cdn.simpleicons.org/instagram"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "TikTok",
    "distractors": [
          "Snapchat",
          "Triller",
          "Likee"
    ],
    "imageUrl": "https://cdn.simpleicons.org/tiktok"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Android",
    "distractors": [
          "Apple iOS",
          "Windows Phone",
          "Ubuntu Touch"
    ],
    "imageUrl": "https://cdn.simpleicons.org/android"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Intel",
    "distractors": [
          "AMD",
          "Qualcomm",
          "NVIDIA"
    ],
    "imageUrl": "https://cdn.simpleicons.org/intel"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "NVIDIA",
    "distractors": [
          "AMD",
          "Intel",
          "ARM"
    ],
    "imageUrl": "https://cdn.simpleicons.org/nvidia"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Uber",
    "distractors": [
          "Lyft",
          "Bolt",
          "Grab"
    ],
    "imageUrl": "https://cdn.simpleicons.org/uber"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Airbnb",
    "distractors": [
          "Booking.com",
          "Expedia",
          "Vrbo"
    ],
    "imageUrl": "https://cdn.simpleicons.org/airbnb"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Snapchat",
    "distractors": [
          "Instagram",
          "TikTok",
          "BeReal"
    ],
    "imageUrl": "https://cdn.simpleicons.org/snapchat"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Reddit",
    "distractors": [
          "Quora",
          "Digg",
          "Tumblr"
    ],
    "imageUrl": "https://cdn.simpleicons.org/reddit"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "WhatsApp",
    "distractors": [
          "Telegram",
          "Signal",
          "Viber"
    ],
    "imageUrl": "https://cdn.simpleicons.org/whatsapp"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "GitHub",
    "distractors": [
          "GitLab",
          "Bitbucket",
          "SourceForge"
    ],
    "imageUrl": "https://cdn.simpleicons.org/github"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Discord",
    "distractors": [
          "TeamSpeak",
          "Slack",
          "Skype"
    ],
    "imageUrl": "https://cdn.simpleicons.org/discord"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Slack",
    "distractors": [
          "Microsoft Teams",
          "Zoom",
          "Asana"
    ],
    "imageUrl": "https://cdn.simpleicons.org/slack"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "OpenAI",
    "distractors": [
          "Anthropic",
          "DeepMind",
          "Mistral"
    ],
    "imageUrl": "https://cdn.simpleicons.org/openai"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Ferrari",
    "distractors": [
          "Lamborghini",
          "Porsche",
          "Maserati"
    ],
    "imageUrl": "https://cdn.simpleicons.org/ferrari"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Lamborghini",
    "distractors": [
          "Ferrari",
          "Bugatti",
          "McLaren"
    ],
    "imageUrl": "https://cdn.simpleicons.org/lamborghini"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Porsche",
    "distractors": [
          "BMW",
          "Audi",
          "Mercedes-Benz"
    ],
    "imageUrl": "https://cdn.simpleicons.org/porsche"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "BMW",
    "distractors": [
          "Mercedes-Benz",
          "Audi",
          "Lexus"
    ],
    "imageUrl": "https://cdn.simpleicons.org/bmw"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Mercedes-Benz",
    "distractors": [
          "BMW",
          "Audi",
          "Rolls-Royce"
    ],
    "imageUrl": "https://cdn.simpleicons.org/mercedes"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Audi",
    "distractors": [
          "Volkswagen",
          "BMW",
          "Volvo"
    ],
    "imageUrl": "https://cdn.simpleicons.org/audi"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Tesla",
    "distractors": [
          "Rivian",
          "Lucid Motors",
          "Polestar"
    ],
    "imageUrl": "https://cdn.simpleicons.org/tesla"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Toyota",
    "distractors": [
          "Honda",
          "Nissan",
          "Mazda"
    ],
    "imageUrl": "https://cdn.simpleicons.org/toyota"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Volkswagen",
    "distractors": [
          "Skoda",
          "Opel",
          "Seat"
    ],
    "imageUrl": "https://cdn.simpleicons.org/volkswagen"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Ford",
    "distractors": [
          "Chevrolet",
          "Dodge",
          "GMC"
    ],
    "imageUrl": "https://cdn.simpleicons.org/ford"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Honda",
    "distractors": [
          "Toyota",
          "Suzuki",
          "Subaru"
    ],
    "imageUrl": "https://cdn.simpleicons.org/honda"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Hyundai",
    "distractors": [
          "Kia",
          "Genesis",
          "Mitsubishi"
    ],
    "imageUrl": "https://cdn.simpleicons.org/hyundai"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Nissan",
    "distractors": [
          "Infiniti",
          "Toyota",
          "Mazda"
    ],
    "imageUrl": "https://cdn.simpleicons.org/nissan"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Rolls-Royce",
    "distractors": [
          "Bentley",
          "Maybach",
          "Aston Martin"
    ],
    "imageUrl": "https://cdn.simpleicons.org/rollsroyce"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Aston Martin",
    "distractors": [
          "Jaguar",
          "Lotus",
          "Maserati"
    ],
    "imageUrl": "https://cdn.simpleicons.org/astonmartin"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Bugatti",
    "distractors": [
          "Koenigsegg",
          "Pagani",
          "Ferrari"
    ],
    "imageUrl": "https://cdn.simpleicons.org/bugatti"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Jeep",
    "distractors": [
          "Land Rover",
          "RAM",
          "Subaru"
    ],
    "imageUrl": "https://cdn.simpleicons.org/jeep"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Volvo",
    "distractors": [
          "Saab",
          "Polestar",
          "Audi"
    ],
    "imageUrl": "https://cdn.simpleicons.org/volvo"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Nike",
    "distractors": [
          "Adidas",
          "Puma",
          "Reebok"
    ],
    "imageUrl": "https://cdn.simpleicons.org/nike"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Adidas",
    "distractors": [
          "Nike",
          "Puma",
          "Under Armour"
    ],
    "imageUrl": "https://cdn.simpleicons.org/adidas"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Puma",
    "distractors": [
          "Adidas",
          "Reebok",
          "Fila"
    ],
    "imageUrl": "https://cdn.simpleicons.org/puma"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Under Armour",
    "distractors": [
          "Nike",
          "Gymshark",
          "Lululemon"
    ],
    "imageUrl": "https://cdn.simpleicons.org/underarmour"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Reebok",
    "distractors": [
          "New Balance",
          "Asics",
          "Brooks"
    ],
    "imageUrl": "https://cdn.simpleicons.org/reebok"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Fila",
    "distractors": [
          "Ellesse",
          "Kappa",
          "Champion"
    ],
    "imageUrl": "https://cdn.simpleicons.org/fila"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "The North Face",
    "distractors": [
          "Patagonia",
          "Columbia",
          "Arc'teryx"
    ],
    "imageUrl": "https://cdn.simpleicons.org/thenorthface"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "McDonald's",
    "distractors": [
          "Burger King",
          "Wendy's",
          "KFC"
    ],
    "imageUrl": "https://cdn.simpleicons.org/mcdonalds"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Starbucks",
    "distractors": [
          "Costa Coffee",
          "Dunkin'",
          "Tim Hortons"
    ],
    "imageUrl": "https://cdn.simpleicons.org/starbucks"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Burger King",
    "distractors": [
          "McDonald's",
          "Wendy's",
          "Five Guys"
    ],
    "imageUrl": "https://cdn.simpleicons.org/burgerking"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "KFC",
    "distractors": [
          "Popeyes",
          "Church's Chicken",
          "Jollibee"
    ],
    "imageUrl": "https://cdn.simpleicons.org/kfc"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Red Bull",
    "distractors": [
          "Monster Energy",
          "Rockstar",
          "Bang Energy"
    ],
    "imageUrl": "https://cdn.simpleicons.org/redbull"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Coca-Cola",
    "distractors": [
          "Pepsi",
          "Dr Pepper",
          "RC Cola"
    ],
    "imageUrl": "https://cdn.simpleicons.org/cocacola"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Taco Bell",
    "distractors": [
          "Chipotle",
          "Del Taco",
          "Qdoba"
    ],
    "imageUrl": "https://cdn.simpleicons.org/tacobell"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "PlayStation",
    "distractors": [
          "Xbox",
          "Nintendo",
          "Sega"
    ],
    "imageUrl": "https://cdn.simpleicons.org/playstation"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Nintendo",
    "distractors": [
          "PlayStation",
          "Atari",
          "Xbox"
    ],
    "imageUrl": "https://cdn.simpleicons.org/nintendo"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Warner Bros.",
    "distractors": [
          "Universal Pictures",
          "Paramount",
          "Sony Pictures"
    ],
    "imageUrl": "https://cdn.simpleicons.org/warnerbros"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Sega",
    "distractors": [
          "Capcom",
          "Konami",
          "Bandai Namco"
    ],
    "imageUrl": "https://cdn.simpleicons.org/sega"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Twitch",
    "distractors": [
          "Kick",
          "YouTube Live",
          "Mixer"
    ],
    "imageUrl": "https://cdn.simpleicons.org/twitch"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Steam",
    "distractors": [
          "Epic Games Store",
          "GOG",
          "Origin"
    ],
    "imageUrl": "https://cdn.simpleicons.org/steam"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Epic Games",
    "distractors": [
          "Valve",
          "Blizzard",
          "Ubisoft"
    ],
    "imageUrl": "https://cdn.simpleicons.org/epicgames"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Atari",
    "distractors": [
          "Commodore",
          "ColecoVision",
          "Amiga"
    ],
    "imageUrl": "https://cdn.simpleicons.org/atari"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Visa",
    "distractors": [
          "Mastercard",
          "American Express",
          "Discover"
    ],
    "imageUrl": "https://cdn.simpleicons.org/visa"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Mastercard",
    "distractors": [
          "Visa",
          "Maestro",
          "Cirrus"
    ],
    "imageUrl": "https://cdn.simpleicons.org/mastercard"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "PayPal",
    "distractors": [
          "Venmo",
          "Stripe",
          "Square"
    ],
    "imageUrl": "https://cdn.simpleicons.org/paypal"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "IKEA",
    "distractors": [
          "Wayfair",
          "JYSK",
          "Ashley Furniture"
    ],
    "imageUrl": "https://cdn.simpleicons.org/ikea"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Walmart",
    "distractors": [
          "Target",
          "Costco",
          "Kroger"
    ],
    "imageUrl": "https://cdn.simpleicons.org/walmart"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Target",
    "distractors": [
          "Walmart",
          "Kmart",
          "Macy's"
    ],
    "imageUrl": "https://cdn.simpleicons.org/target"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "FedEx",
    "distractors": [
          "UPS",
          "DHL",
          "USPS"
    ],
    "imageUrl": "https://cdn.simpleicons.org/fedex"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "eBay",
    "distractors": [
          "Etsy",
          "Amazon",
          "Mercari"
    ],
    "imageUrl": "https://cdn.simpleicons.org/ebay"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Stripe",
    "distractors": [
          "Adyen",
          "Square",
          "Authorize.Net"
    ],
    "imageUrl": "https://cdn.simpleicons.org/stripe"
  },
  {
    "category": "logos_brands",
    "text": "Which brand or company does this logo represent?",
    "correct": "Shopify",
    "distractors": [
          "WooCommerce",
          "Magento",
          "BigCommerce"
    ],
    "imageUrl": "https://cdn.simpleicons.org/shopify"
  },

  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Lion",
    "distractors": [
          "Tiger",
          "Leopard",
          "Cheetah"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a6/020_The_lion_king_Snyggve_in_the_Serengeti_National_Park_Photo_by_Giles_Laurent.jpg/330px-020_The_lion_king_Snyggve_in_the_Serengeti_National_Park_Photo_by_Giles_Laurent.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Cheetah",
    "distractors": [
          "Leopard",
          "Jaguar",
          "Serval"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/92/Male_cheetah_facing_left_in_South_Africa.jpg/330px-Male_cheetah_facing_left_in_South_Africa.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "African Elephant",
    "distractors": [
          "Asian Elephant",
          "Hippopotamus",
          "Rhinoceros"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bf/African_Elephant_%28Loxodonta_africana%29_male_%2817289351322%29.jpg/330px-African_Elephant_%28Loxodonta_africana%29_male_%2817289351322%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Giraffe",
    "distractors": [
          "Okapi",
          "Zebra",
          "Antelope"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9e/Giraffe_Mikumi_National_Park.jpg/330px-Giraffe_Mikumi_National_Park.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Plains Zebra",
    "distractors": [
          "Wild Ass",
          "Okapi",
          "Wildebeest"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/45/Equus_quagga_burchellii_-_Etosha%2C_2014.jpg/330px-Equus_quagga_burchellii_-_Etosha%2C_2014.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Bengal Tiger",
    "distractors": [
          "Lion",
          "Jaguar",
          "Leopard"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/84/Bengal_tiger_in_Sanjay_Dubri_Tiger_Reserve_December_2024_by_Tisha_Mukherjee_11.jpg/330px-Bengal_tiger_in_Sanjay_Dubri_Tiger_Reserve_December_2024_by_Tisha_Mukherjee_11.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Leopard",
    "distractors": [
          "Jaguar",
          "Cheetah",
          "Snow Leopard"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/70/African_leopard_male_%28cropped%29.jpg/330px-African_leopard_male_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Hippopotamus",
    "distractors": [
          "Rhinoceros",
          "Water Buffalo",
          "Tapir"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f2/Portrait_Hippopotamus_in_the_water.jpg/330px-Portrait_Hippopotamus_in_the_water.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "White Rhinoceros",
    "distractors": [
          "Hippopotamus",
          "African Elephant",
          "Water Buffalo"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/28/109_Male_White_rhinoceros_walking_in_the_Kalahari_Desert_of_Namibia_Photo_by_Giles_Laurent.jpg/330px-109_Male_White_rhinoceros_walking_in_the_Kalahari_Desert_of_Namibia_Photo_by_Giles_Laurent.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Western Gorilla",
    "distractors": [
          "Chimpanzee",
          "Orangutan",
          "Baboon"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/50/Male_gorilla_in_SF_zoo.jpg/330px-Male_gorilla_in_SF_zoo.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Chimpanzee",
    "distractors": [
          "Bonobo",
          "Gorilla",
          "Orangutan"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/42/015_Chimpanzee_at_Kibale_forest_National_Park_Photo_by_Giles_Laurent.jpg/330px-015_Chimpanzee_at_Kibale_forest_National_Park_Photo_by_Giles_Laurent.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Red Kangaroo",
    "distractors": [
          "Wallaby",
          "Wombat",
          "Koala"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f1/Red_kangaroo_-_melbourne_zoo.jpg/330px-Red_kangaroo_-_melbourne_zoo.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Koala",
    "distractors": [
          "Wombat",
          "Sloth",
          "Quokka"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/49/Koala_climbing_tree.jpg/330px-Koala_climbing_tree.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Grizzly Bear",
    "distractors": [
          "Black Bear",
          "Polar Bear",
          "Brown Bear"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a9/GrizzlyBearJeanBeaufort.jpg/330px-GrizzlyBearJeanBeaufort.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Gray Wolf",
    "distractors": [
          "Coyote",
          "Dingo",
          "Jackal"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/68/Eurasian_wolf_2.jpg/330px-Eurasian_wolf_2.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Meerkat",
    "distractors": [
          "Prairie Dog",
          "Mongoose",
          "Suricate"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9a/Meerkat_%28Suricata_suricatta%29_Tswalu.jpg/330px-Meerkat_%28Suricata_suricatta%29_Tswalu.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Giant Panda",
    "distractors": [
          "Red Panda",
          "Sun Bear",
          "Sloth Bear"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0f/Grosser_Panda.JPG/330px-Grosser_Panda.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Red Panda",
    "distractors": [
          "Raccoon",
          "Giant Panda",
          "Coati"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fd/Red_Panda%2C_Gentle_Tree-Dweller_of_the_Himalayas.jpg/330px-Red_Panda%2C_Gentle_Tree-Dweller_of_the_Himalayas.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Brown-throated Sloth",
    "distractors": [
          "Koala",
          "Anteater",
          "Tamandua"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/18/Bradypus.jpg/330px-Bradypus.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Jaguar",
    "distractors": [
          "Leopard",
          "Cheetah",
          "Cougar"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0a/Standing_jaguar.jpg/330px-Standing_jaguar.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Spotted Hyena",
    "distractors": [
          "Wild Dog",
          "Jackal",
          "Aardwolf"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dc/Spotted_hyena_%28Crocuta_crocuta%29.jpg/330px-Spotted_hyena_%28Crocuta_crocuta%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Red Fox",
    "distractors": [
          "Arctic Fox",
          "Coyote",
          "Fennec Fox"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d2/Portrait_of_a_red_fox_in_Rautas_fj%C3%A4llurskog_%28cropped%29.jpg/330px-Portrait_of_a_red_fox_in_Rautas_fj%C3%A4llurskog_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Bornean Orangutan",
    "distractors": [
          "Chimpanzee",
          "Gorilla",
          "Gibbon"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d6/Tanjung_Puting30477.jpg/330px-Tanjung_Puting30477.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Fennec Fox",
    "distractors": [
          "Bat-eared Fox",
          "Kit Fox",
          "Red Fox"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9f/Fennec_Fox_Vulpes_zerda.jpg/330px-Fennec_Fox_Vulpes_zerda.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Common Warthog",
    "distractors": [
          "Wild Boar",
          "Peccary",
          "Babirusa"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/45/Southern_warthog_%28Phacochoerus_africanus_sundevallii%29_male.jpg/330px-Southern_warthog_%28Phacochoerus_africanus_sundevallii%29_male.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Blue Whale",
    "distractors": [
          "Humpback Whale",
          "Fin Whale",
          "Bowhead Whale"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1c/Anim1754_-_Flickr_-_NOAA_Photo_Library.jpg/330px-Anim1754_-_Flickr_-_NOAA_Photo_Library.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Humpback Whale",
    "distractors": [
          "Blue Whale",
          "Fin Whale",
          "Gray Whale"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d7/Humpback_whale_breaching_off_Cabo_San_Lucas.jpg/330px-Humpback_whale_breaching_off_Cabo_San_Lucas.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Great White Shark",
    "distractors": [
          "Tiger Shark",
          "Bull Shark",
          "Mako Shark"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/56/White_shark.jpg/330px-White_shark.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Bottlenose Dolphin",
    "distractors": [
          "Porpoise",
          "Orca",
          "Beluga Whale"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bc/Tursiops_truncatus_01-cropped.jpg/330px-Tursiops_truncatus_01-cropped.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Orca (Killer Whale)",
    "distractors": [
          "False Killer Whale",
          "Pilot Whale",
          "Dolphin"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/37/Killerwhales_jumping.jpg/330px-Killerwhales_jumping.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Green Sea Turtle",
    "distractors": [
          "Loggerhead Turtle",
          "Hawksbill Turtle",
          "Leatherback Turtle"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a3/Green_sea_turtle_%28Chelonia_mydas%29_Moorea.jpg/330px-Green_sea_turtle_%28Chelonia_mydas%29_Moorea.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Sea Otter",
    "distractors": [
          "River Otter",
          "Harbor Seal",
          "Beaver"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/02/Sea_Otter_%28Enhydra_lutris%29_%2825169790524%29_crop.jpg/330px-Sea_Otter_%28Enhydra_lutris%29_%2825169790524%29_crop.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Clownfish",
    "distractors": [
          "Damselfish",
          "Blue Tang",
          "Angelfish"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ad/Amphiprion_ocellaris_%28Clown_anemonefish%29_by_Nick_Hobgood.jpg/330px-Amphiprion_ocellaris_%28Clown_anemonefish%29_by_Nick_Hobgood.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Giant Oceanic Manta Ray",
    "distractors": [
          "Stingray",
          "Eagle Ray",
          "Skate"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/df/Manta_birostris-Thailand4.jpg/330px-Manta_birostris-Thailand4.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Giant Pacific Octopus",
    "distractors": [
          "Squid",
          "Cuttlefish",
          "Nautilus"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0b/Enteroctopus_dolfeini.jpg/330px-Enteroctopus_dolfeini.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Emperor Penguin",
    "distractors": [
          "King Penguin",
          "Adelie Penguin",
          "Puffin"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a3/Aptenodytes_forsteri_-Snow_Hill_Island%2C_Antarctica_-adults_and_juvenile-8.jpg/330px-Aptenodytes_forsteri_-Snow_Hill_Island%2C_Antarctica_-adults_and_juvenile-8.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "West Indian Manatee",
    "distractors": [
          "Dugong",
          "Sea Cow",
          "Walrus"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/99/Manatee_with_calf.PD_-_colour_corrected.jpg/330px-Manatee_with_calf.PD_-_colour_corrected.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Hammerhead Shark",
    "distractors": [
          "Great White Shark",
          "Thresher Shark",
          "Tiger Shark"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bf/Scalloped_Hammerhead_Shark_Sphyrna_Lewini_%28226845659%29.jpeg/330px-Scalloped_Hammerhead_Shark_Sphyrna_Lewini_%28226845659%29.jpeg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Bald Eagle",
    "distractors": [
          "Golden Eagle",
          "Osprey",
          "Red-tailed Hawk"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/db/Bald_eagle_about_to_fly_in_Alaska_%282016%29.jpg/330px-Bald_eagle_about_to_fly_in_Alaska_%282016%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Peregrine Falcon",
    "distractors": [
          "Kestrel",
          "Merlin",
          "Gyrfalcon"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9c/Falco_peregrinus_m_Humber_Bay_Park_Toronto.jpg/330px-Falco_peregrinus_m_Humber_Bay_Park_Toronto.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Snowy Owl",
    "distractors": [
          "Barn Owl",
          "Great Horned Owl",
          "Tawny Owl"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f1/SnowyOwlAmericanBlackDuck.jpg/330px-SnowyOwlAmericanBlackDuck.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Greater Flamingo",
    "distractors": [
          "Scarlet Ibis",
          "Spoonbill",
          "Heron"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/81/010_Greater_flamingos_male_and_female_in_the_Camargue_during_mating_season_Photo_by_Giles_Laurent.jpg/330px-010_Greater_flamingos_male_and_female_in_the_Camargue_during_mating_season_Photo_by_Giles_Laurent.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Keel-billed Toucan",
    "distractors": [
          "Hornbill",
          "Parrot",
          "Macaw"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/ff/Keel-billed_toucan_%28Ramphastos_sulfuratus_sulfuratus%29_on_foxtail_palm_%28Wodyetia_bifurcata%29_Cayo.jpg/330px-Keel-billed_toucan_%28Ramphastos_sulfuratus_sulfuratus%29_on_foxtail_palm_%28Wodyetia_bifurcata%29_Cayo.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Scarlet Macaw",
    "distractors": [
          "Toucan",
          "Amazon Parrot",
          "Cockatoo"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/47/Scarlet_macaw_%28Ara_macao_cyanopterus%29_Copan.jpg/330px-Scarlet_macaw_%28Ara_macao_cyanopterus%29_Copan.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Indian Peafowl (Peacock)",
    "distractors": [
          "Pheasant",
          "Turkey",
          "Bird of Paradise"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7f/Peacock_on_tree_%2852077240794%29.jpg/330px-Peacock_on_tree_%2852077240794%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Ruby-throated Hummingbird",
    "distractors": [
          "Sunbird",
          "Kingfisher",
          "Honeyeater"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7c/Archilochus_colubris_-flying_-male-8.jpg/330px-Archilochus_colubris_-flying_-male-8.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Common Ostrich",
    "distractors": [
          "Emu",
          "Rhea",
          "Cassowary"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9d/Struthio_camelus_-_Etosha_2014_%283%29.jpg/330px-Struthio_camelus_-_Etosha_2014_%283%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Atlantic Puffin",
    "distractors": [
          "Guillemot",
          "Auk",
          "Razorbill"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c4/Puffin_%28Fratercula_arctica%29.jpg/330px-Puffin_%28Fratercula_arctica%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Common Kingfisher",
    "distractors": [
          "Kookaburra",
          "Bee-eater",
          "Woodpecker"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bc/Alcedo_atthis_-England-8_%28cropped%29.jpg/330px-Alcedo_atthis_-England-8_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Barn Owl",
    "distractors": [
          "Snowy Owl",
          "Screech Owl",
          "Eagle Owl"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9e/American_Barn_Owl_%28Tyto_furcata_guatemalae%29%2C_Orange_Walk.jpg/330px-American_Barn_Owl_%28Tyto_furcata_guatemalae%29%2C_Orange_Walk.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Golden Eagle",
    "distractors": [
          "Bald Eagle",
          "Harpy Eagle",
          "Buzzard"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cc/015_Wild_Golden_Eagle_in_flight_at_Pfyn-Finges_%28Switzerland%29_Photo_by_Giles_Laurent.jpg/330px-015_Wild_Golden_Eagle_in_flight_at_Pfyn-Finges_%28Switzerland%29_Photo_by_Giles_Laurent.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Great Horned Owl",
    "distractors": [
          "Barred Owl",
          "Screech Owl",
          "Barn Owl"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/23/Bubo_virginianus_06.jpg/330px-Bubo_virginianus_06.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Komodo Dragon",
    "distractors": [
          "Monitor Lizard",
          "Green Iguana",
          "Gila Monster"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f5/202306_Varanus_komodoensis.jpg/330px-202306_Varanus_komodoensis.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Veiled Chameleon",
    "distractors": [
          "Gecko",
          "Iguana",
          "Anole"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/68/Yemen_Chameleon.jpg/330px-Yemen_Chameleon.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Green Iguana",
    "distractors": [
          "Komodo Dragon",
          "Monitor Lizard",
          "Chameleon"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/21/Iguana_iguana_%28male_resting%29.jpg/330px-Iguana_iguana_%28male_resting%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Saltwater Crocodile",
    "distractors": [
          "American Alligator",
          "Gharial",
          "Caiman"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/43/SaltwaterCrocodile%28%27Maximo%27%29.jpg/330px-SaltwaterCrocodile%28%27Maximo%27%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Red-Eyed Tree Frog",
    "distractors": [
          "Poison Dart Frog",
          "Bullfrog",
          "Toad"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e3/Red-eyed_Tree_Frog_%28Agalychnis_callidryas%29_1.png/330px-Red-eyed_Tree_Frog_%28Agalychnis_callidryas%29_1.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "King Cobra",
    "distractors": [
          "Black Mamba",
          "Rattlesnake",
          "Python"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4d/12_-_The_Mystical_King_Cobra_and_Coffee_Forests.jpg/330px-12_-_The_Mystical_King_Cobra_and_Coffee_Forests.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Axolotl",
    "distractors": [
          "Mudpuppy",
          "Newt",
          "Salamander"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/00/Axolotl_ganz.jpg/330px-Axolotl_ganz.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Central Bearded Dragon",
    "distractors": [
          "Gecko",
          "Monitor Lizard",
          "Iguana"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/98/Bartagame_%28fcm%29.jpg/330px-Bartagame_%28fcm%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Golden Poison Frog",
    "distractors": [
          "Tree Frog",
          "Bullfrog",
          "Cane Toad"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6e/Schrecklicherpfeilgiftfrosch-01.jpg/330px-Schrecklicherpfeilgiftfrosch-01.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "American Alligator",
    "distractors": [
          "Saltwater Crocodile",
          "Caiman",
          "Gharial"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/03/American_Alligator.jpg/330px-American_Alligator.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Polar Bear",
    "distractors": [
          "Grizzly Bear",
          "Brown Bear",
          "Beluga Whale"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/66/Polar_Bear_-_Alaska_%28cropped%29.jpg/330px-Polar_Bear_-_Alaska_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Arctic Fox",
    "distractors": [
          "Red Fox",
          "Fennec Fox",
          "Arctic Wolf"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dc/Vulpes_lagopus_in_Iceland_%28cropped_3%29.jpg/330px-Vulpes_lagopus_in_Iceland_%28cropped_3%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Snow Leopard",
    "distractors": [
          "Clouded Leopard",
          "Cougar",
          "Lynx"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a5/Irbis4.JPG/330px-Irbis4.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Reindeer (Caribou)",
    "distractors": [
          "Elk",
          "Moose",
          "Red Deer"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/96/Reinbukken_p%C3%A5_frisk_gr%C3%B8nt_beite._-_panoramio.jpg/330px-Reinbukken_p%C3%A5_frisk_gr%C3%B8nt_beite._-_panoramio.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Walrus",
    "distractors": [
          "Elephant Seal",
          "Sea Lion",
          "Manatee"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/Walrus_in_the_Russian_Arctic_National_Park%2C_Novaya_Zemlya_2015-2.jpg/330px-Walrus_in_the_Russian_Arctic_National_Park%2C_Novaya_Zemlya_2015-2.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Beluga Whale",
    "distractors": [
          "Narwhal",
          "Bowhead Whale",
          "Pilot Whale"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e8/Oceanogr%C3%A0fic_29102004.jpg/330px-Oceanogr%C3%A0fic_29102004.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Narwhal",
    "distractors": [
          "Beluga Whale",
          "Orca",
          "Bowhead Whale"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bc/%D0%9D%D0%B0%D1%80%D0%B2%D0%B0%D0%BB_%D0%B2_%D1%80%D0%BE%D1%81%D1%81%D0%B8%D0%B9%D1%81%D0%BA%D0%BE%D0%B9_%D0%90%D1%80%D0%BA%D1%82%D0%B8%D0%BA%D0%B5.jpg/330px-%D0%9D%D0%B0%D1%80%D0%B2%D0%B0%D0%BB_%D0%B2_%D1%80%D0%BE%D1%81%D1%81%D0%B8%D0%B9%D1%81%D0%BA%D0%BE%D0%B9_%D0%90%D1%80%D0%BA%D1%82%D0%B8%D0%BA%D0%B5.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Muskox",
    "distractors": [
          "Bison",
          "Yak",
          "Water Buffalo"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ca/Muskox_%28Ovibos_moschatus%29_male_Dovrefjell_4.jpg/330px-Muskox_%28Ovibos_moschatus%29_male_Dovrefjell_4.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Monarch Butterfly",
    "distractors": [
          "Viceroy Butterfly",
          "Swallowtail",
          "Moth"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/73/Monarch_Butterfly_Danaus_plexippus_Male_2664px.jpg/330px-Monarch_Butterfly_Danaus_plexippus_Male_2664px.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "European Mantis",
    "distractors": [
          "Stick Insect",
          "Grasshopper",
          "Katydid"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/62/European_praying_mantis_%28Mantis_religiosa%29_green_female_Dobruja.jpg/330px-European_praying_mantis_%28Mantis_religiosa%29_green_female_Dobruja.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Western Honey Bee",
    "distractors": [
          "Bumblebee",
          "Hornet",
          "Wasp"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4d/Apis_mellifera_Western_honey_bee.jpg/330px-Apis_mellifera_Western_honey_bee.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Seven-Spot Ladybird",
    "distractors": [
          "Colorado Potato Beetle",
          "Firefly",
          "June Bug"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/08/7-Spotted-Ladybug-Coccinella-septempunctata-sq1.jpg/330px-7-Spotted-Ladybug-Coccinella-septempunctata-sq1.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Dragonfly",
    "distractors": [
          "Damselfly",
          "Mayfly",
          "Lacewing"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b4/Red_grasshawk_%28Neurothemis_fluctuans%29_male_Phuket_2.jpg/330px-Red_grasshawk_%28Neurothemis_fluctuans%29_male_Phuket_2.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Giant Anteater",
    "distractors": [
          "Tamandua",
          "Pangolin",
          "Aardvark"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3b/Myresluger2.jpg/330px-Myresluger2.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "European Hedgehog",
    "distractors": [
          "Porcupine",
          "Echidna",
          "Tenrec"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e1/Erinaceus_europaeus_LC0119.jpg/330px-Erinaceus_europaeus_LC0119.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "animals",
    "text": "Which animal is shown in this picture?",
    "correct": "Galapagos Giant Tortoise",
    "distractors": [
          "Aldabra Tortoise",
          "Box Turtle",
          "Snapping Turtle"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/42/Galapagos_giant_tortoise_Geochelone_elephantopus.jpg/330px-Galapagos_giant_tortoise_Geochelone_elephantopus.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
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
  },
{
    "category": "holy_bible",
    "text": "In which town was Jesus Christ born, fulfilling the prophecy of Micah 5:2?",
    "correct": "Bethlehem",
    "distractors": [
      "Nazareth",
      "Jerusalem",
      "Capernaum"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f9/Adoration_of_the_sheperds_-_Matthias_Stomer.jpg/330px-Adoration_of_the_sheperds_-_Matthias_Stomer.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "holy_bible",
    "text": "In what town did Jesus grow up and spend His youth with Mary and Joseph?",
    "correct": "Nazareth",
    "distractors": [
      "Bethlehem",
      "Jericho",
      "Bethany"
    ]
  },
  {
    "category": "holy_bible",
    "text": "Who baptized Jesus in the Jordan River, declaring 'Behold! The Lamb of God'?",
    "correct": "John the Baptist",
    "distractors": [
      "Simon Peter",
      "The Prophet Elijah",
      "James the Apostle"
    ]
  },
  {
    "category": "holy_bible",
    "text": "What was the very first miracle performed by Jesus recorded in the Gospel of John?",
    "correct": "Turning water into wine at the wedding in Cana",
    "distractors": [
      "Healing the blind man at the pool of Siloam",
      "Walking on the waters of the Sea of Galilee",
      "Feeding the 5,000 with loaves and fish"
    ]
  },
  {
    "category": "holy_bible",
    "text": "How many days and nights did Jesus fast in the wilderness while resisting the devil's temptations?",
    "correct": "40 days and 40 nights",
    "distractors": [
      "7 days and 7 nights",
      "12 days and 12 nights",
      "50 days and 50 nights"
    ]
  },
  {
    "category": "holy_bible",
    "text": "On which body of water did Jesus walk during the night and invite Peter to step out of the boat?",
    "correct": "Sea of Galilee",
    "distractors": [
      "Dead Sea",
      "River Jordan",
      "Mediterranean Sea"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f3/Rembrandt_Christ_in_the_Storm_on_the_Lake_of_Galilee.jpg/330px-Rembrandt_Christ_in_the_Storm_on_the_Lake_of_Galilee.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "holy_bible",
    "text": "With what food did Jesus miraculously feed a multitude of 5,000 men besides women and children?",
    "correct": "5 loaves of bread and 2 fish",
    "distractors": [
      "7 loaves of bread and 3 fish",
      "12 loaves of barley and 4 fish",
      "3 loaves of bread and 5 fish"
    ]
  },
  {
    "category": "holy_bible",
    "text": "What friend of Jesus was raised from the dead in Bethany after being in the tomb for four days?",
    "correct": "Lazarus",
    "distractors": [
      "Nicodemus",
      "Jairus",
      "Zacchaeus"
    ]
  },
  {
    "category": "holy_bible",
    "text": "In the Sermon on the Mount, what series of blessings did Jesus teach, beginning with 'Blessed are the poor in spirit'?",
    "correct": "The Beatitudes",
    "distractors": [
      "The Decalogue",
      "The Canticles",
      "The Levitical Blessings"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/96/Bloch-SermonOnTheMount.jpg/330px-Bloch-SermonOnTheMount.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "holy_bible",
    "text": "When the disciples asked Jesus 'Lord, teach us to pray', what prayer did He give them?",
    "correct": "The Lord's Prayer (Our Father)",
    "distractors": [
      "The Shema",
      "The Magnificat",
      "The Prayer of Jabez"
    ]
  },
  {
    "category": "holy_bible",
    "text": "In the Parable of the Good Samaritan, who showed true mercy to the beaten traveler on the road to Jericho?",
    "correct": "A Samaritan",
    "distractors": [
      "A Priest",
      "A Levite",
      "A Roman Soldier"
    ]
  },
  {
    "category": "holy_bible",
    "text": "In the Parable of the Prodigal Son, what did the father do when he saw his returning son from afar?",
    "correct": "He was filled with compassion, ran to him, and embraced him",
    "distractors": [
      "He sent his servants to turn him away at the gate",
      "He commanded him to pay back every lost penny first",
      "He ordered him to live outside the household as a stranger"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/93/Rembrandt_Harmensz_van_Rijn_-_Return_of_the_Prodigal_Son_-_Google_Art_Project.jpg/330px-Rembrandt_Harmensz_van_Rijn_-_Return_of_the_Prodigal_Son_-_Google_Art_Project.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "holy_bible",
    "text": "What type of tree did the short tax collector Zacchaeus climb in Jericho in order to see Jesus?",
    "correct": "Sycamore-fig tree",
    "distractors": [
      "Olive tree",
      "Cedar of Lebanon",
      "Pomegranate tree"
    ]
  },
  {
    "category": "holy_bible",
    "text": "How many apostles did Jesus select as His inner foundational circle of followers?",
    "correct": "12",
    "distractors": [
      "7",
      "10",
      "70"
    ]
  },
  {
    "category": "holy_bible",
    "text": "Which disciple betrayed Jesus in the Garden of Gethsemane with a kiss for thirty silver coins?",
    "correct": "Judas Iscariot",
    "distractors": [
      "Thomas",
      "Simon the Zealot",
      "Bartholomew"
    ]
  },
  {
    "category": "holy_bible",
    "text": "Which apostle denied knowing Jesus three times before the rooster crowed, weeping bitterly afterward?",
    "correct": "Peter",
    "distractors": [
      "John",
      "Andrew",
      "Philip"
    ]
  },
  {
    "category": "holy_bible",
    "text": "In which garden on the Mount of Olives did Jesus pray with agonized sweat before His arrest?",
    "correct": "Garden of Gethsemane",
    "distractors": [
      "Garden of Eden",
      "Garden of Bethany",
      "Garden of Siloam"
    ]
  },
  {
    "category": "holy_bible",
    "text": "What meal did Jesus share with His disciples where He instituted the bread and cup of the New Covenant?",
    "correct": "The Last Supper",
    "distractors": [
      "The Feast of Tabernacles",
      "The Wedding Feast of Cana",
      "The Breakfast on the Shore"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/48/The_Last_Supper_-_Leonardo_Da_Vinci_-_High_Resolution_32x16.jpg/330px-The_Last_Supper_-_Leonardo_Da_Vinci_-_High_Resolution_32x16.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "holy_bible",
    "text": "What was the name of the Roman governor who washed his hands and handed Jesus over to be crucified?",
    "correct": "Pontius Pilate",
    "distractors": [
      "Herod Antipas",
      "Felix",
      "Festus"
    ]
  },
  {
    "category": "holy_bible",
    "text": "What is the Hebrew/Aramaic name of the place outside Jerusalem where Jesus was crucified, meaning 'The Place of the Skull'?",
    "correct": "Golgotha",
    "distractors": [
      "Gethsemane",
      "Bethesda",
      "Moriah"
    ]
  },
  {
    "category": "holy_bible",
    "text": "On which day after His crucifixion did Jesus rise triumphantly from the dead?",
    "correct": "The third day",
    "distractors": [
      "The seventh day",
      "The fortieth day",
      "The second day"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ef/Rafael_-_ressureicaocristo01.jpg/330px-Rafael_-_ressureicaocristo01.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "holy_bible",
    "text": "Who was the first person to encounter the risen Jesus outside the empty garden tomb on Easter morning?",
    "correct": "Mary Magdalene",
    "distractors": [
      "Simon Peter",
      "John the Apostle",
      "Nicodemus"
    ]
  },
  {
    "category": "holy_bible",
    "text": "Which disciple insisted that he would not believe unless he saw and touched the nail marks in Jesus's hands?",
    "correct": "Thomas",
    "distractors": [
      "Matthew",
      "Thaddaeus",
      "Nathanael"
    ]
  },
  {
    "category": "holy_bible",
    "text": "According to John 14:6, how did Jesus famously describe His identity?",
    "correct": "'I am the way, the truth, and the life; no one comes to the Father except through Me'",
    "distractors": [
      "'I am the conqueror of empires and kingdoms'",
      "'I am the high judge of earthly wealth'",
      "'I am the lawgiver like Moses of old'"
    ]
  },
  {
    "category": "holy_bible",
    "text": "According to John 10:11, how does Jesus describe Himself as the protector of believers?",
    "correct": "'I am the good shepherd. The good shepherd gives His life for the sheep.'",
    "distractors": [
      "'I am the builder who makes towering cities'",
      "'I am the master of merchants and trade'",
      "'I am the general over legions of chariots'"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/15/Rom%2C_Domitilla-Katakomben%2C_Der_gute_Hirte.jpg/330px-Rom%2C_Domitilla-Katakomben%2C_Der_gute_Hirte.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "holy_bible",
    "text": "What miracle did Jesus perform when a violent squall threatened to drown His disciples on the lake?",
    "correct": "He rebuked the wind and sea, saying 'Peace, be still!' and there was a great calm",
    "distractors": [
      "He told them to throw their cargo into the deep",
      "He swam to shore dragging the boat behind Him",
      "He called down rain to dilute the waves"
    ]
  },
  {
    "category": "holy_bible",
    "text": "How many days after His resurrection did Jesus ascend into Heaven in the sight of His disciples?",
    "correct": "40 days",
    "distractors": [
      "3 days",
      "7 days",
      "50 days"
    ]
  },
  {
    "category": "holy_bible",
    "text": "In the Parable of the Lost Sheep, what does the shepherd do when one of his hundred sheep wanders away?",
    "correct": "He leaves the ninety-nine in the open country to search for the lost one until he finds it",
    "distractors": [
      "He writes off the loss and buys another sheep",
      "He scolds the flock and closes the pen",
      "He waits until nightfall to see if it returns alone"
    ]
  },
  {
    "category": "holy_bible",
    "text": "What words of forgiveness did Jesus speak from the cross regarding His executioners in Luke 23:34?",
    "correct": "'Father, forgive them, for they do not know what they do.'",
    "distractors": [
      "'May judgment fall swiftly upon this land.'",
      "'Remember my disciples in Galilee.'",
      "'Behold, my kingdom has departed from you.'"
    ]
  },
  {
    "category": "holy_bible",
    "text": "What Roman centurion who stood at the foot of the cross exclaimed at Jesus's death: 'Truly this was the Son of God!'?",
    "correct": "The Roman centurion guarding the crucifixion",
    "distractors": [
      "Pontius Pilate the governor",
      "Nicodemus the Pharisee",
      "Joseph of Arimathea"
    ]
  },
  {
    "category": "holy_bible",
    "text": "In Genesis chapter 1, on how many days did God complete the creation of the heavens, earth, and all life before resting on the seventh day?",
    "correct": "6 days",
    "distractors": [
      "7 days",
      "10 days",
      "40 days"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5b/Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg/330px-Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "holy_bible",
    "text": "Who was the first man created by God in the Garden of Eden?",
    "correct": "Adam",
    "distractors": [
      "Noah",
      "Abraham",
      "Enoch"
    ]
  },
  {
    "category": "holy_bible",
    "text": "What sign in the clouds did God give to Noah as an everlasting covenant promise never to destroy all life by flood again?",
    "correct": "The Rainbow",
    "distractors": [
      "A pillar of cloud",
      "A shooting star",
      "A golden halo"
    ]
  },
  {
    "category": "holy_bible",
    "text": "Who is known as the 'Father of Faith', to whom God promised that his descendants would be as numerous as the stars of heaven?",
    "correct": "Abraham",
    "distractors": [
      "Moses",
      "David",
      "Solomon"
    ]
  },
  {
    "category": "holy_bible",
    "text": "What son was miraculously born to Abraham and Sarah in their old age according to God's promise?",
    "correct": "Isaac",
    "distractors": [
      "Ishmael",
      "Jacob",
      "Esau"
    ]
  },
  {
    "category": "holy_bible",
    "text": "Which son of Jacob was given an ornate coat of many colors and was later sold by his brothers into Egypt?",
    "correct": "Joseph",
    "distractors": [
      "Judah",
      "Benjamin",
      "Reuben"
    ]
  },
  {
    "category": "holy_bible",
    "text": "Through what miraculous sight in the desert of Horeb did God first call Moses to deliver His people?",
    "correct": "A bush that burned with fire yet was not consumed",
    "distractors": [
      "A whirlwind carrying a chariot of fire",
      "A pillar of light rising from a mountain spring",
      "A golden tablet falling from the clouds"
    ]
  },
  {
    "category": "holy_bible",
    "text": "How many plagues did God send upon Egypt before Pharaoh finally allowed the Israelites to leave?",
    "correct": "10 plagues",
    "distractors": [
      "7 plagues",
      "12 plagues",
      "40 plagues"
    ]
  },
  {
    "category": "holy_bible",
    "text": "What body of water did Moses stretch out his hand over, which God divided so the Israelites crossed on dry ground?",
    "correct": "The Red Sea",
    "distractors": [
      "The Jordan River",
      "The Dead Sea",
      "The Nile River"
    ]
  },
  {
    "category": "holy_bible",
    "text": "On which holy mountain did God give Moses the Ten Commandments inscribed on two tablets of stone?",
    "correct": "Mount Sinai",
    "distractors": [
      "Mount Nebo",
      "Mount Carmel",
      "Mount Ararat"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/58/0001_FL9694984.jpg/330px-0001_FL9694984.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "holy_bible",
    "text": "What miraculous bread from heaven did God rain down daily to nourish the Israelites during their 40 years in the desert?",
    "correct": "Manna",
    "distractors": [
      "Unleavened cakes",
      "Coriander bread",
      "Showbread"
    ]
  },
  {
    "category": "holy_bible",
    "text": "The massive fortified walls of which city fell flat after Joshua and the Israelites marched around them for seven days?",
    "correct": "Jericho",
    "distractors": [
      "Ai",
      "Hebron",
      "Gibeon"
    ]
  },
  {
    "category": "holy_bible",
    "text": "What young shepherd boy defeated the nine-foot Philistine champion Goliath using only a sling and five smooth stones?",
    "correct": "David",
    "distractors": [
      "Jonathan",
      "Saul",
      "Gideon"
    ],
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f6/David_with_the_Head_of_Goliath-Caravaggio_%281610%29.jpg/330px-David_with_the_Head_of_Goliath-Caravaggio_%281610%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "category": "holy_bible",
    "text": "What musical instrument did young David play skillfully to bring peace to King Saul when troubled by a distressing spirit?",
    "correct": "The Harp (Lyre)",
    "distractors": [
      "The Trumpet",
      "The Flute",
      "The Cymbals"
    ]
  },
  {
    "category": "holy_bible",
    "text": "Which son of King David asked God for wisdom and understanding to govern His people, and built the First Temple in Jerusalem?",
    "correct": "King Solomon",
    "distractors": [
      "Absalom",
      "Adonijah",
      "Rehoboam"
    ]
  },
  {
    "category": "holy_bible",
    "text": "Which prophet confronted 450 false prophets of Baal on Mount Carmel, where God answered with consuming fire from heaven?",
    "correct": "Elijah",
    "distractors": [
      "Elisha",
      "Isaiah",
      "Jeremiah"
    ]
  },
  {
    "category": "holy_bible",
    "text": "Which prophet was swallowed by a great fish after trying to flee from God's instruction to preach in Nineveh?",
    "correct": "Jonah",
    "distractors": [
      "Amos",
      "Micah",
      "Habakkuk"
    ]
  },
  {
    "category": "holy_bible",
    "text": "Which Hebrew prophet was cast into a den of hungry lions for praying to God, but was unharmed because God shut the lions' mouths?",
    "correct": "Daniel",
    "distractors": [
      "Ezekiel",
      "Jeremiah",
      "Nehemiah"
    ]
  },
  {
    "category": "holy_bible",
    "text": "What were the Babylonian names of Daniel's three companions who were thrown into the blazing furnace and walked out unburned?",
    "correct": "Shadrach, Meshach, and Abednego",
    "distractors": [
      "Shem, Ham, and Japheth",
      "Peter, James, and John",
      "Caleb, Joshua, and Phinehas"
    ]
  },
  {
    "category": "holy_bible",
    "text": "Which brave Jewish queen risked her life to plead before the Persian King Xerxes to save her people from Haman's plot?",
    "correct": "Queen Esther",
    "distractors": [
      "Ruth",
      "Deborah",
      "Hannah"
    ]
  },
  {
    "category": "holy_bible",
    "text": "Which devoted Moabite daughter-in-law declared to Naomi: 'Your people shall be my people, and your God, my God'?",
    "correct": "Ruth",
    "distractors": [
      "Orpah",
      "Rahab",
      "Michal"
    ]
  },
  {
    "category": "holy_bible",
    "text": "Who was the mighty judge of Israel whose supernatural physical strength was bound to his Nazarite vow and uncut hair?",
    "correct": "Samson",
    "distractors": [
      "Gideon",
      "Jephthah",
      "Barak"
    ]
  },
  {
    "category": "holy_bible",
    "text": "Which judge of Israel laid out a fleece of wool on the threshing floor to confirm God's sign that he would save Israel?",
    "correct": "Gideon",
    "distractors": [
      "Samson",
      "Othniel",
      "Ehud"
    ]
  },
  {
    "category": "holy_bible",
    "text": "Who was taken up to heaven in a whirlwind accompanied by a chariot and horses of fire?",
    "correct": "Elijah",
    "distractors": [
      "Elisha",
      "Moses",
      "Samuel"
    ]
  },
  {
    "category": "holy_bible",
    "text": "What faithful man lost his livestock, family, and health, yet blessed God saying 'The Lord gave, and the Lord has taken away; blessed be the name of the Lord'?",
    "correct": "Job",
    "distractors": [
      "Jeremiah",
      "Habakkuk",
      "Hosea"
    ]
  },
  {
    "category": "holy_bible",
    "text": "On what feast day in Jerusalem was the Holy Spirit poured out with the sound of a rushing mighty wind and divided tongues of fire?",
    "correct": "The Day of Pentecost",
    "distractors": [
      "The Feast of Passover",
      "The Feast of Trumpets",
      "The Day of Atonement"
    ]
  },
  {
    "category": "holy_bible",
    "text": "What Roman citizen and persecutor of the church saw a blinding light and heard the voice of Jesus on the road to Damascus?",
    "correct": "Saul of Tarsus (Paul)",
    "distractors": [
      "Barnabas",
      "Silas",
      "Cornelius"
    ]
  },
  {
    "category": "holy_bible",
    "text": "Who was the first Christian deacon and martyr, who prayed 'Lord Jesus, receive my spirit' as he was being stoned?",
    "correct": "Stephen",
    "distractors": [
      "Philip",
      "Prochorus",
      "Nicanor"
    ]
  },
  {
    "category": "holy_bible",
    "text": "What devout Roman centurion in Caesarea became the first Gentile convert to receive the Holy Spirit after Peter preached in his home?",
    "correct": "Cornelius",
    "distractors": [
      "Julius",
      "Claudius Lysias",
      "Sergius Paulus"
    ]
  },
  {
    "category": "holy_bible",
    "text": "In what major Syrian city were the disciples of Jesus first called 'Christians'?",
    "correct": "Antioch",
    "distractors": [
      "Jerusalem",
      "Rome",
      "Ephesus"
    ]
  },
  {
    "category": "holy_bible",
    "text": "What young co-worker of the Apostle Paul was commended for the genuine faith he inherited from his grandmother Lois and mother Eunice?",
    "correct": "Timothy",
    "distractors": [
      "Titus",
      "Philemon",
      "Epaphroditus"
    ]
  },
  {
    "category": "holy_bible",
    "text": "How many total books are in the New Testament of the Christian Bible?",
    "correct": "27 books",
    "distractors": [
      "39 books",
      "66 books",
      "12 books"
    ]
  },
  {
    "category": "holy_bible",
    "text": "Which apostle was in exile on the island of Patmos when he received and wrote down the Book of Revelation?",
    "correct": "John the Apostle",
    "distractors": [
      "Peter",
      "Paul",
      "Jude"
    ]
  },
  {
    "category": "holy_bible",
    "text": "According to 1 Corinthians 13:13, what three virtues abide, and which of them is explicitly named the greatest?",
    "correct": "Faith, hope, and love; but the greatest of these is love",
    "distractors": [
      "Patience, peace, and truth; the greatest is truth",
      "Righteousness, fasting, and almsgiving; the greatest is fasting",
      "Wisdom, courage, and zeal; the greatest is zeal"
    ]
  },
  {
    "category": "holy_bible",
    "text": "According to Galatians 5:22-23, what is the very first characteristic named in the Fruit of the Spirit?",
    "correct": "Love",
    "distractors": [
      "Joy",
      "Peace",
      "Self-control"
    ]
  },
  {
    "category": "holy_bible",
    "text": "In Ephesians 6:11-17, what spiritual armor are believers urged to put on to withstand the schemes of darkness?",
    "correct": "The Whole Armor of God (Belt of Truth, Breastplate of Righteousness, Shield of Faith, Sword of the Spirit)",
    "distractors": [
      "The Robe of David and Crown of Solomon",
      "The Chariots of Elijah and Fire of Mount Carmel",
      "The Staff of Moses and Ark of the Covenant"
    ]
  },
  {
    "category": "holy_bible",
    "text": "Which physician traveled with the Apostle Paul on missionary journeys and authored both a Gospel and the Book of Acts?",
    "correct": "Luke",
    "distractors": [
      "Mark",
      "Matthew",
      "Apollos"
    ]
  },
  {
    "category": "holy_bible",
    "text": "What miraculous event shook the Philippian jail at midnight while Paul and Silas were singing praises to God in chains?",
    "correct": "A great earthquake opened all doors and unfastened everyone's chains",
    "distractors": [
      "A lightning bolt struck down the guards",
      "An angel carried them away in secret to Athens",
      "A sudden flood washed through the cells"
    ]
  },
  {
    "category": "holy_bible",
    "text": "In 2 Timothy 4:7, what victorious words did the Apostle Paul write as he neared the completion of his earthly life?",
    "correct": "'I have fought the good fight, I have finished the race, I have kept the faith.'",
    "distractors": [
      "'I have gathered great renown across Rome and Greece.'",
      "'My work on earth is done without any trial or tribulation.'",
      "'I look to the kingdoms of the world with pride.'"
    ]
  },
  {
    "category": "holy_bible",
    "text": "On the Island of Malta, what creature fastened onto Paul's hand from the firewood, yet caused him no harm by God's protection?",
    "correct": "A poisonous viper",
    "distractors": [
      "A desert scorpion",
      "A rabid dog",
      "A venomous spider"
    ]
  },
  {
    "category": "holy_bible",
    "text": "Complete the beloved declaration of God's love in John 3:16: 'For God so loved the world that He gave His only begotten Son, that whoever believes in Him should not perish but have...'",
    "correct": "Everlasting life",
    "distractors": [
      "Worldly wealth",
      "Temporal power",
      "Earthly honor"
    ]
  },
  {
    "category": "holy_bible",
    "text": "How does the famous Psalm of comfort and assurance, Psalm 23, open?",
    "correct": "'The Lord is my shepherd; I shall not want.'",
    "distractors": [
      "'The earth is the Lord's, and all its fullness.'",
      "'I will lift up my eyes to the hills.'",
      "'God is our refuge and strength, a very present help in trouble.'"
    ]
  },
  {
    "category": "holy_bible",
    "text": "Complete Proverbs 3:5-6: 'Trust in the Lord with all your heart, and lean not on your own understanding; in all your ways acknowledge Him, and He shall...'",
    "correct": "Direct your paths",
    "distractors": [
      "Multiply your gold",
      "Remove every challenge",
      "Grant you worldly fame"
    ]
  },
  {
    "category": "holy_bible",
    "text": "In Matthew 28:19, in whose Name did Jesus command His followers to baptize all nations?",
    "correct": "In the name of the Father and of the Son and of the Holy Spirit",
    "distractors": [
      "In the name of Moses, Elijah, and the Prophets",
      "In the name of the holy city of Jerusalem",
      "In the name of the Twelve Apostles"
    ]
  },
  {
    "category": "holy_bible",
    "text": "Complete the declaration of spiritual strength in Philippians 4:13: 'I can do all things through Christ who...'",
    "correct": "Strengthens me",
    "distractors": [
      "Replaces me",
      "Exalts my status",
      "Enriches my treasury"
    ]
  },
  {
    "category": "holy_bible",
    "text": "What comforting invitation did Jesus offer in Matthew 11:28: 'Come to Me, all you who labor and are heavy laden, and I will give you...'",
    "correct": "Rest",
    "distractors": [
      "Wealth",
      "Vengeance",
      "Political victory"
    ]
  },
  {
    "category": "holy_bible",
    "text": "What are the first 10 words of the entire Holy Bible in Genesis 1:1?",
    "correct": "'In the beginning God created the heavens and the earth.'",
    "distractors": [
      "'The earth was formless and void, and darkness was over the deep.'",
      "'Let there be light, and there was light upon the earth.'",
      "'Praise the Lord, all nations; laud Him, all you peoples.'"
    ]
  },
  {
    "category": "holy_bible",
    "text": "According to Romans 8:38-39, what power in heaven, earth, death, or life can separate believers from the love of God in Christ Jesus?",
    "correct": "Nothing can separate us",
    "distractors": [
      "Only our deepest trials",
      "The ruler of this world",
      "Hardship and poverty"
    ]
  },
  {
    "category": "holy_bible",
    "text": "What does Micah 6:8 say that the Lord requires of you: 'to act justly, to love mercy, and to...'",
    "correct": "Walk humbly with your God",
    "distractors": [
      "Conquer many kingdoms",
      "Build temples of cedar and gold",
      "Perform great public signs"
    ]
  },
  {
    "category": "holy_bible",
    "text": "Complete Jeremiah 29:11: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you...'",
    "correct": "A future and a hope",
    "distractors": [
      "Immediate ease and wealth",
      "Power over your adversaries",
      "Exemption from every challenge"
    ]
  },
  {
    "category": "holy_bible",
    "text": "What assurance did God give Joshua as he prepared to lead the people into the Promised Land in Joshua 1:9?",
    "correct": "'Be strong and of good courage; do not be afraid... for the Lord your God is with you wherever you go.'",
    "distractors": [
      "'Lean on your mighty warriors and trust in their spears.'",
      "'Wait on the mountain until all dangers have passed.'",
      "'Build high stone walls before you cross over.'"
    ]
  },
  {
    "category": "holy_bible",
    "text": "According to Matthew 6:33, what did Jesus say we should seek first above all food, clothing, and worry?",
    "correct": "Seek first the kingdom of God and His righteousness",
    "distractors": [
      "Seek first earthly security and stored grain",
      "Seek first the favor of governors and rulers",
      "Seek first knowledge of worldly affairs"
    ]
  }
];

// Pre-convert once at module load time (300+ authoritative questions across 12 categories)
export const SEED_BANK: Question[] = RAW_SEEDS.map(seedToQuestion);
