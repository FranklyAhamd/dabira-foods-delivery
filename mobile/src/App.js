import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { PlateProvider } from './context/PlateContext';
import { ToastProvider } from './context/ToastContext';
import AppRoutes from './routes/AppRoutes';
import GlobalStyles from './styles/GlobalStyles';
import { API_URL } from './config/api';

// Server wake-up component - ensures server is awake when mobile app loads
const ServerWakeUp = () => {
  useEffect(() => {
    const wakeUpServer = async () => {
      const healthCheckUrl = API_URL.replace('/api', '/api/health');
      const maxRetries = 5;
      const baseDelay = 1000; // Start with 1 second

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          // Use fetch with AbortController for timeout (more compatible than AbortSignal.timeout)
          const controller = new AbortController();
          const timeout = attempt === 0 ? 5000 : 10000;
          const timeoutId = setTimeout(() => controller.abort(), timeout);
          
          const response = await fetch(healthCheckUrl, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            signal: controller.signal,
          });

          clearTimeout(timeoutId);
          
          if (response.ok) {
            console.log('✅ Server is awake and ready');
            return; // Success, exit retry loop
          }
        } catch (error) {
          // If it's the last attempt, log it but don't throw
          if (attempt === maxRetries - 1) {
            console.log('⚠️ Server wake-up attempt completed (may still be waking up)');
            return;
          }

          // Calculate delay with exponential backoff: 1s, 2s, 4s, 8s, 16s
          const delay = baseDelay * Math.pow(2, attempt);
          console.log(`🔄 Server wake-up attempt ${attempt + 1}/${maxRetries} failed, retrying in ${delay}ms...`);
          
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    };

    // Wake up server immediately when app loads
    wakeUpServer();
  }, []);

  return null; // This component doesn't render anything
};

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <PlateProvider>
              <ServerWakeUp />
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







