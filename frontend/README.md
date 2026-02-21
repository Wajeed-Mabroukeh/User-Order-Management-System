# Frontend Dashboard (React + TypeScript)

## Run

```bash
npm install
npm run dev
```

API base URL defaults to:

```
http://localhost:8080/api
```

You can change it with:

```
VITE_API_BASE_URL=http://localhost:8080/api
```

## Implemented Requirements

- Login page with email/password, loading state, and error handling
- Protected routes for authenticated users only
- Profile page showing name, email, and role
- Orders page showing order list, order creation form, loading states, and errors
- API service layer (`src/services`)
- Global auth state using React context (`src/context/AuthContext.tsx`)
- Reusable components (`src/components/ui`)
- Type-safe DTO models (`src/types`)

## Token Storage Strategy

Current implementation stores the JWT token in **memory only** (React state):

- Pros: token is not persisted to disk (`localStorage`/`sessionStorage`), which reduces long-term XSS exposure.
- Cons: token is lost on page refresh; user logs in again.

Alternative for production:

- Use **httpOnly secure cookies** set by backend.
- Pros: token inaccessible from JavaScript; stronger protection against token theft.
- Cons: requires backend cookie configuration and CSRF strategy.
