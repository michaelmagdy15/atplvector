import React, { createContext, useContext, useState, useEffect } from 'react';
import { LicenceTrack } from '../types';

interface CourseModeContextType {
  track: LicenceTrack;
  setTrack: (track: LicenceTrack) => void;
}

const CourseModeContext = createContext<CourseModeContextType>({
  track: 'ATPL',
  setTrack: () => {},
});

export const CourseModeProvider: React.FC<{ children: React.ReactNode; initialTrack?: LicenceTrack }> = ({
  children,
  initialTrack,
}) => {
  const [track, setTrackState] = useState<LicenceTrack>(() => {
    // Prefer prop, then localStorage, then default to ATPL
    if (initialTrack) return initialTrack;
    return (localStorage.getItem('licenceTrack') as LicenceTrack) || 'ATPL';
  });

  // Sync initialTrack changes (e.g. after login when user profile loads)
  useEffect(() => {
    if (initialTrack && initialTrack !== track) {
      setTrackState(initialTrack);
    }
  }, [initialTrack]);

  const setTrack = (newTrack: LicenceTrack) => {
    setTrackState(newTrack);
    localStorage.setItem('licenceTrack', newTrack);
  };

  return (
    <CourseModeContext.Provider value={{ track, setTrack }}>
      {children}
    </CourseModeContext.Provider>
  );
};

/** Use this hook in any component to read or switch the active licence track. */
export const useCourseMode = () => useContext(CourseModeContext);

export default CourseModeContext;
