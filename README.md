# Secure Notes Backend

Node.js + Express + Mongoose REST API with JWT authentication and role-based access control.

## Setup

```bash
npm install
cp .env.example .env
```

Update `.env` with your MongoDB URI and JWT secret.

## Seed Admin User

```bash
npm run seed
```

Default admin credentials:
- Name: Admin
- Email: secureadmin@example.com
- Password: secureadmin

## Run

```bash
npm run dev
```

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (protected)

### Notes
- `POST /api/notes` (protected)
- `GET /api/notes?page=1` (protected, paginated)
- `GET /api/notes/:id` (protected)
- `PUT /api/notes/:id` (protected, owner or admin)
- `DELETE /api/notes/:id` (protected, owner or admin)

### Admin
- `GET /api/admin/users?page=1` (admin)
- `GET /api/admin/users/:id` (admin)
- `PUT /api/admin/users/:id` (admin)
- `DELETE /api/admin/users/:id` (admin)

### Aggregations
- `GET /api/aggregations/users-by-interest` (admin)
- `GET /api/aggregations/user-posts/:userId` (protected)
