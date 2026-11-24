# PawHome - Pet Adoption System (MERN)

A full stack web app where shelters list pets and adopters browse, search and apply to adopt them.

## What you need first
1. Node.js (v18 or newer)
2. MongoDB - either MongoDB Community (local) or a free MongoDB Atlas link
3. VS Code

## How to run

### 1. Backend
```
cd backend
npm install
```
Open `backend/.env` and check `MONGO_URI`.
(Using Atlas? Paste your Atlas connection link there.)

Add sample data (optional but recommended), then start the server:
```
npm run seed
npm run dev
```
Backend runs on http://localhost:5000

### 2. Frontend (open a second terminal)
```
cd frontend
npm install
npm run dev
```
Frontend runs on http://localhost:5173

## Demo accounts (created by `npm run seed`)
| Role | Email | Password |
|------|-------|----------|
| Shelter | shelter@example.com | 123456 |
| Adopter | user@example.com | 123456 |

## Features
- Register / login with JWT (two roles: adopter and shelter)
- Browse pets, search by name or breed, filter by type, gender and city
- Pet details page
- Adopters: send adoption request, track status (Pending / Approved / Rejected), cancel pending request
- Shelters: add, edit, delete pets, approve or reject requests
- When a request is approved, the pet becomes "Adopted" and other pending requests are rejected

## Folder structure
```
backend/
  server.js            -> starts Express server
  config/db.js         -> MongoDB connection
  models/              -> Mongoose schemas (User, Pet, AdoptionRequest)
  middleware/auth.js   -> JWT login check and role check
  routes/              -> REST API routes
  seed.js              -> sample data
frontend/src/
  main.jsx, App.jsx    -> app start and page routes
  api.js               -> Axios setup
  context/             -> AuthContext (logged in user)
  components/          -> reusable components
  pages/               -> full pages
```

## REST API list
| Method | URL | Who | Work |
|--------|-----|-----|------|
| POST | /api/auth/register | all | create account |
| POST | /api/auth/login | all | login |
| GET | /api/pets | all | list pets (search + filters) |
| GET | /api/pets/:id | all | one pet |
| GET | /api/pets/mine | shelter | my pets |
| POST | /api/pets | shelter | add pet |
| PUT | /api/pets/:id | shelter | update pet |
| DELETE | /api/pets/:id | shelter | delete pet |
| POST | /api/requests | adopter | send request |
| GET | /api/requests/mine | adopter | my requests |
| DELETE | /api/requests/:id | adopter | cancel pending request |
| GET | /api/requests/shelter | shelter | requests for my pets |
| PUT | /api/requests/:id/status | shelter | approve or reject |

