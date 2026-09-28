# Task Tracker

A production-grade task management app built with Next.js 16, TypeScript, Supabase, and Prisma. Features a Kanban board, real-time task CRUD, priority tracking, and overdue detection.

**Live Demo:** https://task-tracker-tau-ruby.vercel.app

---

## Features

- **Authentication** — Email/password signup & login via Supabase Auth
- **Kanban Board** — 3-column view (To Do / In Progress / Done)
- **Task CRUD** — Create, edit, delete tasks with title, description, priority, status, and due date
- **Priority Levels** — Low / Medium / High with color-coded badges
- **Dashboard** — Live stats (total, todo, in progress, done, overdue)
- **Overdue Detection** — Automatic highlighting of past-due tasks
- **Responsive** — Works on desktop (1280px+) and mobile (375px)
- **Type-safe** — End-to-end TypeScript with Zod validation
- **Atomic Design** — atoms / molecules / organisms / templates / pages
- **Error Monitoring** — Sentry integration for error tracking

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Database | Supabase (PostgreSQL) |
| ORM | Prisma 5 |
| Auth | Supabase Auth (`@supabase/ssr`) |
| Validation | Zod |
| Monitoring | Sentry |
| Linting | ESLint + Prettier + SonarJS + jsx-a11y |
| Deployment | Vercel |

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   └── tasks/page.tsx
│   ├── api/
│   │   └── tasks/
│   │       ├── route.ts
│   │       └── [id]/route.ts
│   ├── global-error.tsx
│   └── layout.tsx
├── components/
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   ├── templates/
│   └── ui/
├── lib/
│   ├── actions/auth.ts
│   ├── api/tasks.ts
│   ├── supabase/
│   ├── validations/
│   └── prisma.ts
└── middleware.ts
```

---

## Local Setup

### Prerequisites

- Node.js 20+
- npm
- Supabase account ([supabase.com](https://supabase.com))

### 1. Clone & Install

```bash
git clone https://github.com/your-username/task-tracker.git
cd task-tracker
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Database (Supabase Postgres)
DATABASE_URL=
DIRECT_URL=

# Sentry 
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=
SENTRY_ORG=
SENTRY_PROJECT=
```

### 3. Database Setup

```bash
cp .env.local .env
npx prisma migrate dev
```

### 4. Supabase Auth Setup

In Supabase Dashboard:

1. **Authentication → Sign In / Providers → Email** → Enable
2. **User Signups → Confirm email** → OFF (for local dev)

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npx prisma studio` | Open Prisma GUI |

---

## API Routes

All routes require authentication (Supabase session cookie).

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Fetch all tasks for current user |
| POST | `/api/tasks` | Create a new task |
| PATCH | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

**Example — Create Task:**

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Design homepage",
    "priority": "HIGH",
    "status": "TODO",
    "dueDate": "2026-10-01T00:00:00.000Z"
  }'
```

---

## Database Schema

**User** (synced with Supabase Auth):

```prisma
model User {
  id        String   @id
  email     String   @unique
  name      String?
  avatarUrl String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  tasks     Task[]
}
```

**Task:**

```prisma
model Task {
  id          String    @id @default(uuid())
  title       String
  description String?
  priority    Priority  @default(MEDIUM)
  status      Status    @default(TODO)
  dueDate     DateTime?
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([userId])
  @@index([status])
}

enum Priority { LOW MEDIUM HIGH }
enum Status   { TODO IN_PROGRESS DONE }
```

---

## Known Limitations

- **Drag-and-drop** is not implemented; use the dropdown menu on task cards to change status
- **Row-Level Security (RLS)** is not configured; authorization is enforced at API route level via `userId` filtering
- **Real-time updates** are not implemented; refresh required
- **Email confirmation** is disabled for development
- **File uploads** (attachments) are not supported
- **Sentry source maps** require `SENTRY_AUTH_TOKEN` in CI (DSN-only setup currently)

---

## Manual Testing Checklist

- [x] Signup with new email
- [x] Login with existing user
- [x] Logout
- [x] Create task with all fields
- [x] Edit task
- [x] Delete task
- [x] Change task status via dropdown
- [x] Dashboard stats update
- [x] Overdue highlighting
- [x] Responsive (375px, 768px, 1280px)
- [x] Sentry error capture

---

## License

MIT
