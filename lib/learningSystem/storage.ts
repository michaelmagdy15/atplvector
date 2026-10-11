/**
 * ============================================================================
 * Foundation Learning System - Storage & Synchronization Engine
 * ============================================================================
 *
 * Implements:
 *   1. Type-safe, versioned localStorage persistence.
 *   2. Bounded storage quotas with resilient corruption self-healing.
 *   3. Asynchronous delta-sync to remote Firestore user profile.
 *   4. Monotonic conflict resolution ensuring students never lose earned mastery.
 */

import {
  ConceptId,
  StudentConceptState,
  DelayedReviewSchedule,
  RecommendationRecord,
  StudentLessonActivity,
  ConceptMasteryStatus,
} from './types';
import { db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const STORAGE_VERSION = 'v1';
const PREFIX = `atpl_learn_${STORAGE_VERSION}`;

export interface LearningSystemLocalData {
  version: string;
  studentId: string;
  concepts: Record<ConceptId, StudentConceptState>;
  schedules: Record<ConceptId, DelayedReviewSchedule>;
  recommendations: Record<string, RecommendationRecord>;
  lessonActivities: Record<string, StudentLessonActivity>;
  dirtyConceptIds: string[];
  dirtyScheduleIds: string[];
  dirtyRecommendationIds: string[];
  dirtyLessonIds: string[];
  lastSyncedAt: string | null;
}

const STATUS_PROGRESSION_RANK: Record<ConceptMasteryStatus, number> = {
  NOT_STARTED: 0,
  INTRODUCED: 1,
  MISCONCEPTION_FLAGGED: 1.5,
  ASSISTED: 2,
  LAPSED: 2.5,
  DEMONSTRATED: 3,
  RETAINED: 4,
};

export class LearningSystemStorage {
  private studentId: string;
  private cache: LearningSystemLocalData;

  constructor(studentId: string) {
    this.studentId = studentId;
    this.cache = this.loadFromLocalStorage();
  }

  private getKey(): string {
    return `${PREFIX}_${this.studentId || 'anonymous'}`;
  }

  // --------------------------------------------------------------------------
  // LocalStorage Operations
  // --------------------------------------------------------------------------

  private loadFromLocalStorage(): LearningSystemLocalData {
    const defaultData: LearningSystemLocalData = {
      version: STORAGE_VERSION,
      studentId: this.studentId,
      concepts: {},
      schedules: {},
      recommendations: {},
      lessonActivities: {},
      dirtyConceptIds: [],
      dirtyScheduleIds: [],
      dirtyRecommendationIds: [],
      dirtyLessonIds: [],
      lastSyncedAt: null,
    };

    try {
      const raw = localStorage.getItem(this.getKey());
      if (!raw) return defaultData;

      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          ...defaultData,
          ...parsed,
          concepts: parsed.concepts || {},
          schedules: parsed.schedules || {},
          recommendations: parsed.recommendations || {},
          lessonActivities: parsed.lessonActivities || {},
          dirtyConceptIds: parsed.dirtyConceptIds || [],
          dirtyScheduleIds: parsed.dirtyScheduleIds || [],
          dirtyRecommendationIds: parsed.dirtyRecommendationIds || [],
          dirtyLessonIds: parsed.dirtyLessonIds || [],
        };
      }
    } catch (err) {
      console.warn('[LearningStorage] Corrupt localStorage, initializing fallback', err);
    }
    return defaultData;
  }

  public saveToLocalStorage(): void {
    try {
      const payload = JSON.stringify(this.cache);
      localStorage.setItem(this.getKey(), payload);
    } catch (err) {
      console.error('[LearningStorage] Failed to save to localStorage (quota exceeded?)', err);
      this.pruneHistoricalData();
    }
  }

  private pruneHistoricalData(): void {
    // Retain only last 5 history entries per concept if storage constrained
    for (const conceptId of Object.keys(this.cache.concepts)) {
      const c = this.cache.concepts[conceptId];
      if (c && c.history && c.history.length > 5) {
        c.history = c.history.slice(-5);
      }
    }
    try {
      localStorage.setItem(this.getKey(), JSON.stringify(this.cache));
    } catch (e) {
      console.error('[LearningStorage] Pruning did not alleviate quota error', e);
    }
  }

  // --------------------------------------------------------------------------
  // Concept State Queries & Mutations
  // --------------------------------------------------------------------------

  public getConceptState(conceptId: ConceptId): StudentConceptState | null {
    return this.cache.concepts[conceptId] || null;
  }

  public getAllConceptStates(): Record<ConceptId, StudentConceptState> {
    return { ...this.cache.concepts };
  }

  public setConceptState(state: StudentConceptState): void {
    this.cache.concepts[state.conceptId] = state;
    if (!this.cache.dirtyConceptIds.includes(state.conceptId)) {
      this.cache.dirtyConceptIds.push(state.conceptId);
    }
    this.saveToLocalStorage();
  }

  // --------------------------------------------------------------------------
  // Spaced Review Schedule Queries & Mutations
  // --------------------------------------------------------------------------

  public getSchedule(conceptId: ConceptId): DelayedReviewSchedule | null {
    return this.cache.schedules[conceptId] || null;
  }

  public getAllDueSchedules(asOf: Date = new Date()): DelayedReviewSchedule[] {
    const asOfIso = asOf.toISOString();
    return Object.values(this.cache.schedules).filter(s => s.dueAt <= asOfIso);
  }

  public setSchedule(schedule: DelayedReviewSchedule): void {
    this.cache.schedules[schedule.conceptId] = schedule;
    if (!this.cache.dirtyScheduleIds.includes(schedule.conceptId)) {
      this.cache.dirtyScheduleIds.push(schedule.conceptId);
    }
    this.saveToLocalStorage();
  }

  // --------------------------------------------------------------------------
  // Recommendations Queries & Mutations
  // --------------------------------------------------------------------------

  public getActiveRecommendations(): RecommendationRecord[] {
    return Object.values(this.cache.recommendations)
      .filter(r => r.status === 'ACTIVE')
      .sort((a, b) => {
        const priorityScore: Record<string, number> = {
          CRITICAL_BLOCKER: 4,
          HIGH: 3,
          MEDIUM: 2,
          LOW: 1,
        };
        return (priorityScore[b.priority] || 0) - (priorityScore[a.priority] || 0);
      });
  }

  public setRecommendation(rec: RecommendationRecord): void {
    this.cache.recommendations[rec.id] = rec;
    if (!this.cache.dirtyRecommendationIds.includes(rec.id)) {
      this.cache.dirtyRecommendationIds.push(rec.id);
    }
    this.saveToLocalStorage();
  }

  // --------------------------------------------------------------------------
  // Lesson Activity Queries & Mutations
  // --------------------------------------------------------------------------

  public getLessonActivity(lessonId: string): StudentLessonActivity | null {
    return this.cache.lessonActivities[lessonId] || null;
  }

  public setLessonActivity(activity: StudentLessonActivity): void {
    this.cache.lessonActivities[activity.lessonId] = activity;
    if (!this.cache.dirtyLessonIds.includes(activity.lessonId)) {
      this.cache.dirtyLessonIds.push(activity.lessonId);
    }
    this.saveToLocalStorage();
  }

  // --------------------------------------------------------------------------
  // Remote Synchronization & Conflict Resolution
  // --------------------------------------------------------------------------

  /**
   * Resolves conflicts between two versions of a StudentConceptState.
   * Rule: Higher cognitive mastery status always wins.
   * If status is equal, the higher confidence score wins, then the latest timestamp.
   */
  public static resolveConceptConflict(
    local: StudentConceptState,
    remote: StudentConceptState
  ): StudentConceptState {
    const localRank = STATUS_PROGRESSION_RANK[local.status] || 0;
    const remoteRank = STATUS_PROGRESSION_RANK[remote.status] || 0;

    if (localRank > remoteRank) return local;
    if (remoteRank > localRank) return remote;

    if (local.confidence > remote.confidence) return local;
    if (remote.confidence > local.confidence) return remote;

    return new Date(local.updatedAt).getTime() >= new Date(remote.updatedAt).getTime() ? local : remote;
  }

  /**
   * Asynchronously synchronizes dirty state with Firestore user profile.
   */
  public async syncWithRemote(): Promise<{ success: boolean; syncedItems: number }> {
    if (!this.studentId || this.studentId === 'anonymous') {
      return { success: false, syncedItems: 0 };
    }

    try {
      const learningDocRef = doc(db, 'profiles', this.studentId, 'learning_system', 'root');
      const remoteSnap = await getDoc(learningDocRef);
      const remoteData = remoteSnap.exists() ? (remoteSnap.data() as Partial<LearningSystemLocalData>) : null;

      // 1. Inbound merge from remote if remote exists
      if (remoteData?.concepts) {
        for (const [conceptId, remoteConcept] of Object.entries(remoteData.concepts)) {
          const localConcept = this.cache.concepts[conceptId];
          if (!localConcept) {
            this.cache.concepts[conceptId] = remoteConcept;
          } else {
            this.cache.concepts[conceptId] = LearningSystemStorage.resolveConceptConflict(localConcept, remoteConcept);
          }
        }
      }

      if (remoteData?.schedules) {
        for (const [conceptId, remoteSchedule] of Object.entries(remoteData.schedules)) {
          const localSchedule = this.cache.schedules[conceptId];
          if (!localSchedule || new Date(remoteSchedule.dueAt).getTime() > new Date(localSchedule.dueAt).getTime()) {
            this.cache.schedules[conceptId] = remoteSchedule;
          }
        }
      }

      // 2. Outbound upload of consolidated payload
      const syncedCount =
        this.cache.dirtyConceptIds.length +
        this.cache.dirtyScheduleIds.length +
        this.cache.dirtyRecommendationIds.length +
        this.cache.dirtyLessonIds.length;

      const nowIso = new Date().toISOString();
      const payloadToSave = {
        version: STORAGE_VERSION,
        studentId: this.studentId,
        concepts: this.cache.concepts,
        schedules: this.cache.schedules,
        recommendations: this.cache.recommendations,
        lessonActivities: this.cache.lessonActivities,
        lastSyncedAt: nowIso,
      };

      await setDoc(learningDocRef, payloadToSave, { merge: true });

      // Clear dirty flags upon successful save
      this.cache.dirtyConceptIds = [];
      this.cache.dirtyScheduleIds = [];
      this.cache.dirtyRecommendationIds = [];
      this.cache.dirtyLessonIds = [];
      this.cache.lastSyncedAt = nowIso;
      this.saveToLocalStorage();

      return { success: true, syncedItems: syncedCount };
    } catch (err) {
      console.error('[LearningStorage] Failed to sync with remote Firestore:', err);
      return { success: false, syncedItems: 0 };
    }
  }
}

export const learningStorage = new LearningSystemStorage('default_user');
