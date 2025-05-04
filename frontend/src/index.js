// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { GlobalProvider } from './context/GlobalContext';

// Usamos createRoot para React 18
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderizamos la aplicación, envolviendo App con GlobalProvider para que el contexto esté disponible globalmente
root.render(
  <GlobalProvider>
    <App />
  </GlobalProvider>
);
