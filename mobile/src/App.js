import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AppRoutes from './routes/AppRoutes';
import GlobalStyles from './styles/GlobalStyles';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <GlobalStyles />
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;




