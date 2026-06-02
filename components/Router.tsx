import React from 'react';
import { View, User } from '../types';
import { routes } from '../config/routes';
import { subjectConfigs } from '../config/subjectRoutes';
import { Wifi } from 'lucide-react';
import { useCourseMode } from '../context/CourseModeContext';
import PPLDashboard from './PPL/PPLDashboard';

interface RouterProps {
    currentView: View;
    user: User;
    studyTime: number;
    navigateTo: (view: View) => void;
    handleLogout: () => void;
    handleUserUpdate: (updatedUser: User) => void;
    handleOpenSyllabus: (subjectId: string) => void;
    isSubjectAllowed: (subjectCode: string) => boolean;
    goBack: () => void;
    goForward: () => void;
    selectedSubjectId?: string;
}

const Router: React.FC<RouterProps> = ({
    currentView,
    user,
    studyTime,
    navigateTo,
    handleLogout,
    handleUserUpdate,
    handleOpenSyllabus,
    isSubjectAllowed,
    goBack,
    goForward,
    selectedSubjectId
}) => {
    const Component = routes[currentView] as any;

    if (!Component) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-slate-400 bg-slate-900/50 rounded-2xl border border-slate-800">
                <div className="bg-slate-800 p-4 rounded-full mb-6">
                    <Wifi className="w-12 h-12 text-slate-600" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">View Not Found</h3>
                <p className="text-slate-400 text-center max-w-md mb-8">
                    The requested view <span className="text-blue-400 font-mono text-sm">{currentView}</span> has not been implemented or mapped yet.
                    Our engineering team is working on bringing all ATPL modules online.
                </p>
                <button
                    onClick={() => navigateTo(View.PLATFORM_DASHBOARD)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-lg shadow-blue-900/20 active:scale-95"
                >
                    Return to Mission Control
                </button>
            </div>
        );
    }

    // Common props for most views
    const commonProps = {
        user,
        currentUser: user,
        studyTime,
        onChangeView: navigateTo,
        onNavigate: navigateTo,
        onLogout: handleLogout,
        onUpdateUser: handleUserUpdate,
        onOpenSyllabus: handleOpenSyllabus,
        onBack: goBack,
        onForward: goForward,
        goBack,
        goForward,
        isLocked: false // Default to unlocked
    };

    // Special lookup for Generic Subject Dashboards
    const subjectConfig = subjectConfigs[currentView];
    if (subjectConfig) {
        return (
            <Component
                {...subjectConfig}
                modules={subjectConfig.modules.map(mod => ({
                    ...mod,
                    isLocked: !isSubjectAllowed(subjectConfig.subjectCode)
                }))}
                onChangeView={navigateTo}
                onOpenSyllabus={handleOpenSyllabus}
            />
        );
    }

    // Special UI wrapping or prop injection for specific views
    switch (true) {


        // --- METEOROLOGY (050) Section ---
        case [
            View.MET_HOME, View.MET_ATMOSPHERE, View.MET_PRESSURE, View.MET_DENSITY,
            View.MET_TEMPERATURE, View.MET_ALTIMETRY, View.MET_WIND, View.MET_CIRCULATION, View.MET_HUMIDITY,
            View.MET_PRECIPITATION, View.MET_FRONTS, View.MET_THUNDERSTORMS, View.MET_ICING,
            View.MET_VISIBILITY, View.MET_AIR_MASSES, View.MET_TURBULENCE,
            View.MET_JET_STREAMS, View.MET_CLIMATOLOGY, View.MET_LOCAL_WINDS,
            View.MET_DEPRESSIONS_ANTICYCLONES, View.MET_CLOUD_TYPES, View.MET_METAR_TAF,
            View.MET_CHARTS, View.MET_TRS, View.MET_SPECIAL_HAZARDS, View.MET_SATELLITE,
            View.MET_OPTICAL, View.MET_STATION_MODEL
        ].includes(currentView):
            return (
                <div className="w-full animate-in fade-in duration-500">
                    {currentView === View.MET_HOME ? (
                        <Component onChangeView={navigateTo} />
                    ) : currentView === View.MET_ATMOSPHERE ? (
                        <Component initialView="layers" />
                    ) : (
                        <Component {...commonProps} />
                    )}
                </div>
            );

        // --- DASHBOARDS needing specific props ---
        case currentView === View.PLATFORM_DASHBOARD: {
            const { track } = useCourseMode();
            if (track === 'PPL') {
                return (
                    <div className="w-full animate-in fade-in duration-500">
                        <PPLDashboard {...commonProps} />
                    </div>
                );
            }
            return (
                <div className="w-full animate-in fade-in duration-500">
                    <Component {...commonProps} />
                    {routes[View.PLATFORM_PROGRESS] && (
                        <div className="px-2 md:px-0 mt-12 mb-8">
                            {React.createElement(routes[View.PLATFORM_PROGRESS] as any)}
                        </div>
                    )}
                </div>
            );
        }

        case currentView === View.ACCOUNT_SETTINGS:
            return <Component user={user} onBack={() => navigateTo(View.PROFILE)} />;

        case currentView === View.SUBSCRIPTION_MANAGEMENT:
            return <Component user={user} onUpdateUser={handleUserUpdate} onBack={() => navigateTo(View.PLATFORM_DASHBOARD)} />;

        case currentView === View.ADMIN_DASHBOARD:
            return user.isAdmin ? <Component currentUser={user} onBack={() => navigateTo(View.PLATFORM_DASHBOARD)} /> : null;

        case currentView === View.STUDY_GUIDE:
            return <Component onBack={() => navigateTo(View.PLATFORM_DASHBOARD)} onChangeView={navigateTo} />;



        case currentView === View.DASHBOARD: // Comms Dashboard
            return <Component onChangeView={navigateTo} onOpenSyllabus={handleOpenSyllabus} />;

        case currentView === View.SYLLABUS_VIEWER:
            return (
                <Component
                    {...commonProps}
                    subjectId={selectedSubjectId || 'ALL'}
                />
            );

        case currentView === View.EXAM_PLANNER:
            return <Component currentUser={user} />;

        case currentView === View.PROGRESS_DASHBOARD:
            return <Component onChangeView={navigateTo} onOpenSyllabus={handleOpenSyllabus} />;

        case currentView === View.NAV_60_1:
            return <Component />;

        // --- EGYPTAIR Prep Module Section ---
        case [
            View.EGYPTAIR_DASHBOARD, View.EGYPTAIR_REGS_QUIZ, View.EGYPTAIR_FUEL_PLAN,
            View.EGYPTAIR_NAV_SIM, View.EGYPTAIR_PERF_CALC, View.EGYPTAIR_CRM_SIM
        ].includes(currentView):
            return (
                <div className="w-full animate-in fade-in duration-500">
                    <Component {...commonProps} />
                </div>
            );

        // Generic Component fallback
        default:
            return <Component {...commonProps} />;
    }

};

export default Router;
