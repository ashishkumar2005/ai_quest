import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "AI Quest — Class 10 AI learning", template: "%s | AI Quest" },
  description: "Learn AI. Build Skills. Explore the Future. A guided Class 10 Artificial Intelligence learning platform.",
  applicationName: "AI Quest",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "AI Quest — Learn AI. Build Skills. Explore the Future.",
    description: "A student-friendly AI learning journey for CBSE Class 10.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
