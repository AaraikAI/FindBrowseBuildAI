import React, { useState, useEffect, useCallback } from 'react';
import { Idea, ViewMode, FilterState, GenerationStatus } from './types';
import { SAMPLE_IDEAS } from './constants';
import { generateIdeas } from './services/geminiService';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FilterBar from './components/FilterBar';
import IdeaCard from './components/IdeaCard';
import IdeaModal from './components/IdeaModal';
import { Loader2, Plus, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [savedIdeas, setSavedIdeas] = useState<Idea[]>([]);
  const [view, setView] = useState<ViewMode>(ViewMode.EXPLORE);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [status, setStatus] = useState<GenerationStatus>('IDLE');
  const [errorMsg, setErrorMsg] = useState<string>('');
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'All',
    difficulty: 'All'
  });

  // Load saved ideas on mount
  useEffect(() => {
    const saved = localStorage.getItem('find_browse_build_saved');
    if (saved) {
      try {
        setSavedIdeas(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved ideas", e);
      }
    }
  }, []);

  // Save ideas when list changes
  useEffect(() => {
    localStorage.setItem('find_browse_build_saved', JSON.stringify(savedIdeas));
  }, [savedIdeas]);

  const handleSearch = async (term: string) => {
    setStatus('LOADING');
    setErrorMsg('');
    setView(ViewMode.EXPLORE);
    try {
      const newIdeas = await generateIdeas(term);
      setIdeas(newIdeas);
      setStatus('SUCCESS');
    } catch (e) {
      console.error(e);
      setStatus('ERROR');
      setErrorMsg("Failed to generate ideas. Please check your API key or try again.");
    }
  };

  const toggleSave = (idea: Idea) => {
    setSavedIdeas(prev => {
      const isAlreadySaved = prev.some(i => i.id === idea.id);
      if (isAlreadySaved) {
        return prev.filter(i => i.id !== idea.id);
      } else {
        return [...prev, idea];
      }
    });
  };

  // When an artifact is generated inside the modal, we need to update the idea in state
  const handleUpdateIdea = (updatedIdea: Idea) => {
      // Update in ideas list if present
      setIdeas(prev => prev.map(i => i.id === updatedIdea.id ? updatedIdea : i));
      
      // Update in saved list if present
      setSavedIdeas(prev => prev.map(i => i.id === updatedIdea.id ? updatedIdea : i));

      // Update selected idea to reflect changes immediately
      setSelectedIdea(updatedIdea);
  };

  const handleMoreIdeas = (newIdeas: Idea[]) => {
      setIdeas(prev => [...newIdeas, ...prev]);
  };

  // Filter Logic
  const currentList = view === ViewMode.EXPLORE ? ideas : savedIdeas;
  
  const filteredIdeas = currentList.filter(idea => {
    const matchCategory = filters.category === 'All' || idea.category === filters.category;
    const matchDifficulty = filters.difficulty === 'All' || idea.difficulty === filters.difficulty;
    const matchSearch = idea.title.toLowerCase().includes(filters.search.toLowerCase()) || 
                        idea.oneLiner.toLowerCase().includes(filters.search.toLowerCase());
    return matchCategory && matchDifficulty && matchSearch;
  });

  return (
    <div className="min-h-screen bg-dark text-slate-200 font-sans selection:bg-primary/30">
      <Navbar 
        currentView={view} 
        setView={setView} 
        savedCount={savedIdeas.length} 
      />

      {view === ViewMode.EXPLORE && (
        <Hero onSearch={handleSearch} isLoading={status === 'LOADING'} />
      )}

      <main className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        
        {/* Render FilterBar only if we have ideas or are in saved view */}
        {(ideas.length > 0 || view === ViewMode.SAVED) && (
            <FilterBar 
                filters={filters} 
                setFilters={setFilters} 
                view={view}
                onClear={() => setFilters({ search: '', category: 'All', difficulty: 'All' })}
            />
        )}

        {/* Loading State */}
        {status === 'LOADING' && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-lg text-gray-400 animate-pulse">Brainstorming the next unicorn...</p>
          </div>
        )}

        {/* Error State */}
        {status === 'ERROR' && (
             <div className="mt-8 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-200 flex items-center gap-3">
                 <AlertCircle className="h-5 w-5" />
                 {errorMsg}
             </div>
        )}

        {/* Empty State (Initial) */}
        {status === 'IDLE' && view === ViewMode.EXPLORE && ideas.length === 0 && (
           <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {SAMPLE_IDEAS.map(idea => (
                 <IdeaCard 
                    key={idea.id || 'sample'} 
                    idea={{...idea, id: 'sample'}} 
                    onClick={() => {
                        // For sample card interaction
                    }}
                 />
              ))}
              <div className="col-span-full text-center py-10 text-gray-500 text-sm">
                 Sample ideas shown. Use the search bar to generate your own.
              </div>
           </div>
        )}

        {/* Empty State (No Results/Saved) */}
        {status === 'SUCCESS' && filteredIdeas.length === 0 && (
            <div className="py-20 text-center">
                <p className="text-gray-400">No ideas found matching your filters.</p>
            </div>
        )}
        
        {view === ViewMode.SAVED && savedIdeas.length === 0 && (
             <div className="py-20 text-center flex flex-col items-center">
                <div className="bg-white/5 p-4 rounded-full mb-4">
                    <Plus className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">No saved ideas yet</h3>
                <p className="text-gray-400 mt-2 max-w-sm">Explore generated ideas and bookmark the ones you like to see them here.</p>
                <button 
                    onClick={() => setView(ViewMode.EXPLORE)}
                    className="mt-6 text-primary hover:text-primary/80 font-medium"
                >
                    Go to Explore
                </button>
            </div>
        )}

        {/* Grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredIdeas.map((idea) => (
            <IdeaCard 
              key={idea.id} 
              idea={idea} 
              onClick={setSelectedIdea}
              saved={savedIdeas.some(saved => saved.id === idea.id)}
            />
          ))}
        </div>
      </main>

      <IdeaModal 
        idea={selectedIdea} 
        isOpen={!!selectedIdea} 
        onClose={() => setSelectedIdea(null)}
        onToggleSave={toggleSave}
        onUpdateIdea={handleUpdateIdea}
        isSaved={selectedIdea ? savedIdeas.some(i => i.id === selectedIdea.id) : false}
        onMoreIdeas={handleMoreIdeas}
      />
    </div>
  );
};

export default App;