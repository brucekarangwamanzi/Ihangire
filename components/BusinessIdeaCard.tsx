import React from 'react';
import type { BusinessIdea } from '../../types';
import Button from './common/Button';
import { BookmarkIcon } from './common/Icons';

interface BusinessIdeaCardProps {
  idea: BusinessIdea;
  onAnalyze: () => void;
  onSave: () => void;
  isSaved: boolean;
}

const costColorMap = {
  Low: 'bg-green-500/20 text-green-300',
  Medium: 'bg-yellow-500/20 text-yellow-300',
  High: 'bg-red-500/20 text-red-300',
  default: 'bg-slate-600/20 text-slate-300',
}

const BusinessIdeaCard: React.FC<BusinessIdeaCardProps> = ({ idea, onAnalyze, onSave, isSaved }) => {
  const costKey = idea.startupCost as keyof typeof costColorMap;
  const costClasses = costColorMap[costKey] || costColorMap.default;
  
  return (
    <div className="bg-slate-800 rounded-lg shadow-md p-5 transition-transform hover:scale-[1.02] hover:shadow-cyan-500/10 duration-300 flex flex-col">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold text-white pr-4">{idea.name}</h3>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${costClasses}`}>
          {idea.startupCost} Start-up
        </span>
      </div>
      <p className="text-slate-400 mt-2 mb-4 flex-grow">{idea.concept}</p>
      <div className="flex justify-end items-center gap-2">
         <button onClick={onSave} className={`p-2 rounded-full transition-colors ${isSaved ? 'text-brand-cyan' : 'text-slate-400 hover:text-white'}`} title={isSaved ? 'Saved' : 'Save Idea'}>
            <BookmarkIcon saved={isSaved} />
        </button>
        <Button onClick={onAnalyze} variant="secondary">
          Analyze Deeper
        </Button>
      </div>
    </div>
  );
};

export default BusinessIdeaCard;