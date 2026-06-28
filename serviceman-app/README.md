# servicewale-serviceman-app

Expo React Native mobile app for ServiceWale servicemen.

This project is **mobile-only**. Do not deploy it to Vercel. Use Expo for local development and Android/iOS builds.

## Run locally

```bash
cd serviceman-app
npm install
npm run android
```

From the monorepo root:

```bash
npm run serviceman-app:start
```

## API

The app talks to the backend at `http://10.0.2.2:5000/api` on Android emulator. Start the backend first:

```bash
npm run backend:dev
```

## Login

Use a user account with role `serviceman`.
