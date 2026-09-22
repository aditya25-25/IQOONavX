# IQOO NavX — Backend API Specification (v1)

Base URL: `http://localhost:5000/api/v1`

---

## 1. Authentication (`/auth`)

### `POST /api/v1/auth/session`
Validates an active Supabase session token.
- **Headers:** `Authorization: Bearer <supabase_token>`
- **Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "pilot@iqoo-navx.dev",
      "full_name": "iQOO Monster Pilot"
    },
    "authenticated": true
  }
}
```

### `GET /api/v1/auth/me`
Retrieves current authenticated pilot profile.
- **Headers:** `Authorization: Bearer <supabase_token>`
- **Response (200):**
```json
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "email": "pilot@iqoo-navx.dev" }
  }
}
```

---

## 2. Saved Places (`/places`)

### `GET /api/v1/places`
List all saved locations for the authenticated user.
- **Headers:** `Authorization: Bearer <supabase_token>`

### `POST /api/v1/places`
Save a new favorite location.
- **Headers:** `Authorization: Bearer <supabase_token>`
- **Request Body:**
```json
{
  "name": "iQOO Arena Gate 1",
  "latitude": 28.5355,
  "longitude": 77.3910,
  "address": "Grand Velocity Boulevard",
  "category": "track"
}
```

### `PUT /api/v1/places/:id`
Updates a saved location.

### `DELETE /api/v1/places/:id`
Deletes a saved location.

### `GET /api/v1/places/search`
Searches places via Google Places API or POI cache.
- **Query Params:** `q=query_text`, `lat=number`, `lng=number`

---

## 3. Navigation & Routing (`/navigation`)

### `POST /api/v1/navigation/route`
Computes optimal primary and alternative navigation paths with turn-by-turn maneuvers.
- **Request Body:**
```json
{
  "origin": { "latitude": 28.4595, "longitude": 77.0266 },
  "destination": { "latitude": 28.5355, "longitude": 77.3910 },
  "travelMode": "driving",
  "monsterOptimization": true
}
```
- **Response (200):**
```json
{
  "success": true,
  "data": {
    "primaryRoute": {
      "distanceMeters": 12800,
      "durationSeconds": 840,
      "distanceText": "12.8 km",
      "durationText": "14 mins",
      "polyline": "encoded_polyline_geometry",
      "steps": [
        {
          "instruction": "Head northeast on the primary corridor",
          "distanceText": "3.2 km",
          "durationText": "3 mins",
          "maneuver": "straight",
          "streetName": "Cyber Expressway Axis"
        }
      ],
      "trafficLevel": "smooth",
      "tag": "monster_boost"
    },
    "alternatives": [],
    "provider": "google_routes",
    "isCachedOfflineReady": true
  }
}
```

---

## 4. Recent Routes (`/routes/recent`)

### `GET /api/v1/routes/recent`
Lists recent trip history.
- **Headers:** `Authorization: Bearer <supabase_token>`
- **Query Params:** `limit=number` (default: 10)

### `POST /api/v1/routes/recent`
Logs a completed trip.
- **Headers:** `Authorization: Bearer <supabase_token>`
- **Request Body:**
```json
{
  "source_name": "Apex Cyber Heights",
  "destination_name": "iQOO Monster Esports Arena",
  "distance": 14.2,
  "duration": 18,
  "travel_mode": "driving"
}
```

---

## 5. Navigation Preferences (`/preferences`)

### `GET /api/v1/preferences`
Retrieves navigation customization settings for the authenticated user.

### `PUT /api/v1/preferences`
Updates navigation settings.
- **Request Body:**
```json
{
  "voice_enabled": true,
  "dark_mode": true,
  "travel_mode": "two_wheeler",
  "monster_mode_enabled": true,
  "speed_unit": "km/h",
  "voice_language": "en-US"
}
```

---

## 6. Geocoding (`/geocode`)

### `GET /api/v1/geocode?address=...`
Converts address into `{ latitude, longitude }`.

### `GET /api/v1/geocode/reverse-geocode?lat=...&lng=...`
Converts coordinates into formatted address string.

---

## 7. AI Navigation Assistant (`/ai`)

### `POST /api/v1/ai/navigation-assistant`
Generates tactical real-time driving advice via Gemini 1.5.
- **Request Body:**
```json
{
  "destination": "iQOO Monster Esports Arena",
  "travelMode": "driving",
  "routeSummary": {
    "distance": "12.8 km",
    "duration": "14 mins",
    "trafficCondition": "smooth"
  },
  "userQuery": "Recommend optimal flyover lane strategy."
}
```
- **Response (200):**
```json
{
  "success": true,
  "data": {
    "available": true,
    "assistantReply": "Take the right-most flyover lane on Cyber Expressway to bypass signal congestion at Sector 24.",
    "suggestedAction": "continue",
    "confidenceScore": 0.96,
    "tips": ["Stay in right-lane on ramp", "144Hz vector interpolation active"],
    "provider": "gemini-1.5-flash"
  }
}
```

---

## 8. Health Check (`/health`)

### `GET /health`
Returns system status and connected integration states.
