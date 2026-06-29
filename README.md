# ServiceWale

Monorepo for ServiceWale with backend APIs, customer web, customer mobile app, and placeholders for serviceman/admin apps.

## Folder Structure

```txt
backend/         Node.js, Express, MongoDB and Razorpay APIs
customer-web/    React + Tailwind customer website
customer-app/    Expo React Native customer app
serviceman-app/  Expo React Native mobile app for servicemen (Android/iOS)
serviceman-web/  React web app for servicemen (Vercel deploy)
admin-panel/     React admin dashboard
docs/            API, schema and roadmap documentation
```

## Common Commands

```bash
npm run backend:dev
npm run customer-web:dev
npm run customer-app:start
npm run serviceman-app:start
npm run serviceman-web:dev
```

`serviceman-app` is the mobile Expo project. `serviceman-web` is the browser app for Vercel.

Backend environment variables live in `backend/.env`.
