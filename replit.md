# ScholarTrack

A scholarship and opportunity tracking app for students — browse, manage, and apply to scholarships, internships, and competitions. **Web application only** — targets desktop, tablet, and mobile web browsers. Responsive design required. No native mobile apps.

## Run & Operate

- `pnpm --filter @workspace/scholartrack run dev` — run the web app (main artifact)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- Required env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite (`artifacts/scholartrack/`)
- Routing: wouter
- UI: shadcn/ui + Tailwind CSS v4
- Auth: Supabase Google OAuth (`@supabase/supabase-js`)

## Where things live

- `artifacts/scholartrack/` — React + Vite frontend (the main app)
- `artifacts/scholartrack/src/lib/supabase.ts` — Supabase client
- `artifacts/scholartrack/src/lib/data.ts` — static mock data (opportunities, scholarships, applications)
- `artifacts/scholartrack/src/lib/definitions.ts` — TypeScript types
- `artifacts/scholartrack/src/pages/` — route-level page components
- `artifacts/scholartrack/src/components/` — reusable UI components

## Architecture decisions

- **Auth**: Supabase Google OAuth only — no email/password. `LoginPage.tsx` shows a single "Continue with Google" button. Session state is managed via `supabase.auth.onAuthStateChange` in `App.tsx`.
- **Data**: Static mock data from `src/lib/data.ts`; admin CRUD uses localStorage.
- **Routing**: wouter routes in `App.tsx`; auth guard redirects unauthenticated users to `/login`.

## Product

- Login page — Google OAuth only ("Continue with Google")
- Dashboard showing scholarship/internship/competition opportunities
- Admin panel to add, edit, and delete opportunities (stored in localStorage)
- Profile page showing the signed-in Google user's name and avatar
- Apply pages for individual opportunities and scholarships

## User preferences

- **Web application only** — no React Native, no Expo, no mobile app code, no App Store/Play Store assets
- Target: Next.js-style web app (now Vite), desktop + tablet + mobile web browsers
- Responsive design required

## Gotchas

- Auth requires Google to be enabled as an OAuth provider in Supabase → Authentication → Providers
- Supabase redirect URL must be configured in Supabase dashboard (add your Replit dev domain and any production domain)
- Admin routes at `/admin/dashboard` and `/admin/opportunities` have no role-based access control — any authenticated user can reach them
- Data is static mock data; real persistence would need a backend wired up separately

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
