# Online Prescription Platform

A full-stack MERN application that connects patients with doctors for online consultations and digital prescriptions. Patients browse doctors, submit paid consultation requests, and receive downloadable PDF prescriptions. Doctors manage their consultations and issue prescriptions from a dedicated dashboard.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Frontend Routes](#frontend-routes)
- [Backend API Routes](#backend-api-routes)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Deployment](#deployment)

---

## Tech Stack

| Layer     | Technology                                      |
| --------- | ----------------------------------------------- |
| Frontend  | React 19, React Router v7, Vite 7               |
| Backend   | Node.js, Express 5                              |
| Database  | MongoDB (Mongoose)                              |
| Auth      | JWT (jsonwebtoken), bcryptjs                    |
| File Upload | Multer (in-memory, stored in MongoDB as Buffer) |
| PDF       | PDFKit                                          |
| QR Code   | qrcode                                          |
| Hosting   | Vercel (both client and server)                 |

---

## Project Structure

```
online-prescription-platform/
├── client/                  # React frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # AuthContext (JWT state + expiry)
│   │   ├── hooks/           # useAuth hook
│   │   ├── pages/           # Route-level page components
│   │   ├── styles/
│   │   └── utils/
│   │       ├── api.js        # All fetch calls to the server
│   │       └── formatDate.js
│   ├── .env                  # Local env (git-ignored)
│   ├── .env.example          # Env template (committed)
│   └── vercel.json
│
└── server/                  # Express backend
    ├── config/
    │   ├── db.js
    │   └── env.js            # Env validation on startup
    ├── controllers/
    ├── middleware/
    │   ├── authMiddleware.js  # JWT protect middleware
    │   ├── errorMiddleware.js
    │   └── uploadMiddleware.js
    ├── models/
    │   ├── Doctor.js
    │   ├── Patient.js
    │   ├── Consultation.js
    │   └── Prescription.js
    ├── routes/
    ├── utils/
    │   ├── generatePDF.js
    │   ├── generateQR.js
    │   └── validators.js
    ├── .env                   # Local env (git-ignored)
    ├── .env.example           # Env template (committed)
    └── vercel.json
```

---

## Features

### Patient
- Sign up / sign in with profile picture upload
- Browse all available doctors
- Submit multi-step consultation requests (symptoms, history, UPI payment)
- View consultation history and status
- View and download digital prescriptions as PDF

### Doctor
- Sign up / sign in with profile picture upload
- View and manage incoming consultations (accept / reject)
- Write, issue and update prescriptions per consultation
- View all issued prescriptions
- Update profile information

### Security
- JWT authentication with automatic token expiry detection on the client
- Protected routes redirect to the appropriate login page when token is expired or missing
- Role-based access control enforced on both client routes and API endpoints

---

## Frontend Routes

All protected routes redirect to the role-specific login page when unauthenticated or when the JWT has expired.

| Path | Page | Access |
|------|------|--------|
| `/` | Home / landing page | Public |
| `/doctor/signup` | Doctor registration | Public |
| `/doctor/login` | Doctor sign in | Public |
| `/patient/signup` | Patient registration | Public |
| `/patient/login` | Patient sign in | Public |
| `/doctor/dashboard` | Doctor dashboard (stats + info) | Doctor only |
| `/doctor/profile` | Doctor profile editor | Doctor only |
| `/doctor/consultations` | List of incoming consultations | Doctor only |
| `/doctor/prescriptions` | Manage and issue prescriptions | Doctor only |
| `/patient/dashboard` | Patient dashboard (stats + info) | Patient only |
| `/patient/doctors` | Browse all doctors | Patient only |
| `/consult/:doctorId` | Multi-step consultation form | Patient only |
| `/patient/prescriptions` | View received prescriptions | Patient only |
| `*` | 404 Not Found | Public |

---

## Backend API Routes

Base URL: `http://localhost:5000/api` (dev) or your deployed server URL.

### Auth — `/api/auth`

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/auth/doctor/signup` | Register a new doctor (multipart/form-data) | Public |
| POST | `/auth/doctor/login` | Doctor sign in | Public |
| POST | `/auth/patient/signup` | Register a new patient (multipart/form-data) | Public |
| POST | `/auth/patient/login` | Patient sign in | Public |

### Doctors — `/api/doctors`

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/doctors` | Get all doctors | Public |
| GET | `/doctors/:id` | Get doctor by ID | Public |
| GET | `/doctors/:id/avatar` | Stream doctor profile image | Public |
| PUT | `/doctors/me` | Update own doctor profile (multipart/form-data) | Doctor |

### Patients — `/api/patients`

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/patients/me` | Get own patient profile | Patient |
| PUT | `/patients/me` | Update own patient profile (multipart/form-data) | Patient |
| GET | `/patients/:id/avatar` | Stream patient profile image | Public |

### Consultations — `/api/consultations`

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/consultations` | Create a new consultation request | Patient |
| GET | `/consultations/doctor` | Get all consultations for logged-in doctor | Doctor |
| GET | `/consultations/patient` | Get all consultations for logged-in patient | Patient |
| GET | `/consultations/:id` | Get a single consultation by ID | Doctor / Patient |
| PUT | `/consultations/:id` | Update consultation status | Doctor |

### Prescriptions — `/api/prescriptions`

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/prescriptions` | Create a new prescription | Doctor |
| PUT | `/prescriptions/:id` | Update an existing prescription | Doctor |
| GET | `/prescriptions/my` | Get all prescriptions for logged-in patient | Patient |
| GET | `/prescriptions/doctor` | Get all prescriptions issued by logged-in doctor | Doctor |
| GET | `/prescriptions/:id/pdf` | Download prescription as PDF | Public |

---

## Environment Variables

### Client — `client/.env`

Copy `client/.env.example` to `client/.env` and fill in the values.

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `VITE_AUTH_STORAGE_KEY` | localStorage key for auth state | `online-prescription-auth` |
| `VITE_CONSULTATION_FEE` | Consultation fee displayed in payment step | `600` |
| `VITE_PAYMENT_UPI_ID` | UPI ID shown to patients for payment | `medcare@upi` |
| `VITE_PAYMENT_QR_URL` | URL of the payment QR code image | *(QR server URL)* |

### Server — `server/.env`

Copy `server/.env.example` to `server/.env` and fill in the values.

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URI` | MongoDB connection string | ✅ |
| `JWT_SECRET` | Secret key used to sign JWT tokens | ✅ |
| `CLIENT_URL` | Frontend origin (for CORS) | ✅ |
| `PORT` | HTTP port the server listens on | Optional (default `5000`) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas cluster)
- npm

### 1. Clone the repository

```bash
git clone <repo-url>
cd online-prescription-platform
```

### 2. Set up the server

```bash
cd server
cp .env.example .env      # then fill in MONGO_URI, JWT_SECRET, CLIENT_URL
npm install
npm run dev               # starts with nodemon on port 5000
```

### 3. Set up the client

```bash
cd client
cp .env.example .env      # adjust VITE_API_URL if needed
npm install
npm run dev               # starts Vite dev server on port 5173
```

### 4. Open in browser

```
http://localhost:5173
```

---

## Deployment

Both the client and server are configured for **Vercel**.

### Client
- Uses `client/vercel.json` — rewrites all paths to `index.html` for SPA routing.
- Set `VITE_API_URL` to the deployed server URL in Vercel environment variables.

### Server
- Uses `server/vercel.json` — routes all requests to `index.js` using `@vercel/node`.
- Set `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL` in Vercel environment variables.
- `CLIENT_URL` must be set to the deployed frontend URL for CORS to work.

```bash
# Deploy both from the repo root or separately:
cd client && vercel --prod
cd server && vercel --prod
```
