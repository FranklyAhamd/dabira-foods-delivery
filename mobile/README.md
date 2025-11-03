# Dabira Foods Mobile Web App

A mobile-first, responsive React web application for the Dabira Foods food delivery service.

## Features

- 📱 **Mobile-First Design**: Optimized for mobile devices with responsive layout
- 🔐 **User Authentication**: Login and registration
- 🍔 **Menu Browsing**: Browse food items by category
- 🛒 **Shopping Cart**: Add items, adjust quantities, persistent cart
- 📦 **Order Management**: Place orders, track status, view history
- 👤 **User Profile**: Manage personal information
- 🎨 **Modern UI**: Clean, intuitive interface with smooth animations

## Tech Stack

- **React 18**: Modern React with Hooks
- **React Router**: Client-side routing
- **Styled Components**: CSS-in-JS styling
- **Axios**: HTTP client for API calls
- **Context API**: State management

## Installation

1. Navigate to the mobile directory:
```bash
cd mobile
```

2. Install dependencies:
```bash
npm install
```

3. Update API configuration:
   - Open `src/config/api.js`
   - Update the `API_URL` constant to match your backend server

## Running the App

Start the development server:
```bash
npm start
```

The app will open in your browser at `http://localhost:3000`

## Testing on Mobile Devices

### On the Same Network

1. Find your computer's IP address
2. Start the app with:
```bash
HOST=0.0.0.0 npm start
```
3. Access from mobile browser: `http://YOUR_IP:3000`

### Using ngrok (for external access)

1. Install ngrok
2. Start the app: `npm start`
3. In another terminal: `ngrok http 3000`
4. Use the ngrok URL on any device

## Building for Production

Create an optimized production build:
```bash
npm run build
```

The build folder will contain the production-ready files.

## Project Structure

```
mobile/
├── public/
│   ├── index.html          # HTML template
│   └── manifest.json       # PWA manifest
├── src/
│   ├── components/         # Reusable components
│   │   └── Layout/         # Layout components
│   ├── config/             # Configuration files
│   │   └── api.js          # API configuration
│   ├── context/            # React Context providers
│   │   ├── AuthContext.js  # Authentication state
│   │   └── CartContext.js  # Shopping cart state
│   ├── pages/              # Page components
│   │   ├── Auth/           # Login & Register
│   │   ├── Home/           # Home page
│   │   ├── Cart/           # Shopping cart
│   │   ├── Checkout/       # Checkout process
│   │   ├── MyOrders/       # Order history
│   │   ├── OrderDetails/   # Order details
│   │   └── Profile/        # User profile
│   ├── routes/             # Routing configuration
│   │   └── AppRoutes.js    # Route definitions
│   ├── styles/             # Global styles
│   │   └── GlobalStyles.js # Global CSS
│   ├── App.js              # Main App component
│   └── index.js            # Entry point
└── package.json            # Dependencies

```

## Mobile Features

- **Touch-Optimized**: All buttons and interactive elements are sized for easy tapping
- **Bottom Navigation**: Easy-to-reach navigation at the bottom of the screen
- **Swipe-Friendly**: Smooth scrolling and intuitive gestures
- **Responsive Images**: Optimized image loading for mobile networks
- **Form Validation**: Clear error messages and helpful hints
- **Loading States**: Visual feedback during data fetching

## Browser Support

- Chrome (Android & iOS)
- Safari (iOS)
- Firefox (Android)
- Samsung Internet
- Edge (Android)

## Integration with Backend

The app connects to the Dabira Foods backend API at the configured URL. Make sure your backend is running and accessible.

### API Endpoints Used:
- `/api/auth/register` - User registration
- `/api/auth/login` - User login
- `/api/auth/profile` - User profile
- `/api/menu` - Get menu items
- `/api/menu/categories` - Get categories
- `/api/orders` - Create and manage orders
- `/api/orders/my-orders` - User's order history

## Deployment

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

## Troubleshooting

**Issue**: API calls fail
- **Solution**: Check that your backend is running and the API_URL in `src/config/api.js` is correct

**Issue**: App not accessible on mobile
- **Solution**: Ensure your mobile device is on the same network and firewall allows connections

**Issue**: Images not loading
- **Solution**: Check image URLs in the backend API responses

## License

This project is proprietary and confidential.




