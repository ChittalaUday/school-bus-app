# Check Changes Against Repo Rules

Review the current git diff against the rules, constraints, and design principles of the affected repository. Catch violations before they reach PR review.

**Usage:** `/check` (no arguments — checks current uncommitted changes)

---

1. Run `git diff HEAD` to see all current changes.
2. Identify which repository/repositories are modified (`apps/api`, `apps/web`, `apps/mobile-driver`, `apps/mobile-parent`, `apps/shared`).
3. For each affected repository, read:
   - `docs/repositories/{repo}/RULES.md`
   - `docs/repositories/{repo}/CONSTRAINTS.md`
   - `docs/repositories/{repo}/DESIGN_PRINCIPLES.md`

4. Check the diff against each rule and constraint. Flag any violation with:
   - **File and line** where the violation occurs
   - **Which rule** it violates (quote the rule)
   - **How to fix it**

5. Check cross-cutting concerns:
   - Are module boundaries respected? (no cross-module imports in `apps/api`)
   - Are there any direct database accesses outside the service layer?
   - Are there any `console.log` calls? (should use `req.log` or `fastify.log`)
   - Are there any hardcoded API URLs? (should use env vars)
   - Are there any `"use client"` directives on components that don't need them? (web only)
   - Are there any synchronous external calls in route handlers? (API only)

6. **Postman check (API only):** If any `*.routes.ts` files were added or modified:
   - Read `apps/api/postman/govexa-api.postman_collection.json`
   - Verify that every added or changed route has a matching entry in the collection
   - If the collection was NOT updated, flag it as a blocking violation:
     > "BLOCKING: Route changes detected but Postman collection not updated.
     > Run `/postman` to update the collection before this PR can be reviewed."

7. Check the definition of done:
   - Are there tests for new service methods?
   - Is the PR likely to be < 400 lines? (warn if not)
   - Does the change touch only one logical concern?

8. Report: list of violations (if any) and a "LGTM" if none found.
