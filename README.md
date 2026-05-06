# Delivery API

Starter backend scaffold for a delivery service API.

## Structure

- `app.js`: application bootstrap (env loading, startup, server listen)
- `express-app.js`: global middleware setup
- `http-server.js`: HTTP server factory
- `app_backend/routes`: API route modules
- `app_backend/controller`: business logic handlers
- `app_backend/middleware`: request-level middlewares
- `app_backend/utils`: response and error helpers
- `app_backend/config`: sequelize config for local/staging/production
- `app_backend/db/models`: DB connection bootstrap

## Quick Start

1. Install dependencies:
   - `npm install`
2. Create env file:
   - copy `.env.example` to `.env.local` (or `.env`)
3. Run server:
   - `npm run dev` for development
   - `npm start` for normal run

## Basic Endpoints

- `GET /` -> base welcome
- `GET /api/health` -> health check
- `GET /api/delivery/orders` -> list orders
- `GET /api/delivery/orders/:id` -> get one order
- `POST /api/delivery/orders` -> create order
- `PATCH /api/delivery/orders/:id/status` -> update order status
- `POST /api/auth/signup` -> register user and send email verification OTP
- `POST /api/auth/verify-email-otp` -> verify email after signup
- `POST /api/auth/resend-email-otp` -> resend signup OTP
- `POST /api/auth/login` -> login with email/password
- `POST /api/auth/forgot-password` -> send reset password OTP
- `POST /api/auth/reset-password` -> reset password using OTP

### Create Order Payload

```json
{
  "customer_name": "John Doe",
  "pickup_address": "Warehouse A",
  "dropoff_address": "Main Street 10"
}
```

### Update Status Payload

```json
{
  "status": "assigned"
}
```

### Signup Payload

```json
{
  "first_name": "Sohaib",
  "last_name": "Khan",
  "email": "sohaib@example.com",
  "phone_number": "03001234567",
  "password": "Passw0rdA!",
  "confirm_password": "Passw0rdA!",
  "fcm_token": "fcm-token",
  "token": "device-token",
  "role": "customer"
}
```

### Verify Email OTP Payload

```json
{
  "email": "sohaib@example.com",
  "otp": "1234"
}
```

### Login Payload

```json
{
  "email": "sohaib@example.com",
  "password": "Passw0rdA!"
}
```

### Forgot Password Payload

```json
{
  "email": "sohaib@example.com"
}
```

### Reset Password Payload

```json
{
  "email": "sohaib@example.com",
  "otp": "1234",
  "password": "Passw0rdB!",
  "confirm_password": "Passw0rdB!"
}
```
