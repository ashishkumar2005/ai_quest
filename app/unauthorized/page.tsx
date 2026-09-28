import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { LockKeyhole } from "lucide-react";
export default function UnauthorizedPage(){return <AppShell><div className="card mx-auto max-w-lg p-10 text-center"><span className="mx-auto grid size-12 place-items-center rounded-2xl bg-rose-50 text-rose-500"><LockKeyhole size={22}/></span><h1 className="mt-4 text-xl font-bold">Admin access only</h1><p className="body-muted mt-2 text-xs">This account does not have administrator access to the AI Quest portal.</p><Link href="/dashboard" className="btn-primary mt-5">Return to learning</Link></div></AppShell>}
