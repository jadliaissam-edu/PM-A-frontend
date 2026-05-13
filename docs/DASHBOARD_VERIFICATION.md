# Dashboard Verification Report

Scope: review of dashboard UI in `app/(dashboard)` (layout, enterprise dashboard, project dashboard) to identify which parts are static/mock and which require backend/auth to function. Also lists buttons that currently behave as placeholders or may fail and suggested fixes.

## How the frontend expects auth & API
- Base API: `NEXT_PUBLIC_API_BASE_URL` (defaults to `http://127.0.0.1:8000/api`). See `lib/api.ts`.
- Client auth: reads tokens from `localStorage` (`accessToken`, `refreshToken`) and attaches `Authorization: Bearer <token>` for requests. If API returns 401/403 it clears tokens and redirects to `/login`.
- NextAuth scaffolding was added, but current middleware may be a stub — verify `NEXTAUTH_SECRET` and installation.

## Files reviewed
- `app/(dashboard)/layout.tsx` — dashboard shell, sidebar, org/workspace loading.
- `app/(dashboard)/dashboard/enterprise/page.tsx` — enterprise/home dashboard UI.
- `app/(dashboard)/project/[id]/page.tsx` — per-project dashboard (uses `projectService`).
- Services: `services/dashboard.service.ts`, `services/project.service.ts`, `services/org.service.ts`, `lib/api.ts`, `services/auth.service.ts`.

## Static / mock content (works without backend)
- `focusItems` in `enterprise/page.tsx` — hard-coded sample list used when assigned tasks are empty. Add/remove tasks here is local-only.
- `overviewColumns` and several UI counts in the enterprise page are static demo numbers until `dashboardService.getStats()` returns real values.
- Many UI panels (e.g., mini cards, some widgets) are demo-only and render fine without backend.
- Local-only flows:
  - `addLocalTask()` — adds a task to local component state only; no API call.
  - `inviteTeammate()` — sets a staged notice only; no invite API call.
  - Several `setNotice(...)` uses are informational and do not call backend.

## Dynamic / backend-dependent parts
- `authService.getProfile()` — required to fetch user data (username, avatar, color). If this fails, UI falls back to placeholders.
- `dashboardService.getStats()`, `getRecentActivity()`, `getAssignedTasks()` — provide counts, activity and assigned items. Missing backend causes empty/default values and a notice.
- `orgService.getOrganizations()`, `getWorkspaces()`, `getOrganizationMembers()` — sidebar organization/workspace lists depend on these.
- `projectService` endpoints — project dashboards, board moves, ticket updates, releases, etc. Many buttons navigate to routes that expect API data.

## Buttons and interactions that may not work (actions & suggested fixes)

- Refresh (Enterprise header) -> `fetchData()`
  - Depends on multiple backend calls (profile, stats, activity, tasks, orgs, workspaces).
  - If API is not running or auth token missing, it will fail and show `Failed to load dashboard data.`
  - Fix: Ensure API running and `accessToken` present in `localStorage` or configure NextAuth session; add retry/logging.

- MetricStrip buttons (Total projects, Owned projects, Collaborations, Archived)
  - They call `router.push('/project')` or set a notice. Navigation works but target pages depend on API.
  - Fix: implement server endpoints or mock data for dev; protect navigation if unauthenticated (middleware already added).

- Open board / Open task list / View dashboard / Organizations / Workspaces buttons
  - These navigate to internal routes. If those routes expect API data, the page may show empty or error.
  - Fix: create or mock corresponding API endpoints (see `project.service` and `dashboard.service`). Add loading/error states.

- Create task (panel -> Create) -> `addLocalTask()`
  - Currently local-only. If you expect server-side creation, wire to `projectService.createProject` or a `ticketsService.createTicket` call with project/workspace context.
  - Suggested implementation: add optional `projectId` selector in the panel and call `ticketsService.createTicket(projectId, payload)`, then refresh data.

- Invite teammate -> `inviteTeammate()`
  - Currently just shows a notice. Fix by calling org API: `orgService.inviteMember(orgId, { email: inviteEmail })` and handle success/failure.

- Sidebar org/workspace switching buttons
  - They call `orgService.getOrganizations()` and `getWorkspaces()` on mount; switching writes `localStorage` keys and updates UI. If orgService endpoints are missing, the list is empty and shows "No members found".
  - Fix: implement org endpoints or provide a local dev mock fallback service.

- Quick Actions (Create task, Open board, Invite teammate, Add view)
  - Create task -> local panel; Open board -> navigation; Invite teammate -> local staged invite.
  - Fix: wire Create task and Invite to real APIs as above.

- Focus table checkboxes (toggle complete)
  - Toggle is local-only via `setCompletedFocus` and does not persist to backend. Fix by calling a ticket update endpoint when connected to a project/ticket id.

- Project dashboard (`app/(dashboard)/project/[id]/page.tsx`)
  - Uses `projectService.getProjectById()` and many project-scoped endpoints (board, backlog, documents, members). These will fail if API not available or authorization missing.
  - Fix: ensure `projectService` backend endpoints exist and are reachable, or provide mock implementations during development.

- Sidebar links guarded by middleware
  - Server middleware (NextAuth) was added; ensure `next-auth` is installed and configured or use the cookie-based fallback to avoid blocking dev usage.

## How to test locally (quick checklist)
1. Ensure backend API is running and reachable at `NEXT_PUBLIC_API_BASE_URL` (or edit `lib/api.ts`).
2. Provide auth token in browser `localStorage` as `accessToken` (or configure NextAuth session):
   - `localStorage.setItem('accessToken', '<valid-jwt>')`
3. Start dev server:
   - `cd project_matier/PM-A-frontend && npm install && npm run dev`
4. Open `/dashboard` and click the interactive buttons listed above to observe failures and console/network errors.

## Suggested prioritized fixes
1. Ensure auth is wired (NextAuth or JWT cookie). For quick dev, add a dev-only mock token or cookie.
2. Implement server endpoints used by `dashboardService` and `orgService` (stats, recent-projects, organizations, workspaces, organization members).
3. Convert local-only flows (create task, invite) into API calls and refresh dashboard on success.
4. Add defensive error handling and empty-state UI to avoid uncaught console errors when API calls fail.
5. Add end-to-end tests (Cypress/Playwright) for main dashboard flows: refresh, open board, create task, invite teammate.

## Notes / Observations
- The code is well-structured: services centralize API calls and components handle local fallbacks. This makes it straightforward to wire the backend.
- Many interactive elements already call the correct `router.push(...)` or service functions — most work is implementing server endpoints and wiring create/update APIs.

If you want, I can:
- Run a sweep to list every button with an `onClick` in `app/(dashboard)` and generate a CSV of file/line/button-text/handler. (recommended for actionable bug list)
- Replace local-only task/invite flows with API calls to example endpoints and add error handling.
