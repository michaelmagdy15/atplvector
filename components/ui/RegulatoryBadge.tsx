import React from 'react';

export type RegulatoryJurisdiction = 'EASA' | 'UK_CAA' | 'FAA' | 'ICAO';

interface RegulatoryBadgeProps {
  jurisdiction: RegulatoryJurisdiction;
  citation?: string;
  className?: string;
  variant?: 'solid' | 'outline' | 'subtle';
}

const BADGE_CONFIG: Record<RegulatoryJurisdiction, {
  label: string;
  subtext: string;
  bgSolid: string;
  bgSubtle: string;
  border: string;
  textColor: string;
  dotColor: string;
}> = {
  EASA: {
    label: 'EASA Part-FCL',
    subtext: 'Regulation (EU) No 1178/2011 / SERA',
    bgSolid: 'bg-sky-600 text-white',
    bgSubtle: 'bg-sky-500/10 text-sky-300',
    border: 'border-sky-500/30',
    textColor: 'text-sky-300',
    dotColor: 'bg-sky-400',
  },
  UK_CAA: {
    label: 'UK CAA',
    subtext: 'CAP 804 / UK ANO 2016',
    bgSolid: 'bg-indigo-600 text-white',
    bgSubtle: 'bg-indigo-500/10 text-indigo-300',
    border: 'border-indigo-500/30',
    textColor: 'text-indigo-300',
    dotColor: 'bg-indigo-400',
  },
  FAA: {
    label: 'FAA 14 CFR',
    subtext: 'US FAR Difference (Cross-Credit)',
    bgSolid: 'bg-amber-600 text-white',
    bgSubtle: 'bg-amber-500/10 text-amber-300',
    border: 'border-amber-500/30',
    textColor: 'text-amber-300',
    dotColor: 'bg-amber-400',
  },
  ICAO: {
    label: 'ICAO Annex',
    subtext: 'Global Standard SARPs',
    bgSolid: 'bg-teal-600 text-white',
    bgSubtle: 'bg-teal-500/10 text-teal-300',
    border: 'border-teal-500/30',
    textColor: 'text-teal-300',
    dotColor: 'bg-teal-400',
  },
};

/**
 * Accessible, high-contrast tri-jurisdictional regulatory badge.
 * Solves Problem 9 by providing unambiguous regulatory attribution across all learning modules.
 */
export const RegulatoryBadge: React.FC<RegulatoryBadgeProps> = ({
  jurisdiction,
  citation,
  className = '',
  variant = 'subtle',
}) => {
  const config = BADGE_CONFIG[jurisdiction];

  const variantClass = variant === 'solid'
    ? config.bgSolid
    : `${config.bgSubtle} border ${config.border}`;

  return (
    <span
      role="note"
      aria-label={`Regulatory authority: ${config.label}${citation ? `, Citation: ${citation}` : ''}`}
      title={config.subtext}
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide transition-colors ${variantClass} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor} animate-pulse`} aria-hidden="true" />
      <span>{config.label}</span>
      {citation && (
        <span className="text-[10px] opacity-80 border-l border-current/30 pl-1.5 ml-0.5 font-mono">
          {citation}
        </span>
      )}
    </span>
  );
};

export default RegulatoryBadge;
