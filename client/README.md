# Online Prescription Platform — Client

React 19 frontend built with Vite. See the [root README](../README.md) for full project documentation, API routes, and setup instructions.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server on port 5173 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## Environment Variables

Copy `.env.example` to `.env`:

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |
| `VITE_AUTH_STORAGE_KEY` | localStorage key for auth state |
| `VITE_CONSULTATION_FEE` | Consultation fee amount |
| `VITE_PAYMENT_UPI_ID` | UPI ID for patient payments |
| `VITE_PAYMENT_QR_URL` | Payment QR code image URL |
