# Multi-vendor E-commerce MVP

Production-ready Daraz-inspired multi-vendor marketplace with Express/MongoDB backend and React/Tailwind frontend. Includes RBAC (user, seller, admin), product/catalog management, cart/checkout flow (payment abstracted), and order visibility per role.

## 1) High-level architecture
- **Frontend**: React + React Router + Tailwind; Axios-based API client with auth token interceptor; global cart state via context; protected routes enforce RBAC on the client.
- **Backend**: Express REST API with MVC structure, JWT auth, bcrypt password hashing, role-based middleware, multer file uploads, centralized validation/error handling. MongoDB (Mongoose) models for users, products, categories, and orders.
- **Security & config**: Environment-driven secrets, input validation (express-validator), CORS, limited JSON body size, activity flags for soft deactivation.

## 2) Backend folder structure
```
backend/
  package.json
  .env.sample
  src/
    app.js
    config/db.js
    controllers/
    middleware/
    models/
    routes/
    uploads/ (runtime)
```

## 3) Backend implementation highlights
- **Models**: User (RBAC + hashing), Product (seller & category references, images, stock), Category, Order (per-item seller linkage + status lifecycle).
- **Controllers**: Auth (register/login + JWT), Product (CRUD with seller/admin guards, search/filter), Orders (create with stock decrement, user/seller/all queries, status updates), Categories (admin CRUD), Admin (user moderation/promotions, dashboard stats).
- **Routes**: RESTful endpoints under `/api/*` with role-aware middleware and validation; multer for image uploads.
- **Middleware**: Auth with JWT verification and role checks; request validation; centralized not-found/error handlers.

## 4) Frontend folder structure
```
frontend/
  index.html
  package.json
  tailwind.config.js
  src/
    main.jsx
    styles.css
    routes/AppRoutes.jsx
    context/CartContext.jsx
    services/api.js
    components/*
    pages/*
```

## 5) Frontend implementation highlights
- **Pages**: Home (search/filter, category list), Product detail, Cart (checkout -> order API), Dashboard (role-aware orders & seller catalog), Auth (login/register with role selection).
- **Components**: Layout with navbar/footer, ProtectedRoute enforcing RBAC, Product cards with add-to-cart actions.
- **State & data**: Cart context with reducer; Axios service layer with token interceptor; responsive Tailwind UI inspired by Daraz styling.

## 6) Sample environment (.env)
Copy to `backend/.env` and adjust:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/marketplace
JWT_SECRET=supersecretjwt
NODE_ENV=development
```

## 7) Run locally
1. **Backend**
   ```bash
   cd backend
   npm install
   cp .env.sample .env   # update values
   npm run dev            # starts API on PORT
   ```
2. **Frontend** (requires API running)
   ```bash
   cd frontend
   npm install
   npm run dev            # Vite dev server
   ```
3. Open the frontend dev URL (default http://localhost:5173) and ensure `VITE_API_URL` env (if needed) points to your backend origin.
