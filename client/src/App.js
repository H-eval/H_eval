import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './page/Login';
import Home from './page/Home';
import TranslatePage from './page/ViewTranslations'; 
import LineViewer from './page/LineViewer';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />

        {/* Existing translation page */}
        <Route path="/translate/:fileId" element={<TranslatePage />} />

        {/* New route for testing LineViewer directly */}
        <Route path="/lineviewer" element={<LineViewer />} />
        <Route path="/lineviewer/:fileId" element={<LineViewer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
