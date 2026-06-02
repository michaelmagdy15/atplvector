import React, { useState, useEffect } from 'react';
import { Calendar, ChevronRight, AlertCircle, Info, Trash2, CheckCircle2, Layout, Clock, BookOpen, Target, Sparkles, Plus, GripVertical, CalendarDays, Calculator } from 'lucide-react';
import { db, doc } from '../lib/firebase';
import { getDoc, updateDoc } from 'firebase/firestore';
import { User } from '../types';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface Subject {
    id: string;
    name: string;
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Medium-Hard';
    passRate: number;
    description: string;
    questionCount: number;
}

const ALL_SUBJECTS: Subject[] = [
    { id: '010', name: 'Air Law', difficulty: 'Medium', passRate: 92, description: 'Regulations, airspaces, and rules of the air.', questionCount: 1220 },
    { id: '021', name: 'Aircraft General Knowledge', difficulty: 'Medium', passRate: 84, description: 'Airframe, systems, and powerplants.', questionCount: 1290 },
    { id: '022', name: 'Instrumentation', difficulty: 'Medium', passRate: 90, description: 'Flight instruments and automated systems.', questionCount: 1297 },
    { id: '031', name: 'Mass & Balance', difficulty: 'Medium', passRate: 83, description: 'Weight, CG limits, and loadsheets.', questionCount: 449 },
    { id: '032', name: 'Performance', difficulty: 'Hard', passRate: 67, description: 'Take-off, landing, and climb performance.', questionCount: 1017 },
    { id: '033', name: 'Flight Planning', difficulty: 'Hard', passRate: 65, description: 'Fuel planning, routes, and monitoring.', questionCount: 994 },
    { id: '040', name: 'Human Performance', difficulty: 'Medium', passRate: 87, description: 'Physiology and psychology in aviation.', questionCount: 1112 },
    { id: '050', name: 'Meteorology', difficulty: 'Medium-Hard', passRate: 81, description: 'Atmosphere, charts, and weather hazards.', questionCount: 1784 },
    { id: '061', name: 'General Navigation', difficulty: 'Hard', passRate: 70, description: 'Plotting, charts, and dead reckoning.', questionCount: 1041 },
    { id: '062', name: 'Radio Navigation', difficulty: 'Medium', passRate: 86, description: 'ILS, VOR, DME, and Satellite Nav.', questionCount: 992 },
    { id: '070', name: 'Operational Procedures', difficulty: 'Medium', passRate: 90, description: 'Special ops, fire, and emergency procedures.', questionCount: 950 },
    { id: '081', name: 'Principles of Flight', difficulty: 'Hard', passRate: 76, description: 'Aerodynamics and lift/drag forces.', questionCount: 1585 },
    { id: '090', name: 'Communications', difficulty: 'Easy', passRate: 98, description: 'VFR and IFR phraseology.', questionCount: 714 },
];

interface Sitting {
    id: number;
    month: number;
    subjects: string[]; // IDs
    examDate?: string;
}

interface ExamPlannerProps {
    currentUser?: User;
}

export const ExamPlanner: React.FC<ExamPlannerProps> = ({ currentUser }) => {
    const [sittings, setSittings] = useState<Sitting[]>([]);
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
    const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [isLoading, setIsLoading] = useState(true);

    // Load from Firebase (if logged in) or Local Storage
    useEffect(() => {
        const loadPlan = async () => {
            setIsLoading(true);
            let synced = false;

            // 1. Try fetching from Firebase if user exists
            if (currentUser?.id) {
                try {
                    const profileDocRef = doc(db, 'profiles', currentUser.id);
                    const docSnap = await getDoc(profileDocRef);

                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        if (data?.exam_plan) {
                            setSittings(data.exam_plan.sittings || []);
                            setSelectedSubjects(data.exam_plan.selectedSubjects || []);
                            setStartDate(data.exam_plan.startDate || new Date().toISOString().split('T')[0]);
                            synced = true;
                        }
                    }
                } catch (err) {
                    console.error("Error fetching exam plan:", err);
                }
            }

            // 2. Fallback to Local Storage if no Firebase data found
            if (!synced) {
                const saved = localStorage.getItem('atpl_exam_plan');
                if (saved) {
                    try {
                        const parsed = JSON.parse(saved);
                        setSittings(parsed.sittings || []);
                        setSelectedSubjects(parsed.selectedSubjects || []);
                        setStartDate(parsed.startDate || new Date().toISOString().split('T')[0]);
                    } catch (e) {
                        console.error("Error parsing local exam plan", e);
                    }
                }
            }
            setIsLoading(false);
        };

        loadPlan();
    }, [currentUser?.id]); // Only re-run if user ID changes (e.g. login)

    // Save to Local Storage & Firebase (Debounced)
    useEffect(() => {
        if (isLoading) return; // Don't save empty state while loading

        const planData = { sittings, selectedSubjects, startDate };

        // Always save to local storage as backup
        localStorage.setItem('atpl_exam_plan', JSON.stringify(planData));

        // Sync to Firebase if logged in
        if (currentUser?.id) {
            const timer = setTimeout(async () => {
                try {
                    const profileDocRef = doc(db, 'profiles', currentUser.id);
                    await updateDoc(profileDocRef, {
                        exam_plan: planData
                    });
                } catch (err) {
                    console.error("Error saving exam plan:", err);
                }
            }, 1500); // 1.5s debounce

            return () => clearTimeout(timer);
        }
    }, [sittings, selectedSubjects, startDate, currentUser?.id, isLoading]);

    const addSitting = () => {
        if (sittings.length >= 6) {
            alert("You are limited to 6 sittings for the ATPL exams.");
            return;
        }
        const nextId = sittings.length > 0 ? Math.max(...sittings.map(s => s.id)) + 1 : 1;
        setSittings([...sittings, { id: nextId, month: sittings.length * 2, subjects: [] }]);
    };

    const removeSitting = (id: number) => {
        setSittings(sittings.filter(s => s.id !== id));
    };

    const updateSittingDate = (id: number, date: string) => {
        setSittings(prev => prev.map(s => s.id === id ? { ...s, examDate: date } : s));
    };

    const getRecommendedPlan = () => {
        // Based on Airhead ATPL strategy
        const plan: Sitting[] = [
            { id: 1, month: 0, subjects: ['010', '022', '031', '040', '090'] }, // Module 1: Relatively easy mix
            { id: 2, month: 3, subjects: ['021', '062', '070', '081'] }, // Module 2: AGK + POF
            { id: 3, month: 6, subjects: ['032', '033', '050', '061'] }, // Module 3: Gen Nav, Perf, Flight Planning, Met (The big ones)
        ];
        setSittings(plan);
    };

    const assignedSubjectIds = sittings.flatMap(s => s.subjects);
    const unassignedSubjects = ALL_SUBJECTS.filter(s => !assignedSubjectIds.includes(s.id));

    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case 'Easy': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
            case 'Medium': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case 'Medium-Hard': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
            case 'Hard': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
        }
    };

    const calculateSittingMetrics = (sitting: Sitting) => {
        const subjects = sitting.subjects.map(id => ALL_SUBJECTS.find(s => s.id === id)).filter(Boolean) as Subject[];
        const totalQuestions = subjects.reduce((sum, s) => sum + s.questionCount, 0);

        let daysRemaining = 0;
        let dailyTarget = 0;

        if (sitting.examDate) {
            const today = new Date();
            const exam = new Date(sitting.examDate);
            const diffTime = exam.getTime() - today.getTime();
            daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (daysRemaining > 0) {
                dailyTarget = Math.ceil(totalQuestions / daysRemaining);
            }
        }

        return { totalQuestions, daysRemaining, dailyTarget };
    };

    const onDragEnd = (result: DropResult) => {
        const { source, destination, draggableId } = result;

        // Dropped outside the list
        if (!destination) {
            return;
        }

        // Dropped in the same place
        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        // --- Logic to handle moving items ---

        // 1. Moving from/to 'remaining'
        const isSourceRemaining = source.droppableId === 'remaining';
        const isDestRemaining = destination.droppableId === 'remaining';

        // Helper to parse 'sitting-ID'
        const getSittingId = (dropId: string) => parseInt(dropId.replace('sitting-', ''));

        if (isSourceRemaining && !isDestRemaining) {
            // Drag from Remaining -> Sitting
            const destSittingId = getSittingId(destination.droppableId);
            setSittings(prev => prev.map(s => {
                if (s.id === destSittingId) {
                    const newSubjects = Array.from(s.subjects);
                    newSubjects.splice(destination.index, 0, draggableId);
                    return { ...s, subjects: newSubjects };
                }
                return s;
            }));
            return;
        }

        if (!isSourceRemaining && isDestRemaining) {
            // Drag from Sitting -> Remaining
            const sourceSittingId = getSittingId(source.droppableId);
            setSittings(prev => prev.map(s => {
                if (s.id === sourceSittingId) {
                    const newSubjects = s.subjects.filter(id => id !== draggableId);
                    return { ...s, subjects: newSubjects };
                }
                return s;
            }));
            return;
        }

        if (!isSourceRemaining && !isDestRemaining) {
            // Drag from Sitting -> Sitting (or Reorder within same Sitting)
            const sourceSittingId = getSittingId(source.droppableId);
            const destSittingId = getSittingId(destination.droppableId);

            if (sourceSittingId === destSittingId) {
                // Reorder within same sitting
                setSittings(prev => prev.map(s => {
                    if (s.id === sourceSittingId) {
                        const newSubjects = Array.from(s.subjects);
                        const [moved] = newSubjects.splice(source.index, 1);
                        newSubjects.splice(destination.index, 0, moved);
                        return { ...s, subjects: newSubjects };
                    }
                    return s;
                }));
            } else {
                // Move from one sitting to another
                setSittings(prev => prev.map(s => {
                    if (s.id === sourceSittingId) {
                        // Remove from source
                        return { ...s, subjects: s.subjects.filter(id => id !== draggableId) };
                    }
                    if (s.id === destSittingId) {
                        // Add to destination
                        const newSubjects = Array.from(s.subjects);
                        newSubjects.splice(destination.index, 0, draggableId);
                        return { ...s, subjects: newSubjects };
                    }
                    return s;
                }));
            }
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
                {/* Header section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                            <Calendar size={12} />
                            Strategic Exam Planner
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tight">Plan Your Sittings</h1>
                        <p className="text-slate-400 max-w-2xl">
                            Drag and drop subjects to plan your sittings. You have <span className="text-white font-bold">6 sittings</span> and <span className="text-white font-bold">18 months</span>.
                            {currentUser ? (
                                <span className="ml-2 inline-flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                    <CheckCircle2 size={10} /> Cloud Synced
                                </span>
                            ) : (
                                <span className="ml-2 inline-flex items-center gap-1 text-amber-400 text-xs font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                    <AlertCircle size={10} /> Local Storage Only
                                </span>
                            )}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={getRecommendedPlan}
                            className="px-6 py-3 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-2xl font-bold transition-all flex items-center gap-2"
                        >
                            <Sparkles size={18} />
                            Load Recommended Strategy
                        </button>
                        <button
                            onClick={addSitting}
                            className="px-6 py-3 bg-white text-slate-900 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center gap-2"
                        >
                            <Plus size={18} />
                            Add Sitting
                        </button>
                    </div>
                </div>

                {/* Rules Alert */}
                <div className="glass-panel p-6 rounded-3xl border-l-4 border-amber-500 flex gap-6 items-start">
                    <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl">
                        <AlertCircle size={24} />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-bold text-white">EASA/CAA Regulations</h3>
                        <p className="text-sm text-slate-400">
                            All exams must be passed within <span className="text-amber-400 font-bold">18 months</span> of the end of the month in which you first attempted an exam.
                            You have a maximum of <span className="text-amber-400 font-bold">6 sittings</span> and <span className="text-amber-400 font-bold">4 attempts</span> per subject.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Sidebar: Unassigned Subjects */}
                    <div className="lg:col-span-1 space-y-4">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <BookOpen size={20} className="text-indigo-400" />
                            Remaining Subjects
                        </h3>
                        <Droppable droppableId="remaining">
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar min-h-[200px]"
                                >
                                    {unassignedSubjects.map((subject, index) => (
                                        <Draggable key={subject.id} draggableId={subject.id} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`glass-panel p-4 rounded-2xl border transition-all group cursor-grab active:cursor-grabbing ${snapshot.isDragging
                                                            ? 'border-indigo-500/50 bg-indigo-500/20 shadow-lg scale-105 z-50'
                                                            : 'border-white/5 hover:border-indigo-500/30'
                                                        }`}
                                                    style={provided.draggableProps.style}
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="text-xs font-mono text-slate-500 tracking-wider">#{subject.id}</span>
                                                        <div className="flex gap-2">
                                                            <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                                                                <Target size={10} /> {subject.questionCount}
                                                            </span>
                                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getDifficultyColor(subject.difficulty)}`}>
                                                                {subject.difficulty}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <h4 className="font-bold text-white mb-1">{subject.name}</h4>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                    {unassignedSubjects.length === 0 && (
                                        <div className="p-10 text-center glass-panel rounded-3xl border border-dashed border-white/10">
                                            <CheckCircle2 size={40} className="mx-auto mb-4 text-emerald-500/50" />
                                            <p className="text-slate-500 text-sm">All subjects assigned!</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </Droppable>
                    </div>

                    {/* Right Area: Sittings Timeline */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {sittings.map((sitting, index) => {
                                const metrics = calculateSittingMetrics(sitting);
                                return (
                                    <Droppable key={sitting.id} droppableId={`sitting-${sitting.id}`}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className={`glass-panel p-6 rounded-3xl border transition-colors relative group min-h-[300px] flex flex-col ${snapshot.isDraggingOver ? 'border-indigo-500/30 bg-indigo-500/5' : 'border-white/5'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black">
                                                            {index + 1}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-white uppercase tracking-wider text-sm">Sitting #{index + 1}</h4>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <CalendarDays size={12} className="text-slate-500" />
                                                                <input
                                                                    type="date"
                                                                    value={sitting.examDate || ''}
                                                                    onChange={(e) => updateSittingDate(sitting.id, e.target.value)}
                                                                    className="bg-transparent border-none text-xs text-slate-400 focus:text-white p-0 focus:ring-0 cursor-pointer"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => removeSitting(sitting.id)}
                                                        className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>

                                                {/* Metrics Dashboard */}
                                                <div className="grid grid-cols-3 gap-2 mb-4">
                                                    <div className="bg-white/5 rounded-xl p-2 text-center border border-white/5">
                                                        <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Questions</div>
                                                        <div className="text-sm font-black text-white">{metrics.totalQuestions}</div>
                                                    </div>
                                                    <div className={`bg-white/5 rounded-xl p-2 text-center border border-white/5 ${metrics.daysRemaining < 0 ? 'bg-red-500/10 border-red-500/20' : ''}`}>
                                                        <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Days Left</div>
                                                        <div className={`text-sm font-black ${metrics.daysRemaining < 0 ? 'text-red-400' : 'text-white'}`}>
                                                            {sitting.examDate ? (metrics.daysRemaining > 0 ? metrics.daysRemaining : "Passed") : "-"}
                                                        </div>
                                                    </div>
                                                    <div className={`bg-white/5 rounded-xl p-2 text-center border border-white/5 ${metrics.dailyTarget > 100 ? 'bg-red-500/10 border-red-500/20' : metrics.dailyTarget > 50 ? 'bg-amber-500/10 border-amber-500/20' : ''}`}>
                                                        <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Daily Target</div>
                                                        <div className={`text-sm font-black ${metrics.dailyTarget > 100 ? 'text-red-400' : metrics.dailyTarget > 50 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                                            {metrics.dailyTarget > 0 ? metrics.dailyTarget : "-"}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-2 flex-1">
                                                    {sitting.subjects.length > 0 ? (
                                                        sitting.subjects.map((subId, subIndex) => {
                                                            const sub = ALL_SUBJECTS.find(s => s.id === subId);
                                                            if (!sub) return null;
                                                            return (
                                                                <Draggable key={subId} draggableId={subId} index={subIndex}>
                                                                    {(provided, snapshot) => (
                                                                        <div
                                                                            ref={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                            className={`flex items-center justify-between p-3 rounded-xl border group/item transition-all ${snapshot.isDragging
                                                                                    ? 'bg-indigo-500/20 border-indigo-500/50 shadow-lg scale-105 z-50'
                                                                                    : 'bg-white/5 border-white/5 hover:border-white/10'
                                                                                }`}
                                                                            style={provided.draggableProps.style}
                                                                        >
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="cursor-grab active:cursor-grabbing text-slate-600 hover:text-indigo-400">
                                                                                    <GripVertical size={14} />
                                                                                </div>
                                                                                <div className={`w-2 h-2 rounded-full ${sub.difficulty === 'Hard' ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                                                                                <div>
                                                                                    <span className="text-sm font-medium text-white block leading-none">{sub.name}</span>
                                                                                    <span className="text-[10px] text-slate-500">{sub.questionCount} qs</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </Draggable>
                                                            );
                                                        })
                                                    ) : (
                                                        <div className="h-full flex items-center justify-center text-center p-6 border-2 border-dashed border-white/5 rounded-2xl">
                                                            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                                                                {snapshot.isDraggingOver ? "Drop Here" : "Drag Subjects Here"}
                                                            </p>
                                                        </div>
                                                    )}
                                                    {provided.placeholder}
                                                </div>
                                            </div>
                                        )}
                                    </Droppable>
                                );
                            })}

                            {sittings.length === 0 && (
                                <div className="md:col-span-2 py-20 text-center glass-panel rounded-[40px] border-2 border-dashed border-white/5">
                                    <Calendar size={64} className="mx-auto mb-6 text-slate-800" />
                                    <h3 className="text-xl font-bold text-slate-400 mb-2">No sittings planned yet</h3>
                                    <p className="text-slate-600 text-sm mb-8 max-w-xs mx-auto">Start by adding your first exam session or use our recommended strategy.</p>
                                    <button
                                        onClick={addSitting}
                                        className="px-8 py-3 bg-indigo-500 hover:bg-indigo-400 text-white rounded-2xl font-bold transition-all"
                                    >
                                        Add First Sitting
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Timeline Analysis */}
                        {sittings.length > 0 && (
                            <div className="glass-panel p-8 rounded-3xl space-y-6">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Target size={20} className="text-emerald-400" />
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                    Plan Viability Analysis
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="space-y-4">
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Time Window</div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-3xl font-black text-white">18m</div>
                                            <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500 w-[70%]"></div>
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-400">Total time from first to last sitting is within the 18-month limit.</p>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sitting Count</div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-3xl font-black text-white">{sittings.length}/6</div>
                                            <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-indigo-500" style={{ width: `${(sittings.length / 6) * 100}%` }}></div>
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-400">You are using {sittings.length} out of your 6 allowed sitting windows.</p>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Subject Completion</div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-3xl font-black text-white">{assignedSubjectIds.length}/13</div>
                                            <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500" style={{ width: `${(assignedSubjectIds.length / 13) * 100}%` }}></div>
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-400">
                                            {assignedSubjectIds.length === 13 ? "All subjects are planned! Good luck, Pilot." : `${13 - assignedSubjectIds.length} subjects remaining to be planned.`}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DragDropContext>
    );
};
