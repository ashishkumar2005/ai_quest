import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ lectureId: string }> }) {
  const supabase=await getSupabaseServerClient();
  if(!supabase)return NextResponse.json({error:"Video playback is unavailable in demo mode."},{status:503});
  const {data:{user}}=await supabase.auth.getUser();
  if(!user)return NextResponse.json({error:"Sign in required."},{status:401});
  const {lectureId}=await params;
  const {data:lecture}=await supabase.from("lectures").select("video_provider,video_id,published,units!inner(published)").eq("id",lectureId).eq("published",true).eq("units.published",true).maybeSingle();
  if(!lecture?.video_id||lecture.video_provider!=="supabase")return NextResponse.json({error:"Video not found."},{status:404});
  const {data,error}=await supabase.storage.from("course-resources").createSignedUrl(lecture.video_id,3600);
  if(error||!data?.signedUrl)return NextResponse.json({error:"Could not create a secure video link."},{status:502});
  return NextResponse.json({playbackUrl:data.signedUrl},{headers:{"Cache-Control":"private, no-store, max-age=0"}});
}
