# Booking flow api 

REST API for event management and seat booking. Built with Express, TypeScript, and MongoDB.

## Prerequisites

- Node.js
- MongoDB (local instance with replica set enabled — see `MONGODB_URL` in `.example.env`)
- pnpm or npm

## Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Copy the example env file and adjust values as needed:

   ```bash
   cp .example.env .env
   ```

3. Start the dev server:

   ```bash
   pnpm dev
   ```

The API runs at `http://localhost:3000` by default.

## Environment variables

| Variable         | Description                                      | Example                                              |
| ---------------- | ------------------------------------------------ | ---------------------------------------------------- |
| `PORT`           | Server port                                      | `3000`                                               |
| `MONGODB_URL`    | MongoDB connection string                        | `mongodb://localhost:27017/booking?replicaSet=rs0` |
| `ACCESS_SECRET`  | JWT access token secret                          | `accessSecret`                                       |
| `REFRESH_SECRET` | JWT refresh token secret                         | `refreshSecret`                                      |
| `CORS_ORIGIN`    | Allowed frontend origin for CORS                 | `http://localhost:5173`                              |

## Scripts

| Command            | Description                    |
| ------------------ | ------------------------------ |
| `pnpm dev`         | Start dev server with hot reload |
| `pnpm build`       | Compile TypeScript             |
| `pnpm start`       | Run production build           |
| `pnpm test`        | Run tests                      |
| `pnpm lint`        | Lint source files              |

## API routes

Base URL: `/api/v1`

### Health check

| Method | Path | Auth | Description        |
| ------ | ---- | ---- | ------------------ |
| GET    | `/`  | No   | Server health check |

### Auth — `/api/v1/auth`

| Method | Path                        | Auth | Description              |
| ------ | --------------------------- | ---- | ------------------------ |
| POST   | `/signUp`                   | No   | Register a new user      |
| POST   | `/login`                    | No   | Log in                   |
| GET    | `/refresh-token`            | No   | Refresh access token     |
| GET    | `/forget-password/:email`   | No   | Request password reset   |
| PATCH  | `/reset-password/:token`    | No   | Reset password with token |
| GET    | `/me`                       | Yes  | Get current user details |
| PATCH  | `/change-password`          | Yes  | Change password          |
| POST   | `/logout`                   | Yes  | Log out                  |

### Events — `/api/v1/event`

| Method | Path   | Auth | Description        |
| ------ | ------ | ---- | ------------------ |
| GET    | `/`    | No   | List all events    |
| POST   | `/`    | No   | Create an event    |
| GET    | `/:id` | No   | Get event details  |
| PATCH  | `/:id` | No   | Update an event    |

**Create event body:** `name`, `venue`, `date`, `totalSeats`

### Bookings — `/api/v1/booking`

Requires authentication and `user` role.

| Method | Path                    | Auth | Description              |
| ------ | ----------------------- | ---- | ------------------------ |
| POST   | `/:eventId/reserve`     | Yes  | Reserve seats for an event |
| PATCH  | `/:eventId/confirm`     | Yes  | Confirm a reservation      |
| GET    | `/`                     | Yes  | Get reserved seats         |

**Reserve body:** `{ "seatIds": ["..."] }`

## Static files

Uploaded files are served at `/uploads`.
