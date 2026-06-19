# Start a GOV Ticket

Start work on a Govexa ticket. Creates the correct branch and loads all required reading for the affected repository.

**Usage:** `/ticket GOV-{ID} {scope} {short description}`

- `scope` is one of: `api`, `web`, `mobile-driver`, `mobile-parent`, `shared`
- Example: `/ticket GOV-042 api add trip start endpoint`

---

Run the following steps for the ticket `$ARGUMENTS`:

1. Parse the ticket ID (GOV-{ID}), scope, and description from the arguments.

2. Determine the branch type:
   - New functionality → `feature/GOV-{ID}-{slug}`
   - Bug fix → `fix/GOV-{ID}-{slug}`
   - Use kebab-case for the slug derived from the description.

3. Create the git branch:
   ```
   git checkout -b feature/GOV-{ID}-{slug}
   ```

4. Read the mandatory docs for the given scope in this order:
   - `docs/product/PRODUCT.md` — confirm which product module this ticket touches
   - `docs/repositories/{scope}/ARCHITECTURE.md`
   - `docs/repositories/{scope}/CONSTRAINTS.md`
   - `docs/repositories/{scope}/RESPONSIBILITIES.md`
   - `docs/repositories/{scope}/DESIGN_PRINCIPLES.md`
   - `docs/repositories/{scope}/RULES.md`

5. Report back:
   - Branch created: `feature/GOV-{ID}-{slug}`
   - Product module: (from PRODUCT.md section 13)
   - Key constraints to keep in mind for this ticket
   - Any design principles especially relevant to this ticket
   - What you are ready to implement

Do not write any code until the user confirms the plan.
