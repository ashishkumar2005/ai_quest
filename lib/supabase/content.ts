"use client";
import { units, type Unit } from "@/lib/data";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export async function loadCourseUnitsFromSupabase(includeUnpublished=false): Promise<Unit[] | null> {
  const supabase=getSupabaseBrowserClient();if(!supabase)return null;
  const [{data:rows,error},{data:lectureRows}]=await Promise.all([supabase.from("units").select("id,title,short_title,description,color,hero_image_url,objectives,topics,position,published").order("position"),supabase.from("lectures").select("id,unit_id,title,description,duration,topics,video_id,position,published").order("position")]);
  if(error||!rows?.length)return null;
  const visible=rows.filter(row=>includeUnpublished||row.published).map(row=>({id:row.id,title:row.title,shortTitle:row.short_title,description:row.description,color:row.color??"#3f62e8",image:row.hero_image_url??"",objectives:row.objectives??[],topics:row.topics??[],lectures:(lectureRows??[]).filter(lecture=>lecture.unit_id===row.id&&(includeUnpublished||(lecture.published&&Boolean(lecture.video_id)))).map(lecture=>({id:lecture.id,title:lecture.title,description:lecture.description,duration:lecture.duration,topics:lecture.topics??[],videoId:lecture.video_id??undefined,published:lecture.published})),published:row.published} as Unit));
  return Promise.all(visible.map(async unit=>{
    if(!unit.image||unit.image.startsWith("/")||unit.image.startsWith("http")||unit.image.startsWith("data:"))return unit;
    const {data}=await supabase.storage.from("course-resources").createSignedUrl(unit.image,3600);return {...unit,image:data?.signedUrl??"/images/unit-1.svg"};
  }));
}
