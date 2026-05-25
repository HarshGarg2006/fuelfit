import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import store from './store/store';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { background: '#1a1a1a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' },
            success: { iconTheme: { primary: '#00ff88', secondary: '#1a1a1a' } },
            error: { iconTheme: { primary: '#ff2d2d', secondary: '#1a1a1a' } },
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
