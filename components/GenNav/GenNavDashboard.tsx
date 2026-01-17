import React, { useState } from 'react';
import { View } from '../../types';
import GenericSubjectDashboard from '../GenericSubjectDashboard';
import { Globe, Map, Navigation, Sun, Clock, Compass } from 'lucide-react';

interface Props {
    currentView: View;
    setCurrentView: (view: View) => void;
    isLocked?: boolean;
}

const GenNavDashboard: React.FC<Props> = ({ currentView, setCurrentView, isLocked }) => {
    return (
        <GenericSubjectDashboard
            subjectCode="061"
            subjectName="General Navigation"
            color="indigo"
            description="Geodesy, Charting, Dead Reckoning, and In-Flight Navigation."
            icon={Globe}
            onChangeView={setCurrentView}
            modules={[
                {
                    title: 'Earth Geometry',
                    desc: 'Great Circles, Rhumb Lines, Latitude & Longitude.',
                    view: View.GEN_NAV_EARTH,
                    isLocked
                },
                {
                    title: 'Solar System & Time',
                    desc: 'Seasons, Equation of Time, UTC/LMT conversions.',
                    view: View.GEN_NAV_SOLAR,
                    isLocked
                },
                {
                    title: 'Map Projections',
                    desc: 'Mercator vs Lambert Conformal Conic charts.',
                    view: View.GEN_NAV_MAPS,
                    isLocked
                },
                {
                    title: 'Dead Reckoning',
                    desc: 'The Wind Triangle and E-6B Flight Computer.',
                    view: View.GEN_NAV_WIND_TRIANGLE,
                    isLocked
                },
                {
                    title: 'Polar Navigation',
                    desc: 'Grid Heading and Polar Stereographic charts.',
                    view: View.GEN_NAV_POLAR,
                    isLocked
                },
            ]}
        />
    );
};

export default GenNavDashboard;
