import { View } from '../types';

export const easa090Syllabus = [
    // 090.01 - DEFINITIONS
    { id: '090.01.01.01', title: 'Meanings and significance', status: 'covered', subject: '090', component: View.COMMS_DEFINITIONS },
    { id: '090.01.01.02', title: 'Air traffic services (ATS) abbreviations', status: 'covered', subject: '090', component: View.ABBREVIATION_GAME },
    { id: '090.01.01.03', title: 'Q-code groups', status: 'covered', subject: '090', component: View.QCODE_CARDS },
    { id: '090.01.01.04', title: 'Categories of messages', status: 'covered', subject: '090', component: View.PRIORITY },

    // 090.02 - GENERAL OPERATING PROCEDURES
    { id: '090.02.01.01', title: 'Transmission of letters', status: 'covered', subject: '090', component: View.PHONETIC },
    { id: '090.02.01.02', title: 'Transmission of numbers', status: 'covered', subject: '090', component: View.NUM_TIME_TRANSMIT },
    { id: '090.02.01.03', title: 'Transmission of time', status: 'covered', subject: '090', component: View.NUM_TIME_TRANSMIT },
    { id: '090.02.01.04', title: 'Transmission techniques', status: 'covered', subject: '090', component: View.VFR_COMMS_SIM },
    { id: '090.02.01.05', title: 'Standard words and phrases', status: 'covered', subject: '090', component: View.VFR_COMMS_SIM },
    { id: '090.02.01.06', title: 'RT call signs for aeronautical stations', status: 'covered', subject: '090', component: View.CALLSIGN_TRAINER }, // Covered by Trainer
    { id: '090.02.01.07', title: 'RT call signs for aircraft (Abbreviations)', status: 'covered', subject: '090', component: View.CALLSIGN_TRAINER },
    { id: '090.02.01.08', title: 'Transfer of communication', status: 'covered', subject: '090', component: View.TRANSFER_DRILL },
    { id: '090.02.01.09', title: 'Test procedures (Readability Scale)', status: 'covered', subject: '090', component: View.READABILITY_SIM },
    { id: '090.02.01.10', title: 'Read-back and acknowledgement', status: 'covered', subject: '090', component: View.VFR_COMMS_SIM },
    { id: '090.02.01.11', title: 'Radar procedural phraseology', status: 'covered', subject: '090', component: View.RADAR_VECTORS },
    { id: '090.02.01.12', title: 'Level changes and reports', status: 'covered', subject: '090', component: View.LEVEL_CHANGES },
    { id: '090.02.01.13', title: 'Data link messages (CPDLC)', status: 'covered', subject: '090', component: View.CPDLC_SIM },

    // 090.03 - RELEVANT WEATHER INFORMATION TERMS (VFR)
    { id: '090.03.01.01', title: 'Aerodrome weather terms', status: 'covered', subject: '090', component: View.SIGMET_DECODER },
    { id: '090.03.01.02', title: 'Weather broadcast', status: 'covered', subject: '090', component: View.VOLMET_SIM },

    // 090.04 - COMMS FAILURE (VFR)
    { id: '090.04.01.01', title: 'Action required to be taken in case of communication failure', status: 'covered', subject: '090', component: View.COMM_FAIL },

    // 090.05 - DISTRESS AND URGENCY PROCEDURES
    { id: '090.05.01.01', title: 'Distress (MAYDAY)', status: 'covered', subject: '090', component: View.URGENCY_TRAINER },
    { id: '090.05.01.02', title: 'Urgency (PAN PAN)', status: 'covered', subject: '090', component: View.URGENCY_TRAINER },

    // 090.06 - GENERAL PRINCIPLES OF VHF PROPAGATION AND FREQUENCY ALLOCATION
    { id: '090.06.01.01', title: 'Spectrum, bands, range', status: 'covered', subject: '090', component: View.PROPAGATION_THEORY },

    // 090.07 - MORSE CODE
    { id: '090.07.01.01', title: 'Meteorological observations', status: 'covered', subject: '090', component: View.SIGMET_DECODER },
    { id: '090.07.01.02', title: 'Use of Morse code', status: 'covered', subject: '090', component: View.NAV_NDB_VOR },
];
