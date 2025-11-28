import React, { useState } from 'react';
import { Search, Loader2, ArrowRight } from 'lucide-react';

interface HeroProps {
  onSearch: (term: string) => void;
  isLoading: boolean;
}

const Hero: React.FC<HeroProps> = ({ onSearch, isLoading }) => {
  const [term, setTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (term.trim()) {
      onSearch(term);
    }
  };

  const suggestions = ['SaaS for Dog Walkers', 'AI Legal Assistant', 'Sustainable Fashion Marketplace', 'EdTech for Seniors'];

  return (
    <div className="relative overflow-hidden py-16 sm:py-24">
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/20 blur-[100px]" />
        <div className="absolute top-20 -left-20 h-72 w-72 rounded-full bg-secondary/20 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
          Turn Keywords into <br />
          <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            Next-Gen Startups
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
          Generate detailed business ideas, problem statements, and monetization strategies in seconds using advanced AI.
        </p>

        <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-xl">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Enter a topic, industry, or problem..."
              className="block w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-12 text-white placeholder-gray-500 backdrop-blur-sm transition-all focus:border-primary focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="absolute inset-y-0 right-2 flex items-center">
              <button
                type="submit"
                disabled={isLoading || !term.trim()}
                className="rounded-xl bg-primary p-2 text-white transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <ArrowRight className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </form>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <span className="text-sm text-gray-500">Try:</span>
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => {
                setTerm(s);
                onSearch(s);
              }}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300 transition-colors hover:border-white/20 hover:bg-white/10"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;