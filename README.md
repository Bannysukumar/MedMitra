# MedMitra

A modern healthcare web application for ordering medicines, managing prescriptions, and tracking health records.

## Features

- **Public site**: Home, About, Features, Medicine catalog, Pricing, Team, Blog, FAQ, Contact
- **User dashboard**: Orders, medicines, prescriptions, health records, wishlist, cart & checkout
- **Admin panel**: Users, medicines, prescriptions, orders, content management
- **Demo mode**: Works without Firebase — uses localStorage and mock data

## Tech Stack

- React 19 + Vite 8
- Tailwind CSS v4
- React Router v7
- Zustand (cart, wishlist, theme)
- Firebase (Auth, Firestore, Storage) — optional
- Recharts, react-hook-form, react-hot-toast, lucide-react

## Getting Started

```bash
cd medmitra
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Demo Login

Use any email/password on the login page — demo mode stores session in `localStorage`.

### Admin Login

Visit `/admin/login` — sets `medmitra-admin` in localStorage for admin access.

## Firebase Setup (Optional)

1. Copy `.env.example` to `.env` and fill in Firebase config values
2. Deploy rules: `firebase deploy --only firestore:rules,storage`
3. Deploy functions: `cd functions && npm install && cd .. && firebase deploy --only functions`

## Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/   # UI components and layouts
├── config/       # Constants and Firebase
├── contexts/     # Auth context
├── data/         # Mock data
├── pages/        # Route pages (public, auth, dashboard, admin)
├── routes/       # Protected and admin route guards
├── services/     # Search service
├── stores/       # Zustand stores
└── utils/        # Helpers
```

## License

MIT
