import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outDir = path.resolve(__dirname, '../../../apps/web/public/puzzles');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 30 rich SVG puzzle illustrations
export const PUZZLE_SVGS = {
  'vp-01': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
  <defs>
    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#090d16"/>
      <stop offset="100%" stop-color="#111827"/>
    </linearGradient>
    <linearGradient id="barkGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#78350f"/>
      <stop offset="100%" stop-color="#451a03"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="600" height="400" fill="url(#skyGrad)" rx="16"/>
  <rect x="0" y="360" width="600" height="40" fill="#064e3b" opacity="0.6"/>
  <!-- Tree Trunk -->
  <path d="M 50 380 Q 70 240 80 180 Q 90 100 100 20 L 140 20 Q 130 110 120 190 Q 110 260 140 380 Z" fill="url(#barkGrad)"/>
  <!-- Branch A (Upper) -->
  <path d="M 95 140 Q 180 110 280 110 Q 360 110 420 130" stroke="#78350f" stroke-width="26" stroke-linecap="round" fill="none"/>
  <!-- Branch B (Lower) -->
  <path d="M 110 220 Q 220 220 340 230 Q 420 240 520 230" stroke="#78350f" stroke-width="24" stroke-linecap="round" fill="none"/>
  <!-- Leaves / Canopy -->
  <circle cx="110" cy="40" r="50" fill="#047857" opacity="0.4"/>
  <circle cx="360" cy="90" r="45" fill="#059669" opacity="0.3"/>
  <circle cx="490" cy="200" r="40" fill="#10b981" opacity="0.25"/>

  <!-- PERSON 1: Sits near trunk on lower branch (Safe) -->
  <g transform="translate(140, 175)">
    <circle cx="15" cy="0" r="10" fill="#34d399"/>
    <rect x="5" y="10" width="20" height="26" rx="4" fill="#10b981"/>
    <rect x="-8" y="-18" width="46" height="18" rx="9" fill="#065f46" stroke="#34d399" stroke-width="1.5"/>
    <text x="15" y="-6" fill="#ffffff" font-size="11" font-weight="900" text-anchor="middle" font-family="sans-serif">1</text>
  </g>

  <!-- PERSON 2: Sits on Branch A, saws branch towards Person 3 -->
  <g transform="translate(240, 60)">
    <circle cx="15" cy="0" r="10" fill="#f87171"/>
    <rect x="5" y="10" width="20" height="26" rx="4" fill="#ef4444"/>
    <rect x="-8" y="-18" width="46" height="18" rx="9" fill="#991b1b" stroke="#f87171" stroke-width="1.5"/>
    <text x="15" y="-6" fill="#ffffff" font-size="11" font-weight="900" text-anchor="middle" font-family="sans-serif">2</text>
    <!-- Saw in hand cutting downwards -->
    <path d="M 28 28 L 50 48" stroke="#94a3b8" stroke-width="3"/>
    <line x1="285" y1="100" x2="285" y2="125" stroke="#ef4444" stroke-width="3" stroke-dasharray="3,2"/>
    <text x="55" y="46" fill="#ef4444" font-size="9" font-weight="bold" font-family="sans-serif">SAWS A</text>
  </g>

  <!-- PERSON 3: Sits on Branch B, saws Branch A behind Person 2 -->
  <g transform="translate(330, 170)">
    <circle cx="15" cy="0" r="10" fill="#60a5fa"/>
    <rect x="5" y="10" width="20" height="26" rx="4" fill="#3b82f6"/>
    <rect x="-8" y="-18" width="46" height="18" rx="9" fill="#1e40af" stroke="#60a5fa" stroke-width="1.5"/>
    <text x="15" y="-6" fill="#ffffff" font-size="11" font-weight="900" text-anchor="middle" font-family="sans-serif">3</text>
    <!-- Saw reaching up towards Branch A -->
    <path d="M 10 10 L -20 -35" stroke="#94a3b8" stroke-width="3"/>
    <line x1="205" y1="125" x2="205" y2="150" stroke="#60a5fa" stroke-width="3" stroke-dasharray="3,2"/>
    <text x="-48" y="-30" fill="#60a5fa" font-size="9" font-weight="bold" font-family="sans-serif">SAWS A</text>
  </g>

  <!-- PERSON 4: Sits on outer Branch B, SAWING BETWEEN HIMSELF AND TRUNK! -->
  <g transform="translate(470, 175)">
    <circle cx="15" cy="0" r="10" fill="#fbbf24"/>
    <rect x="5" y="10" width="20" height="26" rx="4" fill="#f59e0b"/>
    <rect x="-8" y="-18" width="46" height="18" rx="9" fill="#92400e" stroke="#fbbf24" stroke-width="1.5"/>
    <text x="15" y="-6" fill="#ffffff" font-size="11" font-weight="900" text-anchor="middle" font-family="sans-serif">4</text>
    <!-- Saw cutting his own branch support! -->
    <path d="M -5 20 L -35 48" stroke="#f59e0b" stroke-width="4"/>
    <!-- Cut line right under his own branch! -->
    <line x1="430" y1="218" x2="430" y2="242" stroke="#fbbf24" stroke-width="4" stroke-dasharray="4,2"/>
    <text x="-70" y="60" fill="#fbbf24" font-size="9" font-weight="900" font-family="sans-serif">CUTS OWN BRANCH!</text>
  </g>

  <!-- Header Banner -->
  <rect x="20" y="14" width="560" height="34" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
  <text x="300" y="36" fill="#f8fafc" font-size="13" font-weight="800" text-anchor="middle" font-family="sans-serif" letter-spacing="0.5">TREE BRANCH RIDDLE: WHO WILL FALL FIRST?</text>
</svg>`,

  'vp-02': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
  <defs>
    <linearGradient id="tankBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
    <linearGradient id="waterFlow" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
  </defs>
  <rect width="600" height="400" fill="url(#tankBg)" rx="16"/>

  <!-- Top Funnel Pitcher -->
  <path d="M 260 50 L 340 50 L 315 95 L 285 95 Z" fill="#334155" stroke="#64748b" stroke-width="3"/>
  <rect x="290" y="95" width="20" height="40" fill="#334155" stroke="#64748b" stroke-width="2"/>
  <!-- Pouring Water Stream -->
  <path d="M 295 40 L 305 40 L 303 95 L 297 95 Z" fill="url(#waterFlow)"/>

  <!-- Central Manifold Tank -->
  <rect x="100" y="135" width="400" height="30" rx="4" fill="#1e293b" stroke="#64748b" stroke-width="3"/>
  <text x="300" y="155" fill="#94a3b8" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">CENTRAL LIQUID DISTRIBUTION PIPE</text>

  <!-- Cup 1 (Blocked Plug) -->
  <g transform="translate(80, 230)">
    <!-- Pipe from manifold -->
    <line x1="40" y1="-65" x2="40" y2="0" stroke="#64748b" stroke-width="12"/>
    <!-- Red Stopper Plug -->
    <rect x="30" y="-35" width="20" height="10" fill="#ef4444" stroke="#f87171" stroke-width="2"/>
    <text x="40" y="-42" fill="#ef4444" font-size="8" font-weight="900" text-anchor="middle" font-family="sans-serif">BLOCKED</text>
    <!-- Cup -->
    <rect x="10" y="0" width="60" height="70" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5"/>
    <rect x="20" y="15" width="40" height="20" rx="6" fill="#1e293b" stroke="#64748b"/>
    <text x="40" y="30" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle" font-family="sans-serif">Cup 1</text>
  </g>

  <!-- Cup 2 (Hole at Bottom) -->
  <g transform="translate(200, 230)">
    <line x1="40" y1="-65" x2="40" y2="0" stroke="#64748b" stroke-width="12"/>
    <!-- Cup with bottom hole -->
    <path d="M 10 0 L 10 70 L 30 70 M 50 70 L 70 70 L 70 0" stroke="#38bdf8" stroke-width="2.5" fill="none"/>
    <line x1="30" y1="70" x2="50" y2="70" stroke="#ef4444" stroke-width="3" stroke-dasharray="3,2"/>
    <text x="40" y="85" fill="#ef4444" font-size="8" font-weight="900" text-anchor="middle" font-family="sans-serif">LEAKS OUT</text>
    <rect x="20" y="15" width="40" height="20" rx="6" fill="#1e293b" stroke="#64748b"/>
    <text x="40" y="30" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle" font-family="sans-serif">Cup 2</text>
  </g>

  <!-- Cup 3 (Higher Inlet) -->
  <g transform="translate(320, 230)">
    <!-- Pipe connects high -->
    <line x1="40" y1="-65" x2="40" y2="-20" stroke="#64748b" stroke-width="12"/>
    <line x1="40" y1="-20" x2="40" y2="0" stroke="#64748b" stroke-width="8"/>
    <text x="40" y="-25" fill="#fbbf24" font-size="8" font-weight="bold" text-anchor="middle" font-family="sans-serif">HIGH INLET</text>
    <!-- Cup -->
    <rect x="10" y="0" width="60" height="70" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5"/>
    <rect x="20" y="15" width="40" height="20" rx="6" fill="#1e293b" stroke="#64748b"/>
    <text x="40" y="30" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle" font-family="sans-serif">Cup 3</text>
  </g>

  <!-- Cup 4 (Lower Open Inlet, No Block, No Leak) -->
  <g transform="translate(440, 230)">
    <!-- Low open pipe directly into cup -->
    <line x1="40" y1="-65" x2="40" y2="10" stroke="#38bdf8" stroke-width="12"/>
    <circle cx="40" cy="20" r="4" fill="#38bdf8"/>
    <!-- Cup filling with water! -->
    <rect x="10" y="0" width="60" height="70" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5"/>
    <rect x="12" y="25" width="56" height="43" fill="#0284c7" opacity="0.8"/>
    <rect x="20" y="15" width="40" height="20" rx="6" fill="#1e293b" stroke="#38bdf8"/>
    <text x="40" y="30" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle" font-family="sans-serif">Cup 4</text>
    <text x="40" y="85" fill="#34d399" font-size="8" font-weight="900" text-anchor="middle" font-family="sans-serif">FILLS FIRST!</text>
  </g>

  <!-- Header -->
  <rect x="20" y="12" width="560" height="30" rx="6" fill="#0b1120" stroke="#38bdf8" stroke-width="1"/>
  <text x="300" y="32" fill="#38bdf8" font-size="12" font-weight="800" text-anchor="middle" font-family="sans-serif">WATER TANK FLOW: WHICH CUP WILL FILL COMPLETELY FIRST?</text>
</svg>`,

  'vp-03': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400" width="100%" height="100%">
  <rect width="500" height="400" fill="#020617"/>
  <!-- Rubin's Vase Central Silhouette -->
  <path d="M 120 40 Q 250 40 380 40 Q 320 100 340 160 Q 360 200 310 240 Q 270 270 330 360 L 170 360 Q 230 270 190 240 Q 140 200 160 160 Q 180 100 120 40 Z" fill="#f8fafc"/>
  <!-- Two Face Profiles emerge in black sides -->
  <text x="80" y="200" fill="#94a3b8" font-size="12" font-weight="bold" text-anchor="middle" font-family="sans-serif">FACE 1</text>
  <text x="420" y="200" fill="#94a3b8" font-size="12" font-weight="bold" text-anchor="middle" font-family="sans-serif">FACE 2</text>
  <text x="250" y="200" fill="#0f172a" font-size="13" font-weight="900" text-anchor="middle" font-family="sans-serif">VASE</text>
  <rect x="50" y="365" width="400" height="25" rx="6" fill="#0f172a" stroke="#334155"/>
  <text x="250" y="382" fill="#cbd5e1" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">RUBIN'S VASE: TWO FACES OR ONE VASE?</text>
</svg>`,

  'vp-04': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400" width="100%" height="100%">
  <rect width="500" height="400" fill="#0f172a" rx="16"/>
  <!-- Duck / Rabbit Bistable Silhouette -->
  <g transform="translate(90, 60)">
    <path d="M 60 140 C 0 130 0 100 40 80 C 80 60 140 40 200 80 C 260 120 280 180 240 220 C 200 250 140 250 100 220 C 70 200 70 160 60 140 Z" fill="#e2e8f0"/>
    <!-- Left Beak / Right Ears -->
    <path d="M 70 95 Q -30 90 -40 110 Q -30 130 65 125 Z" fill="#e2e8f0"/>
    <path d="M 70 130 Q -25 140 -35 155 Q -25 170 70 150 Z" fill="#e2e8f0"/>
    <!-- Eye in middle -->
    <circle cx="110" cy="115" r="7" fill="#0f172a"/>
    <circle cx="112" cy="113" r="2.5" fill="#ffffff"/>
  </g>
  <!-- Labels -->
  <text x="80" y="170" fill="#38bdf8" font-size="11" font-weight="bold" font-family="sans-serif">← DUCK BEAK</text>
  <text x="350" y="170" fill="#f472b6" font-size="11" font-weight="bold" font-family="sans-serif">RABBIT HEAD →</text>
  <rect x="40" y="350" width="420" height="30" rx="6" fill="#1e293b" stroke="#334155"/>
  <text x="250" y="370" fill="#cbd5e1" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">JASTROW (1899): DUCK FACING LEFT OR RABBIT FACING RIGHT?</text>
</svg>`,

  'vp-05': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400" width="100%" height="100%">
  <rect width="500" height="400" fill="#0f172a" rx="16"/>
  <!-- Classic My Wife and Mother-in-Law Silhouette Lines -->
  <g transform="translate(130, 40)">
    <path d="M 120 30 Q 180 20 200 70 Q 210 130 190 190 Q 140 260 80 280 L 40 260 Q 20 180 50 110 Q 70 40 120 30 Z" fill="#e2e8f0"/>
    <!-- Feather / Hat -->
    <path d="M 120 10 Q 140 -20 170 -10 Q 150 20 120 20 Z" fill="#fbbf24"/>
    <!-- Young girl chin / Old woman nose -->
    <path d="M 100 130 Q 80 150 95 160 Q 110 160 120 145" stroke="#0f172a" stroke-width="4" fill="none"/>
    <!-- Necklace / Old woman mouth -->
    <line x1="85" y1="210" x2="135" y2="205" stroke="#0f172a" stroke-width="4"/>
    <!-- Ear / Old woman left eye -->
    <ellipse cx="145" cy="145" rx="6" ry="10" fill="#0f172a"/>
  </g>
  <rect x="30" y="350" width="440" height="30" rx="6" fill="#1e293b" stroke="#334155"/>
  <text x="250" y="370" fill="#cbd5e1" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">W.E. HILL (1915): YOUNG WOMAN OR OLD WOMAN?</text>
</svg>`,

  'vp-06': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 350" width="100%" height="100%">
  <rect width="600" height="350" fill="#0f172a" rx="16"/>
  <!-- FedEx Logo with emphasized arrow in negative space -->
  <g transform="translate(90, 90)">
    <text x="0" y="110" fill="#4f46e5" font-size="115" font-weight="900" font-family="Arial, Helvetica, sans-serif" letter-spacing="-4">Fed</text>
    <text x="200" y="110" fill="#f97316" font-size="115" font-weight="900" font-family="Arial, Helvetica, sans-serif" letter-spacing="-6">Ex</text>
    <!-- Highlighted arrow in negative space between E and x -->
    <path d="M 283 58 L 306 82 L 283 106 L 283 94 L 265 94 L 265 70 L 283 70 Z" fill="#ffffff" stroke="#38bdf8" stroke-width="2"/>
  </g>
  <rect x="50" y="280" width="500" height="40" rx="8" fill="#1e293b" stroke="#4f46e5"/>
  <text x="300" y="305" fill="#38bdf8" font-size="12" font-weight="800" text-anchor="middle" font-family="sans-serif">SECRET NEGATIVE SPACE SYMBOL: A RIGHT-POINTING ARROW (➔)</text>
</svg>`,

  'vp-07': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 380" width="100%" height="100%">
  <rect width="500" height="380" fill="#0f172a" rx="16"/>
  <!-- Toblerone Matterhorn Mountain Peak with Hidden Bear -->
  <g transform="translate(100, 50)">
    <polygon points="150,20 40,250 260,250" fill="#b45309" stroke="#f59e0b" stroke-width="3"/>
    <!-- Snow shadows forming the dancing Bernese Bear -->
    <path d="M 150 25 L 140 70 L 160 110 L 135 150 L 155 190 L 130 250 L 175 250 L 180 170 L 195 130 L 165 70 Z" fill="#ffffff"/>
    <!-- Bear silhouette in snow -->
    <circle cx="152" cy="115" r="7" fill="#b45309"/>
    <path d="M 148 125 C 135 140 140 180 155 200 C 160 190 162 160 155 145 Z" fill="#b45309"/>
  </g>
  <rect x="40" y="325" width="420" height="30" rx="6" fill="#1e293b" stroke="#f59e0b"/>
  <text x="250" y="345" fill="#fcd34d" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">TOBLERONE MOUNTAIN: WHAT ANIMAL IS HIDDEN IN THE SHADOWS?</text>
</svg>`,

  'vp-08': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 320" width="100%" height="100%">
  <rect width="600" height="320" fill="#0f172a" rx="16"/>
  <text x="300" y="50" fill="#f8fafc" font-size="14" font-weight="900" text-anchor="middle" font-family="sans-serif">MATCHSTICK PUZZLE: MOVE 1 MATCH TO FIX</text>
  <!-- Matchstick equation: 6 + 4 = 4 -->
  <g transform="translate(70, 90)">
    <!-- Digit 6 in matchsticks -->
    <rect x="20" y="20" width="12" height="70" rx="3" fill="#fbbf24" stroke="#d97706"/><circle cx="26" cy="18" r="7" fill="#ef4444"/>
    <rect x="20" y="90" width="12" height="70" rx="3" fill="#fbbf24" stroke="#d97706"/><circle cx="26" cy="88" r="7" fill="#ef4444"/>
    <rect x="20" y="16" width="70" height="12" rx="3" fill="#fbbf24" stroke="#d97706"/><circle cx="92" cy="22" r="7" fill="#ef4444"/>
    <rect x="20" y="86" width="70" height="12" rx="3" fill="#fbbf24" stroke="#d97706"/><circle cx="92" cy="92" r="7" fill="#ef4444"/>
    <rect x="80" y="90" width="12" height="70" rx="3" fill="#fbbf24" stroke="#d97706"/><circle cx="86" cy="162" r="7" fill="#ef4444"/>
    <rect x="20" y="156" width="70" height="12" rx="3" fill="#fbbf24" stroke="#d97706"/><circle cx="20" cy="162" r="7" fill="#ef4444"/>

    <!-- Sign + -->
    <text x="140" y="115" fill="#ef4444" font-size="54" font-weight="900" font-family="monospace">+</text>

    <!-- Digit 4 -->
    <rect x="190" y="20" width="12" height="70" rx="3" fill="#fbbf24" stroke="#d97706"/><circle cx="196" cy="18" r="7" fill="#ef4444"/>
    <rect x="190" y="86" width="70" height="12" rx="3" fill="#fbbf24" stroke="#d97706"/><circle cx="262" cy="92" r="7" fill="#ef4444"/>
    <rect x="250" y="20" width="12" height="148" rx="3" fill="#fbbf24" stroke="#d97706"/><circle cx="256" cy="18" r="7" fill="#ef4444"/>

    <!-- Equals = -->
    <text x="300" y="115" fill="#38bdf8" font-size="54" font-weight="900" font-family="monospace">=</text>

    <!-- Digit 4 -->
    <rect x="360" y="20" width="12" height="70" rx="3" fill="#fbbf24" stroke="#d97706"/><circle cx="366" cy="18" r="7" fill="#ef4444"/>
    <rect x="360" y="86" width="70" height="12" rx="3" fill="#fbbf24" stroke="#d97706"/><circle cx="432" cy="92" r="7" fill="#ef4444"/>
    <rect x="420" y="20" width="12" height="148" rx="3" fill="#fbbf24" stroke="#d97706"/><circle cx="426" cy="18" r="7" fill="#ef4444"/>
  </g>
  <rect x="50" y="275" width="500" height="30" rx="6" fill="#1e293b" stroke="#334155"/>
  <text x="300" y="295" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">6 + 4 = 4  ➔  MOVE 1 STICK TO GET 0 + 4 = 4</text>
</svg>`,

  'vp-09': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
  <rect width="600" height="400" fill="#0f172a" rx="16"/>
  <!-- Checkerboard grid with Adelson Illusion -->
  <g transform="translate(100, 50)">
    <!-- Light and dark checker tiles -->
    <!-- Row 1 -->
    <rect x="50" y="30" width="70" height="70" fill="#cbd5e1"/>
    <rect x="120" y="30" width="70" height="70" fill="#78716c"/>
    <rect x="190" y="30" width="70" height="70" fill="#cbd5e1"/>
    <!-- Row 2 -->
    <rect x="50" y="100" width="70" height="70" fill="#78716c"/><!-- Tile A -->
    <rect x="120" y="100" width="70" height="70" fill="#cbd5e1"/>
    <rect x="190" y="100" width="70" height="70" fill="#78716c"/>
    <!-- Row 3 -->
    <rect x="50" y="170" width="70" height="70" fill="#cbd5e1"/>
    <rect x="120" y="170" width="70" height="70" fill="#78716c"/><!-- Tile B (in shadow) -->
    <rect x="190" y="170" width="70" height="70" fill="#cbd5e1"/>

    <!-- Cylinder casting soft shadow -->
    <ellipse cx="320" cy="90" rx="35" ry="18" fill="#15803d"/>
    <rect x="285" y="90" width="70" height="90" fill="#16a34a"/>
    <ellipse cx="320" cy="180" rx="35" ry="18" fill="#15803d"/>
    <!-- Shadow overlay over Tile B -->
    <path d="M 280 130 Q 140 180 120 220 L 260 250 Z" fill="#000000" opacity="0.45"/>

    <!-- Letter A and B Badges -->
    <text x="85" y="142" fill="#ffffff" font-size="20" font-weight="900" text-anchor="middle" font-family="sans-serif">A</text>
    <text x="155" y="212" fill="#ffffff" font-size="20" font-weight="900" text-anchor="middle" font-family="sans-serif">B</text>
  </g>
  <rect x="40" y="340" width="520" height="35" rx="8" fill="#1e293b" stroke="#334155"/>
  <text x="300" y="362" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle" font-family="sans-serif">ADELSON CHECKER SHADOW: SQUARES A AND B ARE THE EXACT SAME SHADE!</text>
</svg>`,

  'vp-10': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400" width="100%" height="100%">
  <rect width="500" height="400" fill="#0f172a" rx="16"/>
  <!-- Hermann Grid: Black squares with white streets -->
  <g transform="translate(85, 40)">
    <rect x="0" y="0" width="330" height="280" fill="#ffffff"/>
    <!-- 4x3 array of black squares -->
    <rect x="10" y="10" width="65" height="70" fill="#020617"/>
    <rect x="90" y="10" width="65" height="70" fill="#020617"/>
    <rect x="170" y="10" width="65" height="70" fill="#020617"/>
    <rect x="250" y="10" width="65" height="70" fill="#020617"/>

    <rect x="10" y="100" width="65" height="70" fill="#020617"/>
    <rect x="90" y="100" width="65" height="70" fill="#020617"/>
    <rect x="170" y="100" width="65" height="70" fill="#020617"/>
    <rect x="250" y="100" width="65" height="70" fill="#020617"/>

    <rect x="10" y="190" width="65" height="70" fill="#020617"/>
    <rect x="90" y="190" width="65" height="70" fill="#020617"/>
    <rect x="170" y="190" width="65" height="70" fill="#020617"/>
    <rect x="250" y="190" width="65" height="70" fill="#020617"/>
  </g>
  <rect x="40" y="345" width="420" height="35" rx="8" fill="#1e293b" stroke="#334155"/>
  <text x="250" y="367" fill="#cbd5e1" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">HERMANN GRID: GRAY GHOST SPOTS APPEAR AT INTERSECTIONS</text>
</svg>`,

  'vp-11': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400" width="100%" height="100%">
  <rect width="500" height="400" fill="#0f172a" rx="16"/>
  <!-- Converging Railroad Tracks (Ponzo Illusion) -->
  <line x1="250" y1="50" x2="100" y2="340" stroke="#64748b" stroke-width="6"/>
  <line x1="250" y1="50" x2="400" y2="340" stroke="#64748b" stroke-width="6"/>
  <!-- Sleepers / Ties -->
  <line x1="235" y1="80" x2="265" y2="80" stroke="#475569" stroke-width="3"/>
  <line x1="220" y1="120" x2="280" y2="120" stroke="#475569" stroke-width="4"/>
  <line x1="200" y1="170" x2="300" y2="170" stroke="#475569" stroke-width="5"/>
  <line x1="170" y1="230" x2="330" y2="230" stroke="#475569" stroke-width="6"/>
  <line x1="130" y1="300" x2="370" y2="300" stroke="#475569" stroke-width="7"/>

  <!-- Top Yellow Bar (looks huge) -->
  <rect x="180" y="110" width="140" height="12" rx="3" fill="#fbbf24" stroke="#d97706" stroke-width="1.5"/>
  <text x="330" y="120" fill="#fbbf24" font-size="10" font-weight="bold" font-family="sans-serif">Top Bar (140px)</text>

  <!-- Bottom Yellow Bar (looks small, but same length!) -->
  <rect x="180" y="280" width="140" height="12" rx="3" fill="#fbbf24" stroke="#d97706" stroke-width="1.5"/>
  <text x="330" y="290" fill="#fbbf24" font-size="10" font-weight="bold" font-family="sans-serif">Bottom Bar (140px)</text>

  <rect x="30" y="355" width="440" height="30" rx="6" fill="#1e293b" stroke="#334155"/>
  <text x="250" y="375" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">PONZO ILLUSION: BOTH YELLOW BARS ARE IDENTICAL IN LENGTH!</text>
</svg>`,

  'vp-12': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400" width="100%" height="100%">
  <rect width="500" height="400" fill="#0f172a" rx="16"/>
  <!-- Fraser Spiral Illusion: Twisted cord concentric circles -->
  <g transform="translate(250, 180)">
    <circle cx="0" cy="0" r="140" fill="none" stroke="#f8fafc" stroke-width="6" stroke-dasharray="14,14"/>
    <circle cx="0" cy="0" r="140" fill="none" stroke="#020617" stroke-width="6" stroke-dasharray="14,14" stroke-dashoffset="14"/>
    <circle cx="0" cy="0" r="105" fill="none" stroke="#f8fafc" stroke-width="6" stroke-dasharray="12,12"/>
    <circle cx="0" cy="0" r="105" fill="none" stroke="#020617" stroke-width="6" stroke-dasharray="12,12" stroke-dashoffset="12"/>
    <circle cx="0" cy="0" r="70" fill="none" stroke="#f8fafc" stroke-width="6" stroke-dasharray="10,10"/>
    <circle cx="0" cy="0" r="70" fill="none" stroke="#020617" stroke-width="6" stroke-dasharray="10,10" stroke-dashoffset="10"/>
    <circle cx="0" cy="0" r="35" fill="none" stroke="#f8fafc" stroke-width="6" stroke-dasharray="8,8"/>
    <circle cx="0" cy="0" r="35" fill="none" stroke="#020617" stroke-width="6" stroke-dasharray="8,8" stroke-dashoffset="8"/>
    <circle cx="0" cy="0" r="8" fill="#fbbf24"/>
  </g>
  <rect x="30" y="350" width="440" height="30" rx="6" fill="#1e293b" stroke="#334155"/>
  <text x="250" y="370" fill="#cbd5e1" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">FRASER SPIRAL: NESTED CONCENTRIC CIRCLES (NOT A SPIRAL!)</text>
</svg>`,

  'vp-13': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400" width="100%" height="100%">
  <rect width="500" height="400" fill="#1e293b" rx="16"/>
  <!-- Kanizsa Triangle: 3 Pac-man circles forming illusory white triangle -->
  <g transform="translate(100, 40)">
    <!-- 3 Black Pacman shapes -->
    <!-- Top Pacman -->
    <path d="M 150 40 L 150 70 A 30 30 0 1 0 176 55 Z" fill="#020617"/>
    <!-- Bottom Left Pacman -->
    <path d="M 50 240 L 80 240 A 30 30 0 1 0 65 214 Z" fill="#020617"/>
    <!-- Bottom Right Pacman -->
    <path d="M 250 240 L 220 240 A 30 30 0 1 1 235 214 Z" fill="#020617"/>
    <!-- Three black outline corner chevrons -->
    <path d="M 150 240 L 50 70 L 250 70 Z" stroke="#0f172a" stroke-width="3" fill="none"/>
    <!-- The illusory triangle appears brightly in the middle! -->
  </g>
  <rect x="40" y="345" width="420" height="35" rx="8" fill="#0f172a" stroke="#334155"/>
  <text x="250" y="367" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">KANIZSA TRIANGLE: BRAIN CREATES SOLID WHITE TRIANGLE</text>
</svg>`,

  'vp-14': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400" width="100%" height="100%">
  <rect width="500" height="400" fill="#0f172a" rx="16"/>
  <!-- Necker Cube: Isometric wireframe bistable cube -->
  <g transform="translate(150, 80)">
    <!-- Front Face -->
    <rect x="0" y="60" width="140" height="140" fill="none" stroke="#38bdf8" stroke-width="4"/>
    <!-- Rear Face -->
    <rect x="60" y="0" width="140" height="140" fill="none" stroke="#a855f7" stroke-width="4"/>
    <!-- Connecting Edges -->
    <line x1="0" y1="60" x2="60" y2="0" stroke="#94a3b8" stroke-width="4"/>
    <line x1="140" y1="60" x2="200" y2="0" stroke="#94a3b8" stroke-width="4"/>
    <line x1="0" y1="200" x2="60" y2="140" stroke="#94a3b8" stroke-width="4"/>
    <line x1="140" y1="200" x2="200" y2="140" stroke="#94a3b8" stroke-width="4"/>
  </g>
  <rect x="40" y="340" width="420" height="35" rx="8" fill="#1e293b" stroke="#334155"/>
  <text x="250" y="362" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle" font-family="sans-serif">NECKER CUBE: BISTABLE 3D DEPTH PERSPECTIVE</text>
</svg>`,

  'vp-15': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400" width="100%" height="100%">
  <rect width="500" height="400" fill="#0f172a" rx="16"/>
  <!-- The Impossible Penrose Triangle -->
  <g transform="translate(130, 40)">
    <polygon points="120,20 150,20 240,180 210,180" fill="#0284c7"/>
    <polygon points="120,20 30,180 60,180 135,50" fill="#38bdf8"/>
    <polygon points="30,180 240,180 210,230 60,230" fill="#0369a1"/>
    <!-- Impossible joint beams -->
    <path d="M 120 20 L 210 180 L 170 180 L 105 60 Z" fill="#60a5fa" opacity="0.8"/>
    <path d="M 60 180 L 240 180 L 220 215 L 90 215 Z" fill="#0ea5e9"/>
  </g>
  <rect x="40" y="340" width="420" height="35" rx="8" fill="#1e293b" stroke="#334155"/>
  <text x="250" y="362" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle" font-family="sans-serif">PENROSE TRIANGLE: THE IMPOSSIBLE TRIBAR</text>
</svg>`,

  'vp-16': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 380" width="100%" height="100%">
  <rect width="500" height="380" fill="#0f172a" rx="16"/>
  <!-- Café Wall Illusion -->
  <g transform="translate(30, 40)">
    <!-- Row 1 -->
    <g fill="#020617"><rect x="0" y="0" width="45" height="35"/><rect x="90" y="0" width="45" height="35"/><rect x="180" y="0" width="45" height="35"/><rect x="270" y="0" width="45" height="35"/><rect x="360" y="0" width="45" height="35"/></g>
    <g fill="#f8fafc"><rect x="45" y="0" width="45" height="35"/><rect x="135" y="0" width="45" height="35"/><rect x="225" y="0" width="45" height="35"/><rect x="315" y="0" width="45" height="35"/><rect x="405" y="0" width="45" height="35"/></g>
    <line x1="0" y1="36" x2="440" y2="36" stroke="#94a3b8" stroke-width="3"/>

    <!-- Row 2 (offset) -->
    <g fill="#020617"><rect x="15" y="38" width="45" height="35"/><rect x="105" y="38" width="45" height="35"/><rect x="195" y="38" width="45" height="35"/><rect x="285" y="38" width="45" height="35"/><rect x="375" y="38" width="45" height="35"/></g>
    <g fill="#f8fafc"><rect x="60" y="38" width="45" height="35"/><rect x="150" y="38" width="45" height="35"/><rect x="240" y="38" width="45" height="35"/><rect x="330" y="38" width="45" height="35"/></g>
    <line x1="0" y1="74" x2="440" y2="74" stroke="#94a3b8" stroke-width="3"/>

    <!-- Row 3 (offset) -->
    <g fill="#020617"><rect x="30" y="76" width="45" height="35"/><rect x="120" y="76" width="45" height="35"/><rect x="210" y="76" width="45" height="35"/><rect x="300" y="76" width="45" height="35"/></g>
    <g fill="#f8fafc"><rect x="75" y="76" width="45" height="35"/><rect x="165" y="76" width="45" height="35"/><rect x="255" y="76" width="45" height="35"/><rect x="345" y="76" width="45" height="35"/></g>
    <line x1="0" y1="112" x2="440" y2="112" stroke="#94a3b8" stroke-width="3"/>

    <!-- Row 4 -->
    <g fill="#020617"><rect x="15" y="114" width="45" height="35"/><rect x="105" y="114" width="45" height="35"/><rect x="195" y="114" width="45" height="35"/><rect x="285" y="114" width="45" height="35"/></g>
    <g fill="#f8fafc"><rect x="60" y="114" width="45" height="35"/><rect x="150" y="114" width="45" height="35"/><rect x="240" y="114" width="45" height="35"/><rect x="330" y="114" width="45" height="35"/></g>
    <line x1="0" y1="150" x2="440" y2="150" stroke="#94a3b8" stroke-width="3"/>
  </g>
  <rect x="40" y="325" width="420" height="35" rx="8" fill="#1e293b" stroke="#334155"/>
  <text x="250" y="347" fill="#cbd5e1" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">CAFÉ WALL: HORIZONTAL GRAY LINES ARE STRICTLY PARALLEL!</text>
</svg>`,

  'vp-17': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 350" width="100%" height="100%">
  <rect width="500" height="350" fill="#0f172a" rx="16"/>
  <!-- Müller-Lyer Illusion: Inward vs Outward arrow fins -->
  <g transform="translate(60, 60)">
    <!-- Line A (inward arrowheads) -->
    <line x1="60" y1="50" x2="320" y2="50" stroke="#f8fafc" stroke-width="6"/>
    <!-- Inward fins -->
    <line x1="60" y1="50" x2="90" y2="20" stroke="#38bdf8" stroke-width="5"/>
    <line x1="60" y1="50" x2="90" y2="80" stroke="#38bdf8" stroke-width="5"/>
    <line x1="320" y1="50" x2="290" y2="20" stroke="#38bdf8" stroke-width="5"/>
    <line x1="320" y1="50" x2="290" y2="80" stroke="#38bdf8" stroke-width="5"/>
    <text x="190" y="40" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">Line A (260px)</text>

    <!-- Line B (outward arrowheads, looks much longer!) -->
    <line x1="60" y1="170" x2="320" y2="170" stroke="#f8fafc" stroke-width="6"/>
    <!-- Outward fins -->
    <line x1="60" y1="170" x2="30" y2="140" stroke="#f43f5e" stroke-width="5"/>
    <line x1="60" y1="170" x2="30" y2="200" stroke="#f43f5e" stroke-width="5"/>
    <line x1="320" y1="170" x2="350" y2="140" stroke="#f43f5e" stroke-width="5"/>
    <line x1="320" y1="170" x2="350" y2="200" stroke="#f43f5e" stroke-width="5"/>
    <text x="190" y="160" fill="#f43f5e" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">Line B (260px)</text>
  </g>
  <rect x="40" y="295" width="420" height="35" rx="8" fill="#1e293b" stroke="#334155"/>
  <text x="250" y="317" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">MÜLLER-LYER: BOTH LINE SHAFTS ARE THE EXACT SAME LENGTH!</text>
</svg>`,

  'vp-18': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 350" width="100%" height="100%">
  <rect width="500" height="350" fill="#0f172a" rx="16"/>
  <!-- Ebbinghaus / Titchener Circles -->
  <!-- Left: Orange circle surrounded by large blue circles -->
  <g transform="translate(130, 150)">
    <circle cx="-55" cy="-45" r="32" fill="#3b82f6"/>
    <circle cx="55" cy="-45" r="32" fill="#3b82f6"/>
    <circle cx="-55" cy="45" r="32" fill="#3b82f6"/>
    <circle cx="55" cy="45" r="32" fill="#3b82f6"/>
    <!-- Center Orange circle -->
    <circle cx="0" cy="0" r="22" fill="#f97316" stroke="#ffffff" stroke-width="2"/>
  </g>

  <!-- Right: Orange circle surrounded by small blue circles -->
  <g transform="translate(360, 150)">
    <circle cx="-35" cy="-30" r="11" fill="#3b82f6"/>
    <circle cx="0" cy="-45" r="11" fill="#3b82f6"/>
    <circle cx="35" cy="-30" r="11" fill="#3b82f6"/>
    <circle cx="45" cy="0" r="11" fill="#3b82f6"/>
    <circle cx="35" cy="30" r="11" fill="#3b82f6"/>
    <circle cx="0" cy="45" r="11" fill="#3b82f6"/>
    <circle cx="-35" cy="30" r="11" fill="#3b82f6"/>
    <circle cx="-45" cy="0" r="11" fill="#3b82f6"/>
    <!-- Center Orange circle (same 22px radius!) -->
    <circle cx="0" cy="0" r="22" fill="#f97316" stroke="#ffffff" stroke-width="2"/>
  </g>
  <rect x="40" y="295" width="420" height="35" rx="8" fill="#1e293b" stroke="#334155"/>
  <text x="250" y="317" fill="#f97316" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">EBBINGHAUS: BOTH CENTRAL ORANGE CIRCLES ARE IDENTICAL!</text>
</svg>`,

  'vp-19': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 350" width="100%" height="100%">
  <rect width="600" height="350" fill="#0f172a" rx="16"/>
  <text x="300" y="40" fill="#f8fafc" font-size="14" font-weight="900" text-anchor="middle" font-family="sans-serif">THREE SURVIVAL DOORS: WHICH ONE IS SAFE?</text>
  <!-- Door 1: Inferno -->
  <g transform="translate(50, 70)">
    <rect x="0" y="0" width="130" height="190" rx="8" fill="#7f1d1d" stroke="#ef4444" stroke-width="3"/>
    <text x="65" y="30" fill="#fecaca" font-size="12" font-weight="900" text-anchor="middle" font-family="sans-serif">DOOR 1</text>
    <!-- Fire flames -->
    <path d="M 40 160 Q 65 70 65 110 Q 75 80 90 160 Z" fill="#f97316"/>
    <path d="M 50 160 Q 65 100 65 130 Q 75 110 80 160 Z" fill="#fde047"/>
    <text x="65" y="180" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle" font-family="sans-serif">RAGING FIRE</text>
  </g>
  <!-- Door 2: Starved Lions -->
  <g transform="translate(235, 70)">
    <rect x="0" y="0" width="130" height="190" rx="8" fill="#064e3b" stroke="#10b981" stroke-width="3"/>
    <text x="65" y="30" fill="#a7f3d0" font-size="12" font-weight="900" text-anchor="middle" font-family="sans-serif">DOOR 2</text>
    <rect x="25" y="55" width="80" height="65" rx="6" fill="#022c22" stroke="#34d399"/>
    <text x="65" y="85" fill="#34d399" font-size="10" font-weight="bold" text-anchor="middle" font-family="sans-serif">LIONS STARVED</text>
    <text x="65" y="102" fill="#fbbf24" font-size="11" font-weight="900" text-anchor="middle" font-family="sans-serif">FOR 3 YEARS</text>
    <text x="65" y="150" fill="#34d399" font-size="11" font-weight="900" text-anchor="middle" font-family="sans-serif">(THEY'RE DEAD!)</text>
    <text x="65" y="180" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle" font-family="sans-serif">SAFE TO ENTER</text>
  </g>
  <!-- Door 3: High Voltage -->
  <g transform="translate(420, 70)">
    <rect x="0" y="0" width="130" height="190" rx="8" fill="#581c87" stroke="#a855f7" stroke-width="3"/>
    <text x="65" y="30" fill="#e9d5ff" font-size="12" font-weight="900" text-anchor="middle" font-family="sans-serif">DOOR 3</text>
    <!-- Lightning bolt -->
    <path d="M 70 60 L 50 110 L 70 110 L 60 160 L 85 100 L 65 100 Z" fill="#fde047"/>
    <text x="65" y="180" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle" font-family="sans-serif">ELECTRIC GRID</text>
  </g>
  <rect x="40" y="295" width="520" height="35" rx="8" fill="#1e293b" stroke="#10b981"/>
  <text x="300" y="317" fill="#34d399" font-size="12" font-weight="bold" text-anchor="middle" font-family="sans-serif">DOOR 2: LIONS THAT HAVEN'T EATEN IN 3 YEARS HAVE ALREADY PERISHED!</text>
</svg>`,

  'vp-20': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 350" width="100%" height="100%">
  <rect width="500" height="350" fill="#0f172a" rx="16"/>
  <!-- Detective Crime Scene Watch -->
  <g transform="translate(160, 40)">
    <circle cx="90" cy="90" r="85" fill="#1e293b" stroke="#cbd5e1" stroke-width="8"/>
    <!-- Watch Face -->
    <circle cx="90" cy="90" r="75" fill="#f8fafc"/>
    <!-- Hour markers -->
    <line x1="90" y1="20" x2="90" y2="30" stroke="#0f172a" stroke-width="4"/>
    <line x1="160" y1="90" x2="150" y2="90" stroke="#0f172a" stroke-width="4"/>
    <line x1="90" y1="160" x2="90" y2="150" stroke="#0f172a" stroke-width="4"/>
    <line x1="20" y1="90" x2="30" y2="90" stroke="#0f172a" stroke-width="4"/>
    <!-- Hands frozen at 2:15 -->
    <line x1="90" y1="90" x2="135" y2="70" stroke="#0f172a" stroke-width="5" stroke-linecap="round"/>
    <line x1="90" y1="90" x2="148" y2="90" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
    <circle cx="90" cy="90" r="5" fill="#0f172a"/>
    <!-- Shattered glass crack lines -->
    <path d="M 50 40 L 90 90 L 140 130 M 90 90 L 110 50 M 90 90 L 70 140" stroke="#64748b" stroke-width="2"/>
  </g>
  <rect x="40" y="275" width="420" height="50" rx="8" fill="#1e293b" stroke="#ef4444"/>
  <text x="250" y="295" fill="#f87171" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">CRACKED WATCH STOPPED AT 2:15 PM</text>
  <text x="250" y="313" fill="#cbd5e1" font-size="10" font-weight="bold" text-anchor="middle" font-family="sans-serif">Suspect claim of alibi at 3:00 PM is busted!</text>
</svg>`,

  'vp-21': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 350" width="100%" height="100%">
  <rect width="600" height="350" fill="#0f172a" rx="16"/>
  <text x="300" y="40" fill="#f8fafc" font-size="14" font-weight="900" text-anchor="middle" font-family="sans-serif">THE POISONED ICED TEA RIDDLE</text>
  <!-- Glass 1: Chugged fast -->
  <g transform="translate(100, 70)">
    <rect x="20" y="20" width="90" height="150" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>
    <!-- Solid Ice Cubes still intact -->
    <rect x="35" y="110" width="28" height="28" rx="4" fill="#e0f2fe" stroke="#38bdf8" stroke-width="1.5"/>
    <rect x="65" y="125" width="28" height="28" rx="4" fill="#e0f2fe" stroke="#38bdf8" stroke-width="1.5"/>
    <text x="65" y="195" fill="#34d399" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">DRANK IN 10s</text>
    <text x="65" y="210" fill="#34d399" font-size="10" font-weight="bold" text-anchor="middle" font-family="sans-serif">SURVIVED!</text>
  </g>
  <!-- Glass 2: Sipped slow -->
  <g transform="translate(370, 70)">
    <rect x="20" y="20" width="90" height="150" rx="6" fill="#1e293b" stroke="#ef4444" stroke-width="3"/>
    <!-- Liquid poisoned from melted ice -->
    <rect x="23" y="80" width="84" height="87" fill="#78350f" opacity="0.8"/>
    <text x="65" y="125" fill="#f87171" font-size="20" font-weight="900" text-anchor="middle" font-family="sans-serif">☠</text>
    <text x="65" y="195" fill="#f87171" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">SIPPED FOR 1 HR</text>
    <text x="65" y="210" fill="#f87171" font-size="10" font-weight="bold" text-anchor="middle" font-family="sans-serif">DIED OF POISON</text>
  </g>
  <rect x="40" y="295" width="520" height="35" rx="8" fill="#1e293b" stroke="#334155"/>
  <text x="300" y="317" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">THE POISON WAS FROZEN IN THE ICE CUBES (MELTED OVER TIME)!</text>
</svg>`,

  'vp-22': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 350" width="100%" height="100%">
  <rect width="600" height="350" fill="#334155" rx="16"/>
  <!-- Rocky mountain terrain texture -->
  <polygon points="50,300 150,120 280,300" fill="#475569"/>
  <polygon points="200,320 380,80 480,320" fill="#64748b"/>
  <polygon points="350,320 480,140 580,320" fill="#475569"/>
  <!-- Camouflaged Snow Leopard crouching -->
  <g transform="translate(240, 160)">
    <ellipse cx="60" cy="40" rx="45" ry="25" fill="#94a3b8"/>
    <circle cx="105" cy="25" r="18" fill="#94a3b8"/>
    <!-- Spots / rosettes matching slate rock -->
    <circle cx="45" cy="35" r="4" fill="#334155"/>
    <circle cx="65" cy="45" r="5" fill="#334155"/>
    <circle cx="80" cy="32" r="4" fill="#334155"/>
    <circle cx="105" cy="22" r="3" fill="#334155"/>
    <!-- Tail -->
    <path d="M 20 45 Q 0 50 10 70" stroke="#94a3b8" stroke-width="8" stroke-linecap="round" fill="none"/>
  </g>
  <rect x="40" y="295" width="520" height="35" rx="8" fill="#0f172a" stroke="#cbd5e1"/>
  <text x="300" y="317" fill="#cbd5e1" font-size="12" font-weight="bold" text-anchor="middle" font-family="sans-serif">CAMOUFLAGED ANIMAL: SNOW LEOPARD ON SLATE ROCK CLIFF</text>
</svg>`,

  'vp-23': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 350" width="100%" height="100%">
  <rect width="500" height="350" fill="#0f172a" rx="16"/>
  <!-- 3x3 Grid Square Counting -->
  <g transform="translate(150, 40)">
    <rect x="0" y="0" width="210" height="210" fill="none" stroke="#38bdf8" stroke-width="5"/>
    <line x1="70" y1="0" x2="70" y2="210" stroke="#38bdf8" stroke-width="3"/>
    <line x1="140" y1="0" x2="140" y2="210" stroke="#38bdf8" stroke-width="3"/>
    <line x1="0" y1="70" x2="210" y2="70" stroke="#38bdf8" stroke-width="3"/>
    <line x1="0" y1="140" x2="210" y2="140" stroke="#38bdf8" stroke-width="3"/>
    <!-- Highlighted 2x2 square in violet -->
    <rect x="0" y="0" width="140" height="140" fill="#a855f7" opacity="0.2" stroke="#a855f7" stroke-width="2"/>
  </g>
  <rect x="40" y="285" width="420" height="45" rx="8" fill="#1e293b" stroke="#334155"/>
  <text x="250" y="305" fill="#f8fafc" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">TOTAL SQUARES IN A 3x3 GRID:</text>
  <text x="250" y="322" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">9 (1x1) + 4 (2x2) + 1 (3x3) = 14 SQUARES TOTAL</text>
</svg>`,

  'vp-24': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 350" width="100%" height="100%">
  <rect width="600" height="350" fill="#0f172a" rx="16"/>
  <text x="300" y="40" fill="#f8fafc" font-size="14" font-weight="900" text-anchor="middle" font-family="sans-serif">DIE HARD 3: MEASURE EXACTLY 4 GALLONS</text>
  <!-- 5 Gallon Jug -->
  <g transform="translate(120, 80)">
    <rect x="0" y="20" width="100" height="140" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>
    <rect x="35" y="0" width="30" height="20" rx="2" fill="#334155"/>
    <rect x="5" y="50" width="90" height="105" fill="#0284c7" opacity="0.7"/>
    <text x="50" y="105" fill="#ffffff" font-size="16" font-weight="900" text-anchor="middle" font-family="sans-serif">5 GAL</text>
  </g>
  <!-- 3 Gallon Jug -->
  <g transform="translate(360, 110)">
    <rect x="0" y="20" width="80" height="110" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>
    <rect x="25" y="0" width="30" height="20" rx="2" fill="#334155"/>
    <rect x="5" y="45" width="70" height="80" fill="#0284c7" opacity="0.7"/>
    <text x="40" y="90" fill="#ffffff" font-size="16" font-weight="900" text-anchor="middle" font-family="sans-serif">3 GAL</text>
  </g>
  <rect x="40" y="285" width="520" height="45" rx="8" fill="#1e293b" stroke="#38bdf8"/>
  <text x="300" y="305" fill="#f8fafc" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">Fill 5G, pour into 3G (2G left). Empty 3G, pour in 2G.</text>
  <text x="300" y="322" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">Fill 5G, top off 3G (takes 1G) ➔ EXACTLY 4 GALLONS LEFT IN 5G!</text>
</svg>`,

  'vp-25': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 350" width="100%" height="100%">
  <rect width="600" height="350" fill="#0f172a" rx="16"/>
  <text x="300" y="35" fill="#f8fafc" font-size="13" font-weight="900" text-anchor="middle" font-family="sans-serif">3 SWITCHES DOWNSTAIRS · 1 BULB IN THE ATTIC</text>
  <!-- Downstairs Switches -->
  <g transform="translate(80, 80)">
    <rect x="0" y="0" width="160" height="150" rx="8" fill="#1e293b" stroke="#64748b" stroke-width="2"/>
    <text x="80" y="25" fill="#94a3b8" font-size="10" font-weight="bold" text-anchor="middle" font-family="sans-serif">GROUND FLOOR</text>
    <!-- Switch 1 -->
    <rect x="25" y="40" width="30" height="22" rx="4" fill="#fbbf24"/><text x="40" y="55" fill="#0f172a" font-size="10" font-weight="bold" text-anchor="middle">1</text>
    <!-- Switch 2 -->
    <rect x="65" y="40" width="30" height="22" rx="4" fill="#38bdf8"/><text x="80" y="55" fill="#0f172a" font-size="10" font-weight="bold" text-anchor="middle">2</text>
    <!-- Switch 3 -->
    <rect x="105" y="40" width="30" height="22" rx="4" fill="#64748b"/><text x="120" y="55" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">3</text>
  </g>
  <!-- Attic Light Bulb -->
  <g transform="translate(380, 80)">
    <rect x="0" y="0" width="140" height="150" rx="8" fill="#1e293b" stroke="#fbbf24" stroke-width="2"/>
    <text x="70" y="25" fill="#fbbf24" font-size="10" font-weight="bold" text-anchor="middle" font-family="sans-serif">ATTIC</text>
    <circle cx="70" cy="80" r="28" fill="#fde047" stroke="#eab308" stroke-width="3"/>
    <text x="70" y="130" fill="#cbd5e1" font-size="10" font-weight="bold" text-anchor="middle" font-family="sans-serif">LIGHT & HEAT</text>
  </g>
  <rect x="30" y="275" width="540" height="50" rx="8" fill="#1e293b" stroke="#fbbf24"/>
  <text x="300" y="295" fill="#fde047" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">Turn 1 ON for 10 min, turn OFF. Turn 2 ON and walk upstairs:</text>
  <text x="300" y="315" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle" font-family="sans-serif">Lit = Switch 2  ·  Warm to touch = Switch 1  ·  Cold = Switch 3</text>
</svg>`,

  'vp-26': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 350" width="100%" height="100%">
  <rect width="600" height="350" fill="#0f172a" rx="16"/>
  <text x="300" y="40" fill="#f8fafc" font-size="14" font-weight="900" text-anchor="middle" font-family="sans-serif">10 CANDLES: WIND BLOWS OUT 3</text>
  <!-- Birthday Cake with 10 candles: 7 burning, 3 extinguished with smoke -->
  <g transform="translate(60, 90)">
    <rect x="40" y="90" width="400" height="60" rx="8" fill="#ec4899"/>
    <!-- 7 burning candles -->
    <g fill="#fde047">
      <rect x="60" y="40" width="10" height="50" rx="2" fill="#e2e8f0"/><circle cx="65" cy="30" r="7" fill="#f97316"/>
      <rect x="100" y="40" width="10" height="50" rx="2" fill="#e2e8f0"/><circle cx="105" cy="30" r="7" fill="#f97316"/>
      <rect x="140" y="40" width="10" height="50" rx="2" fill="#e2e8f0"/><circle cx="145" cy="30" r="7" fill="#f97316"/>
      <rect x="220" y="40" width="10" height="50" rx="2" fill="#e2e8f0"/><circle cx="225" cy="30" r="7" fill="#f97316"/>
      <rect x="260" y="40" width="10" height="50" rx="2" fill="#e2e8f0"/><circle cx="265" cy="30" r="7" fill="#f97316"/>
      <rect x="340" y="40" width="10" height="50" rx="2" fill="#e2e8f0"/><circle cx="345" cy="30" r="7" fill="#f97316"/>
      <rect x="380" y="40" width="10" height="50" rx="2" fill="#e2e8f0"/><circle cx="385" cy="30" r="7" fill="#f97316"/>
    </g>
    <!-- 3 blown out candles (smoke wisps) -->
    <g fill="#94a3b8">
      <rect x="180" y="40" width="10" height="50" rx="2" fill="#e2e8f0"/><path d="M 185 35 Q 180 20 190 10" stroke="#94a3b8" stroke-width="2" fill="none"/>
      <rect x="300" y="40" width="10" height="50" rx="2" fill="#e2e8f0"/><path d="M 305 35 Q 300 20 310 10" stroke="#94a3b8" stroke-width="2" fill="none"/>
      <rect x="420" y="40" width="10" height="50" rx="2" fill="#e2e8f0"/><path d="M 425 35 Q 420 20 430 10" stroke="#94a3b8" stroke-width="2" fill="none"/>
    </g>
  </g>
  <rect x="30" y="285" width="540" height="40" rx="8" fill="#1e293b" stroke="#ec4899"/>
  <text x="300" y="310" fill="#fbcfe8" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">3 CANDLES REMAIN! (The 7 burning ones melted away to nothing)</text>
</svg>`,

  'vp-27': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 350" width="100%" height="100%">
  <rect width="500" height="350" fill="#0f172a" rx="16"/>
  <!-- Regular Tetrahedron Geometry -->
  <g transform="translate(150, 40)">
    <!-- Base triangle and apex -->
    <polygon points="100,20 10,180 190,180" stroke="#38bdf8" stroke-width="4" fill="#0284c7" opacity="0.3"/>
    <line x1="100" y1="20" x2="100" y2="130" stroke="#f43f5e" stroke-width="3" stroke-dasharray="4,4"/>
    <line x1="10" y1="180" x2="100" y2="130" stroke="#f43f5e" stroke-width="3" stroke-dasharray="4,4"/>
    <line x1="190" y1="180" x2="100" y2="130" stroke="#f43f5e" stroke-width="3" stroke-dasharray="4,4"/>
    <!-- Vertices -->
    <circle cx="100" cy="20" r="6" fill="#fbbf24"/>
    <circle cx="10" cy="180" r="6" fill="#fbbf24"/>
    <circle cx="190" cy="180" r="6" fill="#fbbf24"/>
    <circle cx="100" cy="130" r="6" fill="#fbbf24"/>
  </g>
  <rect x="40" y="285" width="420" height="45" rx="8" fill="#1e293b" stroke="#38bdf8"/>
  <text x="250" y="305" fill="#f8fafc" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">REGULAR TETRAHEDRON (TRIANGULAR PYRAMID):</text>
  <text x="250" y="322" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">4 FACES · 6 EDGES · 4 VERTICES</text>
</svg>`,

  'vp-28': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 350" width="100%" height="100%">
  <rect width="600" height="350" fill="#064e3b" rx="16"/>
  <!-- Stem and Leaves with Camouflaged Leaf Insect -->
  <g transform="translate(100, 40)">
    <line x1="50" y1="240" x2="350" y2="40" stroke="#78350f" stroke-width="8" stroke-linecap="round"/>
    <!-- Real Leaves -->
    <ellipse cx="140" cy="140" rx="45" ry="20" transform="rotate(-30, 140, 140)" fill="#10b981"/>
    <ellipse cx="260" cy="70" rx="45" ry="20" transform="rotate(20, 260, 70)" fill="#059669"/>
    <!-- Leaf Insect (Phasmid) with legs and antennae -->
    <g transform="translate(200, 110)">
      <ellipse cx="0" cy="0" rx="42" ry="22" transform="rotate(40)" fill="#34d399" stroke="#059669" stroke-width="2"/>
      <!-- Legs and antennae -->
      <line x1="-20" y1="-10" x2="-35" y2="-25" stroke="#059669" stroke-width="3"/>
      <line x1="20" y1="-10" x2="35" y2="-25" stroke="#059669" stroke-width="3"/>
      <line x1="-15" y1="15" x2="-30" y2="30" stroke="#059669" stroke-width="3"/>
      <line x1="15" y1="15" x2="30" y2="30" stroke="#059669" stroke-width="3"/>
      <!-- Veins like leaf -->
      <line x1="-30" y1="0" x2="30" y2="0" stroke="#047857" stroke-width="2"/>
    </g>
  </g>
  <rect x="40" y="285" width="520" height="40" rx="8" fill="#0f172a" stroke="#34d399"/>
  <text x="300" y="310" fill="#a7f3d0" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">NATURE'S CAMOUFLAGE: A LEAF INSECT / STICK INSECT (PHASMID)</text>
</svg>`,

  'vp-29': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 350" width="100%" height="100%">
  <rect width="600" height="350" fill="#0f172a" rx="16"/>
  <!-- Wooden Dock and Lake Water -->
  <rect x="0" y="160" width="600" height="190" fill="#0369a1" opacity="0.6"/>
  <rect x="40" y="140" width="280" height="30" fill="#78350f" stroke="#b45309"/>
  <!-- Tourist standing on dock with hands in pockets -->
  <g transform="translate(180, 50)">
    <circle cx="15" cy="15" r="12" fill="#fed7aa"/>
    <rect x="0" y="30" width="30" height="60" rx="6" fill="#3b82f6"/>
    <!-- Hands in pockets -->
    <path d="M 0 50 L 5 70 M 30 50 L 25 70" stroke="#1d4ed8" stroke-width="5"/>
  </g>
  <!-- Inverted Reflection in water: Holding an umbrella! -->
  <g transform="translate(180, 180) scale(1, -1)">
    <circle cx="15" cy="-25" r="12" fill="#fed7aa" opacity="0.8"/>
    <rect x="0" y="-10" width="30" height="60" rx="6" fill="#3b82f6" opacity="0.8"/>
    <!-- Holding umbrella in reflection! (PHYSICAL IMPOSSIBILITY) -->
    <line x1="30" y1="10" x2="50" y2="-40" stroke="#f43f5e" stroke-width="4"/>
    <path d="M 25 -40 Q 50 -60 75 -40 Z" fill="#f43f5e"/>
  </g>
  <rect x="30" y="290" width="540" height="40" rx="8" fill="#1e293b" stroke="#ef4444"/>
  <text x="300" y="315" fill="#f87171" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">ALTERED REFLECTION: HANDS IN POCKETS VS HOLDING UMBRELLA IN WATER</text>
</svg>`,

  'vp-30': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 380" width="100%" height="100%">
  <rect width="500" height="380" fill="#0f172a" rx="16"/>
  <!-- Triangle Counting Challenge -->
  <g transform="translate(100, 30)">
    <polygon points="150,20 20,260 280,260" stroke="#38bdf8" stroke-width="5" fill="#0284c7" opacity="0.2"/>
    <!-- Center vertical bisector -->
    <line x1="150" y1="20" x2="150" y2="260" stroke="#f43f5e" stroke-width="4"/>
    <!-- Horizontal Crossbar 1 -->
    <line x1="107" y1="100" x2="193" y2="100" stroke="#fbbf24" stroke-width="4"/>
    <!-- Horizontal Crossbar 2 -->
    <line x1="63" y1="180" x2="237" y2="180" stroke="#fbbf24" stroke-width="4"/>
  </g>
  <rect x="40" y="315" width="420" height="45" rx="8" fill="#1e293b" stroke="#38bdf8"/>
  <text x="250" y="335" fill="#f8fafc" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">HOW MANY TOTAL TRIANGLES?</text>
  <text x="250" y="350" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">Tier 1 (6) + Tier 2 (6) + Tier 3 (6) = 18 TRIANGLES</text>
</svg>`
};

for (const [id, svg] of Object.entries(PUZZLE_SVGS)) {
  const filePath = path.join(outDir, `${id}.svg`);
  fs.writeFileSync(filePath, svg.trim(), 'utf-8');
}

console.log(`Successfully generated ${Object.keys(PUZZLE_SVGS).length} puzzle SVGs in ${outDir}`);
