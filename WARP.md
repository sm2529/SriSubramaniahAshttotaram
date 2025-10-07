# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Repository overview
- Purpose: A devotional project for Subramaniah Swamy Ashtottaram — a collection of 108 sacred names and prayers. See README.md for the high-level description.
- Current state: Initial setup with placeholder directories. No application code, build system, test suite, or linter configuration is present.

Structure and architecture (big picture)
- Top-level layout (from README.md and repo):
  - docs/: textual content and documentation (currently empty)
  - assets/: media and resource files (currently empty)
  - src/: source files if/when code is added (currently empty)
- Intent inferred from .gitignore: If a build pipeline is introduced later, generated artifacts should live under dist/, build/, or out/ (these are git-ignored). Coverage directories (coverage/, .nyc_output/) and node_modules/ are ignored, which suggests a future JavaScript/TypeScript workflow could be adopted, but none is configured yet.

Commands for development in this repo
- Build: Not applicable — no build tooling configured.
- Lint: Not configured. If Markdown linting is later adopted, document the exact command here (e.g., markdownlint, prettier) once configuration exists in the repo.
- Test: Not configured — there is no test framework or tests present.
- Run a single test: Not applicable.
- Useful inspection commands (safe to run now):
  - List top-level contents: ls -la
  - Show non-hidden files up to two levels: find . -maxdepth 2 -type f
  - Search within text once content is added: grep -R "<pattern>" docs/ src/ assets/

Operational notes for Warp
- There are no project-scoped AI rules (no CLAUDE.md, Cursor rules, or Copilot instructions) beyond this file.
- As the project evolves (e.g., adding a static site generator, script-based transformers in src/, or a test runner), update this file with:
  - Exact build, lint, and test commands
  - How to run a single test (with an example path/pattern)
  - Any project-specific AI rules that affect code generation or file organization

Key points from README.md
- Project goal: Preserve and share resources related to the 108 sacred names of Lord Subramaniah (Murugan/Kartikeya).
- Structure expectations match the directories above; content will be added over time.
- Please respect the sacred nature of the content when contributing or using materials.
