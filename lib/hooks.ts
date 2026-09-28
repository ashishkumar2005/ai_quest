"use client";
import { useEffect, useState } from "react";
import { units } from "@/lib/data";
import { getCourseUnits } from "@/lib/store";
import { loadCourseUnitsFromSupabase } from "@/lib/supabase/content";

export function useCourseUnits() {
  const [courseUnits, setCourseUnits] = useState(getCourseUnits());
  useEffect(() => {
    let alive=true;
    const refresh=()=>setCourseUnits(getCourseUnits());
    refresh();window.addEventListener("ai-quest:updated",refresh);
    const load=async()=>{const rows=await loadCourseUnitsFromSupabase();if(alive&&rows)setCourseUnits(rows)};
    load();return()=>{alive=false;window.removeEventListener("ai-quest:updated",refresh)};
  },[]);
  return courseUnits;
}
