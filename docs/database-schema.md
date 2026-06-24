# Database Schema

## User

Stores customer, serviceman and admin accounts.

Key fields:

- `name`
- `email`
- `password`
- `role`
- `phone`
- `address`
- `serviceCategories`
- `serviceArea`
- `isAvailable`
- `isActive`

## Booking

Stores customer service requests and lifecycle state.

Key fields:

- `customer`
- `serviceman`
- `serviceType`
- `issueDescription`
- `acDetails`
- `address`
- `scheduledAt`
- `status`
- `pricing`
- `paymentStatus`
- `notes`
- `completedAt`

## Payment

Stores Razorpay order and payment verification details.

Key fields:

- `booking`
- `customer`
- `razorpayOrderId`
- `razorpayPaymentId`
- `razorpaySignature`
- `amount`
- `currency`
- `status`

## Review

Stores one customer review per completed booking.

Key fields:

- `customer`
- `serviceman`
- `booking`
- `rating`
- `comment`
