<div align="center">

# 🔧 FixItNow

### *Your Trusted Home Service Platform*

A production-ready backend API for a home services marketplace — customers book verified technicians for plumbing, electrical, cleaning, painting, and more, with real Stripe payments, role-based access, and full booking lifecycle management.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=flat-square&logo=stripe&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat-square&logo=zod&logoColor=white)

</div>

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Roles & Permissions](#-roles--permissions)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Booking Status Flow](#-booking-status-flow)
- [Database Schema](#-database-schema)
- [Getting Started](#-getting-started)
- [Admin Credentials](#-admin-credentials)
- [API Endpoints](#-api-endpoints)
- [Response Format](#-response-format)
- [Postman Collection](#-postman-collection)
- [Project Structure](#-project-structure)
- [Mandatory Requirements Checklist](#-mandatory-requirements-checklist)

---

## 📖 Project Overview

**FixItNow** is a backend API for a home services marketplace. Customers can browse available services (plumbing, electrical, cleaning, painting, etc.), book qualified technicians, and leave reviews. Technicians can create service profiles, manage their availability, and handle job bookings. Admins oversee the platform, manage users, and moderate service categories.

---

## 👥 Roles & Permissions

| Role | Description | Key Permissions |
|:--|:--|:--|
| **Customer** | Users who book home services | Browse services, book technicians, track bookings, leave reviews, make payments |
| **Technician** | Service professionals | Create profile, set availability, view/manage bookings, complete jobs |
| **Admin** | Platform moderators | Manage all users, oversee all bookings, manage service categories |

> 💡 Users select their role (`CUSTOMER` or `TECHNICIAN`) during registration. The Admin account is seeded via script.

---

## 🛠 Tech Stack

| Layer | Technology |
|:--|:--|
| Runtime | Node.js |
| Framework | Express.js v5 |
| Language | TypeScript |
| ORM | Prisma v7 (pg adapter) |
| Database | PostgreSQL |
| Authentication | JWT (Access + Refresh Token) |
| Payment Gateway | Stripe Checkout (real integration) |
| Validation | Zod |
| Password Hashing | bcryptjs |

---

## ✨ Features

### 🌐 Public Features
- Browse all available services and technicians
- Search and filter by service type, location, and price
- View technician profiles with service details and reviews

### 👤 Customer Features
- Register and login as customer
- Book a technician for a specific service and time slot
- **Make payments via Stripe after booking is accepted**
- **View payment history and payment status**
- Track booking status in real time
- Cancel a booking (before it reaches `IN_PROGRESS`)
- Leave reviews after job completion
- Manage own profile

### 🔧 Technician Features
- Register and login as technician
- Create and update service profile (skills, experience, pricing)
- Set weekly availability time slots
- View incoming bookings
- Accept or decline bookings
- Mark jobs as in-progress or completed

### 🛡 Admin Features
- View all users (customers and technicians)
- Manage user status (ban / unban)
- View all bookings across the platform
- Manage service categories (create, update, delete)
- View platform-wide dashboard statistics

---

## 🔄 Booking Status Flow

```
                         ┌──────────────┐
                         │  REQUESTED   │
                         └──────────────┘
                           /          \
                (technician)          (technician)
                  accepts                declines
                     /                        \
                    ▼                          ▼
           ┌──────────────┐           ┌──────────────┐
           │   ACCEPTED   │           │   DECLINED   │
           └──────────────┘           └──────────────┘
                    │
           (customer pays via Stripe)
                    ▼
           ┌──────────────┐
           │     PAID     │
           └──────────────┘
                    │
              (technician)
                    ▼
           ┌──────────────┐
           │ IN_PROGRESS  │
           └──────────────┘
                    │
              (technician)
                    ▼
           ┌──────────────┐
           │  COMPLETED   │
           └──────────────┘
```

> ⚠️ **Note:** Customers can cancel a booking (`CANCELLED`) at any point **before** it reaches `IN_PROGRESS` status.

---

## 🗄 Database Schema

| Model | Description |
|:--|:--|
| `User` | Stores user information, authentication details, and role (`CUSTOMER` / `TECHNICIAN` / `ADMIN`) |
| `TechnicianProfile` | Technician-specific info — bio, skills, experience, location (1:1 with User) |
| `Availability` | Weekly time slots linked to a technician profile |
| `Category` | Service categories (Plumbing, Electrical, Cleaning, etc.) |
| `Service` | Specific services offered by technicians, linked to a category |
| `Booking` | Job bookings between customers and technicians, with full status lifecycle |
| `Payment` | Payment transactions — provider, status, transactionId, paidAt |
| `Review` | Customer reviews tied to a completed booking |

Full schema definitions are in [`prisma/schema/`](./prisma/schema).

---

## 🚀 Getting Started

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
npx prisma generate
npx prisma migrate dev --name init
npm run seed
```

The seed script creates the **admin account** and default **service categories**.

### 4. Run the Server

```bash
npm run dev
```

Server runs at → `http://localhost:5000`

### 5. Stripe Webhook (local testing)

```bash
npm run stripe:webhook
```

---

## 🔑 Admin Credentials

```
Email    : admin@fixitnow.com
Password : Admin@12345
```

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|:--|:--|:--|:--|
| `POST` | `/api/auth/register` | Register new user (customer/technician) | Public |
| `POST` | `/api/auth/login` | Login user, returns JWT | Public |
| `POST` | `/api/auth/refresh-token` | Refresh access token | Public |
| `GET` | `/api/auth/me` | Get current authenticated user | Private |

### Services & Technicians (Public)

| Method | Endpoint | Description | Access |
|:--|:--|:--|:--|
| `GET` | `/api/services` | Get all services with filters (search, category, location, price) | Public |
| `GET` | `/api/services/:serviceId` | Get service details | Public |
| `GET` | `/api/technicians` | Get all technicians with filters | Public |
| `GET` | `/api/technicians/:technicianId` | Get technician profile with reviews | Public |
| `GET` | `/api/categories` | Get all service categories | Public |
| `GET` | `/api/categories/:categoryId` | Get category with its services | Public |

### Bookings

| Method | Endpoint | Description | Access |
|:--|:--|:--|:--|
| `POST` | `/api/bookings` | Create new booking | Customer |
| `GET` | `/api/bookings` | Get logged-in user's bookings | Private |
| `GET` | `/api/bookings/:bookingId` | Get booking details | Private |
| `PATCH` | `/api/bookings/:bookingId/cancel` | Cancel a booking | Customer |

### Payments (Stripe)

| Method | Endpoint | Description | Access |
|:--|:--|:--|:--|
| `POST` | `/api/payments/create` | Create a Stripe checkout session for an accepted booking | Customer |
| `POST` | `/api/payments/webhook` | Stripe webhook — confirms payment | Public (Stripe only) |
| `GET` | `/api/payments` | Get user's payment history | Private |
| `GET` | `/api/payments/:paymentId` | Get payment details | Private |

### Technician Management

| Method | Endpoint | Description | Access |
|:--|:--|:--|:--|
| `POST` | `/api/technicians/profile` | Create technician profile | Technician |
| `PUT` | `/api/technicians/profile` | Update technician profile | Technician |
| `PUT` | `/api/technicians/availability` | Update availability slots | Technician |
| `POST` | `/api/services` | Create a new service | Technician |
| `PATCH` | `/api/services/:serviceId` | Update a service | Technician |
| `DELETE` | `/api/services/:serviceId` | Delete a service | Technician/Admin |
| `GET` | `/api/technicians/my/bookings` | Get technician's bookings | Technician |
| `PATCH` | `/api/technicians/bookings/:bookingId` | Update booking status (accept/decline/complete) | Technician |

### Reviews

| Method | Endpoint | Description | Access |
|:--|:--|:--|:--|
| `POST` | `/api/reviews` | Create review (only after job completion) | Customer |
| `GET` | `/api/reviews/service/:serviceId` | Get reviews for a service | Public |

### Admin

| Method | Endpoint | Description | Access |
|:--|:--|:--|:--|
| `GET` | `/api/admin/stats` | Get platform dashboard stats | Admin |
| `GET` | `/api/admin/users` | Get all users | Admin |
| `PATCH` | `/api/admin/users/:userId` | Update user status (ban/unban) | Admin |
| `GET` | `/api/admin/bookings` | Get all bookings | Admin |
| `GET` | `/api/admin/categories` | Get all categories | Admin |
| `POST` | `/api/admin/categories` | Create new service category | Admin |
| `PATCH` | `/api/admin/categories/:categoryId` | Update category | Admin |
| `DELETE` | `/api/admin/categories/:categoryId` | Delete category | Admin |

---

## 📦 Response Format

All API responses follow a **consistent structure**.

**✅ Success Response**
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

**❌ Error Response**
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

## 🔍 Query Parameters

### Services
| Param | Type | Description |
|:--|:--|:--|
| `searchTerm` | string | Search by title or description |
| `categoryId` | string | Filter by category |
| `location` | string | Filter by location |
| `minPrice` / `maxPrice` | number | Price range filter |
| `page` / `limit` | number | Pagination |
| `sortBy` / `sortOrder` | string | Sorting field & direction |

### Technicians
| Param | Type | Description |
|:--|:--|:--|
| `searchTerm` | string | Search by name or bio |
| `location` | string | Filter by location |
| `skills` | string | Comma-separated skills |
| `page` / `limit` | number | Pagination |

---

## 📮 Postman Collection

Import [`FixItNow.postman_collection.json`](./FixItNow.postman_collection.json) into Postman to test every endpoint.

1. Set the `baseUrl` collection variable to `http://localhost:5000/api`
2. Run **Login** — the `accessToken` is auto-saved to the collection variable
3. All protected routes will automatically use the saved token

---

## 📁 Project Structure

```
fixitnow-backend/
├── prisma/
│   ├── schema/
│   │   ├── schema.prisma        # Generator + datasource
│   │   ├── enums.prisma         # Role, BookingStatus, PaymentStatus, etc.
│   │   ├── user.prisma
│   │   ├── technician.prisma    # TechnicianProfile + Availability
│   │   ├── service.prisma       # Category + Service
│   │   ├── booking.prisma
│   │   ├── payment.prisma
│   │   └── review.prisma
│   └── seed.ts                  # Admin + default categories seeder
├── src/
│   ├── config/                  # Environment config
│   ├── lib/                     # Prisma client, Stripe client
│   ├── middlewares/
│   │   ├── auth.ts              # JWT auth + role-based access control
│   │   ├── validateRequest.ts   # Zod validation middleware
│   │   ├── globalErrorHandler.ts
│   │   └── notFound.ts
│   ├── utils/                   # catchAsync, sendResponse, jwtUtils
│   ├── modules/
│   │   ├── auth/                # register, login, refresh, me
│   │   ├── category/            # CRUD categories
│   │   ├── service/             # CRUD services + filters
│   │   ├── technician/          # profile, availability, bookings
│   │   ├── booking/             # create, list, cancel
│   │   ├── payment/             # Stripe checkout + webhook
│   │   ├── review/              # create review, list by service
│   │   └── admin/               # users, bookings, stats
│   ├── app.ts                   # Express app setup
│   └── server.ts                # Server entry point
├── FixItNow.postman_collection.json
├── .env.example
├── package.json
├── tsconfig.json
└── prisma.config.ts
```

---

## ✅ Mandatory Requirements Checklist

| # | Requirement | Status |
|:-:|:--|:-:|
| 1 | **API Documentation** — Postman collection covering all endpoints | ✅ |
| 2 | **Consistent Error Responses** — `{ success, message, errorDetails }` | ✅ |
| 3 | **20 Meaningful Commits** — descriptive, feature-scoped commit history | ✅ |
| 4 | **Input Validation** — Zod schema validation on all endpoints | ✅ |
| 5 | **Admin Credentials** — working seeded admin account | ✅ |
| 6 | **Real Payment Integration** — Stripe Checkout (no fake/COD payments) | ✅ |

---

<div align="center">

Made with ❤️ for **B7A4 — Apollo Level 2 Web Development**

</div>
