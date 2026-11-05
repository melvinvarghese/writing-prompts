# Writing Prompts

A small creative writing tool for when you need an idea to get started.

**Try it:** [writing-prompts](https://melvinvarghese.github.io/writing-prompts/)

## What it does

- Browse 500 writing prompts across 11 genres.
- Filter prompts by genre and type.
- Pick a random prompt or try the daily challenge.
- Mix a character, setting, conflict and twist into a story idea.
- Use the 5, 10, 15 or 30-minute writing timer.
- Copy any prompt or story seed.

## Built with

HTML, CSS, JavaScript and JSON. The site is hosted on GitHub Pages and runs without a backend, database, account or API key.

## Run it locally

Clone the repository:

```bash
git clone https://github.com/melvinvarghese/writing-prompts.git
cd writing-prompts
```

Start a local server:

```bash
python -m http.server 8000
```

Open http://localhost:8000 in your browser.

## WordPress

The same app can be loaded on [melvinvarghese.in](https://melvinvarghese.in/) without using an iframe. See the [WordPress integration guide](docs/WORDPRESS-INTEGRATION.md).

## Files

```text
assets/
  css/
  js/
data/
  daily-prompts.json
  mixer-elements.json
  prompts.json
docs/
  WORDPRESS-INTEGRATION.md
index.html
```
