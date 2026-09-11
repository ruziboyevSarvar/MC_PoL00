# Mc PoLOO Product Catalog

Premium sanitary ware product catalog built from the attached TZ.

## Structure

- `McPoLOO_frontend` - Next.js, TypeScript, Tailwind CSS public catalog and admin UI.
- `McPoLOO_backend` - existing Maven Spring Boot backend with Java package layers: `controller`, `service`, `repository`, `domain`, `enums`, `dto`, `security`, `config`.

## What is included

- Public homepage, catalog, category pages, search, filters, sorting and product details.
- Premium product-card-first visual identity with responsive 2/3/4-5 grid.
- Loading skeletons, empty state, error page and image fallback.
- SEO metadata, `robots.txt`, `sitemap.xml`, product JSON-LD and slug URLs.
- Admin JWT login, product/category CRUD endpoints, status handling and image upload endpoint.
- PostgreSQL-backed data model for products, categories, gallery images, attributes and admin users.

## What is intentionally excluded

Cart, checkout, online ordering, payment and customer login are not implemented, per TZ.

## Run Backend Locally

Install JDK 21 first, then run the existing Maven backend in `McPoLOO_backend`:

```powershell
cd McPoLOO_backend
.\mvnw.cmd spring-boot:run
```

The default profile uses in-memory H2 so the project starts immediately for local development. Demo catalog data and the default admin account are seeded automatically:

```text
Username: admin
Password: admin12345
```

For PostgreSQL production/staging, run with the `prod` profile and set real secrets:

```text
DATABASE_URL=jdbc:postgresql://localhost:5432/mcpoloo
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
JWT_SECRET=replace-with-a-long-secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=replace-with-a-secure-admin-password
FRONTEND_ORIGIN=http://localhost:3000
```

```powershell
cd McPoLOO_backend
$env:SPRING_PROFILES_ACTIVE="prod"
.\mvnw.cmd spring-boot:run
```

## Run Frontend

```powershell
cd McPoLOO_frontend
npm install
npm run dev
```

Create `.env.local` for backend and public contact configuration. Do not hardcode unverified business details in source code.

```text
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_ASSET_URL=http://localhost:8080
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_CONTACT_PHONE=
NEXT_PUBLIC_CONTACT_ADDRESS=
NEXT_PUBLIC_WORKING_HOURS=
```

## Render Deployment

You can deploy both frontend and backend on Render with the included root-level `render.yaml`.

Render will create:

- `mcpoloo-frontend` - Next.js web service.
- `mcpoloo-backend` - Spring Boot Docker web service.
- `mcpoloo-db` - PostgreSQL database.

Steps:

1. Push the latest repository to GitHub.
2. Open Render Dashboard.
3. Click New, then Blueprint.
4. Select this GitHub repository.
5. Render will read `render.yaml`.
6. During setup, enter secure `ADMIN_PASSWORD`, `ACDN_S3_ACCESS_KEY`, and `ACDN_S3_SECRET_KEY` values.
7. Deploy the blueprint.

The frontend is configured to call:

```text
NEXT_PUBLIC_API_URL=https://mcpoloo-backend.onrender.com/api
NEXT_PUBLIC_ASSET_URL=https://uzbpower.vvv.uz
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_SITE_URL=https://mcpoloo-frontend.onrender.com
```

If Render changes the generated service domains, update those three frontend environment variables in the `mcpoloo-frontend` service and redeploy it.

The Docker entrypoint accepts both `jdbc:postgresql://...` and hosting-provider `postgres://...` database URLs.

The backend CORS setting allows the Render frontend and local development:

```text
FRONTEND_ORIGINS=https://mcpoloo-frontend.onrender.com,http://localhost:3000
```

## Verify

```powershell
cd McPoLOO_backend
.\mvnw.cmd test

cd ..\McPoLOO_frontend
npm run typecheck
npm run build
```
