import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Apply theme from system preference or saved setting
const saved = localStorage.getItem('jumbo-theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const theme = saved ?? (prefersDark ? 'dark' : 'light');
document.documentElement.className = theme;

// Detect low-end hardware for graceful solid fallback (Spec §19)
const isLowPerf =
  (typeof navigator !== 'undefined' && (
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) ||
    ((navigator as any).deviceMemory && (navigator as any).deviceMemory <= 2)
  ));
if (isLowPerf) {
  document.documentElement.classList.add('low-perf');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
