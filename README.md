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

Default local backend DB connection:
- Host: `localhost`
- Port: `3307`
- Database: `userordermanagment`
- Username: `root`
- Password: `1234`

If your local MySQL uses a different port (for example `3306`), override `DB_URL`.

### 2) Backend

Windows:

```bash
cd backend
set JAVA_HOME=C:\Program Files\Java\jdk-21
mvnw.cmd spring-boot:run
```

Windows (production profile):

```bash
cd backend
set JAVA_HOME=C:\Program Files\Java\jdk-21
set SPRING_PROFILES_ACTIVE=prod
mvnw.cmd spring-boot:run
```

macOS/Linux:

```bash
cd backend
./mvnw spring-boot:run
```

Backend URL: `http://localhost:8080`

### 3) Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

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

Docker service endpoints:

- Frontend (Nginx): `http://localhost:5173`
- Backend API: `http://localhost:8080`
- MySQL host port: `3308` (container `3306`)

Note:
- Local MySQL (`3307`) and Docker MySQL (`3308`) can run without port conflict.

## Environment Variables

### Backend

Configured in `backend/src/main/resources/application.properties` (and optional production overrides in `application-prod.properties`).

| Variable | Default | Purpose |
| --- | --- | --- |
| `DB_URL` | `jdbc:mysql://localhost:3307/userordermanagment` | JDBC connection URL |
| `DB_USERNAME` | `root` | DB username |
| `DB_PASSWORD` | `1234` | DB password |
| `JWT_SECRET` | `mySecretKeyForJWTTokenGenerationAndValidation2024` | JWT signing secret |
| `JWT_EXPIRATION` | `86400000` | JWT expiration in ms |
| `JWT_COOKIE_NAME` | `access_token` | Auth cookie name |
| `JWT_COOKIE_SECURE` | `false` (`true` in `prod`) | Require HTTPS for auth cookie |
| `JWT_COOKIE_SAME_SITE` | `Lax` | Cookie SameSite mode |
| `JWT_COOKIE_PATH` | `/` | Cookie path |
| `PORT` | `8080` | Backend port |

### Frontend

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `/api` | API base path. In dev, Vite proxy forwards `/api` to `http://localhost:8080`. |

Optional override in `frontend/.env`:

```bash
VITE_API_BASE_URL=http://localhost:8080/api
```

## API Summary

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/users/me`
- `GET /api/orders`
- `POST /api/orders`

## Troubleshooting

- Backend fails with `JAVA_HOME is not defined correctly`:
  set `JAVA_HOME` to JDK 21 before `mvnw.cmd spring-boot:run`.
- Docker MySQL port error (`3308` already in use):
  stop the process using `3308`, or change host mapping in `docker-compose.yml`.
- Unauthorized (`401`) on backend root path:
  expected behavior. Use the documented `/api/...` endpoints with authentication flow.

## Recent Updates

- Added Docker support (`backend/Dockerfile`, `frontend/Dockerfile`, `docker-compose.yml`).
- Set Docker MySQL host port to `3308` to avoid conflict with local MySQL on `3307`.
- Switched auth flow to JWT in `HttpOnly` cookie with backend logout cookie clear.
- Updated frontend API client to use `credentials: include` for cookie-based requests.
- Added production cookie overrides in `backend/src/main/resources/application-prod.properties`.

## Final Delivery Notes

- Authentication session uses cookie-based auth flow (`credentials: include` in frontend).
- Frontend proxy is configured for `/api` in both Vite (local) and Nginx (Docker).
- Screenshots are available in `Demo & ScreenShots`.
