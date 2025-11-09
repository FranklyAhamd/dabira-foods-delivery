import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    color: #1a1a1a;
    overflow-x: hidden;
    line-height: 1.6;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.3;
  }

  html, body, #root {
    height: 100%;
    width: 100%;
  }

  a {
    text-decoration: none;
    color: inherit;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  }

  button {
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    font-weight: 600;
    cursor: pointer;
    border: none;
    outline: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    letter-spacing: -0.01em;
  }

  input, textarea, select {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    outline: none;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  /* Scrollbar Styles */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #ff6b6b 0%, #ee5a6f 100%);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, #ee5a6f 0%, #ff6b6b 100%);
  }

  /* Prevent text selection on buttons */
  button {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  /* Prevent iOS zoom on input focus */
  input, select, textarea {
    font-size: 16px;
  }

  /* Remove iOS input shadows */
  input, textarea {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }

  /* Smooth transitions for all elements */
  * {
    transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  }

  /* Modern focus styles */
  *:focus-visible {
    outline: 2px solid #ff6b6b;
    outline-offset: 2px;
  }
`;

export default GlobalStyles;

