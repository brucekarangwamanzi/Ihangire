
import React, { useState } from 'react';
import { generateImage } from '../../services/geminiService';
import Button from '../common/Button';
import Spinner from '../common/Spinner';

const ImageView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setImageUrl('');

    try {
      const url = await generateImage(prompt);
      setImageUrl(url);
    } catch (err) {
      console.error("Image generation error:", err);
      setError("Failed to generate image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Visualize Your Brand</h2>
        <p className="text-slate-400 mb-4">
          Enter a business concept to generate a unique logo idea with AI.
        </p>
        <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row items-stretch gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., 'A coffee shop for gamers'"
            className="flex-grow bg-slate-700 border border-slate-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand-cyan text-white"
            disabled={isLoading}
          />
          <Button type="submit" isLoading={isLoading} className="w-full sm:w-auto">
            Generate Logo
          </Button>
        </form>
      </div>

      <div className="bg-slate-800 p-4 rounded-xl shadow-lg min-h-[300px] flex items-center justify-center">
        {isLoading && (
          <div className="text-center space-y-3">
            <Spinner size="lg" />
            <p className="text-slate-400">Imagen is creating your logo...</p>
          </div>
        )}
        {error && <p className="text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</p>}
        {!isLoading && !error && imageUrl && (
          <img src={imageUrl} alt={prompt} className="rounded-lg max-w-full h-auto shadow-lg" />
        )}
         {!isLoading && !error && !imageUrl && (
          <p className="text-slate-500">Your generated logo will appear here.</p>
        )}
      </div>
    </div>
  );
};

export default ImageView;
