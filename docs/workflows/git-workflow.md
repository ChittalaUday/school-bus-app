# Git Workflow

## Branch Strategy

```
main (protected, always deployable)
│
├── feature/GOV-{ID}-description
├── fix/GOV-{ID}-description
├── chore/GOV-{ID}-description
└── refactor/GOV-{ID}-description
```

## Rules

- `main` is always in a deployable state
- No direct commits to `main`
- One Linear ticket = one branch
- Branch from `main`, merge back to `main`
- Delete branch after PR is merged

## Branch Naming

```
feature/GOV-101-auth-api
fix/GOV-203-driver-eta-calculation
chore/GOV-512-update-prisma
refactor/GOV-450-routing-module
docs/GOV-600-update-api-readme
test/GOV-701-tracking-unit-tests
```

## Commit Format

```
type(scope): GOV-{ID} short description
```

| Type | When |
| --------- | ---------------------------------------- |
| feat | New feature or behavior |
| fix | Bug fix |
| refactor | Code change with no behavior change |
| chore | Build, deps, tooling, config |
| docs | Documentation only |
| test | Adding or updating tests |
| perf | Performance improvement |

### Examples

```
feat(auth): GOV-101 add JWT refresh token rotation
fix(tracking): GOV-203 correct ETA on deviation detection
refactor(routing): GOV-450 simplify graphhopper wrapper
chore(deps): GOV-512 upgrade prisma to 5.x
docs(api): GOV-600 document tracking endpoints
test(auth): GOV-701 add unit tests for token refresh
```

## Commit Discipline

- Commit after each logical unit — not at end of session
- Each commit must compile and not break tests
- Use `git stash` when switching context mid-work
- Never squash commits that represent meaningful history

## Git as Checkpoints

Use git to protect progress:

```bash
# Save work in progress
git stash -m "GOV-101 wip: jwt middleware partial"

# Restore
git stash pop

# Tag a completed phase
git tag -a v0.1.0 -m "Phase 1: Foundation complete"

# Undo last commit safely (keep changes staged)
git reset --soft HEAD~1

# Revert a bad commit (creates new commit, safe for shared branches)
git revert <commit-sha>
```

## Never

- Force-push to `main`
- Rebase shared branches
- Amend commits that have been pushed
- Use `git push --force` without explicit team consent

## Pull Requests

Title format:

```
GOV-{ID}: Short description of change
```

Body must include:

- **Why**: What problem does this solve?
- **What**: What was changed?
- **How to test**: Steps for reviewer to validate
- **Screenshots**: Required for any UI change
- **Linked ticket**: Linear ticket URL

## Merging

- Squash and merge for feature branches
- Merge commit for release branches
- Delete branch after merge
- Never merge a PR that has failing CI checks
