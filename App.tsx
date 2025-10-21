import React, { useState, useEffect } from 'react';
import IdeasView from './components/views/IdeasView';
import ChatView from './components/views/ChatView';
import ImageView from './components/views/ImageView';
import NameGeneratorView from './components/views/NameGeneratorView';
import HistoryView from './components/views/HistoryView';
import AuthView from './components/views/AuthView';
import { LightbulbIcon, MessageIcon, ImageIcon, BrandIcon, TagIcon, HistoryIcon, LogoutIcon } from './components/common/Icons';
import { getCurrentUser, logout } from './services/authService';
import type { User } from './types';

type View = 'ideas' | 'chat' | 'image' | 'namer' | 'history';

const ImigongoPattern = () => (
    <svg width="100%" height="100%" className="absolute inset-0 w-full h-full">
        <defs>
            <pattern id="imigongo" patternUnits="userSpaceOnUse" width="80" height="80" patternTransform="scale(1) rotate(45)">
                <path d="M -10 40 L 40 90 L 90 40" stroke="currentColor" strokeWidth="4" fill="none" />
                <path d="M -10 0 L 40 50 L 90 0" stroke="currentColor" strokeWidth="4" fill="none" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#imigongo)" />
    </svg>
);


const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('ideas');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    setActiveView('ideas'); // Reset to default view on logout
  };
  
  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
  }

  if (!user) {
    return (
       <div className="min-h-screen bg-slate-900 flex flex-col font-sans relative">
         <div className="absolute inset-0 text-slate-800 opacity-[0.03] overflow-hidden">
            <ImigongoPattern />
         </div>
         <div className="relative z-[1] flex-grow flex items-center justify-center p-4">
            <AuthView onAuthSuccess={handleAuthSuccess} />
         </div>
       </div>
    );
  }

  const renderView = () => {
    switch (activeView) {
      case 'ideas':
        return <IdeasView user={user} />;
      case 'chat':
        return <ChatView user={user} />;
      case 'image':
        return <ImageView />;
      case 'namer':
        return <NameGeneratorView user={user} />;
      case 'history':
        return <HistoryView user={user} />;
      default:
        return <IdeasView user={user} />;
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
    <div className="min-h-screen bg-slate-900 flex flex-col font-sans relative">
      <div className="absolute inset-0 text-slate-800 opacity-[0.03] overflow-hidden">
        <ImigongoPattern />
      </div>
      <div className="relative z-[1] flex flex-col min-h-screen">
        <header className="bg-slate-900/70 backdrop-blur-sm shadow-lg p-4 sticky top-0 z-10 border-b border-slate-700">
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <BrandIcon />
                    <h1 className="text-xl font-bold text-white tracking-tight">Ihangire Youth</h1>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-400 hidden sm:block">{user.email}</span>
                  <button onClick={handleLogout} className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors" title="Logout">
                    <LogoutIcon />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
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
            <NavItem view="namer" label="Namer" icon={<TagIcon />} />
            <NavItem view="history" label="History" icon={<HistoryIcon />} />
            <NavItem view="image" label="Visualize" icon={<ImageIcon />} />
            </div>
        </nav>
      </div>
    </div>
  );
};

export default App;
