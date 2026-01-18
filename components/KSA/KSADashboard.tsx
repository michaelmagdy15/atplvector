import React from 'react';
import { View } from '../../types';
import GenericSubjectDashboard from '../GenericSubjectDashboard';
import { Brain, Users, Calculator, ShieldAlert, Target } from 'lucide-react';

interface Props {
    onChangeView: (view: View) => void;
    isLocked?: boolean;
}

const KSADashboard: React.FC<Props> = ({ onChangeView, isLocked }) => {
    return (
        <GenericSubjectDashboard
            subjectCode="100"
            subjectName="Knowledge, Skills and Attitudes (KSA)"
            color="indigo"
            description="ICAO Core Competencies, Threat and Error Management (TEM), and Mental Maths application."
            icon={Brain}
            onChangeView={onChangeView}
            modules={[
                {
                    title: 'Core Competencies',
                    desc: 'Instruction and Assessment Performance Indicators (Communication, Teamwork, etc).',
                    view: View.KSA_COMPETENCIES,
                    isLocked
                },
                {
                    title: 'Decision Making (FOR-DEC)',
                    desc: 'Interactive FOR-DEC model training for complex situations.',
                    view: View.KSA_FORDEC,
                    isLocked
                },
                {
                    title: 'Procedure Application',
                    desc: 'SOP adherence, checklist flows, and deviation recognition.',
                    view: View.KSA_PROCEDURES,
                    isLocked
                },
                {
                    title: 'Threat & Error Management',
                    desc: 'Identification of threats, errors, and UAS in various scenarios.',
                    view: View.KSA_TEM,
                    isLocked
                },
                {
                    title: 'UPRT Theory',
                    desc: 'Upset recognition and recovery techniques (Nose High/Low).',
                    view: View.KSA_UPRT,
                    isLocked
                },
                {
                    title: 'CRM Scenarios',
                    desc: 'Crew Resource Management assessment in multi-crew settings.',
                    view: View.KSA_CRM,
                    isLocked
                },
                {
                    title: 'Resilience Training',
                    desc: 'Startle effect, stress management, and fatigue mitigation.',
                    view: View.KSA_RESILIENCE,
                    isLocked
                },
                {
                    title: 'Mental Maths Lab',
                    desc: '11 interactive trainers for aviation arithmetic and RoT.',
                    view: View.KSA_MENTAL_MATHS,
                    isLocked
                },
            ]}
        />
    );
};

export default KSADashboard;
