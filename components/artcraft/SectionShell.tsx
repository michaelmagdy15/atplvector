import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export const Accent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <span className={`font-serif italic font-normal ${className}`}>{children}</span>
);

export const SectionEyebrow: React.FC<{
  index: string;
  label: string;
  right?: React.ReactNode;
}> = ({ index, label, right }) => (
  <div className="sticky top-12 z-30 border-y border-line bg-bg/80 backdrop-blur-md">
    <div className="mx-auto max-w-[1280px] border-x border-line px-4 md:px-10 h-9 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="hud-label text-cad-accent">{index}</span>
        <span className="hud-label text-faint">/</span>
        <span className="hud-label text-ink">{label}</span>
      </div>
      {right ? <div className="hud-label hidden sm:block">{right}</div> : null}
    </div>
  </div>
);

export const SectionShell: React.FC<{
  id?: string;
  eyebrow?: { index: string; label: string; right?: React.ReactNode };
  children: React.ReactNode;
  className?: string;
  noInnerPadding?: boolean;
}> = ({ id, eyebrow, children, className = '', noInnerPadding = false }) => (
  <section id={id} className={`relative scroll-mt-12 ${className}`}>
    {eyebrow ? (
      <SectionEyebrow index={eyebrow.index} label={eyebrow.label} right={eyebrow.right} />
    ) : (
      <div className="h-px bg-line w-full" />
    )}
    <div className="mx-auto max-w-[1280px] border-x border-line relative">
      <span className="tick tick-half absolute -top-[5px] -left-[6px] z-20 pointer-events-none" />
      <span className="tick tick-half absolute -top-[5px] -right-[5px] z-20 pointer-events-none" />
      <div className={noInnerPadding ? '' : 'px-4 md:px-10 py-16 md:py-24'}>
        {children}
      </div>
    </div>
  </section>
);

export const CadButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'ghost' | 'accent';
  size?: 'sm' | 'md';
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}> = ({
  children,
  onClick,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  disabled = false,
}) => {
  const sizeCls = size === 'sm' ? 'h-8 px-3.5 text-[12px]' : 'h-10 px-5 text-[13px]';
  const variantCls =
    variant === 'primary'
      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border border-blue-400/40 shadow-lg shadow-blue-500/20'
      : variant === 'accent'
      ? 'bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400/40 shadow-lg shadow-indigo-500/20'
      : 'border border-line-strong text-ink bg-bg/60 backdrop-blur-sm';

  const combined = `invert-block inline-flex items-center justify-center gap-2 font-medium tracking-[-0.005em] select-none cursor-pointer disabled:opacity-50 disabled:pointer-events-none ${sizeCls} ${variantCls} ${className}`;

  if (href) {
    return (
      <a href={href} onClick={onClick} className={combined}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={combined}>
      {children}
    </button>
  );
};

export const BladeWordmark: React.FC<{
  text?: string;
  subtext?: string;
  className?: string;
}> = ({ text = 'ATPL', subtext = 'VECTOR', className = '' }) => {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      className={`inline-flex items-center justify-center gap-3 md:gap-5 select-none ${className}`}
      style={{
        opacity: entered ? 1 : 0,
        transform: entered ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 600ms cubic-bezier(0.22, 1, 0.36, 1), transform 600ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      {/* Official ATPLVector /brand-mark.png Emblem inside Precision CAD Frame */}
      <div
        className="p-2 w-14 h-14 md:w-20 md:h-20 rounded-xl bg-gradient-to-br from-white/[0.12] via-blue-500/[0.08] to-violet-500/[0.10] backdrop-blur-xl border border-cyan-200/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_0_30px_rgba(59,130,246,0.28)] flex items-center justify-center overflow-hidden shrink-0 relative"
        style={{
          transform: entered ? 'scale(1)' : 'scale(0.88)',
          transition: 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1) 80ms',
        }}
      >
        <img
          src="/brand-mark.png"
          alt="ATPLVector Logo"
          className="w-full h-full object-contain object-center"
        />
      </div>

      <span className="font-display font-black tracking-[-0.045em] leading-[0.92] text-ink">
        {text}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400">
          {subtext}
        </span>
      </span>
    </div>
  );
};

export const ThemeToggleButton: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme');
    if (current === 'light' || current === 'dark') {
      setTheme(current);
    }
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} blueprint mode`}
      title={`Blueprint mode: ${theme.toUpperCase()}`}
      className="invert-block h-7 w-7 inline-flex items-center justify-center border border-line text-muted hover:text-ink cursor-pointer"
    >
      {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
    </button>
  );
};
