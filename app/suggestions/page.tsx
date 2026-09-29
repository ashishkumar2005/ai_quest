"use client";

import { FormEvent, useEffect, useState } from "react";
import { CheckCircle2, Lightbulb, Send } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeading } from "@/components/ui";
import { readState, writeState } from "@/lib/store";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SuggestionsPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [name, setName] = useState(readState().profile.name);

  useEffect(() => {
    setName(readState().profile.name);
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    const current = readState();
    const item = {
      id: crypto.randomUUID(),
      subject: subject.trim(),
      message: message.trim(),
      student: current.profile.name,
      reviewed: false,
      createdAt: new Date().toISOString(),
    };
    writeState({ suggestions: [item, ...current.suggestions] });

    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("suggestions").insert({
          user_id: user.id,
          subject: item.subject,
          message: item.message,
        });
      }
    }

    setSubject("");
    setMessage("");
    setSent(true);
  };

  return (
    <AppShell>
      <PageHeading
        eyebrow="STUDENT SUPPORT"
        title="Issues & messages"
        text="Report a problem, ask a question, or send any message to the course team."
      />
      <div className="grid items-start gap-5 lg:grid-cols-[1fr_300px]">
        <form onSubmit={submit} className="card p-5 md:p-7">
          <div className="flex items-start gap-3 rounded-xl bg-indigo-50/70 p-4">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-indigo-500">
              <Lightbulb size={18} />
            </span>
            <div>
              <b className="text-xs">Your message goes to the course team</b>
              <p className="mt-1 text-[10px] leading-4 text-slate-500">
                An admin can see your message and student account name in the portal.
              </p>
            </div>
          </div>
          <div className="mt-5">
            <label className="label" htmlFor="subject">Subject</label>
            <input
              id="subject"
              className="field"
              maxLength={120}
              required
              value={subject}
              onChange={event => setSubject(event.target.value)}
              placeholder="Briefly describe your issue or message"
            />
          </div>
          <div className="mt-4">
            <label className="label" htmlFor="message">Message</label>
            <textarea
              id="message"
              className="field min-h-40 resize-y"
              required
              maxLength={3000}
              value={message}
              onChange={event => setMessage(event.target.value)}
              placeholder="Tell us what happened or what you’d like the team to know."
            />
            <div className="mt-1.5 text-right text-[9px] text-slate-400">{message.length}/3000</div>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="text-[10px] text-slate-400">
              Submitting as <b className="text-slate-600">{name}</b>
            </div>
            <button type="submit" className="btn-primary text-[11px]">
              <Send size={14} />Send message
            </button>
          </div>
          {sent && (
            <div role="status" className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-[10px] font-semibold text-emerald-700">
              <CheckCircle2 size={15} />Thanks — your message has been sent.
            </div>
          )}
        </form>
        <aside className="card p-5">
          <span className="grid size-10 place-items-center rounded-xl bg-amber-50 text-amber-500">
            <Lightbulb size={19} />
          </span>
          <h2 className="mt-4 text-sm font-bold">What happens next?</h2>
          <p className="mt-2 text-[11px] leading-5 text-slate-500">
            The course admin reviews incoming issues, questions, and messages in the admin portal.
          </p>
          <div className="mt-4 rounded-xl bg-slate-50 p-3 text-[10px] leading-5 text-slate-500">
            Please don’t include passwords or private information in your message.
          </div>
        </aside>
      </div>
    </AppShell>
  );
}