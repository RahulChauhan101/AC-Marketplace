# servicewale-serviceman-web

React web app for ServiceWale servicemen. Deploy this folder to Vercel.

## Run locally

```bash
cd serviceman-web
npm install
npm run dev
```

From the monorepo root:

```bash
npm run serviceman-web:dev
```

## API

Set `VITE_API_URL` for production (example: `https://your-backend.com/api`).

Local default: `http://localhost:5000/api`

Start the backend first:

```bash
npm run backend:dev
```

## Login

Use a user account with role `serviceman`.
