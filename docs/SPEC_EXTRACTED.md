Jumbo App – Build Guide for the AI Agent

Technical specification and implementation brief · Prepared October 27, 2026

1. How to use this document

This is the brief for the AI coding agent that will design and build Jumbo App. Read it fully before writing code. Build in the phases from section 13, one at a time, and show a working result (running app plus passing tests) at the end of each phase. Wherever this guide says verify, check the provider’s current documentation, because free-tier limits and API endpoints change.

Rules for the agent

No Docker anywhere, not for development and not for deployment. Use native Node.js processes, managed hosting and native binaries.

Use free or open-source tools wherever possible, but never hide a cost. If something becomes paid at scale, write it in the README.

Never put API secrets in client code. Use environment variables and a .env.example file.

Use TypeScript everywhere. Add tests for scoring, question generation and token issuing.

Ask the owner before any decision that changes cost, privacy or the features listed here.

2. Product vision

Jumbo App is a web-first platform that works on phones, tablets and computers. It combines two products in one app:

Video meetings (like Google Meet or Zoom): many users in one call, high-quality video, clear audio and recording.

Jumbo Quiz (like Kahoot): live multiplayer quiz games that run inside a meeting or on their own.

The key difference from Kahoot: in Kahoot, players mostly see only their own result on their phone. In Jumbo Quiz, every participant sees the live leaderboard and how the whole game is going in real time, from the top scorer down to the lowest.

3. Honest expectations

Zero delay and zero interference are not physically possible on the internet. The realistic target is audio and video delay of roughly 100 to 300 ms, and game updates under about 200 ms on a decent connection. The architecture below is designed to get as close as possible.

In a call, interference really means overlapping voices, background noise and echo (a microphone picking up the speakers). Section 6.3 handles these.

Free tools are fine to start. Video uses a lot of bandwidth, so free tiers and cheap servers have limits. Plan to move to paid hosting as the user count grows.

4. Architecture

Three parts:

Client app: React and TypeScript, installable as a PWA.

Jumbo API server: Node.js. Handles accounts, rooms, media tokens, the game engine (WebSocket), the question generator and recording control.

Media server: LiveKit, an open-source WebRTC SFU.

Why an SFU. In a peer-to-peer mesh every user uploads video to every other user, which breaks down beyond about 4 people. An SFU receives one upload per user and forwards it to everyone else. With simulcast (several quality layers) each viewer gets the quality that fits their bandwidth.

Why LiveKit. It is open source (Apache 2.0), ships as a single native binary (no Docker needed), has a built-in TURN server, simulcast, adaptive streaming, active-speaker detection, data messages and token-based auth. It has SDKs for web, React, React Native, Flutter, iOS and Android. Alternatives: mediasoup (a Node.js library, more work to build on) and Jitsi (complete product, harder to customise).

Two ways to run the media server

Option A, fastest: LiveKit Cloud free tier (managed). Verify the current limits.

Option B: self-host the LiveKit binary on a Linux VPS with systemd, with Caddy providing free HTTPS. Follow the LiveKit docs for the required ports.

Why the game has its own server. The quiz uses its own authoritative WebSocket server instead of relying only on LiveKit data messages. That way the game also works without a call and the scores can be trusted.

5. Tech stack

Frontend: React 18+, TypeScript, Vite, Tailwind CSS, vite-plugin-pwa, livekit-client and @livekit/components-react, Zustand, socket.io-client.

Backend: Node.js LTS, TypeScript, Fastify, Socket.IO, livekit-server-sdk, zod for validation.

Data: Supabase free tier (Postgres, Auth, Storage). SQLite is fine for local development. Keep live game state in memory in v1; add Upstash Redis later if running more than one API instance.

Hosting without Docker: frontend on Cloudflare Pages, Vercel or Netlify. API on Render or Railway using the native Node runtime, or on a VPS with PM2. LiveKit as in section 4.

Native apps later: wrap the PWA with Capacitor, or build with React Native and the LiveKit React Native SDK.

HTTPS everywhere. Browsers only allow camera and microphone on secure origins.

6. Video meeting features

6.1 Core features

Create and join by link or code, a lobby with camera and mic preview, device selection, gallery view and speaker view, screen share, in-call chat, raise hand, participant list, host controls (mute, remove, lock room, end meeting) and automatic reconnect.

6.2 Quality

Video: simulcast with 3 layers (for example 180p, 360p, 720p), with adaptive stream and dynacast enabled. Default capture 720p at 30 fps, optional 1080p for screen share. Do not subscribe to tiles that are off-screen.

Audio: Opus with DTX and in-band FEC to survive packet loss. Audio has priority: when bandwidth drops, reduce video first.

Grid: desktop shows up to 16 tiles per page with pagination. Mobile shows 4 tiles plus the active speaker; other participants stay audio-only until visible.

Show a connection-quality indicator for each participant.

6.3 Talk without interruption and automatic muting

The goal is that nobody has to ask the host to mute a noisy person. Build these layers:

Capture cleanup: request echoCancellation, noiseSuppression and autoGainControl in getUserMedia. Optionally add RNNoise (WASM) or the Krisp filter if using LiveKit Cloud (verify availability).

Voice activity detection (VAD): run on the device. Use the Web Audio AnalyserNode for loudness and a speech model such as Silero VAD (@ricky0123/vad-web) to tell human speech from other sound.

Auto-mute rule: if the mic is above the loudness threshold for more than 3 seconds and VAD says it is not speech (typing, music, TV, fan, barking, feedback howl), mute the mic automatically and show a message: Jumbo muted your mic because of background noise. Tap to unmute.

Anti-flapping: after a manual unmute give a 10-second grace period. After 3 auto-mutes in 2 minutes, suggest headphones or push-to-talk.

Echo and feedback: if a mic keeps picking up sustained loud tonal sound while others are speaking, auto-mute it and recommend headphones.

Talk-over management: use LiveKit active-speaker events to highlight the current speaker. When 3 or more people speak at once for more than 2 seconds, show a hint to speak one at a time and lower the volume of non-dominant speakers by about 50% for listeners. Make this a host setting called Strict mode, off by default.

Large rooms: a host setting to make participants join muted when the room has more than 8 people.

The host can always override. Auto noise control is on by default and the host can turn it off. All thresholds live in one config file so they can be tuned. Detection runs on the user’s device, so no audio is sent to the server for analysis (better for privacy).

6.4 Recording

Phase 1, client-side: the host records a composite canvas plus mixed audio with MediaRecorder and downloads a .webm file. Limits: the tab must stay open and it is unreliable on mobile.

Phase 2, server-side: LiveKit Egress records the room composite to MP4 and uploads it to Cloudflare R2 (free tier) or Supabase Storage. Egress needs headless Chrome and ffmpeg and is normally deployed with Docker. Because we do not use Docker, the agent must evaluate two options and report before choosing: LiveKit Cloud egress, or a native install on the server.

Consent and privacy: show a clear recording banner and play a sound when recording starts, notify every participant, keep recordings private with expiring signed URLs, and let the host delete them.

7. Jumbo Quiz

7.1 Game flow

The host creates a game (custom or auto-generated), from a meeting or on its own, and gets a PIN and link. Players join from inside the meeting or with the PIN.

Lobby: players appear live with names and avatars.

The host presses Start. For each question the server sends the question and a start timestamp to everyone at the same moment. A countdown runs, players tap an answer, and the question ends when the timer finishes or everyone has answered.

Reveal: show the correct answer, a bar chart of how many players chose each option, then the sorted leaderboard to all participants.

After the last question: podium for the top 3, the full ranking, and saved results the host can download.

7.2 Real-time visibility (the core difference)

Every participant sees the leaderboard ranked from highest to lowest score, with animated position changes and their own row highlighted.

During a question everyone sees how many players have answered (for example 12 of 20) without seeing who chose what.

After the reveal everyone sees each player’s answer result and points earned.

Host setting for leaderboard visibility: Live for everyone (default), After each question, or End only.

Answer options are visible to players, but the correct answer is never sent until the reveal.

7.3 Scoring (server-side only)

Correct answer: points = round(1000 * (1 - (responseTime / timeLimit) / 2)). Wrong or no answer: 0.

Optional streak bonus: +100 per consecutive correct answer, capped at +500.

Response time is measured by the server from the moment the question was sent to the moment the answer arrives, minus half the measured round-trip time. Never trust client-reported times.

Ties: the player with the lower total response time ranks higher.

One answer per player per question. Later changes are rejected.

7.4 Synchronisation and anti-cheat

Clock sync: each client pings the server, computes its clock offset, and renders the countdown from the synced clock. The question message carries the server start time and duration, so every timer matches.

The server is the single source of truth. On reconnect the client receives a full state snapshot.

Anti-cheat: correct answers stay on the server until the reveal, all input is validated, rate limits apply, and each player has one active connection.

7.5 Event contract (Socket.IO)

Client to server: game:create, game:join, game:start, answer:submit, game:next, game:end, game:kick

Server to clients: lobby:update, question:show, answers:progress, question:reveal, leaderboard:update, game:finished, game:state

Define these names and their zod schemas once in packages/shared.

7.6 Question types

Multiple choice with 4 options (default), true or false, image-based (flag, logo, animal photo), and numeric or formula questions. Time limit configurable from 10 to 30 seconds.

8. Question sources

8.1 Host-created games

A builder form for question text, optional image upload (Supabase Storage), 2 to 4 options, the correct option, time limit and points. Hosts can save question sets, reuse them and import from CSV.

8.2 Auto-generated games

Default is 15 questions; the host can choose 5 to 30 and pick categories: Flags, Countries and capitals, Logos and brands, Animals, History, Geography, Science, Math and formulas, Numbers and logic, Religion and culture, Mythology, and General knowledge.

Free sources (verify limits before relying on them)

Open Trivia DB (opentdb.com): free, no key, many categories. Supports a session token to avoid repeated questions. Roughly 1 request per 5 seconds per IP. Text can be HTML-encoded, so request url3986 or base64 encoding.

REST Countries (restcountries.com): free, no key. Country names, capitals, regions, population and flag URLs. Use the fields parameter.

FlagCDN (flagcdn.com): free flag images by ISO code, for example https://flagcdn.com/w320/ke.png.

Simple Icons (npm package simple-icons): free SVG logos for many brands. Bundle them locally. Logos are trademarks, so use them only for the educational quiz context. Do not depend on Clearbit’s free logo API, which was being retired.

Wikipedia and Wikimedia REST API: free thumbnails and summaries for animals, landmarks and historical figures. Send a descriptive User-Agent header and respect image licence attribution.

Wikidata (SPARQL): optional free structured facts for comparison questions.

Math, formulas and numbers: generate locally in code (arithmetic, sequences, percentages, geometry, and a curated formula bank). No API needed.

AI generation (optional): free tiers such as Google Gemini API, Groq or OpenRouter free models. Ask for a strict JSON schema, validate with zod, reject malformed output. Use it for history, culture and general text. Use the structured APIs above for flags and countries so the facts are guaranteed correct.

8.3 Generator algorithm

Take the chosen categories and the count N. Spread questions evenly, shuffle, and avoid duplicates.

Call the builder for each category. Example, the flag builder picks a random country as the correct answer and 3 distractors from the same region so the question is fair.

Shuffle the options and store correctIndex on the server only.

Validate: exactly one correct option, distinct options, text length limits, and image URL reachable (HEAD request).

Pre-fetch and cache all images before the game starts so nothing loads late.

Cache API results in the database and refresh daily. If an API fails, fall back to a local seed bank of at least 300 questions shipped with the app.

Generate while the lobby is open and show progress. It must finish before the host can start.

Content safety. Religion and culture questions must be factual, neutral and respectful, checked against reliable sources. The host can disable any category, and players can report a question.

9. Data model

users, rooms (id, code, host_id, status, settings), recordings (id, room_id, url, started_at, duration)

games (id, room_id, pin, settings, status), question_sets, questions (id, set_id, type, text, image_url, options, correct_index, time_limit, category)

game_players (id, game_id, display_name, avatar, total_score, total_time), game_answers (game_id, question_id, player_id, choice, response_ms, points)

Use Supabase row-level security so users only see their own data.

10. Security and privacy

LiveKit tokens are issued only by the API, are short-lived (for example 1 hour), and are limited to one room with role-based permissions. The API secret never leaves the server.

Guests can join with a display name and room code. Accounts are optional.

Rate limiting, input sanitisation for names and chat, restricted CORS, HTTPS and security headers.

Recording consent, deletion on request and a privacy policy.

Collect minimal data. Schools and children may use quiz games, so avoid unnecessary personal data.

11. Responsive UI

Mobile-first layouts, touch targets of at least 44 px, large answer buttons that use shapes as well as colours, and landscape support.

Meeting with game: on desktop the quiz is a side panel. On mobile it is a full-screen overlay during a question, with a thin strip of video thumbnails on top.

Light and dark themes, and i18n-ready text with English first.

PWA with an installable shell. Use the Screen Wake Lock API during calls and games.

iOS Safari needs a user gesture to start audio. Test on real iPhone and Android devices.

12. Testing and quality targets

Unit tests: scoring, tie-breaks, generator validity.

Load tests: a script with 100 simulated players using socket.io-client, and the LiveKit load-test tool for media.

Network tests: Chrome DevTools throttling and 5% packet loss.

Device matrix: Chrome, Safari on iOS, Chrome on Android, Firefox, Edge.

Noise tests: recorded samples of typing, music, fans, claps and feedback. Target: wrongly muting real speech in under 5% of cases.

Targets: join to first video under 5 seconds, answer acknowledgement under 200 ms typical, leaderboard update reaching everyone under 300 ms after the reveal.

13. Build phases

Phase 0: repo, README, environment files, linting, hosting accounts.

Phase 1: group video with LiveKit: tokens, join flow, grid, controls, chat. Deploy it.

Phase 2: quality and noise control: VAD, auto-mute, echo handling, talk-over management.

Phase 3: quiz engine with custom questions: lobby, timing, scoring, sync and the live leaderboard.

Phase 4: question generator for all categories, with caching and the offline fallback bank.

Phase 5: put the quiz inside the meeting UI.

Phase 6: recording, client-side first and then server-side.

Phase 7: hardening, load tests, PWA polish and optional Capacitor apps.

After each phase deliver a demo script, passing tests, and a short report of what is done and what is known to be broken.

14. Suggested repository structure

jumbo-app/  apps/web/            React PWA  apps/api/            Fastify + Socket.IO + LiveKit tokens  packages/shared/     types, zod schemas, event names  packages/questions/  generators and seed bank  docs/  .env.example

15. Environment variables

LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET, SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY, and optionally GEMINI_API_KEY and R2 storage keys.

16. Open questions for the owner

What is the maximum number of people per meeting and per game?

Is internet quality weak in your main markets? If yes, lower the default video quality.

Do you need user accounts, or are guests enough at launch?

What is the monthly hosting budget at launch?

Do you need App Store and Play Store apps at launch, or is the installable PWA enough?

Which languages must be supported first?

17. Part 2 – Design, UX and performance

This part is as important as the technical sections above. If it conflicts with an earlier section on look, feel or simplicity, this part wins. If it conflicts on real-time performance, performance wins. Build the design system in Phase 0, before any feature work, so every screen is consistent from the start.

18. Core UX principles: simple for everyone

A first-time user must know what to do within 3 seconds, with no tutorial and no manual.

One main action per screen, shown as one large, obvious primary button. Secondary actions are smaller and quieter.

The home screen has two big cards: Meet (start or join a meeting) and Play (start or join a quiz). Nothing else competes for attention.

Join in at most 2 taps: paste a code or open a link, then tap Join. Guests only need a name.

Start a quiz in at most 3 taps: Play, then Auto quiz (15 questions) or Create my own, then Start.

Smart defaults: camera and mic preview ready, best devices pre-selected, 15 questions, 20 seconds per question, live leaderboard on.

Hide advanced settings behind a More options drawer (progressive disclosure).

Every icon has a text label, at least at first. Use plain words: say Mute, not Toggle audio track.

Friendly errors that say what happened and what to do next, with one button to fix it. Example: Camera is blocked. Tap here to see how to allow it.

Be consistent: the same button in the same place on every screen, the same word for the same thing.

Accessibility (WCAG 2.2 AA): text contrast of at least 4.5:1, full keyboard support, visible focus, screen reader labels, never rely on colour alone, and respect the reduced-motion setting.

19. Visual design direction

Goal: modern, premium and calm. It should look like a top-tier app, not a template.

Glass look (glassmorphism): translucent panels with background blur, thin light borders and soft shadows, floating above a soft gradient background. This is most likely the mirror-like look you described. Apple’s recent glass-style interfaces are a good reference.

Shapes and space: rounded corners (16 to 24 px), generous spacing, large readable type and soft depth.

Themes: dark mode first, because video calls look best on dark, plus a light theme. Follow the device setting by default.

Colour: one brand colour for Jumbo, one energetic accent, and neutral greys. The agent proposes 3 palette options and the owner picks one. Quiz answers use four distinct colours, each paired with a different shape.

Typography: one modern sans-serif font (Inter, Plus Jakarta Sans or Sora), self-hosted, subset, with only 2 weights loaded.

Icons: Lucide, one consistent stroke width.

Design tokens: colours, spacing, radius, shadows, blur, durations and easing are defined once as CSS variables or in the Tailwind config. No hard-coded values inside components.

Components: shadcn/ui on Radix primitives for accessible dialogs, menus, tabs and sheets, restyled to the glass look.

Performance warning for glass. Background blur is expensive on cheaper phones. Use it on a few large surfaces (top bar, bottom sheets, cards). Never put it on every video tile or on every row of a long list. Keep the blur radius modest. Provide a solid-colour fallback for users who prefer reduced transparency and for low-end devices, detected with navigator.hardwareConcurrency, navigator.deviceMemory and a quick frame-rate check.

20. Motion, buttons and scrolling

Libraries: Motion (Framer Motion) for component and layout animation, Lenis for smooth scrolling on marketing pages, GSAP ScrollTrigger or native CSS scroll-driven animations (animation-timeline: scroll() and view()) for scroll effects with a fallback where unsupported, Lottie for small illustrated animations, and canvas-confetti for celebrations.

Buttons

Hover: a slight lift and soft glow. Press: shrink to about 97% with a springy release. Keyboard focus ring always visible.

Primary button: gradient fill with a soft glow, at least 48 px tall on mobile.

Loading state: a spinner replaces the label and the button cannot be double-submitted. Disabled state is clearly different.

Visual feedback within 100 ms of every tap. Optional short haptic on Android through the Vibration API (iOS Safari does not support it). Optional soft sounds with a mute toggle.

Screen-to-screen transitions

Use the View Transitions API (as progressive enhancement) or Motion shared-layout animations so elements flow between screens. Example: the Meet card expands into the lobby instead of the screen jumping.

Duration 200 to 350 ms with ease-out. Never block taps while an animation runs.

Scrolling (the special feel)

On the landing page and long lists: smooth inertial scrolling, parallax layers moving at slightly different speeds, content that fades and rises into view, a header that shrinks and turns to glass as you scroll, and sticky sections that transform while you scroll.

Rules: animate only transform and opacity so it stays GPU-friendly at 60 fps. Never hijack scrolling inside the meeting room or the quiz screens. Keep native scrolling for lists on mobile. Turn all of this off when the user prefers reduced motion.

Owner action: send the name of the app that inspired you, or a screen recording of the scrolling effect. The agent should reproduce the feeling and not copy any assets.

Quiz-specific motion

A countdown ring that drains smoothly, answer buttons that pop in one after another, and a satisfying lock-in animation when a player picks an answer.

Correct and wrong reveals with colour and a small bounce.

Leaderboard rows that glide to their new positions (layout animation) while scores count up. A podium with confetti for the top 3.

Sound effects are off by default during meetings so they are not picked up by microphones, and can be turned on by the host.

21. Performance and real-time feel

The app must feel instant. Targets, measured on a mid-range Android phone on 4G: Largest Contentful Paint under 2.5 s, Interaction to Next Paint under 200 ms, Cumulative Layout Shift under 0.1.

Code splitting: landing and home load only what they need. Load the video SDK and quiz engine only when the user enters a meeting or game, and prefetch them as soon as the user focuses the Join field.

Budget: first-load JavaScript under about 200 KB gzipped on landing and home. Fail the build in CI if it is exceeded.

Images: AVIF or WebP, correct sizes, lazy loading, blur-up placeholders. Prefetch the next quiz question’s image while the current question runs.

Fonts: self-hosted, subset, with font-display: swap.

Service worker: cache the app shell so repeat visits open instantly.

Optimistic UI: when a player taps an answer, show it locked immediately and confirm with the server in the background. If the server rejects it, show a clear message.

Skeleton screens instead of blank screens or long spinners.

Rendering: memoize video tiles, virtualize long participant lists, batch leaderboard state updates, and avoid re-rendering the whole room when one participant changes.

Network: small payloads, send only changes (deltas) for leaderboard updates, WebSocket heartbeats, and automatic reconnect with exponential backoff and a full state resync.

Connection pill: a small indicator showing Connected or Reconnecting. Never fail silently.

Measure: Lighthouse CI on every build, real-user Web Vitals monitoring, and a test on a throttled phone before each release.

Priority rule: in the meeting room and during a quiz question, real-time performance beats decoration. If an effect costs frames, remove or simplify it on those screens.

22. Key screens (wireframe brief)

Landing: one headline, two buttons (Start a meeting, Play a quiz), a short animated demo and a scroll story of the features.

Home: two large glass cards, Meet and Play, with recent meetings and quizzes below.

Pre-join lobby: large camera preview, mic level meter, name field and one Join button. Device pickers sit in a small menu.

Meeting room: the video grid fills the screen. A floating glass control bar at the bottom holds mic, camera, share, quiz, chat, record and leave, with Leave in red and set apart. Participants and chat open as slide-over panels. Controls auto-hide after a few seconds and return on tap or mouse move.

Quiz launcher: choose Auto quiz or Create my own, pick categories with icon chips, and set the number of questions (default 15).

Quiz host view: a large PIN, players appearing as animated bubbles and one big Start button.

Quiz player view: large question text and image, four large answer buttons, countdown ring, answered counter, and a live mini-leaderboard strip that expands to the full ranking.

Results: podium animation, full ranking, download results and Play again.

23. Design process and deliverables

Before coding: build a design system page showing colours, type, buttons, cards, inputs, sheets, leaderboard row and answer buttons, plus a clickable prototype of three flows: join a meeting, start a quiz, play a quiz. The owner approves it.

Build every screen using only design-system components.

Design mobile first at 375 px wide, then tablet, then desktop.

Offer the owner 3 style options (colour and glass intensity) to choose from.

24. Usability and design acceptance checklist

Five people who have never seen Jumbo, given no instructions, can join a meeting in under 30 seconds and start or join a quiz in under 60 seconds.

Every screen has one obvious primary action.

Every tappable element is at least 44 px and works with a keyboard.

Contrast, reduced-motion and screen-reader checks pass on the key flows.

Scrolling and animations run at 60 fps on a mid-range phone and the Web Vitals targets are met.

The app looks consistent on iPhone Safari, Android Chrome and desktop Chrome, Safari, Edge and Firefox.

Glass effects degrade gracefully to solid colours.

No layout jumps while content loads.

25. Updated build order

This changes section 13. Add a design-system and prototype step to Phase 0, before Phase 1. Apply design polish at the end of every phase instead of saving it for the end. Run the performance checks from section 21 in every phase and fix regressions immediately.