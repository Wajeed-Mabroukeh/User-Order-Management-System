# User Order Management System

Full-stack user and order management dashboard.

- Backend: Spring Boot, Spring Security, JPA, MySQL
- Frontend: React, TypeScript, Vite
- Auth: JWT in `HttpOnly` cookie

## Design Reference

Figma:
`https://www.figma.com/make/uxFrTPdB2fCvok1jcNkqEH/User---Order-Management-System?t=EOAugVjxwwtk0CMv-1&preview-route=%2Forders`

## Features

- Register, login, and logout
- Protected routes in frontend
- Current user profile (`/api/users/me`)
- Create and list orders for authenticated user (`/api/orders`)
- Dockerized backend, frontend, and MySQL setup

## Project Structure

```text
backend/                 Spring Boot API
frontend/                React dashboard
docker-compose.yml       Full Docker stack
Demo & ScreenShots/      Demo screenshots
ERD Diagram/             Database design
```

## Prerequisites

- Git
- Java 21
- Node.js 18+ and npm
- MySQL 8+ (for local run)
- Docker Desktop (optional, for container run)

## Option A: Run Locally

### 1) Database

Start local MySQL and create database:

```sql
CREATE DATABASE userordermanagment;
```

Database connection values are read from `backend/.env` (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`).

### 2) Create Backend `.env`

The backend reads local environment values from `backend/.env`.

Create it from the template:

Windows (PowerShell):

```bash
Copy-Item backend/.env.template backend/.env
```

Windows (CMD):

```bash
copy backend\.env.template backend\.env
```

Then edit `backend/.env` with your local values (DB host/port/user/password, JWT secret, etc.).

Important:
- Keep `backend/.env` private and never commit real secrets.

Example `backend/.env` (use your own values):

```bash
DB_URL=jdbc:mysql://<DB_HOST>:<DB_PORT>/<DB_NAME>
DB_USERNAME=<DB_USERNAME>
DB_PASSWORD=<DB_PASSWORD>

JWT_SECRET=<JWT_SECRET>
JWT_EXPIRATION=<JWT_EXPIRATION_MS>
JWT_COOKIE_NAME=access_token
JWT_COOKIE_SECURE=<true_or_false>
JWT_COOKIE_SAME_SITE=<Lax_or_None_or_Strict>
JWT_COOKIE_PATH=/

PORT=<BACKEND_PORT>
```

### 3) Backend

Windows (PowerShell):

```powershell
cd backend
Get-Content .env | ForEach-Object {
  if ($_ -and $_ -notmatch '^\s*#') {
    $k, $v = $_ -split '=', 2
    Set-Item -Path "Env:$($k.Trim())" -Value $v.Trim()
  }
}
$env:JAVA_HOME="C:\Program Files\Java\jdk-21"
.\mvnw.cmd spring-boot:run
```

Windows (production profile):

```powershell
cd backend
Get-Content .env | ForEach-Object {
  if ($_ -and $_ -notmatch '^\s*#') {
    $k, $v = $_ -split '=', 2
    Set-Item -Path "Env:$($k.Trim())" -Value $v.Trim()
  }
}
$env:JAVA_HOME="C:\Program Files\Java\jdk-21"
$env:SPRING_PROFILES_ACTIVE="prod"
.\mvnw.cmd spring-boot:run
```

Backend bind port is controlled by `PORT` in `backend/.env`.

### 4) Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend dev URL is shown in terminal when Vite starts.

## Option B: Run with Docker

Run all services:

```bash
docker compose up --build -d
```

Stop services:

```bash
docker compose down
```

Stop and remove DB volume:

```bash
docker compose down -v
```

Docker service URLs and port mappings are defined in `docker-compose.yml`.

## Environment Variables

### Backend

Configured in `backend/src/main/resources/application.properties` and loaded from `backend/.env` (via `spring.config.import`).

| Variable | Source | Purpose |
| --- | --- | --- |
| `DB_URL` | `backend/.env` | JDBC connection URL |
| `DB_USERNAME` | `backend/.env` | DB username |
| `DB_PASSWORD` | `backend/.env` | DB password |
| `JWT_SECRET` | `backend/.env` | JWT signing secret |
| `JWT_EXPIRATION` | `backend/.env` | JWT expiration in ms |
| `JWT_COOKIE_NAME` | `backend/.env` | Auth cookie name |
| `JWT_COOKIE_SECURE` | `backend/.env` | Require HTTPS for auth cookie |
| `JWT_COOKIE_SAME_SITE` | `backend/.env` | Cookie SameSite mode |
| `JWT_COOKIE_PATH` | `backend/.env` | Cookie path |
| `PORT` | `backend/.env` | Backend port |

Note:
- These backend variables are required for local run because application properties use env placeholders without fallback defaults.

### Frontend

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `/api` | API base path. In dev, Vite proxy forwards `/api` to the backend service. |

Optional override in `frontend/.env`:

```bash
VITE_API_BASE_URL=http://<BACKEND_HOST>:<BACKEND_PORT>/api
```

## API Summary

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/users/me`
- `GET /api/orders`
- `POST /api/orders`

## Final Delivery Notes

- Authentication session uses cookie-based auth flow (`credentials: include` in frontend).
- Frontend proxy is configured for `/api` in both Vite (local) and Nginx (Docker).
- Screenshots are available in `Demo & ScreenShots`.
- Auth flow to JWT in `HttpOnly` cookie with backend logout cookie clear
