# Hungry Belly

Hungry Belly is a full-stack admin platform for operating a food-delivery back office. The repository includes a Spring Boot API, a React admin dashboard, media-upload utilities, and management flows for users, roles, restaurants, categories, foods, and restaurant staff membership.

## Overview

- `hungry-belly-backend` - Spring Boot REST API
- `hungry-belly-frontend` - React + Vite admin dashboard
- `resources` - project assets, including the database schema image

## Current capabilities

- **Authentication and account management** - JWT-based login, refresh-token flow, logout, current-user profile, and account update APIs.
- **Role and permission administration** - manage roles, inspect permissions, and control access to protected admin features.
- **User operations** - paginated user management, password reset, status updates, and CSV/XLSX export.
- **Restaurant operations** - create, edit, activate/deactivate, delete, and inspect restaurants.
- **Restaurant membership management** - list members, add members, change member roles, remove members, list the signed-in user's restaurants, and transfer restaurant ownership.
- **Catalog management** - manage hierarchical categories and food items.
- **Media uploads** - generate presigned upload URLs and temporary upload sessions for client-side file handling.
- **Operational cleanup** - scheduled cleanup services remove orphaned uploads and generated export files.
- **API documentation** - OpenAPI/Swagger UI is enabled in the backend.

## Tech stack

| Layer | Technologies |
| --- | --- |
| Backend | Java 21, Spring Boot 3.5, Spring Security, Spring Data JPA, MySQL, H2 (tests) |
| Frontend | React 19, Vite 8, React Router 7, TanStack Query 5, Axios, Bootstrap 5 |
| Storage and export | AWS SDK for S3-compatible storage, Apache POI, Super CSV |

## Repository structure

```text
hungry-belly/
|-- hungry-belly-backend/
|-- hungry-belly-frontend/
`-- resources/
```

## Database schema

![Hungry Belly schema](resources/Hungery%20Belly.jpg)

## Getting started

### Prerequisites

- Java 21
- Node.js 20+
- MySQL 8+

### 1. Configure the backend

Create `hungry-belly-backend\.env`:

```env
DB_URL=jdbc:mysql://localhost:3306/hungry_belly
DB_USERNAME=your_mysql_username
DB_PASSWORD=your_mysql_password

BUCKET_NAME=your_bucket_name
ACCESS_BUCKET_KEY=your_storage_access_key
SECRET_BUCKET_KEY=your_storage_secret_key
REGION_NAME=your_region
S3_ENDPOINT=your_s3_endpoint
SIGN_ENDPOINT=your_sign_endpoint
SERVICE_ROLE_KEY=your_service_role_key

JWT_SECRET=your_jwt_secret
```

The backend loads this file through `spring.config.import`, uses `/api/v1` as the API prefix, and allows frontend requests from `http://localhost:5173`.

### 2. Run the backend

From `hungry-belly-backend`:

```bash
.\mvnw.cmd spring-boot:run
```

The API starts on `http://localhost:8080` by default.

### 3. Configure the frontend

Create `hungry-belly-frontend\.env`:

```env
VITE_API_URL=http://localhost:8080/api/v1
```

### 4. Run the frontend

From `hungry-belly-frontend`:

```bash
npm install
npm run dev
```

The admin app runs on `http://localhost:5173`.

## Useful commands

### Backend

```bash
.\mvnw.cmd spring-boot:run
.\mvnw.cmd -q test
.\mvnw.cmd -q -DskipTests package
```

### Frontend

```bash
npm install
npm run dev
npm run build
npm run lint
npm run preview
```

## API overview

Base path: `/api/v1`

Main modules:

- `/auth`
- `/users`
- `/roles`
- `/permissions`
- `/restaurants`
- `/categories`
- `/foods`
- `/storage`

Restaurant membership endpoints are grouped under `/restaurants`, including:

- `GET /restaurants/{restaurantId}/members`
- `POST /restaurants/{restaurantId}/members`
- `PATCH /restaurants/{restaurantId}/members/{membershipId}/role`
- `DELETE /restaurants/{restaurantId}/members/{membershipId}`
- `GET /restaurants/mine`
- `POST /restaurants/{restaurantId}/transfer-ownership`

Swagger UI is available at `http://localhost:8080/swagger-ui/index.html`.

## Frontend routes

Key admin routes include:

- `/users`
- `/roles`
- `/restaurants`
- `/restaurants/:id`
- `/restaurants/:id/members`
- `/categories`
- `/foods`
- `/profile`

The frontend sends credentials with every request and automatically attempts token refresh on `401` responses.

## Notes

- The backend uses MySQL in normal development and H2 in the test profile.
- Backend security protects user and role management for admins, while restaurant and food features are available to admin and partner roles.
- The frontend contains the latest restaurant member-management UI, including add member, role change, remove member, and transfer owner flows.
