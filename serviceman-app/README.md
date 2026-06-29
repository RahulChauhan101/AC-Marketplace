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

| Platform | Backend URL |
|----------|-------------|
| Android emulator | `http://10.0.2.2:5000/api` |
| Expo Web (`localhost:8082`) | `http://localhost:5000/api` |

Start the backend first:

```bash
npm run backend:dev
```

If login fails on emulator, run:

```bash
adb reverse tcp:5000 tcp:5000
```

## Login

Use a user account with role `serviceman`.
