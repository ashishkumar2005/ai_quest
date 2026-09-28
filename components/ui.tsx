import Link from "next/link";
import { ArrowRight, BookOpen, CircleHelp, FileText, Sparkles } from "lucide-react";
import type { Unit } from "@/lib/data";
import { CourseImage } from "@/components/course-image";

export function PageHeading({ eyebrow, title, text, action }: { eyebrow?: string; title: string; text?: string; action?: React.ReactNode }) {
  return <div className="section-heading"><div>{eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}<h1 className="title-lg">{title}</h1>{text && <p className="body-muted mt-2 max-w-2xl">{text}</p>}</div>{action}</div>;
}

export function ProgressBar({ value, color }: { value: number; color?: string }) {
  return <div className="progress-track"><div className="progress-fill" style={{ width: `${Math.max(0, Math.min(100, value))}%`, ...(color ? { background: color } : {}) }}/></div>;
}

export function UnitCard({ unit, percent = 0 }: { unit: Unit; percent?: number }) {
  return <Link href={`/units/${unit.id}`} className="card group p-3 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-100/60">
    <div className="relative"><CourseImage className="unit-art transition group-hover:brightness-[1.02]" src={unit.image} alt={`Illustration for ${unit.shortTitle}`} width={640} height={360} sizes="(max-width:760px) 90vw, (max-width:1100px) 44vw, 350px"/><span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-slate-600">UNIT {String(unit.id).padStart(2,"0")}</span></div>
    <div className="px-2 pt-4 pb-2"><div className="flex items-start justify-between gap-2"><h2 className="text-[15px] font-bold leading-5">{unit.shortTitle}</h2><span className="shrink-0 text-[10px] text-slate-400">{unit.lectures.length ? `${unit.lectures.length} lessons` : "Coming soon"}</span></div><p className="mt-2 min-h-[38px] text-xs leading-[1.6] text-slate-500 line-clamp-2">{unit.description}</p>
      <div className="mt-4 flex items-center justify-between text-[10px] text-slate-400"><span>{percent}% complete</span><span className="flex items-center gap-1 font-bold text-indigo-600">Explore <ArrowRight size={13}/></span></div><div className="mt-2"><ProgressBar value={percent}/></div></div>
  </Link>;
}

export function EmptyState({ icon = "book", title, text, action }: { icon?: "book"|"file"|"quiz"|"spark"; title: string; text: string; action?: React.ReactNode }) {
  const Icon = icon === "file" ? FileText : icon === "quiz" ? CircleHelp : icon === "spark" ? Sparkles : BookOpen;
  return <div className="card px-6 py-12 text-center"><span className="mx-auto grid size-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-500"><Icon size={22}/></span><h2 className="mt-4 text-base font-bold">{title}</h2><p className="body-muted mx-auto mt-2 max-w-sm text-xs">{text}</p>{action && <div className="mt-5">{action}</div>}</div>;
}
