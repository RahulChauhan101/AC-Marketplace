# servicewale-serviceman-app

Expo React Native **mobile app** for ServiceWale servicemen (Android/iOS).

For the browser version, use **`serviceman-web`**.

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

The app talks to the backend at `http://10.0.2.2:5000/api` on Android emulator.

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
