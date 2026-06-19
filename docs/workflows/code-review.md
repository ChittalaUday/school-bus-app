# Code Review

## Purpose

Code review is mandatory for every PR. It is not optional and it is not a formality.

Reviews ensure architecture compliance, code quality, security, and documentation are maintained at every merge.

---

## Who Reviews

- At least one other developer must approve before merge
- No self-approved PRs
- AI-generated code requires human review before merge

---

## Review Checklist

### Ticket & Scope

- [ ] PR references the correct Linear ticket
- [ ] Changes are scoped to the single concern described in the ticket
- [ ] No unrelated changes are bundled in this PR
- [ ] PR size is reasonable (< 400 lines changed; if larger, request decomposition)

### Architecture

- [ ] Changes respect module boundaries (no cross-module direct imports)
- [ ] No business logic placed in UI or presentation layers
- [ ] No direct database calls from outside the API
- [ ] No new circular dependencies introduced
- [ ] Follows the project's `ARCHITECTURE.md`

### Code Quality

- [ ] Follows the project's `RULES.md` conventions
- [ ] Follows `docs/standards/naming.md`
- [ ] No duplicated logic that belongs in `packages/shared`
- [ ] No dead code committed
- [ ] No `console.log` or debug artifacts committed
- [ ] No hardcoded secrets, URLs, or environment values

### TypeScript

- [ ] No `any` types without explicit justification
- [ ] All public function signatures are typed
- [ ] Zod schemas used at all input boundaries (API, forms)
- [ ] Follows `docs/standards/typescript.md`

### Security

- [ ] No SQL injection vectors (Prisma parameterized queries only)
- [ ] No XSS vectors in frontend output
- [ ] Auth checks in place for all protected routes
- [ ] No sensitive data logged
- [ ] Follows `docs/standards/security.md`

### Testing

- [ ] Unit tests added for new logic
- [ ] Integration tests added if API contracts changed
- [ ] All existing tests still passing
- [ ] Manual validation steps documented in PR body

### Documentation

- [ ] `ARCHITECTURE.md` updated if module structure changed
- [ ] `README.md` updated if setup/commands changed
- [ ] New ADR created if a technology or architecture decision was made
- [ ] API docs (Swagger) updated if endpoints changed

---

## How to Give Feedback

- Be specific — point to the exact line and explain why
- Suggest, don't demand — propose alternatives
- Distinguish blocking issues from suggestions:
  - `[blocking]` Must be fixed before merge
  - `[suggestion]` Nice to have, author's call
  - `[question]` Clarification needed, not necessarily a problem

---

## Reviewer Turnaround

- Reviews should be completed within 1 business day
- If a review will take longer, leave a comment acknowledging the PR
