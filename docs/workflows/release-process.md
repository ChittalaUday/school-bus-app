# Release Process

## Release Types

| Type | Trigger | Example |
| --------- | ---------------------- | ----------- |
| Preview | Every PR merge to main | Auto-deploy |
| Staging | Manual tag | `v0.x.0-rc` |
| Production | Manual promotion | `v1.0.0` |

---

## Versioning

Follows [Semantic Versioning](https://semver.org):

```
v{MAJOR}.{MINOR}.{PATCH}

MAJOR — breaking change
MINOR — new feature, backwards compatible
PATCH — bug fix
```

---

## Release Steps

### 1. Pre-release Checklist

- [ ] All tickets for the milestone are merged
- [ ] All CI checks passing on `main`
- [ ] Manual smoke test completed on preview environment
- [ ] No known P0 or P1 bugs open
- [ ] `CHANGELOG.md` updated

### 2. Create Release Tag

```bash
git tag -a v1.0.0 -m "Release v1.0.0: Phase 1 complete"
git push origin v1.0.0
```

### 3. GitHub Actions Deploys

Tag push triggers:

```
Test → Build → Push Docker image → SSH deploy to VPS
```

### 4. Post-deploy Validation

- [ ] Health check endpoints responding
- [ ] GraphHopper accessible internally
- [ ] Database migrations applied
- [ ] Redis connected
- [ ] Socket.IO accepting connections
- [ ] Grafana dashboards showing metrics

### 5. Monitor for 30 Minutes

Watch:

- API error rate (Grafana)
- Active connections (Socket.IO dashboard)
- Queue depth (BullMQ dashboard)
- Any Telegram ops alerts

### 6. Rollback if Needed

```bash
# Identify previous working image
docker images

# Roll back to previous container version
docker-compose down
docker-compose up -d --image previous-tag

# Or revert the git tag and redeploy
git revert <bad-commit-sha>
git push origin main
```

---

## Hotfix Process

For production bugs that cannot wait for the normal cycle:

```
1. Create branch: fix/GOV-{ID}-hotfix-description from main
2. Implement minimal fix
3. Fast-track review (1 reviewer minimum)
4. Merge to main
5. Tag immediately: v1.0.1
6. Deploy and validate
7. Create follow-up ticket for any related cleanup
```

---

## Changelog Format

`CHANGELOG.md` at repo root:

```markdown
## [v1.1.0] - 2026-06-25

### Added
- GOV-101: JWT authentication with refresh token rotation
- GOV-105: Driver live location broadcasting

### Fixed
- GOV-203: ETA calculation incorrect on route deviation

### Changed
- GOV-450: Routing module refactored for clarity
```
