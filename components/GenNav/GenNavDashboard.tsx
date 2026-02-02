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
                    title: '061.01 Basics of Navigation',
                    desc: 'Fundamental concepts, direction, distance, and speed.',
                    view: View.GEN_NAV_BASICS,
                    isLocked
                },
                {
                    title: '061.02 VFR Navigation',
                    desc: 'Dead Reckoning, Wind Triangle, and Flight Computer (CRP-5).',
                    view: View.GEN_NAV_VFR,
                    isLocked
                },
                {
                    title: '061.03 Great Circles & Rhumb Lines',
                    desc: 'Earth geometry, convergency, and path properties.',
                    view: View.GEN_NAV_EARTH,
                    isLocked
                },
                {
                    title: '061.04 Charts',
                    desc: 'Projections, Mercator, Lambert, and Polar Stereographic.',
                    view: View.GEN_NAV_CHARTS,
                    isLocked
                },
                {
                    title: '061.05 Time',
                    desc: 'Solar system, UTC, LMT, and sunrise/sunset.',
                    view: View.GEN_NAV_TIME,
                    isLocked
                },
            ]}
        />
    );
};

export default GenNavDashboard;
