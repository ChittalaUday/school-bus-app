# Shared Constraints — `apps/shared`

---

- Zero runtime dependencies except `zod`
- Must not import from `apps/api`, `apps/web`, or `apps/mobile`
- Must not use Node.js built-in modules (`fs`, `path`, `crypto`, etc.)
- Must not use browser-only APIs (`window`, `document`, `localStorage`)
- Must not use React or React Native APIs
- Bundle output must be compatible with CommonJS and ESM consumers
- Total package size must remain small — no large utility libraries
