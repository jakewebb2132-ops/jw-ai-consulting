# Captured Lessons

## UI Architecture & Elegance
- **High-End Consultancies:** When building layout components for high-end consultancies, use a state-based sticky navbar with `backdrop-blur` and dynamic styling (e.g. transparent top, frosted glass on scroll) to maintain visual continuity and elegance between the Hero and subsequent scroll sections.

## Production Readiness & Optimization
- **Tree-Shaking:** To properly tree-shake heavy UI components like Icon packs (e.g., `phosphor-react`), avoid using destructuring from the root barrel file. Explicitly import components from their deep dist paths (e.g., `import Icon from "phosphor-react/dist/icons/icon"`) to guarantee unused icons aren't artificially swelling the final JS bundle.
- **Vite Config Hardening:** Explicitly declare `cssMinify: true` within `vite.config.ts` to strictly enforce `esbuild` compression on global CSS layout files before moving payload to Vercel.
