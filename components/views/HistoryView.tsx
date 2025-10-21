import React, { useState, useEffect } from 'react';
import { getHistory } from '../../services/storageService';
import type { AppHistory, BusinessIdea, SavedNameList, ChatMessage, User } from '../../types';
import AnalysisModal from '../AnalysisModal';
import { BookmarkIcon } from '../common/Icons';

interface HistoryViewProps {
  user: User;
}

const HistoryView: React.FC<HistoryViewProps> = ({ user }) => {
  const [history, setHistory] = useState<AppHistory | null>(null);
  const [selectedIdea, setSelectedIdea] = useState<BusinessIdea | null>(null);

  useEffect(() => {
    setHistory(getHistory(user.email));
  }, [user.email]);
  
  const costColorMap = {
    Low: 'bg-green-500/20 text-green-300',
    Medium: 'bg-yellow-500/20 text-yellow-300',
    High: 'bg-red-500/20 text-red-300',
    default: 'bg-slate-600/20 text-slate-300',
  }

  if (!history) {
    return <div>Loading history...</div>;
  }
  
  const hasHistory = history.savedIdeas.length > 0 || history.savedNameLists.length > 0 || history.chatHistory.length > 1;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2 text-white">Your Research History</h2>
        <p className="text-slate-400">All your saved ideas, names, and conversations in one place.</p>
      </div>

      {!hasHistory && (
        <div className="text-center bg-slate-800 p-8 rounded-xl">
          <p className="text-slate-400">You haven't saved anything yet.</p>
          <p className="text-sm text-slate-500 mt-2">Start by analyzing a location for ideas or generating business names.</p>
        </div>
      )}

      {history.savedIdeas.length > 0 && (
        <section>
          <h3 className="text-xl font-semibold mb-4 text-brand-cyan border-b-2 border-slate-700 pb-2">Saved Business Ideas</h3>
          <div className="space-y-4">
            {history.savedIdeas.map((idea, index) => {
                const costKey = idea.startupCost as keyof typeof costColorMap;
                const costClasses = costColorMap[costKey] || costColorMap.default;
                return (
                    <div key={index} className="bg-slate-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <h4 className="font-bold text-lg">{idea.name}</h4>
                            <p className="text-sm text-slate-400">{idea.concept}</p>
                        </div>
                         <div className="flex items-center gap-4">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${costClasses}`}>
                                {idea.startupCost} Start-up
                            </span>
                            <button onClick={() => setSelectedIdea(idea)} className="text-sm text-brand-cyan hover:underline">View Analysis</button>
                        </div>
                    </div>
                );
            })}
          </div>
        </section>
      )}

      {history.savedNameLists.length > 0 && (
        <section>
          <h3 className="text-xl font-semibold mb-4 text-brand-cyan border-b-2 border-slate-700 pb-2">Saved Name Lists</h3>
          <div className="space-y-4">
            {history.savedNameLists.map((list, index) => (
              <div key={index} className="bg-slate-800 p-4 rounded-lg">
                <p className="text-sm text-slate-400 mb-2">For concept:</p>
                <h4 className="font-semibold text-white mb-3 italic">"{list.concept}"</h4>
                <div className="flex flex-wrap gap-2">
                  {list.names.map((name, nameIndex) => (
                    <span key={nameIndex} className="bg-slate-700 text-slate-300 text-sm px-3 py-1 rounded-full">{name}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      
      {history.chatHistory.length > 1 && ( // Assuming first message is always bot intro
        <section>
          <h3 className="text-xl font-semibold mb-4 text-brand-cyan border-b-2 border-slate-700 pb-2">Last Advisor Conversation</h3>
          <div className="bg-slate-800 p-4 rounded-lg max-h-96 overflow-y-auto space-y-3">
             {history.chatHistory.map((msg, index) => (
                <div key={index} className={`flex items-start gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-md px-3 py-2 rounded-xl text-sm ${ msg.sender === 'user' ? 'bg-brand-cyan text-slate-900 rounded-br-none' : 'bg-slate-700 text-white rounded-bl-none'}`}>
                        <p>{msg.text}</p>
                    </div>
                </div>
            ))}
          </div>
        </section>
      )}

      {selectedIdea && (
        <AnalysisModal idea={selectedIdea} onClose={() => setSelectedIdea(null)} />
      )}
    </div>
  );
};

export default HistoryView;
