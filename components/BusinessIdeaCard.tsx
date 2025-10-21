import React from 'react';
import type { BusinessIdea } from '../../types';
import Button from './common/Button';

interface BusinessIdeaCardProps {
  idea: BusinessIdea;
  onAnalyze: () => void;
}

const costColorMap = {
  Low: 'bg-green-500/20 text-green-300',
  Medium: 'bg-yellow-500/20 text-yellow-300',
  High: 'bg-red-500/20 text-red-300',
  default: 'bg-slate-600/20 text-slate-300',
}

const BusinessIdeaCard: React.FC<BusinessIdeaCardProps> = ({ idea, onAnalyze }) => {
  const costKey = idea.startupCost as keyof typeof costColorMap;
  const costClasses = costColorMap[costKey] || costColorMap.default;
  
  return (
    <div className="bg-slate-800 rounded-lg shadow-md p-5 transition-transform hover:scale-[1.02] hover:shadow-cyan-500/10 duration-300">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold text-white pr-4">{idea.name}</h3>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${costClasses}`}>
          {idea.startupCost} Start-up
        </span>
      </div>
      <p className="text-slate-400 mt-2 mb-4">{idea.concept}</p>
      <div className="text-right">
        <Button onClick={onAnalyze} variant="secondary">
          Analyze Deeper
        </Button>
      </div>
    </div>
  );
};

export default BusinessIdeaCard;