"use client";
import { SignIn } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';
import { Sparkles, Command } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const SignInPage = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div className='min-h-screen bg-background flex flex-col md:flex-row relative'>
      
      {/* Left Marketing Panel - hidden on mobile */}
      <div className="hidden md:flex flex-1 bg-zinc-950 flex-col justify-between relative overflow-hidden p-12">
         {/* Background Decor */}
         <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
         
         <div className="relative z-10">
            <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80 w-max">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-lg shadow-sm">
                <Command className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">AutoSync</span>
            </Link>
         </div>

         <div className="relative z-10 max-w-md">
            <h1 className="text-4xl font-bold text-white mb-6 leading-tight">Welcome back to your Automated specific network.</h1>
            <p className="text-zinc-400 text-lg leading-relaxed mb-6">
              "Since using AutoSync, our team's outbound social interaction grew by over 400% without us writing a single post manually."
            </p>
            <div className="flex items-center gap-3">
               <div className="h-10 w-10 bg-zinc-800 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-300 font-bold">AJ</div>
               <div>
                 <p className="text-white font-medium text-sm">Alex Johnson</p>
                 <p className="text-zinc-500 text-xs">Director of Growth, TechCorp</p>
               </div>
            </div>
         </div>
      </div>

      {/* Right Auth Panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-slate-50 dark:bg-background relative">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[14px_24px] pointer-events-none"></div>
         <div className="w-full max-w-md relative z-10 flex flex-col items-center">
            {mounted && (
              <SignIn 
                afterSignInUrl="/dashboard" 
                appearance={{ 
                  baseTheme: theme === 'dark' ? dark : undefined,
                  elements: {
                    rootBox: "w-full shadow-2xl rounded-xl",
                    card: "w-full border border-border/50 bg-background/60 backdrop-blur-xl shadow-xl",
                    headerTitle: "text-foreground",
                    headerSubtitle: "text-muted-foreground",
                    socialButtonsBlockButton: "border-border hover:bg-muted text-foreground",
                    dividerLine: "bg-border",
                    dividerText: "text-muted-foreground",
                    formFieldLabel: "text-foreground",
                    formFieldInput: "bg-background border-border text-foreground focus:ring-primary",
                    formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
                    footerActionText: "text-muted-foreground",
                    footerActionLink: "text-primary hover:text-primary/80"
                  }
                }} 
              />
            )}
         </div>
      </div>

    </div>
  );
};

export default SignInPage;