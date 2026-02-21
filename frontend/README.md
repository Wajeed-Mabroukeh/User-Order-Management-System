# Frontend Dashboard (React + TypeScript + Vite)

## Run Locally

```bash
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

## API Configuration

Default API base URL is:

```bash
/api
```

In local development, Vite proxy forwards `/api` requests to `http://localhost:8080`.

Optional override in `.env`:

```bash
VITE_API_BASE_URL=http://localhost:8080/api
```

## Features

- Login and registration flows
- Protected routes with session hydration
- Profile page (`/profile`)
- Orders list and create form (`/orders`)
- Shared API layer (`src/services`)
- Global auth context (`src/context/AuthContext.tsx`)
- Type-safe models (`src/types`)

## Authentication Behavior

- Backend issues JWT in an `HttpOnly` cookie.
- Frontend sends requests with `credentials: include`.
- On app load, frontend calls `/api/users/me` to restore session state.
- Logout clears the auth cookie via backend endpoint.
