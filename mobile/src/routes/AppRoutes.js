import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Auth Pages
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';

// Main Pages
import Landing from '../pages/Landing/Landing';
import Menu from '../pages/Menu/Menu';
import MenuItemDetails from '../pages/MenuItemDetails/MenuItemDetails';
import Cart from '../pages/Cart/Cart';
import Checkout from '../pages/Checkout/Checkout';
import OrderConfirmation from '../pages/OrderConfirmation/OrderConfirmation';
import PaymentCallback from '../pages/PaymentCallback/PaymentCallback';
import MyOrders from '../pages/MyOrders/MyOrders';
import OrderDetails from '../pages/OrderDetails/OrderDetails';
import Profile from '../pages/Profile/Profile';

// Layout
import MainLayout from '../components/Layout/MainLayout';
import AuthLayout from '../components/Layout/AuthLayout';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route Component (redirects to home if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return !isAuthenticated ? children : <Navigate to="/" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        <PublicRoute>
          <AuthLayout>
            <Login />
          </AuthLayout>
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <AuthLayout>
            <Register />
          </AuthLayout>
        </PublicRoute>
      } />

      {/* Main App Routes with Layout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Landing />} />
        <Route path="menu" element={<Menu />} />
        <Route path="menu/:id" element={<MenuItemDetails />} />
        <Route path="cart" element={<Cart />} />
        
        {/* Checkout - accessible to both guests and authenticated users */}
        <Route path="checkout" element={<Checkout />} />
        
        {/* Order Confirmation - accessible to both guests and authenticated users */}
        <Route path="order-confirmation" element={<OrderConfirmation />} />
        
        {/* Payment Callback - accessible to both guests and authenticated users */}
        <Route path="payment/callback" element={<PaymentCallback />} />
        
        {/* Protected Routes */}
        <Route path="my-orders" element={
          <ProtectedRoute>
            <MyOrders />
          </ProtectedRoute>
        } />
        <Route path="order/:id" element={
          <ProtectedRoute>
            <OrderDetails />
          </ProtectedRoute>
        } />
        <Route path="profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
      </Route>

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;




