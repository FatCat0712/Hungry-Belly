# Hungry Belly

Hungry Belly is a full-stack admin platform for managing users, roles, restaurants, categories, foods, authentication, and media uploads for a food delivery system.

The repository contains:

- `hungry-belly-backend` - Spring Boot 3 REST API
- `hungry-belly-frontend` - React 19 + Vite admin dashboard
- `resources` - project assets, including the database schema image

## Database schema

![Hungry Belly schema](resources/Hungery%20Belly.jpg)

## What's implemented

### Backend API

- JWT authentication with login, refresh token, logout, current-user lookup, and account update endpoints
- Cookie-based access and refresh token flow
- Role-based authorization with route protection for admin and restaurant-partner operations
- User management with paginated listing, search/sort support, stats, create, update, reset password, enable/disable, delete, and export
- Role and permission management with role creation, update, delete, lookup, and permission assignment support
- Restaurant management with paginated listing, details, create, update, enable/disable, and delete
- Restaurant membership APIs for listing members, adding members, changing member roles, removing members, and fetching current-user restaurant memberships
- Category management with paginated root-category listing, hierarchical category data for forms, create, update, enable/disable, delete, and export
- Food management with paginated listing, details, create, update, enable/disable, and delete
- S3-compatible storage integration for temporary upload sessions and pre-signed upload URLs
- Scheduled cleanup jobs for generated files and temporary image-related assets
- Shared export pipeline for CSV and Excel downloads

### Frontend admin app

- Login flow backed by cookie auth and automatic token refresh
- Protected routes with redirect to login for unauthenticated users
- Access-denied screen for authenticated users without permission
- Dashboard shell with sidebar navigation and profile access
- User management screen with paging, sorting, searching, export, status toggle, create/edit, and reset-password flows
- Role management screens with permission-aware role create and edit flows
- Restaurant management screens with create, edit, detail view, status updates, and image handling
- Category management screens with paging, sorting, searching, export, create, edit, delete, and status updates
- Food management screens with paging, sorting, searching, detail view, create, edit, delete, status updates, and image handling
- Shared uploader flow that requests pre-signed URLs from the backend and uploads files directly to object storage

### Present but still minimal

- The dashboard currently uses static summary cards and sample recent-order content
- The Orders page exists in routing and navigation, but is still a placeholder screen

## Tech stack

| Layer | Main technologies |
| --- | --- |
| Backend | Java 21, Spring Boot 3, Spring Security, Spring Data JPA, MySQL, JWT, Lombok |
| Storage / export | AWS SDK S3-compatible client, Apache POI, Super CSV |
| Frontend | React 19, Vite, React Router, TanStack Query, Axios, Bootstrap, Bootstrap Icons, React Toastify |

## Repository structure

```text
hungry-belly/
|-- hungry-belly-backend/
|-- hungry-belly-frontend/
`-- resources/
```

## API surface

Base path: `/api/v1`

Main endpoint groups:

- `/auth`
- `/users`
- `/roles`
- `/permissions`
- `/restaurants`
- `/categories`
- `/foods`
- `/storage`

## Local setup

### Prerequisites

- Java 21
- Node.js 20+ and npm
- MySQL 8+

### Backend

1. Go to the backend folder.
2. Create `hungry-belly-backend\.env`.
3. Add the required environment variables:

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

4. Start the API:

```bash
./mvnw spring-boot:run
```

On Windows, use:

```bash
mvnw.cmd spring-boot:run
```

### Frontend

1. Go to the frontend folder.
2. Install dependencies.
3. Create `hungry-belly-frontend\.env`.
4. Add:

```env
VITE_API_URL=http://localhost:8080/api/v1
```

5. Start the frontend:

```bash
npm install
npm run dev
```

The Vite dev server runs on `http://localhost:5173` by default.

## Useful commands

### Backend

```bash
./mvnw test
./mvnw spring-boot:run
```

### Frontend

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Notes

- Backend configuration imports values from a local `.env` file
- Default backend CORS configuration allows `http://localhost:5173`
- The frontend sends credentials with API requests so auth cookies are included
- Category and user exports support both CSV and Excel formats

## Author

Mai Son Hai  
GitHub: https://github.com/FatCat0712
