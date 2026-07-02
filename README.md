# SHU Frontend

A modern React + Vite frontend for a university-focused campus experience platform. The app provides role-based dashboards, university and society profiles, event and internship discovery, and authentication flows for students and admins.

## Features

- Landing page for the platform
- Authentication flow with login, registration, OTP verification, and role-based navigation
- University and society profile pages
- Reviews, events, and internships sections
- Separate dashboards for:
  - Super admin
  - University admin
  - Society admin
  - Student
- Dark/light theme toggle
- Responsive UI built with React and Vite

## Tech Stack

- React 19
- Vite 8
- React Router DOM
- Lucide React icons
- ESLint for linting

## Project Structure

```bash
SHU-Frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── App.jsx
│   ├── main.jsx
│   └── config.js
├── index.html
├── package.json
├── vite.config.js
└── eslint.config.js
```

## Prerequisites

Make sure you have the following installed:

- Node.js 18 or higher
- npm or yarn

## Installation

1. Navigate to the frontend folder

```bash
cd SHU-Frontend
```

2. Install dependencies

```bash
npm install
```

## Running the Development Server

```bash
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Building for Production

```bash
npm run build
```

The production build will be generated in the `dist` folder.

## Linting

```bash
npm run lint
```

## Environment Configuration

The app uses a backend base URL from [src/config.js](src/config.js):

```js
export const BASE_URL = "https://shu-backend.vercel.app";
```

If your backend runs on a different host, update this value accordingly.

## Main Routes

The app includes routes for:

- `/` - Landing page
- `/login` - Login
- `/register` - Registration
- `/verify-otp` - OTP verification
- `/reviews` - Reviews
- `/events` - Events
- `/internships` - Internships
- `/university/:id` - University profile
- `/society/:id` - Society profile
- `/dashboard` - Role-based dashboard

## Notes

This frontend is designed to work with the backend API hosted at the configured base URL. Make sure the backend is available before testing authentication and dashboard features.
