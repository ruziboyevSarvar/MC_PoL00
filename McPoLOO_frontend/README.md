# Mc PoLOO Frontend

Next.js + TypeScript + Tailwind CSS premium product catalog.

## Pages

- `/` - homepage with hero, categories, products, about and contact placeholder.
- `/catalog` - searchable, filterable product catalog.
- `/catalog/[slug]` - SEO-friendly category catalog.
- `/products/[slug]` - product gallery, price, model, attributes and related products.
- `/admin` - JWT-based admin panel for products and categories.

The UI avoids cart, checkout, payment and customer login by design.

## Environment

```text
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_ASSET_URL=http://localhost:8080
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_CONTACT_PHONE=
NEXT_PUBLIC_CONTACT_TELEGRAM=
NEXT_PUBLIC_CONTACT_INSTAGRAM=
NEXT_PUBLIC_CONTACT_ADDRESS=
NEXT_PUBLIC_WORKING_HOURS=
```

`NEXT_PUBLIC_DEMO_MODE=true` makes the public catalog use bundled static products. Keep it enabled when deploying only the frontend to Vercel. Set `NEXT_PUBLIC_DEMO_MODE=false` only after the backend API is deployed and seeded.
