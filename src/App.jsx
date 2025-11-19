import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserApp from './UserApp';
import AdminApp from './AdminApp';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<UserApp />} />
        <Route path='/admin' element={<AdminApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
