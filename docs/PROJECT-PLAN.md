# Writing Prompts — Project Plan

## Product
A free, distraction-free creative writing prompt generator for writers. It will be available as a standalone GitHub Pages application and as a native-looking embedded experience on melvinvarghese.in/writing-prompts/.

## Product principles
- Encourage writing rather than managing writing.
- Make the interface feel like an imaginative 1980s arcade and Memphis-inspired creative playground: energetic, playful, surprising, accessible, and mobile-first.
- No accounts, subscriptions, AI APIs, backend, database, favourites, or saved history.
- Keep the prompt collection curated, original, structured, and easy to maintain.
- One shared frontend and one shared data source for both deployments.

## Technology
- Semantic HTML
- Modern CSS with design tokens and responsive layouts
- Vanilla JavaScript using native browser APIs
- JSON files for prompt content
- GitHub Pages for static hosting
- WordPress integration through a script and stylesheet loaded from the GitHub Pages origin; no iframe.

## Planned repository layout
```
writing-prompts/
├── index.html
├── README.md
├── assets/
│   ├── css/
│   │   ├── tokens.css
│   │   └── style.css
│   └── js/
│       ├── app.js
│       ├── mixer.js
│       └── timer.js
├── data/
│   ├── prompts.json
│   ├── daily-prompts.json
│   └── mixer-elements.json
├── docs/
│   ├── PROJECT-PLAN.md
│   └── WORDPRESS-INTEGRATION.md
└── wordpress/
    └── embed-example.html
```

## Core features
1. Surprise Me — show a random prompt.
2. Browse by genre and writing form.
3. Browse by prompt type.
4. Prompt Mixer — combine a character, setting, conflict, and twist.
5. Daily featured prompt — selected deterministically by date so it stays the same for each calendar day.
6. Copy prompt — with visible success and failure feedback.
7. Writing timer — 5, 10, 15, and 30 minutes, with start, pause, resume, and reset.

## Prompt library
Target: at least 500 curated prompts for launch. Prompts will have stable IDs, title, prompt text, genre, form, prompt type, and optional estimated difficulty. Data will be validated for missing fields and duplicate IDs before release. Daily prompts and mixer ingredients will be separate datasets.

## Visual direction
- 1980s arcade meets Memphis graphic design
- Cream canvas with hot pink, arcade yellow, electric teal, cobalt blue, and purple
- Chunky outlined controls, geometric stickers, playful asymmetry, and a CRT-inspired prompt machine
- Bold display typography paired with readable sans-serif and monospace interface text
- Energetic without sacrificing hierarchy, readability, accessibility, or mobile usability
- Touch targets at least 44px where practical
- Visible keyboard focus and reduced-motion support

## WordPress delivery
The standalone app and WordPress page will use the same frontend assets. The WordPress page will contain a mount element and load the compiled-free static CSS/JS from GitHub Pages. The app will scope its styles beneath a unique root selector to avoid affecting the rest of the WordPress theme. The WordPress page will also include crawlable introductory copy and headings outside the app mount. No iframe.

## Release gates
- All core controls work with mouse, keyboard, and touch.
- Daily prompt is stable for the visitor's local date.
- Mixer combinations are grammatical and usable.
- Timer handles background tabs and visibility changes accurately.
- Copy action has a fallback and clear feedback.
- Empty, loading, and error states are designed.
- No horizontal overflow at 320px and 200% zoom.
- Respect prefers-reduced-motion.
- Test standalone and embedded modes.
- Verify no console errors and no broken assets.
- Only enable GitHub Pages after the release candidate passes review.
