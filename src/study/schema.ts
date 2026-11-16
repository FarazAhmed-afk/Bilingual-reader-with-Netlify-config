import type { Condition } from '../config/conditions';
import type { Lang } from '../config/languages';
import type { ReaderSettings, SettingKey } from '../config/settings';
import type { SettingEvent, Source, SuggestionStatus } from '../app/adjustableReducer';

export interface QuizAnswer { questionId: string; choice: number; correct: boolean }
export interface EffortRatings { mental: number; effort: number; frustration: number }   // 1..7

export interface SettingsSnapshot {
  final: ReaderSettings;
  /** null in the default condition (nothing is adjustable) */
  sources: Record<SettingKey, Source> | null;
  suggestion: SuggestionStatus | null;
  events: SettingEvent[];
}

export interface TrialRecord {
  index: number;
  lang: Lang;
  condition: Condition;
  passageId: string;
  readingStartedAt: number;   // epoch ms; settings events before this happened during the untimed setup step
  readingEndedAt: number;
  readingMs: number;          // performance.now() difference, includes any in-reading adjustments
  interrupted: number;        // times this trial was restarted after a page reload; exclude timing if > 0
  settings: SettingsSnapshot;
  quiz: { answers: QuizAnswer[]; score: number; submittedAt: number };
  effort: EffortRatings & { submittedAt: number };
}

export interface SusRecord { lang: Lang; answers: number[]; score: number; submittedAt: number }
