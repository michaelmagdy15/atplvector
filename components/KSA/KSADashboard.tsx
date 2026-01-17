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
                    desc: 'Communication, Leadership, Situation Awareness, Problem Solving.',
                    view: View.KSA_COMPETENCIES,
                    isLocked
                },
                {
                    title: 'Threat & Error Management',
                    desc: 'Threats, Errors, UAS, and Countermeasures implementation.',
                    view: View.KSA_TEM,
                    isLocked
                },
                {
                    title: 'Mental Maths',
                    desc: '1-in-60 rule, Reciprocals, Time-Speed-Distance calculations.',
                    view: View.KSA_MENTAL_MATHS,
                    isLocked
                },
            ]}
        />
    );
};

export default KSADashboard;
