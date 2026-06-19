# Code Review — Multi-Domain Agent Review

Run a structured code review across all touched domains using specialized reviewer agents, then merge and push if all reviewers pass.

**Usage:** `/review` (no arguments — reviews current branch vs `main`)

---

## Step 1 — Gather the diff

Run all of these in parallel:
- `git log main..HEAD --oneline`
- `git diff main...HEAD --stat`
- `git diff main...HEAD`
- `git branch --show-current`

## Step 2 — Identify touched domains

Map changed paths to reviewer agents:

| Path pattern | Reviewer agent |
|---|---|
| `apps/api/**` | Backend |
| `apps/web/**` | Web |
| `apps/mobile-driver/**` or `apps/mobile-parent/**` | Mobile |
| `apps/shared/**` | Shared |
| `infrastructure/**`, `docker-compose.yml`, `*.yml`, `Dockerfile*`, `nginx/**` | DevOps |
| Any change (always) | Architecture |

## Step 3 — Spawn specialized reviewer agents in parallel

For each identified domain, spawn one Agent using the corresponding prompt from `.claude/commands/reviewers/`. Run ALL agents in a single parallel batch — do not run them sequentially.

- Backend touched → read `.claude/commands/reviewers/backend.md` and use it as the agent's prompt
- Web touched → read `.claude/commands/reviewers/web.md`
- Mobile touched → read `.claude/commands/reviewers/mobile.md`
- Shared touched → read `.claude/commands/reviewers/shared.md`
- DevOps touched → read `.claude/commands/reviewers/devops.md`
- Architecture (always) → read `.claude/commands/reviewers/architecture.md`

Pass the full `git diff main...HEAD` output to each agent as context.

## Step 4 — Compile review summary

After all agents complete, output:

```
## Review Summary — {branch-name}

### Backend        ✓ PASS | ✗ FAIL | — Not touched
### Web            ✓ PASS | ✗ FAIL | — Not touched
### Mobile         ✓ PASS | ✗ FAIL | — Not touched
### Shared         ✓ PASS | ✗ FAIL | — Not touched
### DevOps         ✓ PASS | ✗ FAIL | — Not touched
### Architecture   ✓ PASS | ✗ FAIL

--- Blocking Issues ---
(list every BLOCKING item, reviewer, file:line, rule violated, fix required)

--- Warnings ---
(list all WARNINGs — do not block merge on warnings alone)
```

## Step 5 — Merge decision

**If any reviewer returns FAIL:**
- Print all blocking issues
- Do NOT merge
- Say: "Fix the blocking issues above, then re-run `/review`"

**If all reviewers return PASS (warnings OK):**
- Say: "All reviewers passed. Ready to merge to `main` — give the signal."
- Wait for explicit user confirmation
- On confirmation, run:
  ```bash
  git checkout main
  git merge --no-ff {branch} -m "merge(GOV-{ID}): {branch-description}"
  git push origin main
  git push origin --delete {branch}
  ```
- Report the merge commit hash and confirm push
