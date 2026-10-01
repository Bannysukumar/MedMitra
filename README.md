# MedMitra

A modern healthcare web application for ordering medicines, managing prescriptions, and tracking health records.

[![License](https://img.shields.io/github/license/Bannysukumar/MedMitra)](https://github.com/Bannysukumar/MedMitra/blob/main/LICENSE) [![Stars](https://img.shields.io/github/stars/Bannysukumar/MedMitra)](https://github.com/Bannysukumar/MedMitra/stargazers) [![Last commit](https://img.shields.io/github/last-commit/Bannysukumar/MedMitra)](https://github.com/Bannysukumar/MedMitra/commits/main)

## Overview

A modern healthcare web application for ordering medicines, managing prescriptions, and tracking health records.


What is actually in the repository: `functions/`, `public/`, `scripts/`, `src/`. GitHub reports the primary language as JavaScript.

Published site recorded on the repository: https://med-mitra-chi.vercel.app

## Features


- Public site: Home, About, Features, Medicine catalog, Pricing, Team, Blog, FAQ, Contact
- User dashboard: Orders, medicines, prescriptions, health records, wishlist, cart & checkout
- Admin panel: Users, medicines, prescriptions, orders, content management
- Demo mode: Works without Firebase — uses localStorage and mock data

## Tech Stack

| Technology | Where it shows up |
|---|---|
| React | User interface |
| Vite | Frontend build tool |
| Firebase | Backend services used by this repository |
| Tailwind CSS | Styling |
| Recharts | Charts |

## Project Architecture

React interface built with Vite → Firebase project files (firestore rules, hosting, or functions) checked into this repository.

## Project Structure

```text
MedMitra/
├── functions/
├── public/
├── scripts/
├── src/
├── .env.example
├── .firebaserc
├── eslint.config.js
├── firebase.json
├── firestore.indexes.json
├── firestore.rules
├── index.html
├── package-lock.json
├── package.json
├── storage.rules
├── vite.config.js
```

## Getting Started

```bash
git clone https://github.com/Bannysukumar/MedMitra.git
cd MedMitra
npm install
npm run dev
# Copy .env.example to .env and fill in the values that file lists.
```

Scripts defined in package.json:

- `npm run dev` — `vite`
- `npm run build` — `vite build`
- `npm run lint` — `eslint .`
- `npm run seed` — `node functions/seed.js`
- `npm run deploy:rules` — `node functions/deployRules.js`
- `npm run deploy` — `npm run build && npm run firebase -- deploy --only firestore:rules,hosting --project medmitra-46913`

## Deployment

- firebase.json is in the repository root.
- The repository homepage is https://med-mitra-chi.vercel.app.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## License

Licensed under MIT. See [LICENSE](LICENSE).

## Author

[Banny Sukumar](https://github.com/Bannysukumar)

- GitHub: [@Bannysukumar](https://github.com/Bannysukumar)
- Portfolio: [adepu-sukumar.vercel.app](https://adepu-sukumar.vercel.app/)
- LinkedIn: [Adepu Sukumar](https://www.linkedin.com/in/adepu-sukumar-59b423351)
