# Hungry Belly

Hungry Belly is a full-stack food delivery admin platform.

The project includes:

- A Spring Boot backend with JWT authentication, role-based authorization, CRUD modules, export utilities, and S3-compatible storage integration.
- A React + Vite frontend for admin operations such as users, roles, restaurants, categories, foods, and account management.

## Tech Stack

### Backend

- Java 21
- Spring Boot 3
- Spring Security + JWT (access/refresh flow)
- Spring Data JPA + Hibernate
- MySQL
- AWS SDK S3 (S3-compatible storage)
- Apache POI + Super CSV (Excel/CSV export)

### Frontend

- React 19 + Vite
- React Router
- TanStack Query
- Axios
- Bootstrap + Bootstrap Icons

## Repository Structure

```text
hungry-belly/
	hungry-belly-backend/   # Spring Boot API
	hungry-belly-frontend/  # React admin app
```

## Features Implemented

### Authentication and Authorization

- Login, refresh token, logout, and current user profile endpoints.
- JWT-based stateless authentication.
- Role-based access control with method and route protection.
- HTTP-only cookie support and frontend auto-refresh flow for expired access tokens.

### Admin Management Modules

- User management: create, update, password reset, status toggle, delete, stats.
- Role and permission management.
- Restaurant management with status updates.
- Category management with hierarchical/root retrieval and category exports.
- Food management with list/detail/create/update/delete, status toggle, category mapping, and image handling.

### Data Handling and Utility Features

- Pagination, filtering/search, sorting across management screens.
- CSV/Excel export endpoints for selected modules.
- S3-compatible upload flow with pre-signed URL generation.
- Scheduled cleanup tasks for stale image/export files.
- Hard-delete CRUD flow for food/user modules (soft-delete removed in recent refactor).
- Query optimizations for food/category listing workflows to reduce N+1 and improve pagination performance.
- JWT/auth flow refinements and stricter backend authorization policies.

## API Overview

Base prefix: `/api/v1`

Main endpoint groups:

- `/auth` (login, refresh-token, logout, me, update-account)
- `/users`
- `/roles`
- `/permissions`
- `/restaurants`
- `/categories`
- `/foods`
- `/storage`

## Prerequisites

- Java 21
- Maven 3.9+
- Node.js 20+ (or 18+ with compatible npm)
- MySQL 8+

## Backend Setup

1. Go to backend folder:

```bash
cd hungry-belly-backend
```

2. Create `.env` file in `hungry-belly-backend` with these keys:

```env
DB_URL=jdbc:mysql://localhost:3306/hungry_belly
DB_USERNAME=your_mysql_user
DB_PASSWORD=your_mysql_password

BUCKET_NAME=your_bucket_name
ACCESS_BUCKET_KEY=your_storage_access_key
SECRET_BUCKET_KEY=your_storage_secret_key
REGION_NAME=your_region
S3_ENDPOINT=your_s3_endpoint
SERVICE_ROLE_KEY=your_service_role_key
SIGN_ENDPOINT=your_sign_endpoint

JWT_SECRET=your_jwt_secret
```

3. Run backend:

```bash
./mvnw spring-boot:run
```

Backend runs on the default Spring Boot port unless changed in configuration.

## Frontend Setup

1. Open a new terminal and go to frontend folder:

```bash
cd hungry-belly-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file in `hungry-belly-frontend`:

```env
VITE_API_URL=http://localhost:8080/api/v1
```

4. Start development server:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173` by default.

## Development Notes

- Backend CORS is configured for `http://localhost:5173`.
- Frontend Axios client uses `withCredentials: true` to support auth cookies.
- Test profile config exists in `src/test/resources/application-test.yaml`.
- Recent tests include category repository sorting/pagination behavior and cookie utility coverage.

## Recent Changes

- Added full food CRUD endpoints (`POST/PUT/DELETE`) and service workflows with validation.
- Extended role-based access control for food APIs (`ADMIN`, `MANAGER`) in security configuration.
- Refactored food/user lifecycle handling toward hard-delete consistency.
- Improved food/category query strategies and table pagination behavior.
- Added and refactored cleanup services for export files and image folders.

## Scripts

### Backend

- Run app: `./mvnw spring-boot:run`
- Run tests: `./mvnw test`

### Frontend

- Start dev server: `npm run dev`
- Build production bundle: `npm run build`
- Preview production build: `npm run preview`
- Lint: `npm run lint`

## Author

Mai Son Hai

- GitHub: https://github.com/FatCat0712
