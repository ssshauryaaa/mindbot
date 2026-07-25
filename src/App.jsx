import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CustomCursor from './components/CustomCursor';
import ConversationPage from './components/ConversationPage';
import LandingPage from './components/LandingPage';

export default function App() {
  return (
    <BrowserRouter>
      {/* Global decorative cursor */}
      <CustomCursor />

      <Routes>
        {/* / → Welcome + Chat */}
        <Route path="/" element={<ConversationPage />} />

        {/* /landing → Landing page */}
        <Route path="/landing" element={<LandingPage />} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
