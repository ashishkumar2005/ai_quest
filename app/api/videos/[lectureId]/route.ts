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
  if(!lecture?.video_id||lecture.video_provider!=="cloudflare")return NextResponse.json({error:"Video not found."},{status:404});
  const account=process.env.CLOUDFLARE_ACCOUNT_ID;const customer=process.env.CLOUDFLARE_STREAM_CUSTOMER_CODE;const token=process.env.CLOUDFLARE_STREAM_API_TOKEN;
  if(!account||!customer||!token)return NextResponse.json({error:"Secure video playback is not configured."},{status:503});
  const response=await fetch(`https://api.cloudflare.com/client/v4/accounts/${account}/stream/${lecture.video_id}/token`,{method:"POST",headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json"},body:JSON.stringify({exp:Math.floor(Date.now()/1000)+3600}),cache:"no-store"});
  if(!response.ok)return NextResponse.json({error:"Could not create a secure playback session."},{status:502});
  const payload=await response.json();const signedToken=payload?.result?.token;
  if(!signedToken)return NextResponse.json({error:"Video provider did not return a playback token."},{status:502});
  return NextResponse.json({playbackUrl:`https://customer-${customer}.cloudflarestream.com/${signedToken}/iframe?preload=metadata`},{headers:{"Cache-Control":"private, no-store, max-age=0"}});
}
