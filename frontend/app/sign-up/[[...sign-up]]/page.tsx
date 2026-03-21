"use client";
import { SignUp } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';
import { Sparkles, Command } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const SignUpPage = () => {
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-xs font-medium mb-6 text-primary shadow-sm">
              <Sparkles className="h-3 w-3" />
              <span>Join the waitlist today</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-6 leading-tight">Start automating your LinkedIn presence instantly.</h1>
            <p className="text-zinc-400 text-lg leading-relaxed">
              Create an account to deploy your first set of AI agents and never manually write a post again.
            </p>
         </div>
      </div>

      {/* Right Auth Panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-slate-50 dark:bg-background relative">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[14px_24px] pointer-events-none"></div>
         <div className="w-full max-w-md relative z-10 flex flex-col items-center">
            {mounted && (
              <SignUp 
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

export default SignUpPage;