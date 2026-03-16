# FutureYou Backend

Node.js + Express + MongoDB backend for the FutureYou NPS app.

## Setup

```bash
npm install
cp .env.example .env
# fill in MONGODB_URI and JWT_SECRET in .env
npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string for signing tokens |
| `JWT_EXPIRES_IN` | Token expiry e.g. `7d` |
| `IMAGE_GEN_API_URL` | External image generation API endpoint |
| `IMAGE_GEN_API_KEY` | API key for image generation |
| `ALLOWED_ORIGINS` | Comma-separated frontend URLs for CORS |

---

## App Flow

```
1. Open app
   └── POST /api/avatars/generate   ← send user photo
       └── returns { userId, avatars: { shocked_url, ... } }
           └── frontend stores userId in memory

2. Visual novel runs
   └── collects: name, age, employment, income, nps knowledge etc.

3. End of visual novel
   └── POST /api/auth/register      ← send all collected data + email + password + userId
       └── returns { token, user }
           └── frontend stores JWT in localStorage

4. Dashboard loads
   └── GET /api/users/me            ← Bearer token in header
       └── returns full user profile

5. User updates profile (complete onboarding page)
   └── PATCH /api/users/me          ← any fields
   └── PATCH /api/users/me/nps      ← NPS-specific fields

6. Login on return visit
   └── POST /api/auth/login         ← email + password
       └── returns { token, user }
```

---

## API Reference

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Register after visual novel |
| POST | `/api/auth/login` | — | Login |

### Avatars
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/avatars/generate` | — | Upload photo → generate aged poses |
| GET | `/api/avatars/:userId` | — | Get avatar URLs by userId |

### Users (all require Bearer token)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/users/me` | JWT | Get full profile |
| PATCH | `/api/users/me` | JWT | Update any profile fields |
| PATCH | `/api/users/me/nps` | JWT | Update NPS fields |
| PATCH | `/api/users/me/gamification` | JWT | Update score/streak/badges |
| POST | `/api/users/me/onboarding-response` | JWT | Save a single scene answer |
| DELETE | `/api/users/me` | JWT | Delete account |

### Health
| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Server + DB status check |

---

## Avatar Generation Stub

The `/api/avatars/generate` endpoint is wired up but stubs the actual
image generation if no `IMAGE_GEN_API_KEY` is set. It copies the original
photo into each pose slot so the visual novel works end-to-end immediately.

To integrate a real provider, edit the marked block in `routes/avatars.js`.
Recommended providers: **FAL.ai** (fast), **Replicate** (flexible).

## Folder Structure

```
futureyou-backend/
├── server.js
├── models/
│   └── User.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   └── avatars.js
├── middleware/
│   └── auth.js
├── assets/
│   └── <userId>/
│       ├── original.jpg
│       ├── shocked.jpg
│       ├── talking.jpg
│       ├── thinking.jpg
│       └── smiling.jpg
└── .env.example
```

## Deploying to Render (free tier)

1. Push to GitHub
2. New Web Service → connect repo
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add environment variables in Render dashboard
6. Use MongoDB Atlas free tier for the database
