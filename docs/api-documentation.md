# AC Service Marketplace API Documentation

Base URL:

```txt
http://localhost:5000/api
```

## Authentication

- `POST /auth/register` - Register a customer or serviceman.
- `POST /auth/login` - Login and receive a JWT.
- `GET /auth/me` - Get current user profile.
- `PATCH /auth/me` - Update current user profile.

Authenticated requests require:

```txt
Authorization: Bearer <token>
```

## Servicemen

- `GET /servicemen` - List available servicemen.
- `GET /servicemen/:id` - Get serviceman details.

Supported filters:

- `city`
- `serviceType`

## Bookings

- `POST /bookings` - Create a booking as a customer.
- `GET /bookings` - List bookings for the current user role.
- `GET /bookings/:id` - Get booking details.
- `PATCH /bookings/:id` - Update booking status as serviceman/admin.
- `PATCH /bookings/:id/assign` - Assign serviceman as admin.
- `PATCH /bookings/:id/cancel` - Cancel booking as customer/admin.

## Payments

- `POST /payments/bookings/:bookingId/order` - Create Razorpay order.
- `POST /payments/razorpay/verify` - Verify Razorpay payment signature.

## Reviews

- `GET /reviews/serviceman/:servicemanId` - Public serviceman reviews.
- `GET /reviews/me` - Reviews by or for the current user.
- `POST /reviews` - Create review for a completed booking.
- `DELETE /reviews/:id` - Delete own review or admin delete.

## Admin

- `GET /admin/dashboard` - Platform summary.
- `GET /admin/users` - List users.
- `PATCH /admin/users/:id` - Update user role or active status.
