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

## Assumptions / Notes

- API base path is `/api` (example: `/api/auth/login`, `/api/auth/register`).
- Frontend token storage is in-memory (React context state), so session is cleared on refresh.
- `Role` displayed in UI is currently a frontend default (`USER`), not persisted in backend `users` table.
- MySQL default port in this project is `3307`; if your MySQL runs on `3306`, override `DB_URL`.
