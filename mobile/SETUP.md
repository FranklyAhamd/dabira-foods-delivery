# Dabira Foods Mobile Web App - Setup Guide

## Quick Start

1. **Install Dependencies**
```bash
cd mobile
npm install
```

2. **Configure API**
- Open `src/config/api.js`
- Update `API_URL` to match your backend server:
```javascript
const API_URL = 'http://YOUR_BACKEND_IP:5000/api';
```

3. **Start Development Server**
```bash
npm start
```

The app will open at `http://localhost:3000`

## Testing on Mobile Devices

### On the Same WiFi Network

1. Find your computer's IP address:
   - Windows: `ipconfig` (look for IPv4 Address)
   - Mac/Linux: `ifconfig` or `ip addr`

2. Start the app and access from your mobile browser:
   ```
   http://YOUR_COMPUTER_IP:3000
   ```

### Example
If your computer's IP is `192.168.1.100`, access:
```
http://192.168.1.100:3000
```

## Features

✅ **Mobile-First Design**
- Responsive layout optimized for mobile screens
- Touch-friendly buttons and controls
- Bottom navigation for easy access
- Smooth scrolling and animations

✅ **Authentication**
- User login and registration
- Persistent sessions
- Protected routes

✅ **Menu Browsing**
- Search functionality
- Category filtering
- Item details view

✅ **Shopping Cart**
- Add/remove items
- Adjust quantities
- Persistent cart storage

✅ **Order Management**
- Place orders
- Track order status
- View order history

✅ **User Profile**
- Edit personal information
- Manage account settings

## Project Structure

```
mobile/
├── public/                 # Static files
├── src/
│   ├── components/         # Reusable components
│   │   └── Layout/         # Layout components
│   ├── config/             # Configuration
│   │   └── api.js          # API configuration
│   ├── context/            # Context providers
│   │   ├── AuthContext.js  # Authentication state
│   │   └── CartContext.js  # Cart state
│   ├── pages/              # Page components
│   │   ├── Auth/           # Login & Register
│   │   ├── Home/           # Home page
│   │   ├── Cart/           # Shopping cart
│   │   ├── Checkout/       # Checkout
│   │   ├── MyOrders/       # Order history
│   │   ├── OrderDetails/   # Order details
│   │   └── Profile/        # User profile
│   ├── routes/             # Routing
│   │   └── AppRoutes.js    # Route definitions
│   ├── styles/             # Global styles
│   ├── App.js              # Main component
│   └── index.js            # Entry point
└── package.json

```

## Building for Production

```bash
npm run build
```

The optimized build will be in the `build/` folder.

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Traditional Web Server
1. Build the app: `npm run build`
2. Upload the `build/` folder to your web server
3. Configure your server to serve `index.html` for all routes

## Troubleshooting

**Problem**: Can't connect to backend API
- **Solution**: Check that the backend is running and the API_URL in `src/config/api.js` is correct

**Problem**: App not accessible on mobile
- **Solution**: Ensure both devices are on the same WiFi network and firewall allows connections

**Problem**: Images not loading
- **Solution**: Check that image URLs from the backend API are accessible

**Problem**: White screen on load
- **Solution**: Check browser console for errors and ensure all dependencies are installed

## Browser Requirements

- Chrome/Safari/Firefox (latest 2 versions)
- JavaScript enabled
- Local storage enabled
- Cookies enabled

## Mobile Optimization

- Uses viewport meta tags for proper scaling
- Touch-optimized UI elements (min 44px tap targets)
- Prevents unwanted zoom on input focus
- Hardware-accelerated animations
- Optimized for 3G/4G networks

## Security

- JWT token authentication
- Secure HTTP-only storage recommended for production
- HTTPS required for production deployment
- XSS protection via React
- CSRF protection via SameSite cookies

## Support

For issues or questions, please check the main project documentation or contact the development team.







