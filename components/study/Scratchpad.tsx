import React, { useState, useEffect, useRef } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { PenTool, Trash2, Maximize2, Minimize2, X, Type, Eraser, RotateCcw, Download, Sparkles, Eye, EyeOff, GripHorizontal } from 'lucide-react';
import { useToast } from '../ui/ToastContext';
import { triggerHaptic } from '../../lib/nativeBridge';

type ScratchpadMode = 'draw' | 'text';

const COLORS = [
  { label: 'Cyan', value: '#38bdf8' },
  { label: 'Yellow', value: '#facc15' },
  { label: 'White', value: '#f8fafc' },
  { label: 'Emerald', value: '#34d399' },
  { label: 'Red', value: '#f87171' },
];

const Scratchpad: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<ScratchpadMode>('draw');
  const [note, setNote] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTranslucent, setIsTranslucent] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#38bdf8');
  const [lineWidth, setLineWidth] = useState(2.5);
  const [isErasing, setIsErasing] = useState(false);
  const [hasDrawnContent, setHasDrawnContent] = useState(false);

  const dragControls = useDragControls();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  // Load saved text from local storage
  useEffect(() => {
    const savedNote = localStorage.getItem('atpl_scratchpad_text');
    if (savedNote) setNote(savedNote);
  }, []);

  // Autosave text
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('atpl_scratchpad_text', note);
    }, 800);
    return () => clearTimeout(timer);
  }, [note]);

  // Handle Canvas sizing and restore drawing
  useEffect(() => {
    if (!isOpen || mode !== 'draw' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Retina display scaling
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Restore saved canvas image if exists
    const savedDrawing = localStorage.getItem('atpl_scratchpad_drawing');
    if (savedDrawing) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
        setHasDrawnContent(true);
      };
      img.src = savedDrawing;
    }
  }, [isOpen, mode, isExpanded]);

  const saveCanvasState = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    localStorage.setItem('atpl_scratchpad_drawing', dataUrl);
    setHasDrawnContent(true);
  };

  // Drawing event handlers (Touch + Apple Pencil + Mouse)
  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }
    return {
      x: (e as React.MouseEvent).clientX - rect.left,
      y: (e as React.MouseEvent).clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e && e.touches.length > 1) return; // Ignore multi-touch zoom
    isDrawingRef.current = true;
    const coords = getCoordinates(e);
    lastPointRef.current = coords;
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingRef.current || !canvasRef.current || !lastPointRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const coords = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(coords.x, coords.y);

    if (isErasing) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = lineWidth * 4;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = lineWidth;
    }

    ctx.stroke();
    lastPointRef.current = coords;
  };

  const stopDrawing = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    lastPointRef.current = null;
    saveCanvasState();
  };

  const handleClear = () => {
    if (mode === 'draw') {
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        localStorage.removeItem('atpl_scratchpad_drawing');
        setHasDrawnContent(false);
      }
    } else {
      if (confirm('Clear scratchpad text?')) {
        setNote('');
        localStorage.removeItem('atpl_scratchpad_text');
      }
    }
  };

  if (!isOpen) {
    return (
      <motion.button
        drag
        dragMomentum={false}
        dragElastic={0.1}
        onClick={() => {
          triggerHaptic('light');
          setIsOpen(true);
        }}
        className="fixed bottom-[calc(max(env(safe-area-inset-bottom,0px),var(--sab,0px))+5.5rem)] right-4 sm:right-6 sm:bottom-6 bg-blue-600/95 hover:bg-blue-500 border border-blue-400/40 p-3.5 rounded-full text-white shadow-2xl shadow-blue-600/40 z-40 transition-shadow active:scale-95 group backdrop-blur-md cursor-grab active:cursor-grabbing"
        title="Cockpit Scratchpad (Drag to reposition, tap to open)"
      >
        {(note.length > 0 || hasDrawnContent) && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
        )}
        <PenTool size={22} className="text-white group-hover:rotate-12 transition-transform" />
      </motion.button>
    );
  }

  return (
    <motion.div
      drag
      dragListener={false}
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0.06}
      className={`fixed bottom-[calc(max(env(safe-area-inset-bottom,0px),var(--sab,0px))+4.5rem)] right-2 sm:right-6 sm:bottom-6 bg-slate-900/95 border border-blue-500/30 rounded-3xl shadow-2xl shadow-blue-950/70 z-50 flex flex-col overflow-hidden backdrop-blur-xl animate-in slide-in-from-bottom-6 fade-in duration-200 select-none ${
        isTranslucent ? 'opacity-40 hover:opacity-100 transition-opacity' : 'opacity-100'
      } ${
        isExpanded
          ? 'w-[96vw] sm:w-[620px] h-[78vh]'
          : 'w-[94vw] sm:w-[390px] h-[46vh] sm:h-[480px] min-h-[290px] max-h-[580px]'
      }`}
    >
      {/* Top Drag Handle Bar (Touch / Pointer friendly for moving window) */}
      <div
        onPointerDown={(e) => dragControls.start(e)}
        className="w-full pt-2 pb-1 px-4 bg-slate-950/90 border-b border-white/5 flex items-center justify-between cursor-grab active:cursor-grabbing touch-none select-none group"
        title="Drag from here to move scratchpad anywhere"
      >
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 group-hover:text-blue-400 transition-colors">
          <GripHorizontal size={14} />
          <span className="tracking-wider uppercase font-semibold">Drag Window</span>
        </div>
        <div className="w-12 h-1.5 rounded-full bg-slate-600/50 group-hover:bg-blue-400/80 transition-colors" />
        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
          {mode === 'draw' ? 'DRAW' : 'TEXT'}
        </span>
      </div>

      {/* Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-950/80 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
            <PenTool size={15} />
          </div>
          <div>
            <h3 className="font-bold text-xs tracking-wider uppercase text-white flex items-center gap-1.5">
              Cockpit Scratchpad
              <span className="text-[9px] font-mono text-emerald-400 px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20 hidden sm:inline">
                PENCIL READY
              </span>
            </h3>
          </div>
        </div>

        {/* Mode Selector & Window Controls */}
        <div className="flex items-center gap-1">
          <div className="flex items-center bg-slate-800/80 rounded-xl p-0.5 border border-white/5 mr-1">
            <button
              onClick={() => setMode('draw')}
              className={`p-1.5 rounded-lg transition-all ${
                mode === 'draw' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Apple Pencil / Drawing Mode"
            >
              <PenTool size={13} />
            </button>
            <button
              onClick={() => setMode('text')}
              className={`p-1.5 rounded-lg transition-all ${
                mode === 'text' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Type Notes / Calculations"
            >
              <Type size={13} />
            </button>
          </div>

          {/* Ghost / Translucent Mode (Peek Through) */}
          <button
            onClick={() => setIsTranslucent(!isTranslucent)}
            className={`p-1.5 rounded-lg transition-colors ${
              isTranslucent
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title={isTranslucent ? 'Disable Translucent Peek Mode' : 'Peek Behind: Make Semi-Transparent'}
          >
            {isTranslucent ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Minimize to Floating Icon"
          >
            <X size={17} />
          </button>
        </div>
      </div>

      {/* Toolbar (Drawing Controls) */}
      {mode === 'draw' && (
        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950/40 border-b border-white/5 text-xs">
          <div className="flex items-center gap-2">
            {/* Color Palette */}
            <div className="flex items-center gap-1.5">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => {
                    setSelectedColor(c.value);
                    setIsErasing(false);
                  }}
                  className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border transition-transform ${
                    selectedColor === c.value && !isErasing
                      ? 'scale-125 border-white shadow-md'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.label}
                />
              ))}
            </div>

            <div className="h-4 w-px bg-white/10 mx-0.5" />

            {/* Eraser */}
            <button
              onClick={() => setIsErasing(!isErasing)}
              className={`p-1 sm:p-1.5 rounded-lg border text-xs transition-colors flex items-center gap-1 ${
                isErasing
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                  : 'text-slate-400 border-transparent hover:bg-slate-800'
              }`}
              title="Eraser"
            >
              <Eraser size={13} />
            </button>
          </div>

          {/* Clear Button */}
          <button
            onClick={handleClear}
            className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-red-400 px-2 py-1 rounded-lg hover:bg-red-500/10 transition-colors"
          >
            <Trash2 size={12} /> CLEAR
          </button>
        </div>
      )}

      {/* Main Interactive Surface (Untouched touch event isolation for drawing) */}
      <div className="flex-1 relative bg-slate-950 overflow-hidden">
        {mode === 'draw' ? (
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-full cursor-crosshair touch-none"
          />
        ) : (
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Type flight calculations, 1-in-60 notes, fuel burn, or wind components..."
            className="w-full h-full p-3 sm:p-4 bg-transparent text-slate-200 placeholder-slate-600 focus:outline-none resize-none font-mono text-xs leading-relaxed"
            spellCheck={false}
          />
        )}
      </div>

      {/* Footer Status */}
      <div className="px-3 py-1.5 bg-slate-950/90 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
        <span>{mode === 'draw' ? 'Touch & Stylus Active' : `${note.length} chars`}</span>
        <div className="flex items-center gap-2">
          {isTranslucent && <span className="text-amber-400 font-bold">PEEK ON</span>}
          <span>AUTOSAVED</span>
        </div>
      </div>
    </motion.div>
  );
};

export default Scratchpad;
