import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { BookOpen, Info, AlertTriangle, CheckCircle, BarChart as ChartIcon } from 'lucide-react';

const allSubjectsData: Record<string, any> = {
    "010": {
        title: "Air Law",
        examInfo: { time: "1:00", totalQs: 44 },
        labels: [
            '010-01', '010-02', '010-04', '010-05', '010-06', '010-07', '010-08',
            '010-09', '010-10', '010-11', '010-12', '010-13'
        ],
        topicNames: [
            'International Law: Conventions, Agreements and Organisations',
            'Airworthiness of Aircraft, Aircraft Nationality and Registration Marks',
            'Personnel Licensing',
            'Rules of the Air According to ICAO Annex 2 and SERA',
            'Aircraft Operations',
            'Air Traffic Services (ATS) and Air Traffic Management (ATM)',
            'Aeronautical Information Service (AIS)',
            'Aerodromes',
            'Facilitation (ICAO Annex 9)',
            'Search and Rescue (SAR)',
            'Security – Safeguarding International Civil Aviation against Acts of Unlawful Interference (ICAO Annex 17)',
            'Aircraft Accident and Incident Investigation'
        ],
        qbQuestions: [76, 27, 109, 242, 343, 406, 82, 281, 51, 31, 71, 74],
        examQuestions: [2, 1, 1, 9, 10, 6, 1, 8, 1, 1, 2, 2]
    },
    "021": {
        title: "Airframe, Systems, Electrics, Power Plant",
        examInfo: { time: "2:00", totalQs: 80 },
        labels: [
            '021-01', '021-02', '021-03', '021-04', '021-05', '021-06',
            '021-07', '021-08', '021-09', '021-10', '021-11', '021-12', '021-13'
        ],
        topicNames: [
            'System Design, Loads, Stresses, Maintenance',
            'Airframe',
            'Hydraulics',
            'Landing Gear, Wheels, Tyres, Brakes',
            'Flight Controls',
            'Pneumatics - Pressurisation and Air Conditioning',
            'Anti-icing and De-icing Systems',
            'Fuel System',
            'Electrics',
            'Piston Engines',
            'Turbine Engines',
            'Protection and Detection Systems',
            'Oxygen Systems'
        ],
        qbQuestions: [77, 75, 101, 130, 141, 89, 51, 117, 261, 213, 373, 59, 77],
        examQuestions: [2, 2, 5, 5, 8, 5, 2, 5, 15, 6, 19, 3, 3]
    },
    "022": {
        title: "Instrumentation",
        examInfo: { time: "1:30", totalQs: 60 },
        labels: [
            '022-01', '022-02', '022-03', '022-04', '022-05', '022-06', '022-08', '022-09',
            '022-10', '022-11', '022-12', '022-13', '022-14', '022-15'
        ],
        topicNames: [
            'Sensors and Instruments',
            'Measurement of Air Data Parameters',
            'Magnetism – Direct Reading Compass and Flux Valve',
            'Gyroscopic Instruments',
            'Inertial Navigation',
            'Aeroplane: Automatic Flight Control Systems',
            'Trims – Yaw Damper – Flight Envelope Protection',
            'Autothrust – Automatic Thrust Control System',
            'Communication Systems',
            'Flight Management System (FMS) / Flight Management and Guidance System (FMGS)',
            'Alerting Systems, Proximity Systems',
            'Integrated Instruments – Electronic Displays',
            'Maintenance, Monitoring and Recording Systems',
            'Digital Circuits and Computers'
        ],
        qbQuestions: [141, 274, 109, 139, 107, 233, 83, 49, 53, 172, 236, 144, 29, 20],
        examQuestions: [3, 8, 2, 4, 3, 11, 4, 4, 2, 6, 6, 4, 1, 1]
    },
    "031": {
        title: "Mass & Balance",
        examInfo: { time: "1:15", totalQs: 25 },
        labels: ['031-01', '031-02', '031-04', '031-05', '031-06'],
        topicNames: [
            'Purpose of Mass and Balance Considerations',
            'Loading',
            'Mass and Balance Details of Aircraft',
            'Determination of CG Position',
            'Cargo Handling'
        ],
        qbQuestions: [53, 235, 120, 186, 51],
        examQuestions: [1, 8, 5, 9, 2]
    },
    "032": {
        title: "Performance",
        examInfo: { time: "2:00", totalQs: 45 },
        labels: ['032-01', '032-02', '032-03', '032-04', '032-05'],
        topicNames: [
            'General',
            'CS-23 / Applicable Operational Requirements Performance Class B – Theory',
            'CS-23 / Applicable Operational Requirements Performance Class B – Use of Aeroplane Performance Data',
            'CS-25 / Applicable Operational Requirements Performance Class A – Theory',
            'CS-25 / Applicable Operational Requirements Performance Class A – Use of Aeroplane Performance Data'
        ],
        qbQuestions: [372, 139, 147, 553, 122],
        examQuestions: [12, 6, 3, 18, 6]
    },
    "033": {
        title: "Flight Planning & Monitoring",
        examInfo: { time: "2:00", totalQs: 42 },
        labels: ['033-01', '033-02', '033-03', '033-04', '033-05', '033-06'],
        topicNames: [
            'Flight Planning for VFR Flights',
            'Flight Planning for IFR Flights',
            'Fuel Planning – CAT.OP.MPA.106 and CAT.OP.MPA.150 plus AMC1, 2, and 3',
            'Pre-Flight Preparation',
            'ICAO Flight Plan (ATS Flight Plan (FPL))',
            'Flight Monitoring and In-flight Re-planning'
        ],
        qbQuestions: [189, 420, 406, 174, 94, 188],
        examQuestions: [6, 13, 11, 6, 1, 5]
    },
    "040": {
        title: "Human Performance and Limitations",
        examInfo: { time: "1:30", totalQs: 48 },
        labels: ['040-01', '040-02', '040-03'],
        topicNames: [
            'Human Factors: Basic Concepts',
            'Basics of Aviation Physiology and Health Maintenance',
            'Basic Aviation Psychology'
        ],
        qbQuestions: [99, 815, 581],
        examQuestions: [4, 24, 20]
    },
    "050": {
        title: "Meteorology",
        examInfo: { time: "2:00", totalQs: 84 },
        labels: [
            '050-01', '050-02', '050-03', '050-04', '050-05',
            '050-06', '050-07', '050-08', '050-09', '050-10'
        ],
        topicNames: [
            'The Atmosphere',
            'Wind',
            'Thermodynamics',
            'Clouds and Fog',
            'Precipitation',
            'Air Masses and Fronts',
            'Pressure Systems',
            'Climatology',
            'Flight Hazards',
            'Meteorological Information'
        ],
        qbQuestions: [361, 298, 148, 218, 60, 193, 138, 212, 379, 514],
        examQuestions: [10, 10, 3, 8, 2, 7, 6, 8, 14, 16]
    },
    "061": {
        title: "General Navigation",
        examInfo: { time: "2:15", totalQs: 55 },
        labels: ['061-01', '061-02', '061-03', '061-04', '061-05'],
        topicNames: [
            'Basics of Navigation',
            'Visual Flight Rule (VFR) Navigation',
            'Great Circles and Rhumb Lines',
            'Charts',
            'Time'
        ],
        qbQuestions: [760, 107, 107, 358, 111],
        examQuestions: [28, 7, 5, 12, 3]
    },
    "062": {
        title: "Radio Navigation",
        examInfo: { time: "1:30", totalQs: 66 },
        labels: ['062-01', '062-02', '062-03', '062-06', '062-07'],
        topicNames: [
            'Basic Radio Propagation Theory',
            'Radio Aids',
            'Radar',
            'Global Navigation Satellite Systems (GNSSs)',
            'Performance Based Navigation (PBN)'
        ],
        qbQuestions: [145, 587, 178, 179, 192],
        examQuestions: [5, 22, 11, 15, 13]
    },
    "070": {
        title: "Operational Procedures",
        examInfo: { time: "1:15", totalQs: 42 },
        labels: ['071-01', '071-02', '071-04'],
        topicNames: [
            'General Requirements',
            'Special Operational Procedures and Hazards (General Aspects)',
            'Specialised Operations'
        ],
        qbQuestions: [730, 590, 6],
        examQuestions: [17, 24, 1]
    },
    "081": {
        title: "Principles of Flight",
        examInfo: { time: "1:30", totalQs: 46 },
        labels: [
            '081-01', '081-02', '081-03', '081-04', '081-05', '081-06', '081-07', '081-08'
        ],
        topicNames: [
            'Subsonic Aerodynamics',
            'High Speed Aerodynamics',
            'Stall, Mach Tuck and Upset Prevention and Recovery',
            'Stability',
            'Control',
            'Limitations',
            'Propellers',
            'Flight Mechanics'
        ],
        qbQuestions: [711, 237, 300, 218, 194, 176, 196, 362],
        examQuestions: [14, 4, 9, 4, 3, 3, 4, 5]
    },
    "090": {
        title: "Communications",
        examInfo: { time: "1:00", totalQs: 34 },
        labels: ['090-01', '090-02', '090-03', '090-04', '090-05', '090-06', '090-07'],
        topicNames: [
            'Concepts',
            'General Operating Procedures',
            'Relevant Weather Information',
            'Voice Communication Failure',
            'Distress and Urgency Procedures',
            'VHF Propagation and Allocation of Frequencies',
            'Other Communications'
        ],
        qbQuestions: [109, 529, 80, 93, 107, 93, 33],
        examQuestions: [4, 17, 2, 4, 3, 2, 2]
    }
};

interface Props {
    onBack?: () => void;
}

const StudyGuide: React.FC<Props> = ({ onBack }) => {
    const [selectedSubject, setSelectedSubject] = useState('090');

    const chartData = useMemo(() => {
        const data = allSubjectsData[selectedSubject];
        if (!data) return [];

        const totalQb = data.qbQuestions.reduce((a: number, b: number) => a + b, 0);
        const totalExam = data.examQuestions.reduce((a: number, b: number) => a + b, 0);

        return data.labels.map((label: string, index: number) => {
            const qbCount = data.qbQuestions[index];
            const examCount = data.examQuestions[index];
            const qbPct = (qbCount / totalQb) * 100;
            const examPct = (examCount / totalExam) * 100;
            const priority = (qbPct > 0) ? (examPct / qbPct) : 0;

            return {
                label,
                topicName: data.topicNames[index],
                qbCount,
                examCount,
                qbPct: parseFloat(qbPct.toFixed(1)),
                examPct: parseFloat(examPct.toFixed(1)),
                priority: parseFloat(priority.toFixed(2))
            };
        });
    }, [selectedSubject]);

    const activeSubject = allSubjectsData[selectedSubject];

    // Priority color helper
    const getPriorityColor = (priority: number) => {
        if (priority > 1.1) return 'text-green-400';
        if (priority < 0.9) return 'text-red-400';
        return 'text-slate-400';
    };

    const getPriorityBg = (priority: number) => {
        if (priority > 1.1) return 'bg-green-500/20';
        if (priority < 0.9) return 'bg-red-500/20';
        return 'bg-slate-500/20';
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 min-h-screen">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <ChartIcon className="w-8 h-8 text-blue-400" />
                        ATPL Study Guide
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Compare Question Bank representation vs. Actual Exam representation
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    {onBack && (
                        <button onClick={onBack} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                            Back to Dashboard
                        </button>
                    )}
                    <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-64 p-2.5"
                    >
                        <option value="010">010 - Air Law</option>
                        <option value="021">021 - AGK: Systems</option>
                        <option value="022">022 - Instrumentation</option>
                        <option value="031">031 - Mass & Balance</option>
                        <option value="032">032 - Performance</option>
                        <option value="033">033 - Flight Planning</option>
                        <option value="040">040 - Human Performance</option>
                        <option value="050">050 - Meteorology</option>
                        <option value="061">061 - General Nav</option>
                        <option value="062">062 - Radio Nav</option>
                        <option value="070">070 - Ops Procedures</option>
                        <option value="081">081 - Principles of Flight</option>
                        <option value="090">090 - Communications</option>
                    </select>
                </div>
            </div>

            {/* Main Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass-panel p-6 rounded-2xl md:col-span-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Info size={100} />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Study Smart: Focus on Percentage!</h2>
                    <p className="text-slate-300 leading-relaxed">
                        Don't be misled by the <strong>total number</strong> of questions in the QB.
                        This tool compares each topic's <strong>percentage share</strong> of the QB versus its <strong>percentage share</strong> of the actual exam.
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-sm text-yellow-400 bg-yellow-400/10 p-3 rounded-lg border border-yellow-400/20">
                        <AlertTriangle size={16} />
                        <span>Focus on topics where Exam % (Green) is higher than QB % (Red).</span>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center gap-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-slate-400">Total Exam Questions</span>
                        <span className="text-xl font-mono font-bold text-white">{activeSubject.examInfo.totalQs}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-400">Time Allowed</span>
                        <span className="text-xl font-mono font-bold text-white">{activeSubject.examInfo.time}</span>
                    </div>
                </div>
            </div>

            {/* Chart Section */}
            <div className="glass-panel p-6 rounded-2xl mb-8 h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis
                            dataKey="label"
                            stroke="#94a3b8"
                            tick={{ fill: '#94a3b8' }}
                        />
                        <YAxis
                            stroke="#94a3b8"
                            tick={{ fill: '#94a3b8' }}
                            label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                            itemStyle={{ color: '#f8fafc' }}
                            cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                            formatter={(value: number) => [`${value}%`]}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Bar name="% of Question Bank" dataKey="qbPct" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        <Bar name="% of Actual Exam" dataKey="examPct" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Data Table */}
            <div className="glass-panel rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/5">
                    <h3 className="text-lg font-bold text-white">Data Breakdown & Priority</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-900/50 text-xs uppercase font-bold text-slate-300">
                            <tr>
                                <th className="px-6 py-4">Subject</th>
                                <th className="px-6 py-4">Topic Name</th>
                                <th className="px-6 py-4 text-right">QB Qs</th>
                                <th className="px-6 py-4 text-right">Exam Qs</th>
                                <th className="px-6 py-4 text-right text-red-400">QB %</th>
                                <th className="px-6 py-4 text-right text-green-400">Exam %</th>
                                <th className="px-6 py-4 text-right">Study Priority</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {chartData.map((row: any, idx: number) => (
                                <tr key={idx} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-mono text-white/70">{row.label}</td>
                                    <td className="px-6 py-4 text-white font-medium">{row.topicName}</td>
                                    <td className="px-6 py-4 text-right font-mono">{row.qbCount}</td>
                                    <td className="px-6 py-4 text-right font-mono text-white">{row.examCount}</td>
                                    <td className="px-6 py-4 text-right font-mono text-red-400">{row.qbPct}%</td>
                                    <td className="px-6 py-4 text-right font-mono text-green-400">{row.examPct}%</td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${getPriorityBg(row.priority)} ${getPriorityColor(row.priority)}`}>
                                            {row.priority}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-slate-900/80 font-bold text-white">
                            <tr>
                                <td colSpan={2} className="px-6 py-4 text-right">Totals</td>
                                <td className="px-6 py-4 text-right text-slate-400">
                                    {activeSubject.qbQuestions.reduce((a: number, b: number) => a + b, 0)}
                                </td>
                                <td className="px-6 py-4 text-right text-slate-400">
                                    {activeSubject.examInfo.totalQs}
                                </td>
                                <td className="px-6 py-4 text-right text-red-400">100%</td>
                                <td className="px-6 py-4 text-right text-green-400">100%</td>
                                <td className="px-6 py-4 opacity-0">--</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StudyGuide;
