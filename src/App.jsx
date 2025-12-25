import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserApp from './UserApp';
import AdminApp from './AdminApp';
import AdminPanel from './components/AdminPanel';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<UserApp />} />
        <Route path='/admin' element={<AdminApp />} />
        <Route path='/panel' element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
