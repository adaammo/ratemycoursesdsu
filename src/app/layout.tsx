import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getSession } from "../lib/supabase/auth";
import { ProfileModel } from "../lib/types";
import { CallProfileGetService } from "../lib/fastapiClient";
import AuthButtons from "../ui/Nav/AuthButtons";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rate My Class",
  description: "Class rating's in SDSU",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await getSession();
  let user : ProfileModel | null = null
  if(session.ok && session.token){
    const response = await CallProfileGetService(session.token)
    if(response.ok){
      user = response.profile;
    }
  }
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-screen w-screen antialiased bg-(--bg-primary) text-(--text-primary) max-w-screen px-20.5`}
    >
      <body className="min-h-full flex flex-col">
        <AuthButtons user = {user}/>
        {children}
      </body>
    </html>
  );
}
