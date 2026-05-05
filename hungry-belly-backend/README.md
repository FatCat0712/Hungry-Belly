# Hungry Belly Backend

Spring Boot backend for the Hungry Belly admin platform.

## Overview

This service provides:

- JWT-based authentication with access and refresh token flow.
- Role-based authorization for admin and manager operations.
- Management APIs for users, roles, permissions, restaurants, categories, and foods.
- CSV/Excel export utilities.
- S3-compatible storage integration with presigned upload/download URLs.
- Scheduled cleanup services for stale uploaded files and exports.

## Tech Stack

- Java 21
- Spring Boot 3.5
- Spring Security (JWT + method security)
- Spring Data JPA + Hibernate
- MySQL
- AWS SDK v2 (S3-compatible storage)
- Apache POI + Super CSV
- Maven Wrapper

## Project Structure

```text
hungry-belly-backend/
  src/main/java/com/eddie/hungry_belly_backend/
    auth/
    user/
    role/
    permission/
    restaurant/
    category/
    food/
    common/
    security/
    scheduler/
  src/main/resources/application.yaml
  src/test/
```

## Requirements

- JDK 21
- MySQL 8+
- Maven 3.9+ (or use `mvnw`/`mvnw.cmd`)

## Environment Configuration

The backend loads local environment values from `.env` in this folder via:

```yaml
spring.config.import: optional:file:./.env[.properties]
```

Create `hungry-belly-backend/.env`:

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

## Run Locally

### Windows

```bash
mvnw.cmd spring-boot:run
```

### macOS/Linux/Git Bash

```bash
./mvnw spring-boot:run
```

Default API base path: `/api/v1`

## Security Model

- Public endpoints:
  - `POST /api/v1/auth/login`
  - `POST /api/v1/auth/refresh-token`
- Cookie-based auth token transport is supported (HTTP-only cookies).
- Stateless JWT security filter chain.
- Route and method-level authorization enabled (`@EnableMethodSecurity`).

Current role scope highlights:

- `users/**`: `ADMIN`
- `roles/**`:
  - `GET`: `ADMIN`, `MANAGER`
  - mutating methods: `ADMIN`
- `restaurants/**`: `ADMIN`, `MANAGER` (`DELETE` restricted to `ADMIN`)
- `foods/**`: `ADMIN`, `MANAGER`

## Main API Modules

- `/auth`: login, refresh token, logout, current user profile, account update
- `/users`: user CRUD, status updates, reset password, stats, export
- `/roles`: role CRUD and permissions linkage
- `/permissions`: permission listing
- `/restaurants`: restaurant CRUD, status updates, image workflows
- `/categories`: category CRUD, hierarchy, status updates, export
- `/foods`: food CRUD, listing, status updates, category mapping, image workflows
- `/storage`: temp upload sessions and presigned upload URLs

## Testing

Run tests:

```bash
./mvnw test
```

Notes:

- Test profile config is in `src/test/resources/application-test.yaml`.
- H2 is configured for test scope.

## Recent Backend Changes

- Added and refined food CRUD flows, including create/delete APIs and validation.
- Extended RBAC rules for food endpoints.
- Refactored lifecycle behavior toward hard-delete consistency.
- Improved pagination/query handling to reduce N+1 issues in listing flows.
- Added/refined scheduler cleanup services for exports and media.

## Useful Commands

```bash
# package
./mvnw clean package

# run tests only
./mvnw test

# run app
./mvnw spring-boot:run
```
