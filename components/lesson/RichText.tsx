import React from 'react';

interface RichTextProps {
  text: string;
  className?: string;
}

function renderInlineSegments(input: string, keyPrefix: string): React.ReactNode[] {
  const parts = input.split(/(\*\*[^*]+\*\*|\{\{[^}]+\}\})/g);
  const nodes: React.ReactNode[] = [];

  parts.forEach((part, idx) => {
    if (!part) return;
    const key = `${keyPrefix}-${idx}`;

    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      nodes.push(
        <mark key={key} className="dx-mark">
          {renderInlineSegments(part.slice(2, -2), `${key}-m`)}
        </mark>
      );
      return;
    }

    if (part.startsWith('{{') && part.endsWith('}}') && part.length > 4) {
      const inner = part.slice(2, -2);
      const splitIdx = inner.indexOf('//');
      if (splitIdx !== -1) {
        const num = inner.slice(0, splitIdx).trim();
        const den = inner.slice(splitIdx + 2).trim();
        nodes.push(
          <span key={key} className="dx-frac">
            <span>{renderInlineSegments(num, `${key}-n`)}</span>
            <span>{renderInlineSegments(den, `${key}-d`)}</span>
          </span>
        );
        return;
      }
      nodes.push(
        <span key={key} className="font-mono font-semibold text-accent-ink">
          {inner.trim()}
        </span>
      );
      return;
    }

    nodes.push(<React.Fragment key={key}>{part}</React.Fragment>);
  });

  return nodes;
}

export const RichText: React.FC<RichTextProps> = ({ text, className }) => {
  if (!text) return null;
  if (className) {
    return <span className={className}>{renderInlineSegments(text, 'rt')}</span>;
  }
  return <>{renderInlineSegments(text, 'rt')}</>;
};

export default RichText;
