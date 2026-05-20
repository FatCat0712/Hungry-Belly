# Copilot Instructions for Hungry Belly Backend

## Project Overview

- This is a Spring Boot REST API backend for an admin/operations platform in the food delivery and restaurant management domain.
- Core areas: authentication, users/roles/permissions, restaurants, restaurant members, categories, foods, storage upload workflows, and export jobs.
- API base prefix is configured via `api.prefix` (currently `/api/v1`).

## Tech Stack

- Language: Java 21 (`pom.xml` -> `java.version`)
- Framework: Spring Boot 3.5.x (parent `3.5.11`)
- Build tool: Maven (`mvnw`/`mvnw.cmd`)
- Key dependencies:
  - Spring Web
  - Spring Security
  - Spring Data JPA (Hibernate)
  - Validation (`spring-boot-starter-validation`)
  - Lombok
  - MySQL connector (runtime)
  - H2 (test scope)
  - JJWT (`jjwt-api`, `jjwt-impl`, `jjwt-jackson`)
  - AWS SDK v2 S3 client
  - springdoc OpenAPI
  - Apache POI + Super CSV
- Not currently used: MapStruct (mapping is manual in services/helpers)

## Architecture and Package Structure

Use package `com.eddie.hungry_belly_backend` (underscore style, not hyphenated).

### Core package responsibilities

- `auth/`: login/account workflows and restaurant access helper logic
- `security/`: Spring Security config, `UserDetails`, JWT filter and handlers
- `token/`: refresh token persistence and token issuance/refresh/logout logic
- `session/`: upload/session domain persistence
- `user/`, `role/`, `permission/`: identity and RBAC management modules
- `restaurant/`, `restaurantuser/`: restaurant CRUD and membership/role assignments
- `category/`, `food/`: catalog hierarchy and food item management
- `common/`: shared DTO wrappers, pagination helpers, exporters, storage helpers, reusable mappers/utilities
- `entity/`: JPA entities grouped by domain (`user`, `restaurant`, `food`, etc.)
- `exception/`: domain exceptions and global exception handler
- `scheduler/`: periodic cleanup jobs and cleanup services
- `config/`: OpenAPI, properties, and external service configuration

### Layer conventions

- Controllers in `*/controller/*Controller`
- Services in `*/service/*Service`
- Repositories in `*/repository/*Repository`
- DTOs in `*/dto/request/*Request` and `*/dto/response/*Response`
- Exceptions in `exception/**` with `*Exception` suffix

## Coding Conventions to Follow

### 1) Dependency injection

- Prefer constructor injection with `final` fields and Lombok `@RequiredArgsConstructor`.
- Avoid field injection (`@Autowired`) in new code.

**Do**

```java
@RequiredArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;
}
```

**Don't**

```java
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
}
```

### 2) Controller response format

- Return `ResponseEntity<ApiResponse<?>>` from controllers.
- Wrap payloads with `ApiResponse.success/create/done/error`.
- Set HTTP status from `ApiResponse#getStatus` (project pattern).

**Do**

```java
@GetMapping("/{id}")
public ResponseEntity<ApiResponse<?>> getById(@PathVariable Long id) {
    var dto = service.findById(id);
    ApiResponse<?> body = ApiResponse.success(dto, "Fetched successfully");
    return ResponseEntity.status(body.getStatus()).body(body);
}
```

**Don't**

```java
@GetMapping("/{id}")
public UserResponse getById(@PathVariable Long id) {
    return service.findById(id);
}
```

### 3) Validation and DTO boundaries

- Use request/response DTOs; do not expose JPA entities directly in API contracts.
- Annotate request DTOs with Jakarta Validation constraints.
- Use `@Valid` in controller method parameters.

### 4) Exception handling

- Throw typed domain exceptions from services (`BadRequestException`, `NotFoundException`, etc.).
- Let `GlobalExceptionHandler` (`@RestControllerAdvice`) convert exceptions to `ApiResponse.error`.
- Do not build ad-hoc error payloads in controllers.

**Do**

```java
if (exists) {
    throw new BadRequestException("email: Email already exists");
}
```

**Don't**

```java
if (exists) {
    return ResponseEntity.badRequest().body(Map.of("message", "Email already exists"));
}
```

### 5) Security and authorization

- Authentication is JWT-based (access + refresh), transported via HTTP-only cookies.
- API is stateless (`SessionCreationPolicy.STATELESS`) with JWT filter.
- Enforce authorization in both places when needed:
  - route-level rules in `SecurityConfig`
  - method-level checks (`@PreAuthorize`) in services
- For restaurant ownership/membership rules, use `RestaurantAuthorizationService` for business checks.

### 6) Mapping and pagination

- Prefer explicit/manual mapping methods in services for DTO conversion.
- For paged endpoints, use `PageRequestDto`, `PaginationUtils`, and `PageMapper.toPageResponse(...)`.
- Keep the ID-first pagination pattern (page IDs, then bulk fetch details) for heavy list endpoints.

### 7) Entity design

- Use JPA relationships with explicit ownership and join tables.
- Current model uses hard deletes and toggle fields like `enabled` / `isAvailable` (no global soft-delete/auditing base class detected).
- Keep entity field names and table mappings consistent with existing style.

## Security Patterns (Current Project)

- Login authenticates via `AuthenticationManager`, then issues access and refresh JWTs.
- Refresh token is also stored server-side and rotated in `TokenService`.
- JWT includes user id and role claims.
- Public endpoints include login, refresh token, and OpenAPI docs; remaining endpoints require authentication.

## Testing Conventions

- Test framework: JUnit 5 + Spring Boot Test + AssertJ.
- Repository tests use `@DataJpaTest` and `@ActiveProfiles("test")` with H2 from `application-test.yaml`.
- Includes a `@SpringBootTest` context-load test.
- No broad Mockito/Testcontainers pattern detected.

## Additional Consistent Patterns

- OpenAPI annotations are used on controllers (`@Tag`, `@Operation`).
- Lombok is used heavily for DTOs/entities.
- Export flow uses strategy abstraction (`ExportStrategy`, CSV/Excel exporters).
- Storage links are generated as temporary download URLs through `StorageService`.

## Practical Guidance for Copilot Suggestions

When generating code in this repository:

1. Place files in the correct module package (`<domain>/controller|service|repository|dto`).
2. Keep API endpoints under `${api.prefix}` unless a module already intentionally uses a fixed path.
3. Return `ApiResponse` wrappers from controllers.
4. Add service-level authorization (`@PreAuthorize`) for protected business actions.
5. Use project-specific exception classes and let the global handler map responses.
6. Prefer constructor injection with `@RequiredArgsConstructor`.
7. Add or extend JUnit 5 tests matching existing style when introducing repository behavior.
