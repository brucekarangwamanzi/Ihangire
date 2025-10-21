import React, { useState, useRef, useEffect } from 'react';
import { chatWithBotStream } from '../../services/geminiService';
import { getHistory, saveChatHistory } from '../../services/storageService';
import type { ChatMessage, User } from '../../types';
import Button from '../common/Button';
import { PaperAirplaneIcon, PlusCircleIcon } from '../common/Icons';

interface ChatViewProps {
  user: User;
}

const conversationStarters = [
  "How do I validate a business idea?",
  "Suggest some low-cost marketing tricks",
  "What's a SWOT analysis for a cafe?",
  "Explain 'product-market fit' simply",
  "How do I register a company in Rwanda?",
  "Give me a pitch template for investors.",
];

const ChatView: React.FC<ChatViewProps> = ({ user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  // Load chat history on initial render
  useEffect(() => {
    const history = getHistory(user.email);
    if (history.chatHistory && history.chatHistory.length > 0) {
      setMessages(history.chatHistory);
    } else {
      setMessages([{ sender: 'bot', text: "Hello! I'm your AI business advisor. How can I help you brainstorm today?" }]);
    }
    isInitialized.current = true;
  }, [user.email]);

  // Save chat history whenever messages change
  useEffect(() => {
    // Prevent saving the initial empty/default state before hydration
    if (isInitialized.current && messages.length > 0) {
      saveChatHistory(messages, user.email);
    }
  }, [messages, user.email]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (prompt: string) => {
    if (!prompt.trim() || isLoading) return;

    const userMessage: ChatMessage = { sender: 'user', text: prompt };
    setMessages(prev => [...prev, userMessage, { sender: 'bot', text: '' }]);
    setInput('');
    setIsLoading(true);

    try {
      let fullResponse = '';
      for await (const chunk of chatWithBotStream(prompt)) {
        fullResponse += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage && lastMessage.sender === 'bot') {
            lastMessage.text = fullResponse;
          }
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage && lastMessage.sender === 'bot' && lastMessage.text === '') {
          lastMessage.text = "Sorry, I'm having trouble connecting. Please try again.";
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };
  
  return (
    <div className="flex flex-col h-[calc(100vh-160px)] bg-slate-800 rounded-xl shadow-lg">
      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-brand-cyan flex-shrink-0 self-start"></div>}
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl prose prose-invert prose-p:my-1 ${
                msg.sender === 'user' ? 'bg-brand-cyan text-slate-900 rounded-br-none' : 'bg-slate-700 text-white rounded-bl-none'
              }`}
            >
              <p className="whitespace-pre-wrap">
                {msg.text}
                {isLoading && msg.sender === 'bot' && index === messages.length - 1 && (
                    <span className="animate-pulse">▍</span>
                )}
              </p>
            </div>
          </div>
        ))}

        {messages.length <= 1 && !isLoading && (
             <div className="p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-slate-400 mb-3 text-center">Conversation Starters</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {conversationStarters.map((prompt, i) => (
                        <button 
                            key={i}
                            onClick={() => handleSend(prompt)}
                            disabled={isLoading}
                            className="flex items-center text-left text-sm p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <PlusCircleIcon />
                            <span>{prompt}</span>
                        </button>
                    ))}
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-slate-700">
        <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for business advice..."
            className="flex-grow bg-slate-700 border border-slate-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand-cyan text-white"
            disabled={isLoading}
          />
          <Button type="submit" isLoading={isLoading} disabled={isLoading || !input.trim()} className="!p-3">
            <PaperAirplaneIcon />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatView;
