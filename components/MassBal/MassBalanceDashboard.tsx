import React from 'react';
import { Scale, Box, TrendingUp, Info, Package, ChevronRight, Calculator, Ruler, Truck, Weight, RefreshCw } from 'lucide-react';
import GenericSubjectDashboard from '../GenericSubjectDashboard';
import { View } from '../../types';

const MassBalanceDashboard: React.FC<{ onNavigate: (view: View) => void }> = ({ onNavigate }) => {
    return (
        <GenericSubjectDashboard
            subjectCode="031"
            subjectName="Mass and Balance"
            description="Master the principles of loading, equilibrium, and aircraft stability."
            icon={Weight}
            color="indigo"
            onChangeView={onNavigate}
            modules={[
                {
                    title: 'Principles & Definitions',
                    desc: 'Understanding BEM, DOM, ZFM, TOM and useful load.',
                    view: View.MASS_BAL_DEFINITIONS
                },
                {
                    title: 'Visual Flow Diagram',
                    desc: 'Visual build-up flow from BEM to Landing Mass.',
                    view: View.MASS_BAL_FLOW_DIAGRAM
                },
                {
                    title: 'Weighing Procedure',
                    desc: 'Aircraft weighing and CG calculation basics.',
                    view: View.MASS_BAL_CG_CALC
                },
                {
                    title: 'MAC Visualizer',
                    desc: 'Mean Aerodynamic Chord, LEMAC and %MAC visuals.',
                    view: View.MASS_BAL_MAC
                },
                {
                    title: 'Load Sheet Simulator',
                    desc: 'Interactive loadsheet with limit checks (MTOM, MZFM).',
                    view: View.MASS_BAL_LOADSHEET
                },
                {
                    title: 'Trim Sheet Sim',
                    desc: 'Visual manual trim sheet with drop line graph.',
                    view: View.MASS_BAL_TRIM_SHEET
                },
                {
                    title: 'Loading Limits',
                    desc: 'Envelope limits and structural maximums.',
                    view: View.MASS_BAL_LIMITS
                },
                {
                    title: 'Fuel Density & Mass',
                    desc: 'Jet A1 vs Avgas, SG calculation and temperature.',
                    view: View.MASS_BAL_FUEL
                },
                {
                    title: 'CG Shift Calculator',
                    desc: 'Formulas for Moving, Adding and Removing Mass.',
                    view: View.MASS_BAL_CG_SHIFT
                },
                {
                    title: 'Cargo Handling',
                    desc: 'Effects of shifting mass (Load Shift).',
                    view: View.MASS_BAL_SHIFT
                },
                {
                    title: 'Unit Converter',
                    desc: 'Mass (kg/lb) and Volume (L/Gal) conversions.',
                    view: View.MASS_BAL_CONVERTER
                }
            ]}
        />
    );
};

export default MassBalanceDashboard;
