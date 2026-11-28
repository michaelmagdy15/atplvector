import React, { createContext, useContext, useEffect, useState } from 'react';

export type StudyDepth = 'exam' | 'airline';

interface StudyDepthContextType {
  depth: StudyDepth;
  setDepth: (depth: StudyDepth) => void;
  isAirline: boolean;
}

const STORAGE_KEY = 'atplvector-study-depth';

const StudyDepthContext = createContext<StudyDepthContextType>({
  depth: 'exam',
  setDepth: () => {},
  isAirline: false,
});

function readInitialDepth(initialDepth?: StudyDepth): StudyDepth {
  if (typeof window !== 'undefined') {
    const param = new URLSearchParams(window.location.search).get('depth');
    if (param === 'airline' || param === 'exam') {
      try {
        localStorage.setItem(STORAGE_KEY, param);
      } catch {
        // ignore storage quota errors
      }
      return param;
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'airline' || saved === 'exam') {
        return saved;
      }
    } catch {
      // ignore storage errors
    }
  }
  return initialDepth || 'exam';
}

export const StudyDepthProvider: React.FC<{
  children: React.ReactNode;
  initialDepth?: StudyDepth;
}> = ({ children, initialDepth }) => {
  const [depth, setDepthState] = useState<StudyDepth>(() => readInitialDepth(initialDepth));

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('depth');
    if (param === 'airline' || param === 'exam') {
      setDepthState(param);
    }
  }, []);

  const setDepth = (next: StudyDepth) => {
    setDepthState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore storage errors
    }
  };

  return (
    <StudyDepthContext.Provider value={{ depth, setDepth, isAirline: depth === 'airline' }}>
      {children}
    </StudyDepthContext.Provider>
  );
};

export const useStudyDepth = () => useContext(StudyDepthContext);

export default StudyDepthContext;
