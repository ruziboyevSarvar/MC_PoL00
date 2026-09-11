# Mc PoLOO Backend

Existing Maven Spring Boot project extended according to the TZ.

## Packages

- `controller` - public catalog, admin CRUD, auth and uploads.
- `service` - business logic, slugging, filtering, storage.
- `repository` - Spring Data JPA repositories.
- `domain` - JPA entities.
- `enums` - product status and admin role enums.
- `dto` - request/response contracts.
- `security` - JWT authentication and admin user details.
- `config` - security, static files and seed data.

## API

Public:

- `GET /api/products`
- `GET /api/products/{id}`
- `GET /api/products/slug/{slug}`
- `GET /api/products/slug/{slug}/related`
- `GET /api/categories`
- `GET /api/categories/{slug}/products`

Admin:

- `POST /api/auth/login`
- `GET /api/admin/products`
- `POST /api/admin/products`
- `PUT /api/admin/products/{id}`
- `DELETE /api/admin/products/{id}`
- `GET /api/admin/categories`
- `POST /api/admin/categories`
- `PUT /api/admin/categories/{id}`
- `DELETE /api/admin/categories/{id}`
- `POST /api/admin/uploads/images`

## Render Deploy

The root `render.yaml` deploys this backend as a Docker web service and attaches PostgreSQL.

Required production environment variables:

```text
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=jdbc:postgresql://HOST:PORT/DATABASE
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=secure-password
JPA_DDL_AUTO=update
JWT_SECRET=long-random-secret-at-least-32-characters
ADMIN_USERNAME=admin
ADMIN_PASSWORD=secure-admin-password
FRONTEND_ORIGINS=https://mcpoloo-frontend.onrender.com,http://localhost:3000
ACDN_S3_ENDPOINT=https://storage.acdn.uz
ACDN_S3_REGION=uz
ACDN_S3_BUCKET=my-mcpoloo-storage
ACDN_S3_ACCESS_KEY=...
ACDN_S3_SECRET_KEY=...
ACDN_CDN_BASE_URL=https://uzbpower.vvv.uz
```

Docker deployments also accept provider-style URLs such as `postgres://user:password@host:port/database`; the entrypoint converts them before Spring Boot starts.

The first admin user is created from `ADMIN_USERNAME` and `ADMIN_PASSWORD` when the database is empty. In the production profile, `ADMIN_PASSWORD` must be provided through the deployment environment.

After deployment, the frontend must point to the backend:

```text
NEXT_PUBLIC_API_URL=https://mcpoloo-backend.onrender.com/api
NEXT_PUBLIC_ASSET_URL=https://uzbpower.vvv.uz
NEXT_PUBLIC_DEMO_MODE=false
```
