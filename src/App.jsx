import React, { useState } from 'react';
import CustomCursor from './components/CustomCursor';
import AIAssistantStudio from './components/AIAssistantStudio';
import ConversationPage from './components/ConversationPage';

export default function App() {
  // 'studio'       = Behance-style AI SaaS Dashboard (metric cards, copilot panel, sidebar)
  // 'conversation' = Dark beam AI conversation page (screenshot reference)
  const [view, setView] = useState('conversation');

  return (
    <div className="relative min-h-screen bg-void-950 text-white selection:bg-synapse-500 selection:text-white">
      <CustomCursor />

      {view === 'conversation' && (
        <ConversationPage onSwitchToStudio={() => setView('studio')} />
      )}

      {view === 'studio' && (
        <AIAssistantStudio onSwitchToConversation={() => setView('conversation')} />
      )}
    </div>
  );
}
