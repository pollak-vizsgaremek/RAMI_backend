# RAMI – Rate My Instructor 🚗

Autósoktató-értékelő közösségi platform. A tanulók valós értékelések alapján választhatnak oktatót türelem, szaktudás, kommunikáció és rugalmasság szempontjai szerint – szóbeli ajánlások helyett.

---

## Technológiák

**Backend:** Node.js · TypeScript · Express.js v5 · MongoDB / Mongoose · JWT · node-cron  
**Frontend:** React 19 · Vite · TailwindCSS v4 · MUI · Axios · Playwright

---

## Telepítés

### Backend
```bash
cd RAMI_backend
npm install
cp .env.example .env   # töltsd ki a változókat
npm run dev            # http://localhost:3300
```

### Frontend
```bash
cd RAMI_frontend
npm install
cp .env.example .env   # töltsd ki a változókat
npm run dev            # http://localhost:5173
```

## Tesztelés

```bash
# Backend (Jest + Supertest)
cd RAMI_backend && npm test

# Frontend (Playwright)
cd RAMI_frontend && npm run test:ui
```

## Fejlesztők

Vizsgaremek – **Hódmezővásárhelyi SZC Szentesi Pollák Antal Technikum** – 2025/2026

**Kovácsik András · Markó Levente · Schwarcz Ottó**
