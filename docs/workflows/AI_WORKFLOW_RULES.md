# AI Workflow, Monorepo Governance & Development Rules

## Purpose

This document defines the mandatory workflow, architecture governance, coding standards, planning process, and AI collaboration rules for the entire Govexa monorepo.

Every human developer and AI agent must follow these rules before making any code, architecture, infrastructure, or documentation changes.

---

# Core Principles

## 1. One Ticket At A Time

All work originates from Linear.

Rules:

- Every change must be linked to a Linear ticket.
- Only one active ticket may be implemented at a time.
- Never work on multiple unrelated tickets simultaneously.
- Complete the current ticket before starting the next one.
- If a ticket becomes too large, split it into smaller tickets.

**Bad:**

Feature → Backend + Frontend + Mobile + Infrastructure together.

**Good:**

```
Feature
├── Backend API          → GOV-101
├── Database Migration   → GOV-102
├── Mobile Integration   → GOV-103
├── Admin UI             → GOV-104
└── Testing              → GOV-105
```

Each becomes an individual ticket, implemented one at a time.

---

## 2. Small Deliverables Only

Never generate large amounts of code in a single implementation.

Rules:

- Break large features into milestones.
- Break milestones into tasks.
- Break tasks into tickets.
- Deliver incremental changes.
- Validate each step before continuing.

Targets:

- Small PRs (< 400 lines changed)
- Small commits (single logical unit)
- Small reviews (reviewable in < 30 min)
- Small deployments (one concern at a time)

---

## 3. No Spaghetti Code

Every implementation must:

- Follow architecture boundaries
- Follow module ownership
- Follow project conventions
- Follow repository responsibilities

Forbidden:

- Random utility duplication across packages
- Circular dependencies between modules
- Business logic placed in UI components
- Direct database access from frontend
- Cross-project hacks or shortcuts
- Temporary solutions left in without a ticket to remove them

---

## 4. Architecture First

Before implementation:

1. Understand requirements
2. Review architecture docs
3. Review affected project docs
4. Review dependencies
5. Create plan
6. Create tasks and tickets
7. Implement

Never write code before understanding the impact on the broader system.

---

# Monorepo Structure

```
root/
│
├── apps/
│   ├── api/          # Fastify backend
│   ├── web/          # Next.js frontend
│   └── mobile/       # React Native app
│
├── packages/
│   └── shared/       # Types, Zod schemas, constants
│
├── infrastructure/   # Docker, Nginx, CI/CD configs
├── docs/             # All documentation
│
├── .github/          # GitHub Actions workflows
├── tools/            # Build and dev tooling
└── scripts/          # Operational scripts
```

Each project is **autonomous**.

Monorepo does NOT mean shared responsibilities. Each project owns its own concerns.

---

# Project Ownership Rules

Each project must contain these files at its root:

```
project/
│
├── README.md            # Purpose, setup, commands, dependencies
├── ARCHITECTURE.md      # Internal design, modules, data flow
├── RULES.md             # Coding standards, naming, folder structure
├── CONSTRAINTS.md       # Technical limits, performance, security requirements
└── RESPONSIBILITIES.md  # What this project owns and does NOT own
```

These files are the source of truth for that project. AI agents must read them before touching the project.

---

# AI Agent Rules

## Before Modifying Any Code

AI must read in this order:

1. `docs/README.md`
2. `docs/workflows/AI_WORKFLOW_RULES.md` (this file)
3. Relevant ADRs for the affected area
4. The project's `RULES.md`
5. The project's `ARCHITECTURE.md`
6. The project's `CONSTRAINTS.md`

Only then may implementation begin.

## AI Must Never

- Generate entire systems, modules, or features in a single response
- Skip the planning step
- Ignore repository and module boundaries
- Introduce hidden dependencies between projects
- Create duplicate code or utilities that already exist in `packages/shared`
- Refactor code unrelated to the current ticket
- Make architecture decisions without creating or updating an ADR
- Write code that violates the project's `CONSTRAINTS.md`

## AI Must Always

- Reference the Linear ticket ID in every code change
- Explain planned changes before implementing them
- Keep changes small and focused on a single concern
- Create subtasks when a task is found to be too large mid-implementation
- Request clarification when requirements are ambiguous
- Update relevant documentation after any significant change
- Propose new ADRs when making technology or architecture decisions

## High-Context / High-Token Tasks

When a task is identified as high-context (touches many files, many modules, or many systems), it must be decomposed into subtasks before any code is written.

Signs a task needs decomposition:

- Touches more than 2 modules in a single project
- Touches more than 1 project in the monorepo
- Requires a database migration AND API changes AND UI changes
- Would result in a PR > 400 lines

Decompose first. Implement one subtask at a time. Never proceed to the next subtask until the current one is reviewed and merged.

---

# Git Workflow

## Branch Naming

```
main
│
├── feature/GOV-{ID}-short-description
├── fix/GOV-{ID}-short-description
├── chore/GOV-{ID}-short-description
└── refactor/GOV-{ID}-short-description
```

Examples:

```
feature/GOV-101-auth-api
fix/GOV-203-driver-location-eta
refactor/GOV-450-clean-routing-module
chore/GOV-512-update-dependencies
```

Rules:

- Always branch from `main`
- Never commit directly to `main`
- One ticket = one branch
- Delete branch after PR is merged

## Commit Format

```
type(scope): GOV-{ID} short description

Optional longer explanation if needed.
```

Examples:

```
feat(auth): GOV-101 add JWT refresh token rotation
fix(tracking): GOV-203 correct ETA calculation on deviation
refactor(routing): GOV-450 simplify graphhopper service wrapper
chore(deps): GOV-512 update prisma to 5.x
```

Types: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `perf`

## Using Git as Checkpoints

Use commits as checkpoints during implementation:

- Commit after completing each logical unit (not at end of session)
- Use `git stash` to save work-in-progress before context switches
- Tag significant milestones: `git tag -a v0.1.0 -m "Phase 1 complete"`
- Use `git revert` to undo a bad commit — never force-push to `main`

---

# Pull Request Rules

PRs must:

- Reference the Linear ticket in the title: `GOV-101: Add JWT authentication`
- Explain the purpose (what problem does this solve)
- Explain the changes (what was changed and why)
- Include screenshots for any UI changes
- Include testing evidence (test output, manual test steps)

No direct commits to `main`. No self-approved PRs.

---

# Code Review Rules

Every PR requires at least one review.

Checklist:

- [ ] References correct Linear ticket
- [ ] Changes are scoped to one concern
- [ ] Follows project `RULES.md` conventions
- [ ] No cross-boundary violations (see `RESPONSIBILITIES.md`)
- [ ] No security issues (see `docs/standards/security.md`)
- [ ] Adequate test coverage
- [ ] Documentation updated if behavior changed
- [ ] No TODO comments without an associated Linear ticket

---

# Feature Development Process

```
Step 1  →  Create Epic in Linear
Step 2  →  Break into Milestones
Step 3  →  Break Milestones into Tasks
Step 4  →  Create Individual Linear Tickets
Step 5  →  Implement One Ticket (one branch, small PR)
Step 6  →  Review and Merge
Step 7  →  Deploy to Preview
Step 8  →  Validate
Step 9  →  Monitor
Step 10 →  Move to Next Ticket
```

---

# Testing Requirements

Every ticket must define before implementation begins:

- What unit tests are needed
- What integration tests are needed
- What manual validation steps exist

No ticket is mergeable without all three being addressed.

---

# Definition of Done

A task is complete **only** when all of these are true:

- [ ] Linear ticket marked complete
- [ ] Code implemented and working
- [ ] All tests passing in CI
- [ ] PR reviewed and approved
- [ ] Documentation updated if applicable
- [ ] Merged to `main`
- [ ] Deployed to preview environment
- [ ] Manually validated

Until every condition is met, the task is not done.

---

# Final Rules

```
Move slowly.
Make small changes.
Review constantly.
Document everything.
Maintain clean architecture.
Respect project boundaries.
One ticket at a time.
Always prefer long-term maintainability over short-term speed.
```
