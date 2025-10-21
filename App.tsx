
import React, { useState } from 'react';
import IdeasView from './components/views/IdeasView';
import ChatView from './components/views/ChatView';
import ImageView from './components/views/ImageView';
import { LightbulbIcon, MessageIcon, ImageIcon, BrandIcon } from './components/common/Icons';

type View = 'ideas' | 'chat' | 'image';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('ideas');

  const renderView = () => {
    switch (activeView) {
      case 'ideas':
        return <IdeasView />;
      case 'chat':
        return <ChatView />;
      case 'image':
        return <ImageView />;
      default:
        return <IdeasView />;
    }
  };

  const NavItem = ({ view, label, icon }: { view: View; label: string; icon: React.ReactNode }) => (
    <button
      onClick={() => setActiveView(view)}
      className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
        activeView === view ? 'text-brand-cyan' : 'text-slate-400 hover:text-white'
      }`}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col font-sans">
      <header className="bg-slate-800/50 backdrop-blur-sm shadow-lg p-4 sticky top-0 z-10 border-b border-slate-700">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
            <BrandIcon />
            <h1 className="text-xl font-bold text-white tracking-tight">Ihangire Youth</h1>
        </div>
      </header>
      
      <main className="flex-grow p-4 md:p-6 mb-16">
        <div className="max-w-4xl mx-auto">
            {renderView()}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 shadow-t-lg z-10">
        <div className="max-w-4xl mx-auto flex justify-around">
          <NavItem view="ideas" label="Ideas" icon={<LightbulbIcon />} />
          <NavItem view="chat" label="Advisor" icon={<MessageIcon />} />
          <NavItem view="image" label="Visualize" icon={<ImageIcon />} />
        </div>
      </nav>
    </div>
  );
};

export default App;