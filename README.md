# Writing Prompts

A free, browser-based creative writing playground for finding ideas, exploring story possibilities, and getting words onto the page.

**Live site:** https://melvinvarghese.github.io/writing-prompts/

## Features

- **500 writing prompts** across fiction, mystery, fantasy, science fiction, horror, personal essays, poetry, screenwriting, philosophical writing, creative nonfiction, and experimental writing.
- **Browse and filter** prompts by genre and prompt type.
- **Surprise me** to discover a random prompt.
- **Daily prompt** for a fresh writing challenge.
- **Prompt Mixer** to combine a character, setting, conflict, and twist into a story seed.
- **Writing timer** with 5-, 10-, 15-, and 30-minute sessions.
- **One-click copying** for prompts and generated story seeds.
- **Responsive layout** designed for desktop and mobile screens.

## Technology

The project is built with:

- HTML
- CSS
- Vanilla JavaScript
- JSON prompt data

It is a static website hosted on GitHub Pages. It does not require a backend, database, user accounts, subscriptions, API keys, or paid services.

## Run locally

Clone the repository:

```bash
git clone https://github.com/melvinvarghese/writing-prompts.git
cd writing-prompts
```

Start a local web server from the project directory. For example, with Python:

```bash
python -m http.server 8000
```

Then open http://localhost:8000 in your browser.

Using a local web server is recommended because the application loads its prompt collection from JSON files.


## Project structure

```text
.
├── assets/
│   ├── css/
│   │   ├── style.css
│   │   └── tokens.css
│   └── js/
│       ├── app.js
│       ├── mixer.js
│       └── timer.js
├── data/
│   ├── daily-prompts.json
│   ├── mixer-elements.json
│   └── prompts.json
├── docs/
│   ├── PROJECT-PLAN.md
│   └── WORDPRESS-INTEGRATION.md
└── index.html
```

## Design

The interface combines 1980s arcade aesthetics with Memphis-inspired graphic design: bold typography, vivid colours, chunky outlines, playful geometric details, and a CRT-inspired prompt display. The layout is designed to keep the experience lively while remaining easy to navigate.

## Contributing

Suggestions, bug reports, and improvements are welcome. Please open an issue to discuss a significant change before submitting a pull request.
