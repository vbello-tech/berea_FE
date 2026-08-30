# Berea

A Scripture reading, word-study, and cross-reference app — Vue 3 + Vite frontend, talking to a Django REST API.

## Requirements

- Node.js 18+ and npm
- A running instance of the Django backend this frontend was built against (it expects endpoints like `/passage/`, `/strongs/`, `/notes/by_passage/`, `/auth/login/`, `/auth/register/`, `/auth/logout/`)

## Project structure

```
berea/
├── index.html                 Vite entry HTML (fonts, Font Awesome, mount point)
├── vite.config.js
├── .env.development           API base URL used by `npm run dev`
├── .env.production             API base URL used by `npm run build`
├── src/
│   ├── main.js                 App entry — installs Pinia, mounts App.vue
│   ├── App.vue                 Root layout
│   ├── api/client.js            Fetch wrapper (auth header, error handling)
│   ├── stores/app.js            Pinia store: auth, passage, notes, popover, toast
│   ├── utils/wordAlignment.js   KJV-word ↔ Strong's-tag alignment heuristic
│   ├── constants/books.js       Bible book list for the passage finder
│   ├── assets/tokens.css        Design tokens (colors, fonts, radii)
│   └── components/              AppHeader, SidebarNav, PassageFinder,
│                                 ScriptureReader, VerseText, StudyPanel,
│                                 InterlinearTab, CrossRefTab, VerseAccordion,
│                                 NotesPanel, WordPopover, ToastNotification
```

## Running in development

1. Install dependencies:
   ```bash
   cd berea
   npm install
   ```
2. Make sure your Django API is running locally (by default this expects `http://127.0.0.1:8000/api` — see `.env.development`).
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open the URL Vite prints (typically `http://localhost:5173`). Vite serves with hot module reload, so edits to any `.vue` file appear instantly without a full refresh.

If your backend runs on a different host or port, edit `.env.development`:
```
VITE_API_BASE=http://127.0.0.1:8000/api
```

## Building for production

1. Point `.env.production` at your deployed API's real origin:
   ```
   VITE_API_BASE=https://api.yourdomain.com/api
   ```
2. Build the static bundle:
   ```bash
   npm run build
   ```
   This outputs optimized, minified static files to `dist/`.
3. Preview the production build locally before deploying (optional but recommended):
   ```bash
   npm run preview
   ```
4. Deploy the contents of `dist/` to any static host — Netlify, Vercel, Cloudflare Pages, S3 + CloudFront, or your own Nginx server. `dist/` is entirely static; no Node server is needed at runtime.

### CORS

Since the frontend and API are on different origins in most deployments, make sure your Django backend's CORS settings (e.g. `django-cors-headers`) allow requests from wherever `dist/` ends up being served (your production domain), and from `http://localhost:5173` during development.

### Auth token persistence

As in the original build, the auth token is kept only in memory (`store.authToken`) and is lost on page refresh — the person needs to log in again. If you want sessions to survive a refresh, the store is the one place to change: persist `authToken`/`username` to `localStorage` (or better, have the backend set an httpOnly cookie) in `handleAuth`/`logout` in `src/stores/app.js`.

## Notes on the port from the original single-file HTML

- All markup, styling, and behavior were ported 1:1 from the original vanilla-JS build, including the Berea warm gold/wine color system, Cormorant Garamond display type, and the enlarged word-popover text.
- DOM string-building (`innerHTML`) was replaced with real Vue templates and computed state — functionally equivalent, but each piece (verse text, interlinear rows, cross-ref cards, notes, popover) is now its own component with reactive state instead of manual `document.getElementById` calls.
- Shared state (auth, current passage, active tab/word, popover, toast) lives in one Pinia store (`src/stores/app.js`) so every component reacts to the same source of truth.
# berea_FE
