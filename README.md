# Govexa — School Bus Tracking & Management Platform

A modern, high-performance monorepo for the school bus tracking and management platform in Hyderabad.

---

## 🛠️ Command Structure (Development Setup)

You can run all commands directly from the root of the workspace using `pnpm`.

### 1. Prerequisites & Services
Make sure Docker is running, then spin up the backend dependencies (PostgreSQL, Redis, GraphHopper):
```bash
pnpm docker:up
```

To view logs or shut down:
```bash
pnpm docker:logs  # View logs
pnpm docker:down  # Shut down containerized services
```

---

### 2. Database Commands
Commands to manage the Prisma schema and database:
```bash
pnpm db:generate  # Regenerate the Prisma Client (must run after schema changes)
pnpm db:migrate   # Apply migrations
pnpm db:seed      # Seed the database with demo/test data
pnpm db:studio    # Open Prisma Studio to view database rows
```

---

### 3. Running Applications

#### 🖥️ Backend API (`apps/api`)
```bash
pnpm dev:api
```

#### 🌐 Web Portal (`apps/web`)
```bash
pnpm dev:web
```

#### 📱 Mobile Apps (`apps/mobile-parent` & `apps/mobile-driver`)

To generate/update the native directories (`android` and `ios`) using Expo Prebuild (must do this first or whenever native dependencies change):
```bash
pnpm prebuild:mobile-parent
pnpm prebuild:mobile-driver
```

To run as native apps on an Android device/emulator:
```bash
pnpm android:mobile-parent
pnpm android:mobile-driver
```

To run as native apps on an iOS device/simulator:
```bash
pnpm ios:mobile-parent
pnpm ios:mobile-driver
```

To start the Metro Bundler manually:
```bash
pnpm dev:mobile-parent
pnpm dev:mobile-driver
```

---

### 4. Code Quality & Verification
```bash
pnpm lint       # Lint all codebases
pnpm typecheck  # Typecheck all packages and apps
pnpm test       # Run all unit and integration tests
```

---

## 📁 Repository Structure
*   `apps/api`: Fastify backend API (REST, Socket.IO, BullMQ, Prisma)
*   `apps/web`: Next.js admin & school portal (Tailwind CSS, shadcn/ui)
*   `apps/mobile-parent`: Expo/React Native app for Parents
*   `apps/mobile-driver`: Expo/React Native app for Drivers
*   `apps/shared`: Shared types, constants, and database schema
