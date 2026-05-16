# Frontend tests (Jest + React Testing Library, Playwright)

This folder contains example unit and E2E test skeletons for the frontend.

Unit tests (Jest + React Testing Library):

```
cd PM-A-frontend
npm install
npm test    # uses existing project scripts if defined; otherwise run `npx jest`
```

Playwright (E2E):

```
cd PM-A-frontend
npx playwright install
npx playwright test
```

Manual debug (curl / Postman):
- Use curl to hit the backend API at `http://localhost:8000` (example below).

```
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"pass"}' -c cookies.txt

curl -X GET http://127.0.0.1:8000/api/projects/ -b cookies.txt
```

Adjust host/ports according to your local dev servers (Next.js usually runs on 3000, Django on 8000).
