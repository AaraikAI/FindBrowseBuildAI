import React from 'react';
import { Idea } from '../types';
import { ArrowUpRight, Lock, Unlock } from 'lucide-react';

interface IdeaCardProps {
  idea: Idea;
  onClick: (idea: Idea) => void;
  saved?: boolean;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onClick, saved }) => {
  return (
    <div 
      onClick={() => onClick(idea)}
      className="group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-card p-6 transition-all hover:-translate-y-1 hover:border-white/10 hover:shadow-xl hover:shadow-primary/5"
    >
      <div 
        className="absolute top-0 left-0 h-1 w-full" 
        style={{ backgroundColor: idea.color }}
      />
      
      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-2xl shadow-inner">
          {idea.emoji}
        </div>
        <div className="flex flex-col items-end gap-2">
           <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium border ${
            idea.difficulty === 'Easy' ? 'border-green-500/30 text-green-400 bg-green-500/10' :
            idea.difficulty === 'Medium' ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10' :
            'border-red-500/30 text-red-400 bg-red-500/10'
          }`}>
            {idea.difficulty}
          </span>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-xl font-bold text-white group-hover:text-primary transition-colors">
          {idea.title}
        </h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-gray-400">
          {idea.oneLiner}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          {idea.category}
        </span>
        <div className="flex items-center gap-1 text-primary opacity-0 transition-opacity group-hover:opacity-100">
          <span className="text-xs font-bold">Details</span>
          <ArrowUpRight className="h-3 w-3" />
        </div>
      </div>
    </div>
  );
};

export default IdeaCard;