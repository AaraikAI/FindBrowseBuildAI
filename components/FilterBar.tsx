import React from 'react';
import { FilterState, ViewMode } from '../types';
import { CATEGORIES, DIFFICULTIES } from '../constants';
import { SlidersHorizontal } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  view: ViewMode;
  onClear: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, setFilters, view, onClear }) => {
  return (
    <div className="sticky top-16 z-40 border-b border-white/5 bg-dark/95 backdrop-blur supports-[backdrop-filter]:bg-dark/60">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        
        <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-white">
                {view === ViewMode.EXPLORE ? 'Explore Ideas' : 'Saved Collection'}
            </h2>
             {(filters.category !== 'All' || filters.difficulty !== 'All') && (
                <button 
                    onClick={onClear}
                    className="text-xs text-red-400 hover:text-red-300 underline ml-2"
                >
                    Clear Filters
                </button>
            )}
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
          <div className="flex items-center gap-2 text-gray-400">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="text-sm">Filters:</span>
          </div>
          
          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-gray-300 focus:border-primary focus:outline-none"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat} className="bg-dark">{cat}</option>
            ))}
          </select>

          <select
            value={filters.difficulty}
            onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-gray-300 focus:border-primary focus:outline-none"
          >
            {DIFFICULTIES.map(diff => (
              <option key={diff} value={diff} className="bg-dark">{diff}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;