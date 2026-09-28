"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, KeyRound, LoaderCircle, LockKeyhole } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = await response.json();
      if (!response.ok) {
        setMessage(result.error ?? "Unable to sign in.");
        setBusy(false);
        return;
      }
      const requested = new URLSearchParams(window.location.search).get("next");
      const destination = requested?.startsWith("/admin") && !requested.startsWith("//") && !requested.startsWith("/admin/login") ? requested : "/admin";
      window.location.assign(destination);
    } catch {
      setMessage("Could not reach the server. Please try again.");
      setBusy(false);
    }
  }

  return <main className="grid min-h-screen place-items-center bg-[#f7f8fc] px-5 py-10">
    <section className="w-full max-w-[410px] rounded-[24px] border border-slate-100 bg-white p-6 shadow-[0_16px_60px_rgba(30,45,90,.08)] sm:p-8">
      <Link href="/dashboard" className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 hover:text-indigo-600"><ArrowLeft size={13}/>Back to learning</Link>
      <div className="mt-7 flex items-center gap-3"><BrandMark size={44}/><div><b className="block text-[16px]">AI Quest</b><span className="text-[9px] font-bold tracking-[.14em] text-slate-400">ADMIN PORTAL</span></div></div>
      <div className="mt-8"><span className="grid size-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600"><KeyRound size={18}/></span><h1 className="mt-4 text-xl font-bold tracking-tight">Admin sign in</h1><p className="mt-1 text-[11px] leading-5 text-slate-500">Enter the administrator password to continue.</p></div>
      <form onSubmit={submit} className="mt-6 space-y-3">
        <label className="label" htmlFor="admin-password">Password</label>
        <div className="relative"><LockKeyhole size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input id="admin-password" name="password" type="password" className="field !pl-9 text-xs" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" autoFocus required/></div>
        {message && <div role="alert" className="rounded-xl bg-rose-50 p-3 text-[10px] text-rose-700">{message}</div>}
        <button disabled={busy} className="btn-primary w-full justify-center text-[11px]">{busy ? <LoaderCircle className="animate-spin" size={15}/> : null}Unlock admin portal<ArrowRight size={15}/></button>
      </form>
      <p className="mt-5 text-[9px] leading-4 text-slate-400">This session stays signed in for 12 hours on this browser.</p>
      <p className="mt-5 text-center text-[10px] text-slate-400">Made with love by Aivora</p>
    </section>
  </main>;
}
