"use client";
import { useEffect } from "react";
import { RefreshCw, TriangleAlert } from "lucide-react";
export default function ErrorPage({reset}:{error:Error&{digest?:string};reset:()=>void}){useEffect(()=>{},[]);return <main className="grid min-h-screen place-items-center p-5"><div className="card max-w-md p-9 text-center"><span className="mx-auto grid size-12 place-items-center rounded-2xl bg-amber-50 text-amber-500"><TriangleAlert size={22}/></span><h1 className="mt-4 text-xl font-bold">Something didn’t load</h1><p className="body-muted mt-2 text-xs">Try again. If the problem continues, return to your dashboard and pick up there.</p><button onClick={()=>reset()} className="btn-primary mt-5"><RefreshCw size={14}/>Try again</button></div></main>}
