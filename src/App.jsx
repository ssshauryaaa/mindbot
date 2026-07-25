import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CustomCursor from './components/CustomCursor';
import ConversationPage  from './components/ConversationPage';
import AIAssistantStudio from './components/AIAssistantStudio';
import LandingPage       from './components/LandingPage';

export default function App() {
  return (
    <BrowserRouter>
      {/* Global decorative cursor */}
      <CustomCursor />

      <Routes>
        {/* / → Welcome + Chat (Behance conversation screen) */}
        <Route path="/"          element={<ConversationPage />} />

        {/* /landing → Landing page with landing.png */}
        <Route path="/landing"   element={<LandingPage />} />

        {/* /dashboard → Dashboard Studio (bento cards + copilot panel) */}
        <Route path="/dashboard" element={<AIAssistantStudio />} />

        {/* Catch-all redirect */}
        <Route path="*"          element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
