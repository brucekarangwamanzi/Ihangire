
import React, { useState } from 'react';
import { useGeolocation } from '../../hooks/useGeolocation';
import { getBusinessIdeas } from '../../services/geminiService';
import type { BusinessIdea, GroundingChunk } from '../../types';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import BusinessIdeaCard from '../BusinessIdeaCard';
import AnalysisModal from '../AnalysisModal';
import { LocationMarkerIcon, ExternalLinkIcon } from '../common/Icons';

const IdeasView: React.FC = () => {
  const { coordinates, loading: geoLoading, error: geoError, getPosition } = useGeolocation();
  const [ideas, setIdeas] = useState<BusinessIdea[]>([]);
  const [sources, setSources] = useState<GroundingChunk[]>([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [selectedIdea, setSelectedIdea] = useState<BusinessIdea | null>(null);

  const handleFetchIdeas = async () => {
    if (!coordinates) return;
    setApiLoading(true);
    setApiError(null);
    setIdeas([]);
    setSources([]);
    try {
      const result = await getBusinessIdeas(coordinates);
      setIdeas(result.ideas);
      setSources(result.sources);
    } catch (err) {
      setApiError('Failed to fetch business ideas. Please try again.');
      console.error(err);
    } finally {
      setApiLoading(false);
    }
  };

  React.useEffect(() => {
    if (coordinates) {
      handleFetchIdeas();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinates]);

  const onAnalyze = (idea: BusinessIdea) => {
    setSelectedIdea(idea);
  };
  
  const renderContent = () => {
    if (geoLoading || apiLoading) {
      return (
        <div className="text-center p-8 flex flex-col items-center justify-center space-y-4">
          <Spinner size="lg" />
          <p className="text-slate-400 animate-pulse">{geoLoading ? 'Acquiring your location...' : 'AI is brainstorming ideas...'}</p>
        </div>
      );
    }

    if (geoError) {
      return <p className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">{geoError}</p>;
    }
    
    if (apiError) {
      return <p className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">{apiError}</p>;
    }

    if (ideas.length > 0) {
      return (
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
      );
    }
    
    return null; // Initial state before button click
  };

  return (
    <div className="container mx-auto">
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg mb-6 text-center">
        <h2 className="text-2xl font-bold mb-2">Discover Your Next Venture</h2>
        <p className="text-slate-400 mb-4">Get AI-powered business ideas tailored to your local area.</p>
        <Button onClick={getPosition} isLoading={geoLoading || apiLoading} disabled={geoLoading || apiLoading}>
          <LocationMarkerIcon />
          Find Ideas Near Me
        </Button>
      </div>
      
      {renderContent()}

      {selectedIdea && (
        <AnalysisModal idea={selectedIdea} onClose={() => setSelectedIdea(null)} />
      )}
    </div>
  );
};

export default IdeasView;
