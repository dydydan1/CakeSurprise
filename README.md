# Frosted Whispers

Every cake carries a message.

## Feature 1: Project foundation

This repository contains separate frontend and backend applications.

### Prerequisites

- Node.js 20 or later
- MySQL 8 or later

### Setup

1. Copy `.env.example` to `backend/.env` and update the database values.
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

