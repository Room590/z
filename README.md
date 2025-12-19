# Multi-vendor Commerce MVP

## High-level architecture
- **Frontend**: React + Vite + Tailwind for a Daraz-inspired responsive UI. Axios handles REST calls, React Router manages navigation, and context providers hold auth and cart state.
- **Backend**: Node.js + Express + MongoDB (Mongoose). MVC structure with JWT auth, bcrypt hashing, RBAC middleware, validation via `express-validator`, and centralized error handling.
- **Security & Ops**: Helmet, CORS, compression, environment-based config, and bearer-token protected routes.

## Backend folder structure
```
backend/
  src/
    config/        # env + database bootstrap
    controllers/   # business logic per domain
    middleware/    # auth, validation, error handler
    models/        # Mongoose schemas
    routes/        # REST endpoints grouped by resource
    server.ts      # express app entrypoint
  package.json
  tsconfig.json
```

### Backend implementation
- Models: `User`, `Product`, `Order`, `Category` capture roles, catalog, and order line-items.
- Controllers: auth (register/login), product CRUD for sellers, category management for admins, order creation/history, admin oversight of users/sellers.
- Routes: mounted under `/api/*` with validation and RBAC guards.
- Middleware: JWT authentication, role authorization, request validation, and centralized error responses.

## Frontend folder structure
```
frontend/
  src/
    api/         # axios client
    components/  # layout + reusable cards
    context/     # auth + cart providers
    pages/       # routed screens
    routes/      # router wrapper
    index.css
    main.tsx
  package.json
  vite.config.ts
  tailwind.config.cjs
```

### Frontend implementation
- Pages: home (catalog browse/filter), product detail, login/register, seller/admin dashboard.
- Components: layout shell with role-aware navigation and cart badge, product cards, protected routes.
- State: `AuthContext` stores token/user and applies auth headers; `CartContext` manages cart items globally.
- API layer: axios instance honors `VITE_API_URL` for backend calls and logs failures.

## Sample environment variables
See `.env.example`:
```
PORT=4000
MONGO_URI=mongodb://localhost:27017/daraz_mvp
JWT_SECRET=super-secret
JWT_EXPIRES_IN=2d
CLIENT_URL=http://localhost:5173
VITE_API_URL=http://localhost:4000/api
```

## Running locally
1. **Backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   API served at `http://localhost:4000/api`.

2. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   App served at `http://localhost:5173`.

Seed MongoDB with categories before adding products; sellers can then publish inventory, buyers can place orders, and admins can manage users/categories.
