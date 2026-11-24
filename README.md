# crumbcoded

Baked with Love, Coded for You.

This repository contains the frontend and backend for creating personalized messages, generating themed QR cards, and revealing those messages through a shareable QR link.

### Prerequisites

- Node.js 20.19 through 24
- MySQL 8 or later

### Setup

1. Copy `backend/.env.example` to `backend/.env` and update the database values.
2. Copy `frontend/.env.example` to `frontend/.env`.
3. Install dependencies in both `backend` and `frontend`.
4. Start the backend with `npm run dev` from `backend`.
5. Start the frontend with `npm run dev` from `frontend`.

The health endpoint is available at `GET http://localhost:5000/api/health`.

### Authentication setup

1. Run `npm run migrate` from `backend`.
2. Add `ADMIN_EMAIL`, `ADMIN_NAME`, and a 12+ character `ADMIN_PASSWORD` to `backend/.env`.
3. Run `npm run seed:admin` from `backend`.
4. Remove `ADMIN_PASSWORD` from `backend/.env` after the seed succeeds.
5. Start both applications and open `http://localhost:5173/login`.

## Deployment readiness

Deploy the backend and database to Railway first, then deploy the frontend to Vercel.

### Railway

1. Create a Railway project and add a MySQL service.
2. Add a service from this GitHub repository and set its root directory to `/backend`.
3. Keep the detected start command as `npm start` and generate a public domain.
4. Set the healthcheck path to `/api/health`.
5. Add these backend variables. Replace `MySQL` if the database service has a different name:

```text
NODE_ENV=production
CLIENT_ORIGIN=https://your-vercel-domain.vercel.app
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_NAME=${{MySQL.MYSQLDATABASE}}
DB_USER=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
SESSION_HOURS=8
```

Do not set `PORT`; Railway provides it. Run `npm run migrate` against the Railway environment before opening the application. Run `npm run seed:admin` once with temporary `ADMIN_EMAIL`, `ADMIN_NAME`, and `ADMIN_PASSWORD` variables, then remove those three variables.

### Vercel

1. Import the same GitHub repository and set the root directory to `frontend`.
2. Keep the detected Vite build command (`npm run build`) and output directory (`dist`).
3. Set `VITE_API_BASE_URL` to `https://your-railway-domain.up.railway.app/api`.
4. Deploy, then update Railway's `CLIENT_ORIGIN` to the exact HTTPS Vercel production URL and redeploy the backend.
5. Verify login, greeting creation, QR generation, the public surprise URL, and the themed QR card download.

The frontend's `vercel.json` keeps React Router pages such as `/dashboard` and `/surprise/:token` working when opened or refreshed directly.

