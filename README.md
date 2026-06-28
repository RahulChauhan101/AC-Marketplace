# ServiceWale

Monorepo for ServiceWale with backend APIs, customer web, customer mobile app, and placeholders for serviceman/admin apps.

## Folder Structure

```txt
backend/         Node.js, Express, MongoDB and Razorpay APIs
customer-web/    React + Tailwind customer website
customer-app/    Expo React Native customer app
serviceman-app/  Expo React Native app for servicemen (mobile only, not Vercel)
admin-panel/     React admin dashboard
docs/            API, schema and roadmap documentation
```

## Common Commands

```bash
npm run backend:dev
npm run customer-web:dev
npm run customer-app:start
npm run serviceman-app:start
```

`serviceman-app` is the **servicewale-serviceman-app** Expo mobile project. Run it with Expo (`npm run serviceman-app:start` or `npm run android` inside `serviceman-app`). It is not deployed to Vercel.

Backend environment variables live in `backend/.env`.
