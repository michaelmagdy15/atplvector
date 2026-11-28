import React from 'react';
import { GraduationCap, Plane } from 'lucide-react';
import { useStudyDepth } from '../../context/StudyDepthContext';

interface StudyDepthToggleProps {
  airlineExtrasCount?: number;
  className?: string;
}

export const StudyDepthToggle: React.FC<StudyDepthToggleProps> = ({
  airlineExtrasCount,
  className = '',
}) => {
  const { depth, setDepth } = useStudyDepth();

  return (
    <div
      role="group"
      aria-label="Study depth track"
      className={`inline-flex border border-line bg-bg-sunken p-0.5 ${className}`}
    >
      <button
        type="button"
        aria-pressed={depth === 'exam'}
        onClick={() => setDepth('exam')}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-bold transition-colors cursor-pointer ${
          depth === 'exam'
            ? 'bg-cad-accent text-white'
            : 'text-muted hover:text-ink'
        }`}
      >
        <GraduationCap className="w-3.5 h-3.5" />
        <span>EASA Exam (75%)</span>
      </button>

      <button
        type="button"
        aria-pressed={depth === 'airline'}
        onClick={() => setDepth('airline')}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-bold transition-colors cursor-pointer ${
          depth === 'airline'
            ? 'bg-cyan-600 text-white'
            : 'text-muted hover:text-ink'
        }`}
      >
        <Plane className="w-3.5 h-3.5" />
        <span>
          Airline Prep
          {airlineExtrasCount ? ` (+${airlineExtrasCount})` : ''}
        </span>
      </button>
    </div>
  );
};

export default StudyDepthToggle;
