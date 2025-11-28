
import React from 'react';
import { Artifact, ArtifactSection } from '../types';
import { ExternalLink, Copy, Check } from 'lucide-react';

interface ArtifactViewProps {
  artifact: Artifact;
}

const SectionRenderer: React.FC<{ section: ArtifactSection }> = ({ section }) => {
  const { title, type, content } = section;

  const renderContent = () => {
    // Handle string content
    const textContent = typeof content === 'string' ? content : JSON.stringify(content);
    
    // Simple markdown-ish parser for safety if raw HTML isn't an option
    // For this app, we will assume text is safe or use simple formatting
    if (type === 'list' || (typeof content === 'string' && content.startsWith('- '))) {
        return (
            <ul className="list-disc pl-5 space-y-2 text-gray-300">
                {textContent.split('\n').map((line, i) => {
                    const cleanLine = line.replace(/^[-\u2022]\s*/, '').trim();
                    if (!cleanLine) return null;
                    return <li key={i}>{cleanLine}</li>;
                })}
            </ul>
        );
    }

    if (type === 'key-value') {
        return (
             <div className="grid gap-2">
                {textContent.split('\n').map((line, i) => {
                    const [key, ...rest] = line.split(':');
                    const val = rest.join(':');
                    if (!key || !val) return <div key={i} className="text-gray-300">{line}</div>;
                    return (
                        <div key={i} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                            <span className="font-semibold text-white min-w-[120px]">{key.trim()}:</span>
                            <span className="text-gray-300">{val.trim()}</span>
                        </div>
                    );
                })}
             </div>
        );
    }

    // Default Markdown/Text
    return (
        <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
            {textContent}
        </div>
    );
  };

  return (
    <div className="mb-8 rounded-xl bg-white/5 p-6 border border-white/5">
      <h3 className="mb-4 text-lg font-bold text-primary">{title}</h3>
      {renderContent()}
    </div>
  );
};

const ArtifactView: React.FC<ArtifactViewProps> = ({ artifact }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    const text = artifact.sections.map(s => `${s.title}\n${typeof s.content === 'string' ? s.content : JSON.stringify(s.content)}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
            <h2 className="text-2xl font-bold text-white">{artifact.title}</h2>
            <p className="text-sm text-gray-500 mt-1">Generated with Gemini 2.5</p>
        </div>
        <button 
            onClick={handleCopy}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
            title="Copy to clipboard"
        >
            {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
        </button>
      </div>

      <div className="space-y-6">
        {artifact.sections.map((section, idx) => (
          <SectionRenderer key={idx} section={section} />
        ))}
      </div>

      {artifact.sources && artifact.sources.length > 0 && (
        <div className="mt-8 border-t border-white/10 pt-6">
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
            Sources & References
          </h4>
          <div className="grid gap-2 sm:grid-cols-2">
            {artifact.sources.map((source, idx) => (
              <a
                key={idx}
                href={source.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg bg-white/5 p-3 text-sm text-blue-400 hover:bg-white/10 hover:text-blue-300 transition-colors truncate"
              >
                <ExternalLink className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{source.title}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtifactView;
