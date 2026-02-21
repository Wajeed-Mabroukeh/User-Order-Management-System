# User Order Management System

Full-stack user and order management dashboard:
- Backend: Spring Boot + Spring Security + JPA + MySQL
- Frontend: React + TypeScript + Vite

## Figma Design

Design reference:
`https://www.figma.com/make/uxFrTPdB2fCvok1jcNkqEH/User---Order-Management-System?t=EOAugVjxwwtk0CMv-1&preview-route=%2Forders`

## Setup Instructions

### Prerequisites

- Java 21
- Node.js 18+ and npm
- MySQL 8+
- Git

### Install dependencies

```bash
# backend dependencies are handled by Maven wrapper on first run

cd frontend
npm install
```

## Environment Variables

### Backend (`backend/src/main/resources/application.properties`)

Backend supports environment overrides for DB, JWT, and port.

| Variable | Default value | Purpose |
| --- | --- | --- |
| `DB_URL` | `jdbc:mysql://localhost:3307/userordermanagment` | MySQL JDBC URL |
| `DB_USERNAME` | `root` | MySQL username |
| `DB_PASSWORD` | `1234` | MySQL password |
| `JWT_SECRET` | `mySecretKeyForJWTTokenGenerationAndValidation2024` | JWT signing secret |
| `JWT_EXPIRATION` | `86400000` | JWT expiration in ms |
| `JWT_COOKIE_NAME` | `access_token` | Auth cookie name |
| `JWT_COOKIE_SECURE` | `false` (`true` in `prod` profile) | Require HTTPS for auth cookie |
| `JWT_COOKIE_SAME_SITE` | `Lax` | Cookie SameSite mode (`None` for cross-site + HTTPS) |
| `JWT_COOKIE_PATH` | `/` | Cookie path scope |
| `PORT` | `8080` | Backend HTTP port |

### Frontend

| Variable | Default value | Purpose |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `/api` | Base URL for API requests. In dev, Vite proxy forwards `/api` to backend. |

Create `frontend/.env` only if you want to override the default:

```bash
VITE_API_BASE_URL=http://localhost:8080/api
```

## Database Setup (MySQL)

1. Start MySQL server.
2. Create database:

```sql
CREATE DATABASE userordermanagment;
```

3. Update credentials if needed using `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD`.
4. Tables are created/updated automatically by Hibernate (`spring.jpa.hibernate.ddl-auto=update`).

## Run Commands

### 1) Run backend

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

### 2) Run frontend

```bash
cd frontend
npm run dev
```

Frontend URL: `http://localhost:5173`

## Docker (Frontend + Backend + MySQL)

Run everything with Docker Compose:

```bash
docker compose up --build -d
```

Stop and remove containers:

```bash
docker compose down
```

Stop and remove containers + database volume:

```bash
docker compose down -v
```

Services after startup:

- Frontend (Nginx): `http://localhost:5173`
- Backend API: `http://localhost:8080`
- MySQL host port: `3308` (container `3306`)

Notes:

- Frontend proxies `/api` to backend through Nginx in container network.
- Current compose defaults set `JWT_COOKIE_SECURE=false` for local HTTP development.
- For real production behind HTTPS, set `JWT_COOKIE_SECURE=true` and update `JWT_COOKIE_SAME_SITE` as needed.

## Assumptions / Notes

- API base path is `/api` (example: `/api/auth/login`, `/api/auth/register`).
- Auth token is stored in an `HttpOnly` cookie set by backend.
- `Role` displayed in UI is currently a frontend default (`USER`), not persisted in backend `users` table.
- MySQL default port in this project is `3307`; if your MySQL runs on `3306`, override `DB_URL`.
