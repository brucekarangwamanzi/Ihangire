import React, { useState } from 'react';
import { getBusinessIdeas } from '../../services/geminiService';
import type { BusinessIdea, GroundingChunk } from '../../types';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import BusinessIdeaCard from '../BusinessIdeaCard';
import AnalysisModal from '../AnalysisModal';
import { ExternalLinkIcon, SearchIcon } from '../common/Icons';

const IdeasView: React.FC = () => {
  const [locationQuery, setLocationQuery] = useState('');
  const [searchedLocation, setSearchedLocation] = useState('');
  const [ideas, setIdeas] = useState<BusinessIdea[]>([]);
  const [sources, setSources] = useState<GroundingChunk[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIdea, setSelectedIdea] = useState<BusinessIdea | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleFetchIdeas = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!locationQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    setIdeas([]);
    setSources([]);
    setShowResults(true);
    setSearchedLocation(locationQuery);

    try {
      const result = await getBusinessIdeas(locationQuery);
      setIdeas(result.ideas);
      setSources(result.sources);
    } catch (err) {
      setError('Failed to fetch business ideas. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const onAnalyze = (idea: BusinessIdea) => {
    setSelectedIdea(idea);
  };

  const handleNewSearch = () => {
    setShowResults(false);
    setIdeas([]);
    setSources([]);
    setLocationQuery('');
    setSearchedLocation('');
  }
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center p-8 flex flex-col items-center justify-center space-y-4">
          <Spinner size="lg" />
          <p className="text-slate-400 animate-pulse">AI is analyzing "{searchedLocation}" for opportunities...</p>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="text-center">
          <p className="text-red-400 bg-red-900/50 p-4 rounded-lg mb-4">{error}</p>
          <Button onClick={handleNewSearch} variant="secondary">Try a New Search</Button>
        </div>
      );
    }

    if (ideas.length > 0) {
      return (
        <div>
           <Button onClick={handleNewSearch} variant="secondary" className="mb-4">
              <SearchIcon />
              Search Another Location
            </Button>
          <div className="space-y-4">
            {ideas.map((idea, index) => (
              <BusinessIdeaCard key={index} idea={idea} onAnalyze={() => onAnalyze(idea)} />
            ))}
            {sources.length > 0 && (
              <div className="mt-6 p-4 bg-slate-800 rounded-lg">
                  <h3 className="font-semibold text-slate-300 mb-2">Data Sources from Google Maps</h3>
                  <ul className="list-disc list-inside text-sm space-y-1">
                      {sources.map((source, index) => source.maps && (
                          <li key={index}>
                              <a href={source.maps.uri} target="_blank" rel="noopener noreferrer" className="text-brand-cyan hover:underline">
                                  {source.maps.title}
                                  <ExternalLinkIcon />
                              </a>
                          </li>
                      ))}
                  </ul>
              </div>
            )}
          </div>
        </div>
      );
    }
    
    return null; 
  };
  
  const renderSearchForm = () => (
     <div className="bg-slate-800 p-6 rounded-xl shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-2">Find Your Next Big Idea</h2>
        <p className="text-slate-400 mb-4">
          Enter a location, and our AI will analyze the area to generate unique business opportunities for you.
        </p>
        <form onSubmit={handleFetchIdeas} className="flex flex-col sm:flex-row items-stretch gap-2">
          <input
            type="text"
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            placeholder="e.g., 'Kigali City Market' or 'Musanze'"
            className="flex-grow bg-slate-700 border border-slate-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-cyan text-white"
            disabled={isLoading}
          />
          <Button type="submit" isLoading={isLoading} disabled={isLoading || !locationQuery.trim()} className="w-full sm:w-auto">
            <SearchIcon />
            <span className="ml-2">Analyze</span>
          </Button>
        </form>
      </div>
  );

  return (
    <div className="container mx-auto">
      {showResults ? renderContent() : renderSearchForm()}
      
      {selectedIdea && (
        <AnalysisModal idea={selectedIdea} onClose={() => setSelectedIdea(null)} />
      )}
    </div>
  );
};

export default IdeasView;