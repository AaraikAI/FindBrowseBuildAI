

import React, { useState } from 'react';
import { Idea, Artifact } from '../types';
import { MODULE_CATEGORIES, ModuleDef } from '../constants';
import { 
    X, Bookmark, Check, Wand2, Loader2, ChevronRight, 
    LayoutDashboard, ArrowLeft
} from 'lucide-react';
import { generateMoreLikeThis, generateArtifact } from '../services/geminiService';
import ArtifactView from './ArtifactView';

interface IdeaModalProps {
  idea: Idea | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleSave: (idea: Idea) => void;
  onUpdateIdea: (updatedIdea: Idea) => void;
  isSaved: boolean;
  onMoreIdeas: (ideas: Idea[]) => void;
}

const IdeaModal: React.FC<IdeaModalProps> = ({ 
    idea, isOpen, onClose, onToggleSave, onUpdateIdea, isSaved, onMoreIdeas 
}) => {
  const [activeModuleId, setActiveModuleId] = useState<string>('overview');
  const [loadingModule, setLoadingModule] = useState<string | null>(null);
  const [isGeneratingMore, setIsGeneratingMore] = useState(false);

  // Reset state when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
        setActiveModuleId('overview');
    }
  }, [isOpen, idea?.id]);

  if (!isOpen || !idea) return null;

  const handleGenerateMore = async () => {
    setIsGeneratingMore(true);
    try {
        const newIdeas = await generateMoreLikeThis(idea);
        onMoreIdeas(newIdeas);
        onClose(); 
    } catch (error) {
        console.error("Failed to generate variations", error);
    } finally {
        setIsGeneratingMore(false);
    }
  };

  const handleModuleSelect = async (module: ModuleDef) => {
      setActiveModuleId(module.id);
      
      // Check if already generated
      if (idea.artifacts?.[module.id]) {
          return;
      }

      // Generate content
      setLoadingModule(module.id);
      try {
          const artifact = await generateArtifact(
              idea, 
              module.id, 
              module.title, 
              module.useSearch, 
              module.promptInstruction // Pass the instruction here
          );
          const updatedIdea = {
              ...idea,
              artifacts: {
                  ...idea.artifacts,
                  [module.id]: artifact
              }
          };
          onUpdateIdea(updatedIdea);
      } catch (e) {
          console.error(e);
      } finally {
          setLoadingModule(null);
      }
  };

  const renderSidebar = () => (
      <div className="w-full md:w-64 flex-shrink-0 border-r border-white/10 bg-dark/50 md:flex flex-col hidden h-[calc(90vh-4rem)] overflow-y-auto custom-scrollbar">
          <div className="p-4">
              <button
                  onClick={() => setActiveModuleId('overview')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeModuleId === 'overview' 
                      ? 'bg-primary/20 text-white' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
              >
                  <LayoutDashboard className="h-4 w-4" />
                  Overview
              </button>
          </div>

          <div className="px-4 pb-4 space-y-6">
              {MODULE_CATEGORIES.map(category => (
                  <div key={category.id}>
                      <h4 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          {category.title}
                      </h4>
                      <div className="space-y-1">
                          {category.modules.map(module => {
                              const Icon = module.icon;
                              const hasArtifact = !!idea.artifacts?.[module.id];
                              return (
                                  <button
                                      key={module.id}
                                      onClick={() => handleModuleSelect(module)}
                                      disabled={loadingModule === module.id}
                                      className={`w-full group flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                                          activeModuleId === module.id 
                                          ? 'bg-white/10 text-white' 
                                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                      }`}
                                  >
                                      <div className="flex items-center gap-3">
                                          <Icon className={`h-4 w-4 ${hasArtifact ? 'text-primary' : ''}`} />
                                          <span>{module.title}</span>
                                      </div>
                                      {loadingModule === module.id && <Loader2 className="h-3 w-3 animate-spin" />}
                                      {hasArtifact && loadingModule !== module.id && <Check className="h-3 w-3 text-primary" />}
                                  </button>
                              );
                          })}
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );

  const renderMobileNav = () => (
      <div className="md:hidden overflow-x-auto whitespace-nowrap border-b border-white/10 bg-dark p-2 scrollbar-hide">
          <div className="flex gap-2">
              <button
                  onClick={() => setActiveModuleId('overview')}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium ${
                      activeModuleId === 'overview' ? 'bg-primary text-white' : 'bg-white/5 text-gray-400'
                  }`}
              >
                  Overview
              </button>
              {MODULE_CATEGORIES.flatMap(c => c.modules).map(module => (
                  <button
                      key={module.id}
                      onClick={() => handleModuleSelect(module)}
                      className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium ${
                          activeModuleId === module.id 
                          ? 'bg-primary text-white' 
                          : 'bg-white/5 text-gray-400'
                      }`}
                  >
                      {idea.artifacts?.[module.id] && <Check className="h-3 w-3" />}
                      {module.title}
                  </button>
              ))}
          </div>
      </div>
  );

  const renderOverview = () => (
      <div className="animate-fade-in space-y-8">
          <div>
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white">{idea.title}</h2>
                    <div className="mt-2 flex items-center gap-3">
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
                            {idea.category}
                        </span>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                                idea.difficulty === 'Easy' ? 'border-green-500/30 text-green-400 bg-green-500/10' :
                                idea.difficulty === 'Medium' ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10' :
                                'border-red-500/30 text-red-400 bg-red-500/10'
                        }`}>
                            {idea.difficulty}
                        </span>
                    </div>
                </div>
            </div>
            <p className="mt-6 text-lg leading-relaxed text-gray-300 font-light">
                {idea.oneLiner}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
               <div className="rounded-xl bg-white/5 p-5 border border-white/5">
                   <h3 className="font-semibold text-white mb-2">The Problem</h3>
                   <p className="text-sm text-gray-400 leading-relaxed">{idea.problem}</p>
               </div>
               <div className="rounded-xl bg-white/5 p-5 border border-white/5">
                   <h3 className="font-semibold text-white mb-2">The Solution</h3>
                   <p className="text-sm text-gray-400 leading-relaxed">{idea.solution}</p>
               </div>
          </div>

          <div>
             <h3 className="font-semibold text-white mb-3">Target Audience</h3>
             <p className="text-sm text-gray-400">{idea.targetAudience}</p>
          </div>

          <div>
             <h3 className="font-semibold text-white mb-3">Monetization Models</h3>
             <div className="flex flex-wrap gap-2">
                {idea.monetization.map((m, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm border border-green-500/20">
                        {m}
                    </span>
                ))}
             </div>
          </div>

           <div>
             <h3 className="font-semibold text-white mb-3">MVP Features</h3>
             <ul className="grid gap-2 sm:grid-cols-2">
                {idea.mvpFeatures.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-400">
                        <Check className="h-4 w-4 text-primary" />
                        {f}
                    </li>
                ))}
             </ul>
          </div>

          <div className="border-t border-white/10 pt-6 flex justify-end">
             <button
                onClick={handleGenerateMore}
                disabled={isGeneratingMore}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
             >
                 {isGeneratingMore ? <Loader2 className="h-4 w-4 animate-spin"/> : <Wand2 className="h-4 w-4"/>}
                 <span>Generate Similar Ideas</span>
             </button>
          </div>
      </div>
  );

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden flex items-center justify-center sm:p-6">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative flex flex-col w-full h-full sm:h-[90vh] max-w-6xl bg-dark border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="h-16 flex-shrink-0 flex items-center justify-between px-6 border-b border-white/10 bg-dark">
             <div className="flex items-center gap-3">
                 <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-lg">
                    {idea.emoji}
                 </div>
                 <h1 className="text-lg font-bold text-white truncate max-w-[200px] sm:max-w-md">
                    {idea.title}
                 </h1>
             </div>
             <div className="flex items-center gap-2">
                <button 
                  onClick={() => onToggleSave(idea)}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all ${
                    isSaved 
                      ? 'border-primary bg-primary text-white' 
                      : 'border-white/10 bg-transparent text-gray-400 hover:bg-white/5'
                  }`}
                >
                  {isSaved ? <Check className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                </button>
                <button 
                  onClick={onClose}
                  className="h-9 w-9 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
             </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
            {renderSidebar()}
            
            <div className="flex-1 flex flex-col min-w-0 bg-dark/30">
                {renderMobileNav()}
                
                <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                    {activeModuleId === 'overview' ? (
                        renderOverview()
                    ) : (
                        loadingModule === activeModuleId ? (
                             <div className="flex flex-col items-center justify-center h-full">
                                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                                <h3 className="text-xl font-semibold text-white">Generating {MODULE_CATEGORIES.flatMap(c => c.modules).find(m => m.id === activeModuleId)?.title}...</h3>
                                <p className="text-gray-400 mt-2">This may take a few seconds.</p>
                             </div>
                        ) : idea.artifacts?.[activeModuleId] ? (
                            <ArtifactView artifact={idea.artifacts[activeModuleId]} />
                        ) : (
                             // Should not happen due to immediate loading state, but safeguard
                             <div className="flex items-center justify-center h-full">
                                <span className="text-gray-500">Select a module to generate content.</span>
                             </div>
                        )
                    )}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default IdeaModal;
