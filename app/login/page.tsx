"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { writeState } from "@/lib/store";

export default function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");
  const [className, setClassName] = useState("10");
  const [school, setSchool] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      writeState({ profile: { name: name || "Ashish", roll: roll || "AI-1024", className: className || "10", school: school || "Your school" } });
      window.location.href = "/dashboard";
      return;
    }
    const result = mode === "signin"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { data: { full_name: name, roll_number: roll, class_name: className, school } } });
    setBusy(false);
    if (result.error) {
      setMessage(result.error.message);
      return;
    }
    if (mode === "signup" && !result.data.session) {
      setMessage("Account created. Check your email for a confirmation link, then sign in.");
      return;
    }
    window.location.href = "/dashboard";
  };

  return <main className="grid min-h-screen bg-white md:grid-cols-[.9fr_1.1fr]">
    <section className="relative hidden overflow-hidden bg-[#263d9e] p-10 text-white md:flex md:flex-col md:justify-between">
      <Link href="/" className="flex items-center gap-3"><BrandMark size={42}/><b className="text-lg">AI Quest</b></Link>
      <div className="relative z-10 max-w-md">
        <div className="text-[10px] font-bold tracking-[.16em] text-indigo-200">LEARN AI. BUILD SKILLS.</div>
        <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight">Your next big idea starts here.</h1>
        <p className="mt-4 text-sm leading-6 text-indigo-100">A friendly learning space for CBSE Class 10 Artificial Intelligence.</p>
        <div className="mt-8 flex flex-wrap gap-2">{["Made for curious minds", "Learn at your pace", "Interactive quizzes"].map(item => <span key={item} className="rounded-full bg-white/10 px-3 py-1.5 text-[9px] font-semibold">{item}</span>)}</div>
      </div>
      <div className="absolute -bottom-16 -right-4 size-80 rounded-full border border-white/10 bg-white/[.04]"/>
      <div className="text-[10px] text-indigo-200">Made with love by Aivora</div>
    </section>

    <section className="flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-[430px]">
        <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-400 md:hidden"><ArrowLeft size={14}/><BrandMark size={26}/>AI Quest</Link>
        <div className="mb-8 mt-8 flex items-center gap-3 md:mt-0"><BrandMark size={44}/><div><b className="block text-[17px]">{mode === "signin" ? "Good to see you" : "Start your learning journey"}</b><small className="text-[10px] text-slate-400">{mode === "signin" ? "Sign in to continue learning." : "Create your student account."}</small></div></div>
        <div className="mb-4 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
          <button onClick={() => { setMode("signin"); setMessage(""); }} className={`rounded-lg py-2 text-[10px] font-bold ${mode === "signin" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"}`}>Sign in</button>
          <button onClick={() => { setMode("signup"); setMessage(""); }} className={`rounded-lg py-2 text-[10px] font-bold ${mode === "signup" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"}`}>Create account</button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && <>
            <div><label className="label" htmlFor="name">Full name</label><input id="name" className="field text-xs" required value={name} onChange={event => setName(event.target.value)} placeholder="Your full name"/></div>
            <div className="grid grid-cols-2 gap-3"><div><label className="label" htmlFor="roll">Roll number</label><input id="roll" className="field text-xs" value={roll} onChange={event => setRoll(event.target.value)} placeholder="Roll number"/></div><div><label className="label" htmlFor="class">Class</label><input id="class" className="field text-xs" value={className} onChange={event => setClassName(event.target.value)}/></div></div>
            <div><label className="label" htmlFor="school">School</label><input id="school" className="field text-xs" value={school} onChange={event => setSchool(event.target.value)} placeholder="School name"/></div>
          </>}
          <div><label className="label" htmlFor="email">Email</label><div className="relative"><Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input id="email" type="email" className="field !pl-9 text-xs" required value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email"/></div></div>
          <div><label className="label" htmlFor="password">Password</label><div className="relative"><LockKeyhole size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input id="password" type="password" className="field !pl-9 text-xs" required minLength={8} value={password} onChange={event => setPassword(event.target.value)} placeholder="At least 8 characters" autoComplete={mode === "signin" ? "current-password" : "new-password"}/></div></div>
          {message && <div role="status" className="rounded-xl bg-amber-50 p-3 text-[10px] leading-4 text-amber-800">{message}</div>}
          <button disabled={busy} className="btn-primary w-full justify-center text-[11px]">{busy ? <LoaderCircle className="animate-spin" size={15}/> : null}{mode === "signin" ? "Sign in" : "Create account"}<ArrowRight size={15}/></button>
        </form>
        {!process.env.NEXT_PUBLIC_SUPABASE_URL && <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4"><div className="flex items-center gap-2 text-[10px] font-bold text-indigo-700"><CheckCircle2 size={14}/>Demo preview</div><p className="mt-1 text-[9px] leading-4 text-slate-500">Supabase isn’t connected yet. You can explore with local demo data while setting up authentication.</p></div>}
        <p className="mt-5 text-center text-[9px] leading-4 text-slate-400">By continuing, you agree to use this learning space respectfully. Student accounts use email and password authentication.</p>
        <p className="mt-6 text-center text-[10px] text-slate-400 md:hidden">Made with love by Aivora</p>
      </div>
    </section>
  </main>;
}
