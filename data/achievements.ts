export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string; // Lucide icon name or emoji
    xpReward: number;
    condition: string; // Description of how to unlock
}

export const ACHIEVEMENTS: Achievement[] = [
    {
        id: 'first_flight',
        title: 'First Flight',
        description: 'Complete your first module interaction.',
        icon: '🛫',
        xpReward: 100,
        condition: 'Interact with any module.'
    },
    {
        id: 'load_master',
        title: 'Load Master',
        description: 'Score 100% on a Mass & Balance Quiz.',
        icon: '⚖️',
        xpReward: 500,
        condition: 'Complete a quiz with perfect score.'
    },
    {
        id: 'quiz_wiz',
        title: 'Quiz Wizard',
        description: 'Complete 5 guided practice sessions.',
        icon: 'mage',
        xpReward: 300,
        condition: 'Finish 5 wizard sessions.'
    },
    {
        id: 'met_expert',
        title: 'Met Expert',
        description: 'Interpret 10 TAFs correctly.',
        icon: 'cloud',
        xpReward: 400,
        condition: 'Correctly answer 10 TAF questions.'
    },
    {
        id: 'system_checked',
        title: 'System Checked',
        description: 'Visit the Settings or Profile page.',
        icon: '⚙️',
        xpReward: 50,
        condition: 'Navigate to settings.'
    }
];

export enum UserRank {
    STUDENT = 'Student Pilot',
    PPL = 'Private Pilot',
    CPL = 'Commercial Pilot',
    ATPL = 'Airline Transport Pilot'
}

export const LEVEL_THRESHOLDS = {
    [UserRank.STUDENT]: 0,
    [UserRank.PPL]: 1000,
    [UserRank.CPL]: 5000,
    [UserRank.ATPL]: 15000
};
