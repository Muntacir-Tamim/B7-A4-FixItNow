# FixItNow 🔧

**"Your Trusted Home Service Platform"**

A backend API for a home services marketplace. Customers can browse available services (plumbing, electrical, cleaning, painting, etc.), book qualified technicians, and leave reviews. Technicians can create service profiles, manage their availability, and handle job bookings. Admins oversee the platform, manage users, and moderate service categories.

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js v5
- **Language:** TypeScript
- **ORM:** Prisma v7 (with pg adapter)
- **Database:** PostgreSQL
- **Auth:** JWT (Access + Refresh Token via cookies)
- **Payment:** Stripe Checkout
- **Validation:** Zod
- **Password Hashing:** bcryptjs

---

## Roles & Permissions

| Role | Description | Key Permissions |
|------|-------------|-----------------|
| **Customer** | Users who book home services | Browse services, book technicians, track bookings, leave reviews, make payments |
| **Technician** | Service professionals | Create profile, set availability, view/manage bookings, complete jobs |
| **Admin** | Platform moderators | Manage all users, oversee all bookings, manage service categories |

> **Note:** Users select their role (CUSTOMER or TECHNICIAN) during registration. Admin is seeded.

---

## Booking Status Flow

```
REQUESTED
   ├── (technician accepts) ──► ACCEPTED
   │                                │
   │                         (customer pays) ──► PAID
   │                                                │
   │                                        (technician) ──► IN_PROGRESS
   │                                                                │
   │                                                        (technician) ──► COMPLETED
   │
   └── (technician declines) ──► DECLINED

Note: Customer can CANCEL at any point before IN_PROGRESS
```

---

## Getting Started

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd fixitnow-backend
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Fill in your `.env`:

```env
PORT=5000
APP_URL=http://localhost:3000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_ACCESS_SECRET=your_jwt_access_secret_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=10
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed admin + default categories
npm run seed
```

### 4. Run Development Server

```bash
npm run dev
```

Server starts at: `http://localhost:5000`

### 5. Stripe Webhook (for local testing)

```bash
npm run stripe:webhook
```

---

## Admin Credentials

```
Email   : admin@fixitnow.com
Password: Admin@12345
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user (customer/technician) | Public |
| POST | `/api/auth/login` | Login user, return JWT | Public |
| POST | `/api/auth/refresh-token` | Refresh access token | Public |
| GET | `/api/auth/me` | Get current authenticated user | Any |

### Services & Technicians (Public)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/services` | Get all services with filters | Public |
| GET | `/api/services/:serviceId` | Get service details | Public |
| POST | `/api/services` | Create new service | Technician |
| PATCH | `/api/services/:serviceId` | Update service | Technician |
| DELETE | `/api/services/:serviceId` | Delete service | Technician/Admin |
| GET | `/api/technicians` | Get all technicians with filters | Public |
| GET | `/api/technicians/:technicianId` | Get technician profile with reviews | Public |
| GET | `/api/categories` | Get all service categories | Public |
| GET | `/api/categories/:categoryId` | Get category with services | Public |

### Technician Management
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/technicians/profile` | Create technician profile | Technician |
| PUT | `/api/technicians/profile` | Update technician profile | Technician |
| PUT | `/api/technicians/availability` | Update availability slots | Technician |
| GET | `/api/technicians/my/bookings` | Get technician's bookings | Technician |
| PATCH | `/api/technicians/bookings/:bookingId` | Update booking status (accept/decline/complete) | Technician |

### Bookings
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/bookings` | Create new booking | Customer |
| GET | `/api/bookings` | Get user's bookings | Any |
| GET | `/api/bookings/:bookingId` | Get booking details | Any |
| PATCH | `/api/bookings/:bookingId/cancel` | Cancel booking | Customer |

### Payments (Stripe)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/payments/create` | Create Stripe checkout session | Customer |
| POST | `/api/payments/webhook` | Handle Stripe webhook | Public |
| GET | `/api/payments` | Get payment history | Customer/Admin |
| GET | `/api/payments/:paymentId` | Get payment details | Customer/Admin |

### Reviews
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/reviews` | Create review (after job completion) | Customer |
| GET | `/api/reviews/service/:serviceId` | Get reviews for a service | Public |

### Admin
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/stats` | Get dashboard statistics | Admin |
| GET | `/api/admin/users` | Get all users | Admin |
| PATCH | `/api/admin/users/:userId` | Update user status (ban/unban) | Admin |
| GET | `/api/admin/bookings` | Get all bookings | Admin |
| GET | `/api/admin/categories` | Get all categories | Admin |
| POST | `/api/admin/categories` | Create new service category | Admin |
| PATCH | `/api/admin/categories/:categoryId` | Update category | Admin |
| DELETE | `/api/admin/categories/:categoryId` | Delete category | Admin |

---

## Response Format

### Success Response
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Data retrieved successfully",
  "data": { },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Validation Error",
  "errorDetails": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

---

## Query Parameters (Filtering & Pagination)

### Services
| Param | Type | Description |
|-------|------|-------------|
| `searchTerm` | string | Search by title or description |
| `categoryId` | string | Filter by category |
| `location` | string | Filter by location |
| `minPrice` | number | Minimum price filter |
| `maxPrice` | number | Maximum price filter |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |
| `sortBy` | string | Field to sort by (default: createdAt) |
| `sortOrder` | string | asc or desc (default: desc) |

### Technicians
| Param | Type | Description |
|-------|------|-------------|
| `searchTerm` | string | Search by name or bio |
| `location` | string | Filter by location |
| `skills` | string | Comma-separated skills |
| `page` | number | Page number |
| `limit` | number | Items per page |

---

## Postman Collection

Import `FixItNow.postman_collection.json` into Postman.

Set the `baseUrl` collection variable to `http://localhost:5000/api`.

The Login request auto-saves the `accessToken` variable for use in all authenticated requests.

---

## Recommended 20 Git Commits

```
1.  chore: initialize project with Express, TypeScript, and Prisma setup
2.  chore: configure prisma.config.ts with multi-file schema support
3.  feat(schema): add enums for Role, BookingStatus, PaymentStatus, UserStatus
4.  feat(schema): add User and TechnicianProfile models with relations
5.  feat(schema): add Category, Service, Availability models
6.  feat(schema): add Booking, Payment, and Review models
7.  chore: add utility functions - catchAsync, sendResponse, jwtUtils
8.  feat(middleware): add auth middleware with role-based access control
9.  feat(middleware): add validateRequest middleware with Zod integration
10. feat(middleware): add global error handler with consistent error format
11. feat(auth): implement register, login, refresh-token, and get-me endpoints
12. feat(category): implement CRUD endpoints for service categories
13. feat(service): implement service CRUD with search and filter by price/location
14. feat(technician): implement technician profile creation and update
15. feat(technician): implement availability slot management
16. feat(technician): implement booking status update (accept/decline/complete)
17. feat(booking): implement booking creation, listing, and cancellation
18. feat(payment): integrate Stripe checkout session and webhook handler
19. feat(review): implement review creation with booking completion guard
20. feat(admin): implement admin dashboard with user management and stats
```

---

## Project Structure

```
fixitnow-backend/
├── prisma/
│   ├── schema/
│   │   ├── schema.prisma       # Generator + datasource
│   │   ├── enums.prisma        # All enum definitions
│   │   ├── user.prisma         # User model
│   │   ├── technician.prisma   # TechnicianProfile + Availability
│   │   ├── service.prisma      # Category + Service
│   │   ├── booking.prisma      # Booking model
│   │   ├── payment.prisma      # Payment model
│   │   └── review.prisma       # Review model
│   └── seed.ts                 # Admin + category seeder
├── src/
│   ├── config/
│   │   └── index.ts            # Environment config
│   ├── lib/
│   │   ├── prisma.ts           # Prisma client
│   │   └── stripe.ts           # Stripe client
│   ├── middlewares/
│   │   ├── auth.ts             # JWT auth + RBAC
│   │   ├── validateRequest.ts  # Zod validation middleware
│   │   ├── globalErrorHandler.ts
│   │   └── notFound.ts
│   ├── utils/
│   │   ├── catchAsync.ts
│   │   ├── sendResponse.ts
│   │   └── jwt.ts
│   ├── modules/
│   │   ├── auth/               # register, login, refresh, me
│   │   ├── category/           # CRUD categories
│   │   ├── service/            # CRUD services + filters
│   │   ├── technician/         # profile, availability, bookings
│   │   ├── booking/            # create, list, cancel
│   │   ├── payment/            # Stripe checkout + webhook
│   │   ├── review/             # create review, list by service
│   │   └── admin/              # users, bookings, stats
│   ├── app.ts                  # Express app setup
│   └── server.ts               # Server entry point
├── FixItNow.postman_collection.json
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── prisma.config.ts
```
