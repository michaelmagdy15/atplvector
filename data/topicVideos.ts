import { View } from '../types';

export const GOOGLE_DRIVE_FOLDER_ID = '1CTzK5RtHsvJtqTNyysjLByYCibqiRS8Z';
export const GOOGLE_DRIVE_FOLDER_URL =
  'https://drive.google.com/drive/folders/1CTzK5RtHsvJtqTNyysjLByYCibqiRS8Z?usp=sharing';

export interface TopicVideoEntry {
  view: View;
  subjectCode: string;
  title: string;
  durationSec: number;
  examTakeaway: string;
  driveFileId?: string;
  videoUrl?: string;
  dayBatch: number;
}

export const TOPIC_VIDEOS: Partial<Record<View, TopicVideoEntry>> = {
  [View.PERF_INTRO]: {
    view: View.PERF_INTRO,
    subjectCode: '032',
    title: 'Density Altitude & TAS vs IAS',
    durationSec: 36,
    examTakeaway: 'High density altitude shrinks thrust & wing lift while increasing TAS for any IAS.',
    driveFileId: '',
    dayBatch: 1,
  },
  [View.PERF_TAKEOFF]: {
    view: View.PERF_TAKEOFF,
    subjectCode: '032',
    title: 'Balanced Field Length & V1',
    durationSec: 36,
    examTakeaway: 'V1 is balanced where Accelerate-Stop Distance equals Takeoff Distance Required.',
    driveFileId: '',
    dayBatch: 1,
  },
  [View.PERF_CLIMB]: {
    view: View.PERF_CLIMB,
    subjectCode: '032',
    title: 'Vx vs Vy & Excess Thrust',
    durationSec: 36,
    examTakeaway: 'Steepest climb angle (Vx) needs excess thrust; best rate (Vy) needs excess power.',
    driveFileId: '',
    dayBatch: 1,
  },
  [View.PERF_CRUISE]: {
    view: View.PERF_CRUISE,
    subjectCode: '032',
    title: 'Specific Air Range & Step Climb',
    durationSec: 36,
    examTakeaway: 'Headwinds demand faster MRC/LRC cruise speed; burning fuel lowers optimum altitude.',
    driveFileId: '',
    dayBatch: 1,
  },
  [View.PERF_LANDING]: {
    view: View.PERF_LANDING,
    subjectCode: '032',
    title: 'Factored Landing Distance (60% / 70% / Wet)',
    durationSec: 36,
    examTakeaway: 'CS-25 jets factor dry ALD by 1/0.60 (1.67) and multiply by 1.15 for wet runways.',
    driveFileId: '',
    dayBatch: 1,
  },
  [View.PERF_CLASS_A]: {
    view: View.PERF_CLASS_A,
    subjectCode: '032',
    title: 'Class A OEI Segments & Net vs Gross',
    durationSec: 36,
    examTakeaway: 'Net flight path deducts 0.8% (2-engine), 0.9% (3-engine), and 1.0% (4-engine) gradient.',
    driveFileId: '',
    dayBatch: 1,
  },
  [View.PERF_CLASS_B]: {
    view: View.PERF_CLASS_B,
    subjectCode: '032',
    title: 'Class B Safety Factors & Obstacles',
    durationSec: 36,
    examTakeaway: 'Multiply Class B unfactored takeoff by 1.25 (to 50 ft) and landing by 1.43.',
    driveFileId: '',
    dayBatch: 1,
  },
  [View.POF_HIGH_SPEED]: {
    view: View.POF_HIGH_SPEED,
    subjectCode: '081',
    title: 'Coffin Corner & Mach Tuck',
    durationSec: 36,
    examTakeaway: 'Shockwaves shift CP aft causing nose-down tuck; trust Mach Trim and avoid hard pulls.',
    driveFileId: '',
    dayBatch: 1,
  },
  [View.POF_STALL]: {
    view: View.POF_STALL,
    subjectCode: '081',
    title: 'Critical AoA & Load Factor Stall',
    durationSec: 36,
    examTakeaway: 'Stall always occurs at the critical AoA; load factor increases stall speed by √n.',
    driveFileId: '',
    dayBatch: 1,
  },
  [View.POF_DRAG]: {
    view: View.POF_DRAG,
    subjectCode: '081',
    title: 'Total Drag Curve & VMD',
    durationSec: 36,
    examTakeaway: 'Minimum total drag (VMD) occurs where induced drag equals parasite drag.',
    driveFileId: '',
    dayBatch: 1,
  },
};

export function hasPlayableVideo(entry?: TopicVideoEntry): entry is TopicVideoEntry {
  return Boolean(entry && (entry.driveFileId?.trim() || entry.videoUrl?.trim()));
}

export function getTopicVideo(view: View): TopicVideoEntry | null {
  const entry = TOPIC_VIDEOS[view];
  return hasPlayableVideo(entry) ? entry : null;
}

export function getSubjectPublishedVideos(subjectCode: string): TopicVideoEntry[] {
  return Object.values(TOPIC_VIDEOS).filter(
    (entry): entry is TopicVideoEntry =>
      hasPlayableVideo(entry) && entry.subjectCode === subjectCode
  );
}

export function getEmbedUrl(entry: TopicVideoEntry): string {
  if (entry.videoUrl?.trim()) {
    return entry.videoUrl.trim();
  }
  const fileId = entry.driveFileId?.trim() || '';
  return `https://drive.google.com/file/d/${fileId}/preview`;
}
