import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { PlateProvider } from './context/PlateContext';
import { ToastProvider } from './context/ToastContext';
import AppRoutes from './routes/AppRoutes';
import GlobalStyles from './styles/GlobalStyles';

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <PlateProvider>
              <GlobalStyles />
              <AppRoutes />
            </PlateProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;







