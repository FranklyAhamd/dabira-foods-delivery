import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Suppress ResizeObserver errors - these are benign browser warnings
const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('ResizeObserver loop completed with undelivered notifications')
  ) {
    return;
  }
  originalError.call(console, ...args);
};

// Also handle window error events
window.addEventListener('error', (event) => {
  if (event.message?.includes('ResizeObserver')) {
    event.preventDefault();
    return false;
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

