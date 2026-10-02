# Wishora - Deployment Guide (Vercel Frontend + Render Backend)

This guide walks you through deploying **Wishora** with the **Frontend** hosted on **Vercel** and the **Backend REST API** hosted on **Render**.

---

## 🏗 Architecture Overview

```text
               ┌───────────────────────────┐
               │    Vercel (Frontend)      │
               │    wishora.vercel.app     │
               └─────────────┬─────────────┘
                             │
                  REST API & │ Supabase
                  Auth Token │ Bearer JWT
                             ▼
               ┌───────────────────────────┐
               │    Render (Backend API)   │
               │  wishora-api.onrender.com │
               └─────────────┬─────────────┘
                             │
                             ▼
               ┌───────────────────────────┐
               │     Supabase Database     │
               │  (PostgreSQL, Auth, RLS)  │
               └───────────────────────────┘
```

---

## 🚀 Step 1: Deploy Backend to Render

1. **Log in to Render**: Go to [render.com](https://render.com) and sign in with GitHub.
2. **Create a New Web Service**:
   - Click **New +** $\rightarrow$ **Web Service**.
   - Connect your **Wishora** GitHub repository.
3. **Configure the Service**:
   - **Name**: `wishora-backend` (or your choice).
   - **Root Directory**: `backend` *(⚠️ Important!)*
   - **Environment**: `Node`
   - **Region**: Choose the region closest to your users.
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
4. **Set Environment Variables** (in the *Environment* tab on Render):
   | Variable | Value | Description |
   | :--- | :--- | :--- |
   | `PORT` | `5000` | Server listening port |
   | `NODE_ENV` | `production` | Environment mode |
   | `FRONTEND_URL` | `https://your-wishora.vercel.app,http://localhost:3000` | Allowed CORS origins |
   | `SUPABASE_URL` | `https://sosnzmnqlviebudytydi.supabase.co` | Your Supabase project URL |
   | `SUPABASE_ANON_KEY` | `sb_publishable_...` | Supabase Anon Key |
   | `SUPABASE_SERVICE_ROLE_KEY` | `your-service-role-key` | *(Optional but recommended for full backend access)* |
   | `ADMIN_EMAIL` | `your-email@gmail.com` | Administrator email |
5. **Deploy**:
   - Click **Create Web Service**.
   - Once deployed, copy your Render URL: e.g. `https://wishora-backend.onrender.com`.
   - Verify health: Open `https://wishora-backend.onrender.com/health` in your browser. You should see `{"status":"ok"}`.

---

## ⚡ Step 2: Deploy Frontend to Vercel

1. **Log in to Vercel**: Go to [vercel.com](https://vercel.com).
2. **Import Project**:
   - Click **Add New...** $\rightarrow$ **Project**.
   - Select your **Wishora** repository.
3. **Configure Root Directory**:
   - Click **Edit** next to **Root Directory**.
   - Select the `frontend` folder *(⚠️ Important!)*.
4. **Framework Preset**:
   - Vercel will automatically detect `Next.js`.
5. **Set Environment Variables** in Vercel:
   | Variable | Value | Description |
   | :--- | :--- | :--- |
   | `NEXT_PUBLIC_API_URL` | `https://wishora-backend.onrender.com` | Your deployed Render backend URL |
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://sosnzmnqlviebudytydi.supabase.co` | Your Supabase project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_...` | Your Supabase Anon Key |
   | `ADMIN_EMAIL` | `your-email@gmail.com` | Administrator email |
   | `NEXT_PUBLIC_APP_URL` | `https://your-wishora.vercel.app` | Production frontend domain |
6. **Deploy**:
   - Click **Deploy**.
   - After deployment completes, copy your live Vercel URL (e.g. `https://wishora.vercel.app`).

---

## 🔄 Step 3: Update Render CORS with Vercel Domain

1. Go back to your [Render Dashboard](https://dashboard.render.com/) $\rightarrow$ **wishora-backend** $\rightarrow$ **Environment**.
2. Update `FRONTEND_URL` to include your live Vercel URL:
   ```text
   FRONTEND_URL=https://wishora.vercel.app,http://localhost:3000
   ```
3. Save changes. Render will automatically redeploy with the updated CORS policy.

---

## 💻 Local Development Workflow

Run both frontend and backend concurrently on your local machine:

### Terminal 1 - Backend (Port 5000):
```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend (Port 3000):
```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.
