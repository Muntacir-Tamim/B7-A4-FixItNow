# 20 Meaningful Git Commit Messages

Run these commands one by one after each logical change:

```bash
git init
git add .gitignore
git commit -m "chore: initialize project with .gitignore"

git add package.json tsconfig.json prisma.config.ts
git commit -m "chore: setup project dependencies and TypeScript configuration"

git add prisma/
git commit -m "feat: design database schema for users, technicians, categories, services, bookings, payments and reviews"

git add src/config/ src/lib/
git commit -m "feat: configure environment variables, Prisma client and Stripe client"

git add src/utils/
git commit -m "feat: add catchAsync, sendResponse and jwt utility helpers"

git add src/middlewares/globalErrorHandler.ts src/middlewares/notFound.ts
git commit -m "feat: implement global error handler with consistent JSON error response format"

git add src/middlewares/validateRequest.ts
git commit -m "feat: add Zod-based validateRequest middleware for input validation"

git add src/middlewares/auth.ts
git commit -m "feat: implement JWT authentication middleware with role-based access control"

git add src/modules/auth/
git commit -m "feat(auth): implement register, login, refresh-token and get-me endpoints"

git add src/modules/category/
git commit -m "feat(category): implement CRUD endpoints for service categories"

git add src/modules/service/
git commit -m "feat(service): implement service listing with search, filter by location price and category"

git add src/modules/technician/technician.interface.ts src/modules/technician/technician.service.ts src/modules/technician/technician.controller.ts
git commit -m "feat(technician): implement technician profile creation, update and availability management"

git add src/modules/technician/technician.route.ts src/modules/technician/technician.validation.ts
git commit -m "feat(technician): add public technician listing with booking status update endpoints"

git add src/modules/booking/
git commit -m "feat(booking): implement booking creation, listing, detail view and cancellation flow"

git add src/modules/payment/payment.interface.ts src/modules/payment/payment.service.ts
git commit -m "feat(payment): integrate Stripe checkout session creation for accepted bookings"

git add src/modules/payment/payment.controller.ts src/modules/payment/payment.route.ts src/modules/payment/payment.validation.ts
git commit -m "feat(payment): add Stripe webhook handler to update booking status after successful payment"

git add src/modules/review/
git commit -m "feat(review): implement review creation restricted to completed bookings only"

git add src/modules/admin/
git commit -m "feat(admin): implement admin dashboard with user management, booking overview and stats"

git add prisma/seed.ts
git commit -m "chore: add database seed script with admin credentials and default service categories"

git add src/app.ts src/server.ts FixItNow.postman_collection.json README.md
git commit -m "feat: wire up all routes in Express app and add Postman collection with API documentation"
```
