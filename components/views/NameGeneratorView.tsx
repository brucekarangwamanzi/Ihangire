import React, { useState } from 'react';
import { generateBusinessNames } from '../../services/geminiService';
import { saveNameList } from '../../services/storageService';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import type { User } from '../../types';

interface NameGeneratorViewProps {
  user: User;
}

const NameGeneratorView: React.FC<NameGeneratorViewProps> = ({ user }) => {
  const [concept, setConcept] = useState('');
  const [names, setNames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedName, setCopiedName] = useState<string | null>(null);
  const [isListSaved, setIsListSaved] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!concept.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setNames([]);
    setIsListSaved(false);

    try {
      const result = await generateBusinessNames(concept);
      setNames(result);
    } catch (err) {
      console.error("Name generation error:", err);
      setError("Failed to generate names. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopy = (name: string) => {
    navigator.clipboard.writeText(name);
    setCopiedName(name);
    setTimeout(() => setCopiedName(null), 2000); // Reset after 2 seconds
  }

  const handleSaveList = () => {
    if (names.length > 0 && concept) {
        saveNameList({ concept, names }, user.email);
        setIsListSaved(true);
    }
  }

  const renderResults = () => {
    if (isLoading) {
      return (
        <div className="text-center space-y-3">
          <Spinner size="lg" />
          <p className="text-slate-400">AI is brainstorming names...</p>
        </div>
      );
    }
    
    if (error) {
        return <p className="text-red-400 bg-red-900/50 p-4 rounded-lg text-center">{error}</p>;
    }
    
    if (names.length > 0) {
        return (
            <div className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {names.map((name, index) => (
                        <div key={index} className="bg-slate-700 p-3 rounded-lg flex justify-between items-center group">
                            <span className="font-medium text-slate-200">{name}</span>
                            <button 
                                onClick={() => handleCopy(name)}
                                className="text-sm bg-slate-600 hover:bg-brand-cyan hover:text-slate-900 text-slate-300 font-semibold py-1 px-3 rounded-md transition-all opacity-0 group-hover:opacity-100"
                            >
                                {copiedName === name ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-6">
                    <Button onClick={handleSaveList} disabled={isListSaved} variant="secondary">
                        {isListSaved ? 'Saved to History' : 'Save Names'}
                    </Button>
                </div>
            </div>
        )
    }

    if (!isLoading && names.length === 0) {
        return <p className="text-slate-500 text-center">Your generated names will appear here.</p>
    }
    
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Craft the Perfect Name</h2>
        <p className="text-slate-400 mb-4">
          Describe your business concept, and let AI brainstorm creative names for you.
        </p>
        <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row items-stretch gap-2">
          <input
            type="text"
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            placeholder="e.g., 'Eco-friendly fashion brand in Kigali'"
            className="flex-grow bg-slate-700 border border-slate-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand-cyan text-white"
            disabled={isLoading}
          />
          <Button type="submit" isLoading={isLoading} disabled={isLoading || !concept.trim()} className="w-full sm:w-auto">
            Generate Names
          </Button>
        </form>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl shadow-lg min-h-[300px] flex items-center justify-center">
        {renderResults()}
      </div>
    </div>
  );
};

export default NameGeneratorView;
