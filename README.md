# Hungry Belly

Hungry Belly is a full-stack admin platform for managing users, roles, restaurants, categories, foods, authentication, and media uploads for a food delivery system.

## Overview

This repository contains:

- `hungry-belly-backend` - Spring Boot REST API
- `hungry-belly-frontend` - React + Vite admin dashboard
- `resources` - project assets, including the database schema

## Database Schema

![Hungry Belly schema](resources/Hungery%20Belly.jpg)

## What Makes It Stand Out

- **Secure by design** - JWT authentication, refresh-token flow, cookie support, and protected routes create a production-ready admin experience.
- **Granular access control** - role- and permission-based authorization helps separate admin and operational responsibilities cleanly.
- **End-to-end admin operations** - a single platform to manage users, roles, restaurants, categories, and foods with a consistent workflow.
- **Scalable media uploads** - pre-signed URL uploads and temporary upload sessions reduce backend load and support a cleaner file pipeline.
- **Export-ready back office** - built-in CSV and Excel export flows make operational data easier to review and share.
- **Operational hygiene** - scheduled cleanup jobs help keep temporary uploads and generated files under control.

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Backend | Java 21, Spring Boot 3.5, Spring Security, Spring Data JPA, MySQL |
| Frontend | React 19, Vite, React Router, TanStack Query, Axios, Bootstrap |
| Storage & export | S3-compatible object storage, Apache POI, Super CSV |

## Repository Structure

```text
hungry-belly/
|-- hungry-belly-backend/
|-- hungry-belly-frontend/
`-- resources/
```

## Getting Started

### Prerequisites

- Java 21
- Node.js 20+
- MySQL 8+

### Backend Setup

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

Run the API:

```bash
mvnw.cmd spring-boot:run
```

### Frontend Setup

Create `hungry-belly-frontend\.env`:

```env
VITE_API_URL=http://localhost:8080/api/v1
```

Install dependencies and start the app:

```bash
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` by default.

## Useful Commands

### Backend

```bash
mvnw.cmd test
mvnw.cmd spring-boot:run
```

### Frontend

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## API Surface

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

## Notes

- The backend loads local configuration from `hungry-belly-backend\.env`
- The default frontend API target is `http://localhost:8080/api/v1`
- The frontend sends credentials with requests so authentication cookies are included
