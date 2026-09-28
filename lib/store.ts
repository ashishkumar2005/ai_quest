"use client";

import { units } from "@/lib/data";
import type { QuizQuestionData } from "@/lib/quiz-data";
import type { Unit } from "@/lib/data";

export type PaperRecord = { id: string; title: string; session: string; type: string; description: string; url?: string; storagePath?: string; demoFileId?: string; downloadUrl?: string; fileName?: string; published: boolean; createdAt: string };
export type AnnouncementRecord = { id: string; title: string; text: string; published: boolean; createdAt: string };
export type SuggestionRecord = { id: string; subject: string; message: string; student: string; reviewed: boolean; createdAt: string };
export type UnitPdfRecord = { title: string; description: string; fileName: string; storagePath?: string; demoFileId?: string; url?: string; published: boolean; uploadedAt: string };
export type QuizAttemptRecord = { id: string; unitId: number; score: number; correct: number; total: number; date: string };

const KEY = "ai-quest-demo-v1";
type DemoState = { completed: string[]; quizScores: number[]; attempts: QuizAttemptRecord[]; papers: PaperRecord[]; announcements: AnnouncementRecord[]; suggestions: SuggestionRecord[]; unitPdfs: Record<string, UnitPdfRecord>; profile: { name: string; roll: string; className: string; school: string }; adminMode: boolean; unitsHidden: number[]; courseUnits?: Unit[]; quizContent?: Record<string, QuizQuestionData[]>; quizPublished?: Record<string, boolean> };
const initial: DemoState = { completed: [], quizScores: [], attempts: [], papers: [], announcements: [], suggestions: [], unitPdfs: {}, profile: { name: "Ashish", roll: "AI-1024", className: "10", school: "Your school" }, adminMode: false, unitsHidden: [] };

export function readState(): DemoState {
  if (typeof window === "undefined") return initial;
  try { const raw = window.localStorage.getItem(KEY); return raw ? { ...initial, ...JSON.parse(raw) } : initial; } catch { return initial; }
}
export function writeState(update: Partial<DemoState> | ((current: DemoState) => Partial<DemoState>)) {
  if (typeof window === "undefined") return readState();
  const current = readState();
  const patch = typeof update === "function" ? update(current) : update;
  const next = { ...current, ...patch };
  window.localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("ai-quest:updated"));
  return next;
}
export function getLearningStats(courseUnits = getCourseUnits()) {
  const state = readState();
  const activeIds = new Set(courseUnits.flatMap(unit => unit.lectures.map(lecture => lecture.id)));
  const completed = new Set(state.completed.filter(id => activeIds.has(id)));
  const currentTotal = courseUnits.reduce((n, u) => n + u.lectures.length, 0);
  const doneLectures = courseUnits.reduce((n, u) => n + u.lectures.filter(l => completed.has(l.id)).length, 0);
  const doneUnits = courseUnits.filter(u => u.lectures.length > 0 && u.lectures.every(l => completed.has(l.id))).length;
  return { completed: doneLectures, doneUnits, overall: currentTotal ? Math.round(doneLectures / currentTotal * 100) : 0, quizAverage: state.quizScores.length ? Math.round(state.quizScores.reduce((a, b) => a + b, 0) / state.quizScores.length) : 0, completedIds: [...completed] };
}

export function getCourseUnits() { return (readState().courseUnits ?? units).filter(unit=>unit.published!==false).map(unit=>({...unit,lectures:unit.lectures.filter(lecture=>lecture.published!==false)})); }
export function getQuizContent(unitId: number) { return readState().quizContent?.[String(unitId)] ?? undefined; }
