# WordPress Integration

Target page: https://melvinvarghese.in/writing-prompts/

## Intended experience
The tool should appear as part of the WordPress page itself. It must not be placed inside an iframe.

## Integration model
1. The WordPress page contains normal, crawlable introductory content and a unique application mount element.
2. The page loads the app stylesheet and JavaScript from the GitHub Pages project origin.
3. The JavaScript mounts the application inside that element.
4. Prompt data is fetched from JSON files hosted on the same GitHub Pages origin as the app assets.
5. All app CSS is scoped beneath a unique root class to prevent styles leaking into the WordPress theme.

## WordPress compatibility
- Prefer loading the external app script through a Custom HTML block if the site's editor permits it.
- If script tags are stripped or blocked, enqueue the script using a small site-specific plugin or an approved code-injection mechanism.
- Do not disable WordPress security protections to make the embed work.
- Avoid global CSS resets and generic selectors that could change the site's header, footer, navigation, or typography.
- Test logged-in and logged-out views, desktop and mobile layouts, caching, and script loading.

## SEO
The WordPress page must include its own meaningful title, introduction, explanatory headings, and supporting copy. Do not rely on the JavaScript-generated prompt text as the only indexable content.

## Launch dependency
Do not publish the WordPress embed until the standalone app is complete and tested. Replace any development URLs with the final GitHub Pages URL only after Pages is enabled and the deployed assets are verified.
