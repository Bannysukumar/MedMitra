<!-- readme-seo: bannysukumar-professional-v4 -->

# MedMitra

MedMitra is a healthcare web application. The HTML meta description says it is a platform for medicines, prescriptions, and health records. The client is built with Vite, and Firebase project files are in the repository.

## Overview

`index.html` sets the description quoted above. `package.json` provides `dev`, `build`, and Firebase-related scripts. Rules for Firestore and Storage are `firestore.rules` and `storage.rules`. `.env.example` lists environment settings without putting secret values in this README. The recorded homepage is https://med-mitra-chi.vercel.app.

## Features

- Public site shell in `index.html` with the MedMitra description
- Firebase Hosting, Firestore, Storage, and Functions config in `firebase.json`
- Firestore and Storage security rules
- Source under `src/` and scripts under `functions/`

## Tech Stack

| Technology | Where it shows up |
|---|---|
| React 19 | `package.json` and `src/` |
| Vite | `vite.config.js` and the `dev` script |
| Firebase | `firebase.json`, `.firebaserc`, rules files |
| Leaflet | `leaflet` dependency |
| Tailwind CSS | `@tailwindcss/vite` |

## Architecture

Vite client in `src/` → Firebase services configured by `firebase.json`.

## Project Structure

```text
MedMitra/
├── src/
├── functions/
├── public/
├── index.html
├── package.json
├── vite.config.js
├── firebase.json
├── firestore.rules
└── storage.rules
```

## Prerequisites

- Node.js
- npm

## Installation

```bash
git clone https://github.com/Bannysukumar/MedMitra.git
cd MedMitra
npm install
npm run dev
```

## Configuration

Copy `.env.example` to `.env` and fill values locally. Do not commit real API keys. Firebase project selection is in `.firebaserc`.

## Usage

`npm run dev` starts the Vite app. The meta description defines the product as medicines, prescriptions, and health records.

## Demo

https://med-mitra-chi.vercel.app

## Deployment

`firebase.json` defines Hosting, Firestore, Storage, and Functions. `vercel.json` is not required for that Firebase config. Homepage: https://med-mitra-chi.vercel.app.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## License

Licensed under MIT. See [LICENSE](LICENSE).

## Author

Banny Sukumar

GitHub: https://github.com/Bannysukumar
