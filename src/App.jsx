import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import UserApp from './UserApp';
import AdminApp from './AdminApp';
import AdminPanel from './components/AdminPanel';

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          // Default options
          duration: 4000,
          style: {
            background: 'rgba(0, 0, 0, 0.9)',
            color: '#00f3ff',
            border: '1px solid rgba(0, 243, 255, 0.3)',
            borderRadius: '8px',
            backdropFilter: 'blur(10px)',
            fontSize: '14px',
            fontFamily: 'monospace',
            maxWidth: '500px',
          },
          // Success toast style
          success: {
            iconTheme: {
              primary: '#00ff41',
              secondary: 'rgba(0, 0, 0, 0.9)',
            },
            style: {
              border: '1px solid rgba(0, 255, 65, 0.3)',
            },
          },
          // Error toast style
          error: {
            iconTheme: {
              primary: '#ff0055',
              secondary: 'rgba(0, 0, 0, 0.9)',
            },
            style: {
              border: '1px solid rgba(255, 0, 85, 0.3)',
            },
          },
        }}
      />
      <Routes>
        <Route path='/' element={<UserApp />} />
        <Route path='/admin' element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
