import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ConversationPage from './components/ConversationPage';
import LandingPage from './components/LandingPage';

function AppContent() {
  const location = useLocation();

  return (
    <>
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

