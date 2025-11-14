# Dabira Foods Backend

Node.js + Express API server with PostgreSQL database for the Dabira Foods food delivery system.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Neon PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Payment**: Paystack
- **Real-time**: Socket.io

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Monnify credentials are configured in Admin Settings
# Go to Admin Dashboard > Settings > Monnify Configuration
# Add your Monnify API Key, Secret Key, and Contract Code

# Server
PORT=5000
NODE_ENV=development

# Frontend URLs (for CORS)
MOBILE_APP_URL="http://localhost:8081"
ADMIN_APP_URL="http://localhost:3000"
```

### 3. Database Setup

#### Get Neon PostgreSQL Database

1. Go to [Neon](https://neon.tech)
2. Create a free account
3. Create a new project
4. Copy the connection string
5. Update `DATABASE_URL` in `.env`

#### Run Migrations

```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema to database
npm run prisma:push

# Or run migrations (for production)
npm run prisma:migrate
```

### 4. Create Admin User

After database setup, you can create an admin user by sending a POST request to `/api/auth/register`:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@dabirafoods.com",
    "password": "admin123",
    "name": "Admin User",
    "phone": "+1234567890",
    "role": "ADMIN"
  }'
```

### 5. Run Development Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Menu

- `GET /api/menu` - Get all menu items
- `GET /api/menu/categories` - Get all categories
- `GET /api/menu/:id` - Get single menu item
- `POST /api/menu` - Create menu item (admin only)
- `PUT /api/menu/:id` - Update menu item (admin only)
- `DELETE /api/menu/:id` - Delete menu item (admin only)

### Orders

- `POST /api/orders` - Create new order (protected)
- `GET /api/orders/my-orders` - Get user's orders (protected)
- `GET /api/orders/all` - Get all orders (admin only)
- `GET /api/orders/stats` - Get order statistics (admin only)
- `GET /api/orders/:id` - Get single order (protected)
- `PATCH /api/orders/:id/status` - Update order status (admin only)

### Payment

- `POST /api/payment/initialize` - Initialize Paystack payment (protected)
- `GET /api/payment/verify/:reference` - Verify payment (protected)
- `POST /api/payment/webhook` - Paystack webhook handler

### Settings

- `GET /api/settings` - Get restaurant settings
- `PUT /api/settings` - Update settings (admin only)

## Database Schema

### User
- id, email, password, name, phone, role, timestamps

### MenuItem
- id, name, description, price, category, image, available, timestamps

### Order
- id, userId, status, totalAmount, paymentStatus, paymentReference, deliveryAddress, customerName, customerPhone, notes, timestamps

### OrderItem
- id, orderId, menuItemId, quantity, price, timestamp

### Settings
- id, restaurantName, contact info, Paystack keys, delivery settings

## Socket.io Events

### Client → Server
- `join:admin` - Join admin room for notifications
- `join:user` - Join user-specific room

### Server → Client
- `order:new` - New order created (to admin)
- `order:updated` - Order updated (to admin)
- `order:statusUpdate` - Order status changed (to user)
- `payment:success` - Payment successful (to user)
- `order:paid` - Order paid (to admin)

## Prisma Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema changes to database (development)
npm run prisma:push

# Create and run migrations (production)
npm run prisma:migrate

# Open Prisma Studio (database GUI)
npm run prisma:studio
```

## Development

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start
```

## Testing

Use tools like Postman or Thunder Client to test the API endpoints.

Example authorization header for protected routes:
```
Authorization: Bearer <your-jwt-token>
```

## Troubleshooting

### Database Connection Issues
- Ensure your Neon PostgreSQL database is running
- Check that `DATABASE_URL` is correct in `.env`
- Verify SSL mode is set to `require` for Neon

### Monnify Integration
- Configure Monnify credentials in Admin Settings
- Get test credentials from [Monnify Dashboard](https://app.monnify.com)
- Use test credentials (MK_TEST_ prefix) for development
- Switch to live credentials (MK_PROD_ prefix) for production

### CORS Issues
- Update `MOBILE_APP_URL` and `ADMIN_APP_URL` in `.env`
- Ensure URLs match your frontend applications

## Production Deployment

1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET`
3. Switch to Monnify live credentials in Admin Settings
4. Run database migrations: `npm run prisma:migrate`
5. Use process manager like PM2

## License

MIT

