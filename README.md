# AC Service Marketplace

Monorepo for an AC service marketplace with backend APIs, customer web, customer mobile app, and placeholders for serviceman/admin apps.

## Folder Structure

```txt
backend/         Node.js, Express, MongoDB and Razorpay APIs
customer-web/    React + Tailwind customer website
customer-app/    Expo React Native customer app
serviceman-app/  Serviceman app scaffold
admin-panel/     Admin panel scaffold
docs/            API, schema and roadmap documentation
```

## Common Commands

```bash
npm run backend:dev
npm run customer-web:dev
npm run customer-app:start
```

Backend environment variables live in `backend/.env`.
