# Homatt Health

**High-quality healthcare access for everyone in Uganda.**

Homatt Health is a dual-portal healthcare platform connecting patients with hospitals and health facilities across Uganda. Every decision — from architecture to UI — prioritizes reliability on low-bandwidth networks and a gentle, human-centered user experience.

---

## Tech Stack

| Layer          | Technology                              |
| -------------- | --------------------------------------- |
| Framework      | **Next.js** (App Router)                |
| Auth & DB      | **Supabase** (Auth, Postgres, Realtime) |
| Styling        | **Tailwind CSS**                        |
| Deployment     | Vercel (or self-hosted Node)            |
| Language       | TypeScript                              |

---

## Project Structure

```
/
├── app/
│   ├── (user)/            # Patient-facing app
│   │   ├── dashboard/
│   │   ├── appointments/
│   │   ├── records/
│   │   └── facilities/
│   ├── (hospital)/        # Hospital/Facility portal
│   │   ├── dashboard/
│   │   ├── patients/
│   │   ├── scheduling/
│   │   └── inventory/
│   ├── auth/              # Shared auth pages (login, signup, reset)
│   └── layout.tsx
├── components/
│   ├── ui/                # Shared primitives (Button, Card, Input, etc.)
│   ├── user/              # Patient-app components
│   └── hospital/          # Hospital-portal components
├── lib/
│   ├── supabase/          # Supabase client, helpers, types
│   ├── hooks/             # Custom React hooks
│   └── utils/             # General utilities
├── public/
├── styles/
│   └── globals.css
├── supabase/
│   ├── migrations/        # SQL migration files
│   └── seed.sql
├── CLAUDE.md              # This file
└── package.json
```

---

## Portals

### 1. User App (Patients)

The patient-facing application. Users can:

- Register / log in (phone number + OTP preferred, email as fallback)
- Search for nearby hospitals and health facilities
- Book and manage appointments
- View personal health records shared by facilities
- Receive notifications (appointment reminders, lab results)

### 2. Hospital / Facility Portal

The provider-facing dashboard. Facilities can:

- Manage their profile, services, and operating hours
- View and confirm incoming appointment requests
- Access and update patient records (with consent)
- Track bed availability, drug inventory, and staffing
- Generate basic reports and analytics

---

## Core Design Principles

### Low-Bandwidth UI

Uganda's internet landscape means many users connect via 2G/3G or congested networks. Every feature must respect this reality.

- **Minimal JavaScript.** Use Server Components by default. Only add `"use client"` when interactivity is required.
- **Small page weights.** Target < 200 KB initial load per route. Audit with Lighthouse regularly.
- **Optimized images.** Use `next/image` with WebP/AVIF formats and aggressive sizing. Provide low-res placeholders.
- **No heavy client libraries.** Avoid large charting, animation, or rich-text libraries on patient-facing pages. Prefer server-rendered HTML.
- **Progressive loading.** Use Suspense boundaries and skeleton screens so content appears incrementally.
- **Offline-aware.** Show clear, friendly messages when the network drops. Cache critical data (upcoming appointments, facility contacts) where possible.
- **Prefetch sparingly.** Only prefetch links that are very likely to be visited next.

### Soft User Experience

Many users will be first-time smartphone users or have limited digital literacy. The interface must feel safe, calm, and forgiving.

- **Simple language.** Write UI copy at a primary-school reading level. Avoid medical jargon in the patient app — use plain descriptions.
- **Local language support.** Architecture must support i18n from day one. Plan for English, Luganda, and Swahili at minimum.
- **Large tap targets.** Minimum 48x48 px touch targets. Generous spacing between interactive elements.
- **Gentle error handling.** Never show raw error codes or technical messages. Use warm, reassuring language: *"Something went wrong. Let's try that again."*
- **Confirmations over assumptions.** Before any destructive or important action (cancel appointment, submit record), confirm with the user in clear terms.
- **Familiar patterns.** Stick to standard mobile UI patterns. Bottom navigation for the patient app. Sidebar navigation for the hospital portal.
- **Accessible colors.** Maintain WCAG AA contrast ratios. Use color plus icons/text — never color alone — to convey status.

---

## Development Rules

### Code Style

- **TypeScript everywhere.** No `any` types. Define proper interfaces for all Supabase tables and API responses.
- **Server Components first.** Default to RSC. Extract client components into small, focused files.
- **Tailwind only.** No CSS modules, styled-components, or inline styles. Use Tailwind's design tokens for consistency.
- **Named exports.** Prefer named exports over default exports for components and utilities.
- **Colocation.** Keep component-specific logic (hooks, types, helpers) close to the component that uses them.

### Supabase Conventions

- All database changes go through migration files in `supabase/migrations/`.
- Enable Row Level Security (RLS) on every table. No exceptions.
- Use Supabase Auth for all authentication. Do not roll custom auth.
- Type-generate database types with `supabase gen types typescript` and store in `lib/supabase/database.types.ts`.
- Use Supabase Realtime only where truly needed (e.g., appointment status updates). Do not subscribe broadly.

### Authentication Flow

- **Patients:** Phone OTP as primary method. Email/password as secondary.
- **Facility staff:** Email/password with role-based access (admin, doctor, nurse, receptionist).
- Use Supabase Auth middleware in `middleware.ts` to protect routes.
- Store user role in a `profiles` table linked to `auth.users`.

### API & Data Fetching

- Fetch data in Server Components using the Supabase server client.
- Use Server Actions for mutations (booking, profile updates, record entries).
- Validate all inputs with Zod schemas before writing to the database.
- Never expose Supabase service-role keys to the client.

### Testing

- Write tests for critical paths: authentication, appointment booking, record access.
- Use Vitest for unit tests and Playwright for end-to-end tests.
- Test on throttled network conditions (Chrome DevTools "Slow 3G" profile) regularly.

### Accessibility

- All images must have meaningful `alt` text.
- All form inputs must have associated labels.
- Interactive elements must be keyboard-navigable.
- Test with screen readers periodically.

---

## Common Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Generate Supabase types
npx supabase gen types typescript --local > lib/supabase/database.types.ts

# Run migrations
npx supabase db push

# Run tests
npm run test

# Run e2e tests
npm run test:e2e

# Build for production
npm run build

# Lint
npm run lint
```

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=        # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # Supabase anonymous/public key
SUPABASE_SERVICE_ROLE_KEY=       # Server-only — never expose to client
```

Store these in `.env.local` (git-ignored). Never commit secrets.

---

## Key Reminders for AI Assistants

1. **Always think low-bandwidth first.** Before adding any feature, ask: "Will this work on a 2G connection in Kampala?"
2. **Keep the UI soft.** No aggressive colors, no dense tables on mobile, no technical jargon in patient views.
3. **RLS on every table.** If you create a new Supabase table, add Row Level Security policies immediately.
4. **Server Components by default.** Only use client components for interactivity (forms, modals, real-time updates).
5. **Validate at the boundary.** Use Zod for all form inputs and API payloads.
6. **Respect the two portals.** Patient features go in `app/(user)/`. Facility features go in `app/(hospital)/`. Shared components go in `components/ui/`.
7. **Migrations, not manual SQL.** All schema changes must be migration files.
8. **Test on slow networks.** If it feels slow on simulated 3G, optimize before shipping.
