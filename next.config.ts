import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (supabaseUrl) {
  try {
    const host = new URL(supabaseUrl).hostname;
    nextConfig.images = { ...nextConfig.images, remotePatterns: [{ protocol: "https", hostname: host }] };
  } catch {}
}

export default nextConfig;
