# IQOO NavX — Backend API

> Production-ready TypeScript backend API for the **IQOO NavX** high-performance smartphone navigation prototype.

---

## ⚡ Architecture Overview

```
Frontend (React + Vite)
        ↓
IQOO NavX Backend API (Express + TypeScript)
        ↓
Service Layer (Routes, Places, Geocoding, AI)
        ↓
Supabase (Auth + PostgreSQL with Row-Level Security)
```

- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **Security:** Helmet, CORS (Origin restriction), Rate Limiting, Input Validation with Zod, JWT Session Verification
- **Database & Auth:** Supabase (PostgreSQL with RLS policies)
- **External Integrations:** Google Routes API v2, Google Places API v1, Google Geocoding, Google Gemini 1.5 Flash AI Assistant

---

## 🚀 Quick Start

### 1. Installation
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env` and provide your configuration:
```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `PORT` | Server listening port (default: `5000`) |
| `NODE_ENV` | `development`, `test`, or `production` |
| `FRONTEND_URL` | Allowed CORS frontend origin (e.g. `http://localhost:5173`) |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_PUBLISHABLE_KEY` | Public anon key for JWT verification |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only service role key |
| `GOOGLE_ROUTES_API_KEY` | Server-side Google Routes API key |
| `GOOGLE_PLACES_API_KEY` | Server-side Google Places API key |
| `GOOGLE_GEOCODING_API_KEY` | Server-side Google Geocoding API key |
| `GEMINI_API_KEY` | Server-side Google Gemini AI key |

> **Graceful Degradation:** If third-party keys are not provided during development, the backend automatically operates in an intelligent local simulation mode with precomputed POIs, vector math routing, and mock telemetry.

### 3. Running Locally
```bash
# Run in development mode with live watch:
npm run dev

# Run test suite:
npm test

# Build for production:
npm run build

# Start production server:
npm start
```

---

## 📡 API Endpoints Summary

All production API routes are versioned under `/api/v1/`:

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/health` | Server health & integration status | No |
| `POST` | `/api/v1/auth/session` | Verify active session | Yes |
| `GET` | `/api/v1/auth/me` | Get current pilot profile | Yes |
| `POST` | `/api/v1/auth/logout` | Session logout | No |
| `GET` | `/api/v1/places` | List user's saved places | Yes |
| `POST` | `/api/v1/places` | Create new saved place | Yes |
| `GET` | `/api/v1/places/:id` | Get saved place by ID | Yes |
| `PUT` | `/api/v1/places/:id` | Update saved place | Yes |
| `DELETE` | `/api/v1/places/:id` | Delete saved place | Yes |
| `GET` | `/api/v1/places/search` | Search places by text/coordinates | No |
| `GET` | `/api/v1/routes/recent` | List recent route logs | Yes |
| `POST` | `/api/v1/routes/recent` | Record completed trip | Yes |
| `DELETE` | `/api/v1/routes/recent/:id` | Delete recent trip log | Yes |
| `GET` | `/api/v1/preferences` | Get navigation preferences | Yes |
| `PUT` | `/api/v1/preferences` | Update navigation preferences | Yes |
| `POST` | `/api/v1/navigation/route` | Compute multi-matrix routes | No |
| `GET` | `/api/v1/geocode` | Address to coordinates | No |
| `GET` | `/api/v1/geocode/reverse-geocode` | Coordinates to address | No |
| `POST` | `/api/v1/ai/navigation-assistant` | Tactical Gemini AI route co-pilot | No |

For detailed request & response schemas, refer to [`docs/API.md`](docs/API.md).

---

## 🛡️ Security Architecture

1. **Server-Side Secret Isolation:** `GEMINI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and Google Maps API keys are NEVER exposed to client-side bundles.
2. **Row-Level Security (RLS):** Enabled on all user tables in PostgreSQL (`profiles`, `saved_places`, `recent_routes`, `navigation_preferences`). Users can never access or modify data belonging to other users.
3. **Strict Validation:** Every endpoint parameter, payload body, and query is validated with Zod schemas.
4. **Rate Limiting:** Protects API and AI quota from brute force and denial of service.
5. **Sanitizing Logger:** Automatically scrubs tokens, passwords, and API keys from production logs.
