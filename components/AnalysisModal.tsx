
import React, { useState, useEffect } from 'react';
import { analyzeBusinessIdea } from '../../services/geminiService';
import type { BusinessIdea } from '../../types';
import Spinner from './common/Spinner';

interface AnalysisModalProps {
  idea: BusinessIdea;
  onClose: () => void;
}

const AnalysisModal: React.FC<AnalysisModalProps> = ({ idea, onClose }) => {
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await analyzeBusinessIdea(idea);
        setAnalysis(result);
      } catch (err) {
        setError('Failed to get analysis. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [idea]);
  
  // A simple markdown to HTML converter for display
  const renderMarkdown = (text: string) => {
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line)
      .map((line, index) => {
        if (line.startsWith('### ')) return <h3 key={index} className="text-lg font-semibold mt-4 mb-1 text-brand-cyan">{line.substring(4)}</h3>
        if (line.startsWith('## ')) return <h2 key={index} className="text-xl font-bold mt-6 mb-2 text-brand-cyan">{line.substring(3)}</h2>
        if (line.startsWith('**') && line.endsWith('**')) return <p key={index} className="font-bold my-1 text-slate-200">{line.substring(2, line.length - 2)}</p>
        if (line.startsWith('* ')) return <li key={index} className="ml-5 list-disc">{line.substring(2)}</li>
        return <p key={index} className="my-1">{line}</p>
      });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-slate-800/80 backdrop-blur-sm p-5 border-b border-slate-700 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">Deep Dive Analysis</h2>
            <p className="text-sm text-slate-400">{idea.name}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">&times;</button>
        </div>
        
        <div className="p-5">
          {loading && (
            <div className="flex flex-col items-center justify-center space-y-4 my-8">
              <Spinner size="lg" />
              <p className="text-slate-400">Gemini Pro is thinking...</p>
              <p className="text-xs text-slate-500">This complex analysis may take a moment.</p>
            </div>
          )}
          {error && <p className="text-center text-red-400">{error}</p>}
          {!loading && !error && (
            <div className="prose prose-invert prose-p:text-slate-300 prose-li:text-slate-300 text-slate-300">
              {renderMarkdown(analysis)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisModal;
