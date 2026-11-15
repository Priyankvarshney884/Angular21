# GtStore Agent Instructions

## Project context

- This project uses Angular 21.2, TypeScript, Sass, npm, and Vitest. Check `package.json` and `angular.json` before relying on framework or tooling features.
- The project uses standalone Angular APIs and the Angular CLI file naming conventions (for example, `app.ts`, `app.html`, and `app.sass`).
- Angular's official AI guidance can include APIs introduced after this project version. Do not use Angular 22+ APIs or assume Angular 22 defaults unless the project is upgraded first.

## Angular and TypeScript

- Follow the [Angular style guide](https://angular.dev/style-guide) and use strict types. Prefer inference for obvious types; avoid `any`.
- Prefer standalone components, directives, and pipes. Do not add NgModules unless required by an existing integration.
- Use signals for local reactive state and `computed()` for derived state. Keep state updates predictable and avoid mutating signal values directly.
- Prefer `input()`, `output()`, and `model()` APIs where they suit the component and are supported by the installed Angular version.
- Use Angular's built-in template control flow (`@if`, `@for`, `@switch`) for new templates. Keep templates simple and use `class`/`style` bindings instead of `NgClass`/`NgStyle`.
- Import only the directives and pipes a template uses rather than importing `CommonModule` by default.
- Use `inject()` for dependency injection where it fits existing code. Keep services focused on one responsibility.
- Lazy-load feature routes where appropriate. Use `NgOptimizedImage` for static image assets where applicable; it is not for inline base64 images.
- Use the project's Sass styling and existing component file layout. Keep component logic, templates, and styles in their corresponding files unless an inline template or style is clearly simpler.
- Make accessible interfaces: semantic HTML, keyboard support, visible focus, appropriate labels, and WCAG AA contrast.

## Changes and verification

- Inspect nearby code and follow its patterns before making changes. Keep changes focused and do not add dependencies without a clear need.
- Use Angular CLI schematics for generated Angular files when practical, and preserve the project's file naming conventions.
- Add or update focused tests for behavior changes. This project uses Vitest; run the most relevant tests and build for code changes.
- Never put credentials or API keys in client-side source files or commit them to the repository.
- The Angular CLI MCP server is configured in `.vscode/mcp.json`; use its documentation, workspace, and target tools when available and relevant.
