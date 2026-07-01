# Char Dham Travel — Production Deployment Guide

## Folder Structure (Deployment)

```
chardham-travel/
├── backend/                        # Railway deployment root
│   ├── config/                     # DB, Cloudinary, Nodemailer config
│   ├── controllers/                # Route handlers
│   ├── middleware/                  # Auth, error, upload middleware
│   ├── models/                     # Mongoose schemas
│   ├── routes/                     # Express routers
│   ├── services/                   # Email, invoice, token, report services
│   ├── templates/                  # HTML email templates
│   ├── uploads/                    # Temp upload directory (gitignored)
│   ├── utils/                      # Helpers, validators, constants
│   ├── validators/                 # express-validator rules
│   ├── app.js                      # Express app setup
│   ├── server.js                   # Entry point (DB connect → listen)
│   ├── package.json                # Dependencies & scripts
│   ├── .env.example                # Environment variable reference
│   └── .gitignore
│
├── frontend/                       # Vercel deployment root
│   ├── public/                     # Static assets
│   ├── src/                        # React application
│   ├── index.html                  # HTML entry
│   ├── vite.config.js              # Vite configuration
│   ├── vercel.json                 # Vercel SPA rewrites + headers
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
└── DEPLOYMENT.md                   # This file
```

---

## 1. Prerequisites

| Item | Required | How to Get |
|------|----------|------------|
| Node.js 18+ | Yes | `node --version` |
| npm 9+ | Yes | `npm --version` |
| Git repository | Yes | `git init` + push to GitHub/GitLab |
| Railway account | Yes | https://railway.app — "Deploy from GitHub repo" |
| Vercel account | Yes | https://vercel.com — "Import Git Repository" |
| MongoDB Atlas cluster | Yes | https://cloud.mongodb.com — Free M0 tier is sufficient |
| Cloudinary account | Yes | https://cloudinary.com — Free tier |
| Gmail App Password | For emails | Google Account → Security → 2FA → App Passwords |

---

## 2. MongoDB Atlas Setup

```bash
# 1. Create a free cluster at https://cloud.mongodb.com
#    - Provider: AWS, Region: Mumbai (ap-south-1) — lowest latency for India
#    - Cluster Tier: M0 Sandbox (free, 512 MB storage)

# 2. Create a database user
#    - Database Access → Add New User
#    - Username: chardham_admin
#    - Password: <generate a strong password>

# 3. Configure Network Access
#    - Network Access → Add IP Address
#    - For Railway: Allow All (0.0.0.0/0) — Railway uses dynamic IPs
#    - Keep "Include all current and future IPs" unticked

# 4. Get Connection String
#    - Cluster → Connect → Connect your application
#    - Driver: Node.js, Version: 4.1 or later
#    - Copy: mongodb+srv://<user>:<password>@<cluster>.mongodb.net/chardham?retryWrites=true&w=majority
#    - Replace <user> and <password> with your credentials
```

**Collections are created automatically** by Mongoose when the first document is inserted into each model. No manual setup needed.

---

## 3. Railway Backend Deployment

### 3.1 Prepare the Backend

```bash
cd backend

# 1. Ensure dependencies are installed
npm install

# 2. Test locally (set .env first)
cp .env.example .env
# Edit .env with your real values
npm start
# Verify: curl http://localhost:5000/api/health
```

### 3.2 Deploy to Railway

```bash
# Option A: Via Railway Dashboard (Recommended)
# 1. Push your repo to GitHub
# 2. Go to https://railway.app → New Project → Deploy from GitHub repo
# 3. Select your repository
# 4. Set Root Directory to 'backend'
# 5. Railway auto-detects Node.js and runs `npm start`

# Option B: Via Railway CLI
npm install -g @railway/cli
railway login
railway init
railway link
railway up --root-dir=backend
```

### 3.3 Set Environment Variables on Railway

In the Railway dashboard, navigate to your project → **Variables** and add:

| Variable | Value | Notes |
|----------|-------|-------|
| `PORT` | `5000` | Railway overrides this automatically |
| `NODE_ENV` | `production` | |
| `MONGO_URI` | `mongodb+srv://...` | Your Atlas connection string |
| `JWT_SECRET` | `<random 64-char hex>` | Generate: `openssl rand -hex 64` |
| `JWT_EXPIRES_IN` | `7d` | |
| `CLOUDINARY_CLOUD_NAME` | `your_cloud_name` | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | `your_api_key` | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | `your_api_secret` | From Cloudinary dashboard |
| `SMTP_HOST` | `smtp.gmail.com` | |
| `SMTP_PORT` | `587` | |
| `SMTP_USER` | `your_email@gmail.com` | Gmail address for sending emails |
| `SMTP_PASS` | `your_app_password` | Gmail App Password |
| `FRONTEND_URL` | `https://your-app.vercel.app` | Vercel frontend URL (set AFTER frontend deploy) |

> **Important:** Railway automatically assigns a `PORT` environment variable. Your `server.js` already uses `process.env.PORT || 5000`.

### 3.4 Verify Backend Deployment

```bash
# Railway provides a public URL like: https://chardham-travel-production.up.railway.app
# Test health endpoint:
curl https://your-railway-url.up.railway.app/api/health
# Expected: {"success":true,"message":"Char Dham Travel API is running"}
```

---

## 4. Vercel Frontend Deployment

### 4.1 Configure Environment

```bash
cd frontend

# Create .env (for local dev only)
cp .env.example .env
```

**Important:** The frontend uses `import.meta.env.VITE_API_URL` (defined in `src/utils/constants.js`). At build time, Vite injects this value. For production, set it in Vercel's environment variables.

### 4.2 Deploy to Vercel

```bash
# Option A: Via Vercel Dashboard (Recommended)
# 1. Go to https://vercel.com → Add New → Project
# 2. Import your Git repository
# 3. Set Root Directory to 'frontend'
# 4. Framework Preset: Vite (auto-detected)
# 5. Build Command: npm run build
# 6. Output Directory: dist
# 7. Add Environment Variable:
#    - Name: VITE_API_URL
#    - Value: https://your-railway-app.up.railway.app/api
# 8. Deploy

# Option B: Via Vercel CLI
npm install -g vercel
vercel login
vercel --cwd frontend --prod
```

### 4.3 Verify Frontend Deployment

```bash
# Open the Vercel-provided URL
# Test:
# - Home page loads without 404
# - Navigate to /packages, /hotels, /contact — all routes work (SPA rewrites)
# - Login/Register flow contacts the Railway backend
```

---

## 5. Post-Deployment Verification

### 5.1 End-to-End Test

```bash
# 1. Visit frontend URL
# 2. Register a new account
# 3. Check email for OTP (check spam folder)
# 4. Verify OTP → redirected to dashboard
# 5. Browse packages → click "Book Now"
# 6. Admin: Login as admin → approve booking
# 7. User: Download invoice
# 8. Contact: Submit contact form → email notification
```

### 5.2 Monitoring

```bash
# Railway: Dashboard → Deployments → View Logs
# Vercel: Dashboard → Project → Analytics / Logs
# MongoDB Atlas: Cluster → Monitoring → Real Time
```

---

## 6. Common Deployment Issues & Fixes

### Backend (Railway)

| Issue | Symptom | Fix |
|-------|---------|-----|
| **Port binding** | `EADDRINUSE` or Railway health check fails | `server.js` already uses `process.env.PORT`. Railway sets PORT automatically. |
| **MongoDB timeout** | `MongooseServerSelectionError` | Check `MONGO_URI` in Railway variables. Ensure Network Access allows `0.0.0.0/0`. |
| **CORS errors** | Browser console: `CORS policy: No 'Access-Control-Allow-Origin'` | Set `FRONTEND_URL` in Railway variables to the exact Vercel URL (no trailing slash). |
| **Email not sending** | OTP not received | Use Gmail App Password (not account password). Check spam folder. SMTP_PORT=587, secure=false. |
| **Module not found** | `Error: Cannot find module '...'` | Run `npm install` locally and push `package-lock.json`. Railway runs `npm install` automatically. |
| **Build fails** | `npm ERR!` during install | Check Node version in `engines` field. Railway uses Node 18+ by default. |
| **API returns 404** | All `/api/*` endpoints return 404 | Verify `app.js` route mounting. Check that `server.js` requires `app.js` correctly. |
| **Rate limiting** | `429 Too Many Requests` from some IPs | Rate limit is 100 requests per 15 minutes per IP. Normal usage should not hit this. |
| **JWT errors** | `JsonWebTokenError` or `TokenExpiredError` | Verify `JWT_SECRET` is set. If changed after deployment, all existing sessions are invalidated. |
| **Cloudinary uploads fail** | `CloudinaryResponse` errors | Verify `CLOUDINARY_*` variables. Ensure Cloudinary account is active. |

### Frontend (Vercel)

| Issue | Symptom | Fix |
|-------|---------|-----|
| **404 on page refresh** | Navigating to `/packages` directly shows 404 | `vercel.json` rewrites all routes to `/index.html`. Already configured. |
| **API calls fail** | Network tab shows failed requests to `/api/*` | Set `VITE_API_URL` in Vercel environment variables to the Railway URL + `/api`. Redeploy. |
| **Blank page** | Console shows JS errors | Check build logs. Ensure `VITE_API_URL` is set correctly. |
| **CORS errors** | Frontend can't reach backend | Backend CORS is configured via `FRONTEND_URL` env var. Ensure both URLs match exactly. |
| **Stale content** | Changes not reflected after deploy | Vercel caches aggressively. Check "Immutable" caching on assets in `vercel.json`. |
| **Environment variables missing** | `import.meta.env.VITE_API_URL` is `undefined` | Vite env vars must be prefixed with `VITE_`. Set in Vercel dashboard → Project → Environment Variables. |
| **Large bundle size** | Slow initial load | `vite.config.js` has manual chunks for vendor/motion/http separation. Already configured. |
| **Images not loading** | Broken image references | Use absolute URLs or Cloudinary URLs. Relative paths may break in production build. |

### MongoDB Atlas

| Issue | Symptom | Fix |
|-------|---------|-----|
| **Connection refused** | `Authentication failed` | Check username/password in `MONGO_URI`. URL-encode special characters in password. |
| **IP not whitelisted** | `connection timed out` | Add `0.0.0.0/0` to Network Access (required for Railway dynamic IPs). |
| **No free space** | `MongoError: documents too large` | M0 Sandbox has 512 MB. Monitor cluster usage. Upgrade tier if needed. |
| **Slow queries** | API responses are slow | Add indexes (already defined in Mongoose schemas). Check Atlas Performance Advisor. |

---

## 7. Production Checklist

- [ ] **Git**: Repository pushed to GitHub/GitLab with both `backend/` and `frontend/`
- [ ] **Secrets**: No `.env` files committed. All secrets stored in Railway/Vercel dashboard variables
- [ ] **MongoDB Atlas**: Cluster created, user configured, `0.0.0.0/0` whitelisted
- [ ] **MONGO_URI**: Connection string with real credentials set in Railway
- [ ] **JWT_SECRET**: Strong random value set in Railway (generate via `openssl rand -hex 64`)
- [ ] **Cloudinary**: Account active, API credentials set in Railway
- [ ] **SMTP**: Gmail App Password configured, OTP emails sending correctly
- [ ] **FRONTEND_URL**: Set to Vercel deployment URL in Railway variables
- [ ] **VITE_API_URL**: Set to Railway deployment URL + `/api` in Vercel variables
- [ ] **Railway**: Backend deploys successfully, `/api/health` returns 200
- [ ] **Vercel**: Frontend deploys successfully, all routes work (including deep links)
- [ ] **CORS**: Frontend can call all backend endpoints without CORS errors
- [ ] **Auth**: Register → verify OTP → login → session persists
- [ ] **Bookings**: Create booking (package + hotel), admin approves, user sees status update
- [ ] **Email**: OTP sent, booking confirmation sent, status update sent
- [ ] **Admin**: Dashboard loads, users/packages/hotels/bookings/contacts CRUD works
- [ ] **Analytics**: Admin analytics charts load with data
- [ ] **Invoice**: Booking invoice downloads as HTML
- [ ] **Rate Limiting**: API returns proper rate-limit errors when exceeded
- [ ] **Security**: JWT auth works, protected routes redirect to login, admin routes block non-admins
- [ ] **Logging**: Backend logs startup info, errors appear in Railway logs
- [ ] **Graceful Shutdown**: SIGTERM (sent by Railway) triggers graceful server close

---

## 8. Quick Reference — Railway & Vercel URLs

```
Backend (Railway):    https://chardham-travel-production.up.railway.app
Frontend (Vercel):    https://chardham-travel.vercel.app

Backend Health Check: https://chardham-travel-production.up.railway.app/api/health
API Base URL (VITE):  https://chardham-travel-production.up.railway.app/api
CORS Origin (FRONT):  https://chardham-travel.vercel.app
```

> Replace the placeholder URLs above with your actual deployment URLs after deploying.

---

## 9. Redeploying After Changes

```bash
# Backend: Push to GitHub → Railway auto-deploys
git add backend/
git commit -m "update backend"
git push

# Frontend: Push to GitHub → Vercel auto-deploys
git add frontend/
git commit -m "update frontend"
git push

# Force redeploy in Railway dashboard:
#   Deployments → "Redeploy" button
# Force redeploy in Vercel dashboard:
#   Project → Deployments → "..." → "Redeploy"
```
