"use client";
import { useEffect, useState } from "react";
import { BookOpen, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeading, UnitCard } from "@/components/ui";
import { useCourseUnits } from "@/lib/hooks";
import { getLearningStats } from "@/lib/store";

export default function UnitsPage(){
 const units=useCourseUnits();
 const [completed,setCompleted]=useState<string[]>([]);
 useEffect(()=>{const refresh=()=>setCompleted(getLearningStats(units).completedIds);refresh();window.addEventListener("ai-quest:updated",refresh);return()=>window.removeEventListener("ai-quest:updated",refresh)},[units]);
 const percent=(id:number)=>{const u=units.find(x=>x.id===id)!;return u.lectures.length?Math.round(u.lectures.filter(l=>completed.includes(l.id)).length/u.lectures.length*100):0};
 return <AppShell><PageHeading eyebrow="CLASS 10 · ARTIFICIAL INTELLIGENCE" title="Explore your units" text="Seven focused modules take you from the foundations of AI to building with Python." action={<span className="badge"><BookOpen size={12} className="mr-1"/>7 units</span>}/><div className="mb-5 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 sm:flex sm:items-center sm:justify-between"><div className="flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-indigo-600"><Sparkles size={17}/></span><div><b className="text-xs">Learn at your own pace</b><p className="mt-1 text-[11px] leading-5 text-slate-500">Lessons, notes and practice live together inside each unit.</p></div></div><span className="mt-3 text-[10px] font-semibold text-indigo-600 sm:mt-0">Your progress saves automatically</span></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{units.map(unit=><UnitCard key={unit.id} unit={unit} percent={percent(unit.id)}/>)}</div></AppShell>
}
