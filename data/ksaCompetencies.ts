export interface KSACompetency {
    id: string;
    name: string;
    description: string;
    indicators: string[];
}

export interface KSAGrade {
    value: number;
    label: string;
    description: string;
    color: string;
}

export const KSA_COMPETENCIES: KSACompetency[] = [
    {
        id: 'COM',
        name: 'Communication',
        description: 'Demonstrates effective oral, non-verbal and written communication skills in classroom exercise and assessment situations.',
        indicators: [
            'Ensures the recipient is ready and prepared to receive the information.',
            'Selects appropriately what, when, how and with whom to communicate.',
            'Conveys messages clearly, accurately and concisely.',
            'Confirms that the recipient correctly understands important information.',
            'Listens actively and demonstrates understanding of the information they receive.',
            'Asks relevant and effective questions.',
            'Adheres to standard radio-telephony phraseology.',
            'Accurately reads, interprets, constructs and responds to given documentation in English.',
            'Correctly interprets non-verbal communication.',
            'Uses eye contact, body language and gestures that are consistent with and support verbal messages.'
        ]
    },
    {
        id: 'L&T',
        name: 'Leadership and Teamwork',
        description: 'Displays effective leadership and teamwork.',
        indicators: [
            'Creates an atmosphere of open communication and encourages team participation.',
            'Uses initiative and gives directions when required.',
            'Admits mistakes and takes responsibility.',
            'Anticipates and responds appropriately to others’ needs.',
            'Carries out instructions when directed.',
            'Communicates relevant concerns and intentions.',
            'Gives and receives feedback constructively.',
            'Demonstrates empathy and shows respect and tolerance for others.',
            'Engages others in planning and allocates activities fairly and appropriately according to abilities.',
            'Addresses and resolves conflicts and disagreements in a constructive manner.',
            'Projects self-control.'
        ]
    },
    {
        id: 'PSD',
        name: 'Problem-solving and Decision-making',
        description: 'Accurately identifies risks and resolves problems. Uses the appropriate decision-making processes.',
        indicators: [
            'Seeks accurate and adequate information from appropriate sources.',
            'Identifies and verifies what and why things have gone wrong.',
            'Employs proper problem-solving strategies.',
            'Perseveres in working through problems.',
            'Uses appropriate decision-making processes in a timely manner.',
            'Sets priorities appropriately.',
            'Identifies and considers options effectively.',
            'Monitors, reviews, and adapts decisions as required.',
            'Identifies and manages risks effectively.'
        ]
    },
    {
        id: 'SA',
        name: 'Situation Awareness',
        description: 'Perceives and comprehends all the relevant information available, anticipates what could happen that could affect the exercise or situations discussed in the classroom, and gives effective solutions to resolve the situation.',
        indicators: [
            'Identifies and assesses accurately the general environment as it may affect the operation.',
            'Identifies and manages threats, errors, and undesirable aircraft states.'
        ]
    },
    {
        id: 'WLM',
        name: 'Workload Management',
        description: 'Manages available resources or time to efficiently prioritise and complete or perform tasks in a timely manner.',
        indicators: [
            'Maintains self-control.',
            'Plans, prioritises and schedules tasks effectively.',
            'Manages time efficiently when carrying out tasks.',
            'Offers and accepts assistance, delegates when necessary, and asks for help early.',
            'Manages and recovers from interruptions, distractions, variations, and failures effectively.'
        ]
    },
    {
        id: 'AKUR',
        name: 'Application of Knowledge, UPRT and Resilience',
        description: 'Demonstrates correct and deep understanding of the subject(s), and is able to effectively relate this knowledge between subjects and apply the knowledge for effective threat and error management (TEM).',
        indicators: [
            'Correctly completes pre-flight planning in the practical exercise.',
            'Demonstrates KSA and TEM relating to phases of flight in the ground training environment.',
            'Correctly and effectively applies knowledge to identify and manage threats and errors that could lead to a potential upset in scenario situations.',
            "Recognises potential upset 'threats' and suggests effective 'threat management' in scenario situations.",
            "Recognises potential upset 'errors' and suggests effective 'error management' in scenario situations.",
            'Identifies the causes of and contributing factors to upsets in aircraft accident and incident reviews and in reported recovered situations or scenarios.',
            'Is resilient, i.e. recognises and adapts to disruptions during scenarios and other exercises.',
            'Identifies the signs of stress and discusses the effects of stress, fatigue and aviation lifestyle on situation awareness, including how to cope with these in order to maintain situation awareness.'
        ]
    }
];

export const KSA_GRADING_SCALE: KSAGrade[] = [
    {
        value: 5,
        label: 'Excellent',
        description: 'The student’s performance in this competency was exemplary, and had an outstanding effect on the excellent outcome of the exercise. The student showed all of the relevant performance indicators to an excellent standard. An impressive performance with practically no remarks.',
        color: 'bg-emerald-500'
    },
    {
        value: 4,
        label: 'Very Good',
        description: 'The student’s performance in this competency was highly effective, and has significantly enhanced the very good outcome. The student showed most or all of the relevant performance indicators to a very good standard. The performance exceeds standards.',
        color: 'bg-green-500'
    },
    {
        value: 3,
        label: 'Good',
        description: 'The student’s performance in this competency was effective and contributed significantly to a good outcome. The student showed most of the relevant performance indicators to a good standard. The performance meets standards.',
        color: 'bg-lime-500'
    },
    {
        value: 2,
        label: 'Fair',
        description: 'The student’s performance in this competency was satisfactory, which had a slightly positive effect on the satisfactory outcome of the exercise, and in group situations had a slightly positive effect on others. The student showed at least some of the relevant performance indicators in this competency. The performance is considered to meet the minimum standards but is calling for improvement.',
        color: 'bg-yellow-500'
    },
    {
        value: 1,
        label: 'Retraining',
        description: 'The student’s performance in this competency was ineffective or inadequate, which in relation to this competency had a neutral or negative effect on others or on the outcome of the exercise. The student showed none or few of the relevant performance indicators in this competency. The performance is below standards.',
        color: 'bg-red-500'
    }
];
