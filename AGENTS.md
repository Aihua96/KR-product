# Repository Guidelines

## Project Structure & Module Organization
Content for the public site is organized by product family. English pages sit in `en/` (for example `en/krvirt/index.md`), shared assets belong in `public/`, and structured data sources live in `data/`. Automation and validation utilities are under `scripts/`, while partner and solution assets sit in `partners/` and `solutions/`. Keep new Markdown entries close to related topics so VitePress sidebars remain coherent.

## Build, Test, and Development Commands
Install once with `npm install`. Use `npm run dev` to launch VitePress locally with hot reload, and `npm run build` to generate the static site. `npm run preview` serves the built output for smoke checks. Run `npm run prebuild` before opening a pull request; it chains glossary generation, quick-link validation, and anchor checks. Targeted helpers such as `npm run validate:products` or `npm run generate:glossary:zh` keep individual datasets in sync.

## Coding Style & Naming Conventions
Markdown files use YAML frontmatter with lowercase keys (`title`, `description`, `lastUpdated`). Follow the existing kebab-case file naming (e.g., `en/help/quick-start.md`) and keep one top-level H1 per page. Lists should use two-space indentation, and tables should align pipes for readability. For interactive components, prefer documented Element Plus patterns and colocate scripts in the same directory as their markdown consumer.

## Testing Guidelines
Treat the validation scripts as the test suite. Every content change must pass `npm run prebuild`; use targeted commands when updating specific datasets to shorten feedback loops. When adding new automation under `scripts/`, ship unit-style assertions or schema checks within the script itself to maintain parity with existing tooling.

## Commit & Pull Request Guidelines
Follow the conventional `type(scope): summary` format visible in history (`feat/docs-…`, `chore(glossary): …`). Keep summaries in English when possible and describe the impact, not the mechanics. Each pull request should link related tracker issues, note any generated artifacts, and include before/after screenshots for visual changes. Confirm that `npm run build` succeeds locally and mention any skipped validations explicitly.

## Localization & Content Workflow
Duplicate content across locales by copying the existing structure under `en/` into the target locale folder, then adjust frontmatter tags accordingly. Use shared metadata from `data/` where possible instead of redefining values inline, and coordinate terminology changes through `scripts/generate-glossary.mjs` to keep localized glossaries aligned.
