import React from 'react';
import { Sparkles, Bookmark, LayoutGrid } from 'lucide-react';
import { ViewMode } from '../types';

interface NavbarProps {
  currentView: ViewMode;
  setView: (view: ViewMode) => void;
  savedCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, savedCount }) => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-dark/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => setView(ViewMode.EXPLORE)}
        >
          <div className="rounded-lg bg-gradient-to-br from-primary to-secondary p-2">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white hidden sm:block">Find Browse Build AI</span>
          <span className="text-xl font-bold tracking-tight text-white sm:hidden">FBB AI</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setView(ViewMode.EXPLORE)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              currentView === ViewMode.EXPLORE
                ? 'bg-white/10 text-white'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden sm:inline">Explore</span>
          </button>
          
          <button
            onClick={() => setView(ViewMode.SAVED)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              currentView === ViewMode.SAVED
                ? 'bg-white/10 text-white'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Bookmark className="h-4 w-4" />
            <span className="hidden sm:inline">Saved</span>
            {savedCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;