# Dabira Foods Admin Dashboard

React web admin dashboard for managing the Dabira Foods food delivery system.

## Tech Stack

- **Framework**: React
- **Routing**: React Router v6
- **Styling**: Styled Components
- **State Management**: Context API
- **HTTP Client**: Axios
- **Real-time**: Socket.io Client
- **Charts**: Recharts

## Features

- Admin authentication (only ADMIN/MANAGER roles)
- Dashboard with statistics and insights
- Menu management (CRUD operations)
- Order management with real-time updates
- Status tracking and updates
- Settings configuration
- Real-time notifications for new orders

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Update the API URL in `src/config/api.js`:

```javascript
const API_URL = 'http://localhost:5000/api';
```

### 3. Run the App

```bash
npm start
```

The app will open at `http://localhost:3000`

## Project Structure

```
admin/
├── public/
│   └── index.html
├── src/
│   ├── components/       # Reusable components
│   │   └── Layout/       # Main layout with sidebar
│   ├── context/          # Context providers
│   │   └── AuthContext.js
│   ├── pages/            # All page components
│   │   ├── Login/
│   │   ├── Dashboard/
│   │   ├── MenuManagement/
│   │   ├── Orders/
│   │   └── Settings/
│   ├── config/           # Configuration files
│   │   └── api.js
│   ├── styles/           # Global styles
│   │   └── GlobalStyles.js
│   ├── App.js            # Main app component
│   └── index.js          # Entry point
└── package.json
```

## Pages

### 1. Login (`/login`)
- Admin authentication
- Only ADMIN and MANAGER roles allowed
- JWT token storage

### 2. Dashboard (`/`)
- Overview statistics
  - Total orders
  - Pending orders
  - Completed orders
  - Total revenue
  - Today's orders
- Recent orders list
- Popular menu items
- Real-time updates

### 3. Menu Management (`/menu`)
- View all menu items
- Add new menu items
- Edit existing items
- Delete items
- Toggle availability
- Image URL support

### 4. Orders (`/orders`)
- View all orders
- Filter by status (All, Pending, Confirmed, etc.)
- Update order status
- View detailed order information
- Real-time order notifications
- Customer details and delivery info

### 5. Settings (`/settings`)
- Restaurant information
- Contact details
- Paystack configuration (API keys)
- Delivery settings
- Operating hours

## Styling Pattern

Each page follows the pattern:
- `PageName.jsx` - Main component
- `PageNameStyles.js` - Styled components

Example:
```javascript
// Dashboard.jsx
import { Container, PageTitle } from './DashboardStyles';

// DashboardStyles.js
import styled from 'styled-components';
export const Container = styled.div`...`;
export const PageTitle = styled.h1`...`;
```

## Authentication

### Creating Admin User

First, register an admin user via the backend API:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@dabirafoods.com",
    "password": "admin123",
    "name": "Admin User",
    "role": "ADMIN"
  }'
```

Then login with these credentials in the dashboard.

### Role-Based Access

Only users with `ADMIN` or `MANAGER` roles can access the dashboard. The AuthContext checks the user's role on login and blocks access for regular `CUSTOMER` users.

## Real-time Features

The dashboard uses Socket.io for real-time updates:

```javascript
// Connect to Socket.io server
const socket = io(API_URL.replace('/api', ''));

// Join admin room
socket.emit('join:admin');

// Listen for new orders
socket.on('order:new', (order) => {
  // Update orders list
});

// Listen for order updates
socket.on('order:updated', (order) => {
  // Update order status
});
```

## Menu Management

### Adding Menu Items

1. Click "Add New Item"
2. Fill in the form:
   - Name (required)
   - Description (required)
   - Category (required)
   - Price (required)
   - Image URL (optional)
   - Available (yes/no)
3. Click "Create"

### Editing Items

1. Click "Edit" on any menu item
2. Modify the fields
3. Click "Update"

### Deleting Items

1. Click "Delete" on any menu item
2. Confirm deletion

## Order Management

### Order Status Flow

1. **PENDING** - Order placed, payment pending
2. **CONFIRMED** - Payment successful, order confirmed
3. **IN_PROGRESS** - Restaurant preparing order
4. **OUT_FOR_DELIVERY** - Order sent for delivery
5. **DELIVERED** - Order completed
6. **CANCELLED** - Order cancelled

### Updating Order Status

1. Find the order in the orders list
2. Use the dropdown in the "Actions" column
3. Select new status
4. Customer receives real-time notification

### Viewing Order Details

Click on the Order ID to view:
- Order information
- Customer details
- Delivery address
- Order items breakdown
- Payment status

## Settings Configuration

### Restaurant Settings

Update basic information about your restaurant:
- Name
- Address
- Phone
- Email
- Operating hours

### Paystack Configuration

Add your Paystack API keys:
- Public Key (pk_test_... or pk_live_...)
- Secret Key (sk_test_... or sk_live_...)

Get keys from: https://dashboard.paystack.com

### Delivery Settings

Configure:
- Delivery fee
- Minimum order amount

## Development

### Adding New Pages

1. Create page component: `src/pages/NewPage/NewPage.jsx`
2. Create styles: `src/pages/NewPage/NewPageStyles.js`
3. Add route in `src/App.js`
4. Add navigation item in `src/components/Layout/Layout.jsx`

### API Integration

All API calls use the configured axios instance:

```javascript
import api from '../../config/api';

// GET request
const response = await api.get('/endpoint');

// POST request
const response = await api.post('/endpoint', data);

// PUT request
const response = await api.put('/endpoint/:id', data);

// DELETE request
const response = await api.delete('/endpoint/:id');
```

## Building for Production

```bash
# Create production build
npm run build

# The build folder is ready to be deployed
```

Deploy the `build` folder to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

## Environment Variables

For production, update:
- API_URL in `src/config/api.js` to your production backend URL

## Troubleshooting

### Cannot login

- Ensure user has ADMIN or MANAGER role
- Check backend is running
- Verify API_URL is correct

### Real-time updates not working

- Check Socket.io connection in browser console
- Verify backend Socket.io server is running
- Check CORS settings

### Orders not showing

- Verify authentication token
- Check API endpoint permissions
- Look for errors in browser console

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Performance Tips

- Dashboard auto-updates with Socket.io, no need to refresh
- Use filter buttons to reduce displayed data
- Order details modal loads on demand

## Security

- JWT tokens stored in localStorage
- Automatic logout on 401 errors
- Role-based access control
- Secure API communication

## License

MIT

