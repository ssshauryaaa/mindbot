import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import CustomCursor from './components/CustomCursor';
import ConversationPage from './components/ConversationPage';
import LandingPage from './components/LandingPage';

function AppContent() {
  const location = useLocation();

  return (
    <>
      {/* Decorative cursor on Landing Page only */}
      {location.pathname === '/landing' && <CustomCursor />}

      <Routes>
        {/* / → Welcome + Chat */}
        <Route path="/" element={<ConversationPage />} />

        {/* /landing → Landing page */}
        <Route path="/landing" element={<LandingPage />} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

