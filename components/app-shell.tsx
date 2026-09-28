"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Bell, BookOpen, ChevronDown, CircleHelp, FileText, GraduationCap, House, LayoutDashboard, Menu, Search, Settings2, Sparkles, UserRound, X, ChartNoAxesColumnIncreasing, MessageSquareText } from "lucide-react";
import { announcements } from "@/lib/data";
import { readState } from "@/lib/store";
import { useCourseUnits } from "@/lib/hooks";
import { BrandMark } from "@/components/brand-mark";

const desktopNav = [
  { label: "Home", href: "/dashboard", icon: House }, { label: "Units", href: "/units", icon: BookOpen }, { label: "CBSE Sample Papers", href: "/papers", icon: FileText }, { label: "Quizzes", href: "/quizzes", icon: CircleHelp }, { label: "Progress", href: "/progress", icon: ChartNoAxesColumnIncreasing }, { label: "Suggestions", href: "/suggestions", icon: MessageSquareText }, { label: "Profile", href: "/profile", icon: UserRound },
];
const mobileNav = [{ label: "Home", href: "/dashboard", icon: House }, { label: "Units", href: "/units", icon: BookOpen }, { label: "Papers", href: "/papers", icon: FileText }, { label: "Progress", href: "/progress", icon: ChartNoAxesColumnIncreasing }, { label: "Profile", href: "/profile", icon: UserRound }, { label: "Admin", href: "/admin", icon: Settings2 }];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const courseUnits=useCourseUnits();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [student, setStudent] = useState(readState().profile.name);
  useEffect(() => { const update = () => setStudent(readState().profile.name); window.addEventListener("ai-quest:updated", update); return () => window.removeEventListener("ai-quest:updated", update); }, []);
  const items = useMemo(() => {
    const all = [
      ...courseUnits.flatMap(unit => [{ title: unit.shortTitle, sub: `Unit ${unit.id}`, href: `/units/${unit.id}`, type: "Unit" }, ...unit.lectures.map(lecture => ({ title: lecture.title, sub: `${unit.shortTitle} · ${lecture.duration}`, href: `/units/${unit.id}#${lecture.id}`, type: "Lecture" })), ...unit.topics.map(topic => ({ title: topic, sub: unit.shortTitle, href: `/units/${unit.id}`, type: "Topic" }))]),
      ...announcements.map(item => ({ title: item.title, sub: "Announcement", href: "/dashboard#announcements", type: "Notice" })),
      ...readState().papers.filter(p => p.published).map(item => ({ title: item.title, sub: item.session, href: "/papers", type: "Paper" })),
    ];
    if (!query.trim()) return all.slice(0, 5);
    return all.filter(x => `${x.title} ${x.sub} ${x.type}`.toLowerCase().includes(query.toLowerCase())).slice(0, 7);
  }, [query,courseUnits]);
  const isActive = (href: string) => href === "/dashboard" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  function runSearch(event: React.FormEvent) { event.preventDefault(); if (items[0]) router.push(items[0].href); }
  return <div className="app-shell">
    <aside className="app-sidebar">
      <Link href="/dashboard" className="flex items-center gap-3 px-3 mb-9">
        <BrandMark size={42} className="shrink-0"/>
        <span><strong className="block text-[17px] tracking-tight">AI Quest</strong><span className="text-[10px] font-semibold text-slate-400">CLASS 10 · ARTIFICIAL INTELLIGENCE</span></span>
      </Link>
      <div className="px-3 mb-2 eyebrow">LEARN</div>
      <nav className="flex flex-col gap-1">
        {desktopNav.map(({ label, href, icon: Icon }) => <Link key={href} href={href} className={`nav-item ${isActive(href) ? "active" : ""}`}><Icon size={18}/><span>{label}</span>{label === "CBSE Sample Papers" && <span className="ml-auto rounded-md bg-indigo-50 px-1.5 py-0.5 text-[9px] text-indigo-500">CBSE</span>}</Link>)}
      </nav>
      <div className="mt-auto">
        <div className="rounded-2xl bg-[#f3f5ff] p-4 mb-4">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs"><Sparkles size={15}/>Your AI Journey</div>
          <p className="text-[11px] leading-5 text-slate-500 mt-2 mb-3">Small steps today. Big ideas tomorrow.</p>
          <Link href="/progress" className="text-[11px] font-bold text-indigo-600 flex items-center gap-1">See your progress <ArrowRight size={13}/></Link>
        </div>
        <Link href="/admin" className="nav-item text-[12px]"><Settings2 size={16}/>Admin portal</Link>
      </div>
    </aside>
    <div className="app-main">
      <header className="topbar">
        <div className="hidden sm:block text-xs font-semibold text-slate-400">Learn AI. Build Skills. Explore the Future.</div>
        <div className="flex items-center gap-3 ml-auto">
          <div className="relative">
            <form onSubmit={runSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
              <input aria-label="Search units, lessons and topics" placeholder="Search anything..." className="w-[210px] md:w-[260px] rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 pl-9 pr-9 text-xs outline-none transition focus:border-indigo-300 focus:bg-white" value={query} onFocus={() => setSearchOpen(true)} onChange={event => { setQuery(event.target.value); setSearchOpen(true); }}/>
              {query && <button type="button" onClick={() => setQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"><X size={14}/></button>}
            </form>
            {searchOpen && <><button aria-label="Close search" className="fixed inset-0 z-10 cursor-default" onClick={() => setSearchOpen(false)}/><div className="search-panel z-20">{items.length ? items.map((item, i) => <Link onClick={() => setSearchOpen(false)} href={item.href} key={`${item.title}-${i}`} className="search-item"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-500"><Search size={16}/></span><span className="min-w-0 flex-1"><strong className="block truncate text-xs">{item.title}</strong><small className="text-slate-400">{item.sub}</small></span><span className="badge">{item.type}</span></Link>) : <div className="p-5 text-center text-xs text-slate-500">No matches yet. Try a unit or topic.</div>}</div></>}
          </div>
          <Link href="/dashboard#announcements" aria-label="Announcements" className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50"><Bell size={17}/><i className="absolute right-[8px] top-[7px] size-1.5 rounded-full bg-orange-400"/></Link>
          <Link href="/profile" className="flex items-center gap-2.5 rounded-xl py-1 pl-1 pr-2 hover:bg-slate-50"><span className="grid size-9 place-items-center rounded-full bg-[#e9edff] text-indigo-600 font-bold text-xs">{student.slice(0,1).toUpperCase()}</span><span className="hidden sm:block text-left"><strong className="block text-[11px]">{student}</strong><small className="text-[10px] text-slate-400">Class 10 student</small></span><ChevronDown size={14} className="hidden sm:block text-slate-400"/></Link>
        </div>
      </header>
      <main className="content">{children}</main>
      <footer className="border-t border-slate-100 px-5 py-4 text-center text-[10px] text-slate-400">Made with love by Aivora</footer>
    </div>
    <nav className="mobile-bottom" aria-label="Mobile navigation">{mobileNav.map(({ label, href, icon: Icon }) => <Link href={href} key={href} className={`mobile-nav-link ${isActive(href) ? "active" : ""}`}><Icon size={19}/><span>{label}</span></Link>)}</nav>
  </div>;
}
