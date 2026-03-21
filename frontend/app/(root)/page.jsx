"use client";
import React, { useEffect } from "react";
import { Button } from "../../components/ui/button";
import Navbar from "../../components/AppComponents/RootNavbar";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { ArrowRight, Bot, Zap, Shield, Sparkles, CheckCircle2, Workflow, Clock, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function LandingPage() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleRoute = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/sign-up");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden selection:bg-primary/20 selection:text-primary">
      {/* Dynamic Background Glow */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10" />
      
      <Navbar />
      
      <main className="flex-1 flex flex-col pt-16">
        
        {/* --- HERO SECTION --- */}
        <section className="px-6 py-24 md:py-32 flex flex-col items-center text-center max-w-5xl mx-auto z-10 relative">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col items-center">
            
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50 text-sm font-medium mb-8 text-muted-foreground shadow-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>The future of AI content generation</span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-foreground leading-[1.1]">
              Automate your LinkedIn Growth with <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-primary/60">Autonomous Agents</span>
            </motion.h1>
            
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed font-medium">
              Deploy intelligent researchers and specialized writers to curate, draft, and publish highly engaging LinkedIn content while you sleep.
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-4">
              <Button 
                size="lg" 
                className="px-8 h-12 text-base font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform cursor-pointer"
                onClick={handleRoute}
              >
                Start Automating <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="px-8 h-12 text-base font-medium shadow-sm cursor-pointer hover:bg-muted"
                onClick={() => router.push('#features')}
              >
                View Features
              </Button>
            </motion.div>

          </motion.div>
          
          {/* Dashboard Preview Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 60 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-20 w-full max-w-5xl rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-2xl overflow-hidden"
          >
             <div className="h-8 border-b border-border/50 bg-muted/30 flex items-center px-4 gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
                <div className="h-3 w-3 rounded-full bg-green-500/80"></div>
             </div>
             <div className="aspect-video w-full bg-zinc-950 flex flex-col relative overflow-hidden">
                {/* Floating Elements */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <div className="flex items-center gap-4 mb-8">
                      <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }} className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                         <Bot className="h-8 w-8 text-primary" />
                      </motion.div>
                      <div className="h-1 w-16 bg-primary rounded-full relative overflow-hidden">
                         <motion.div initial={{ x: "-100%" }} animate={{ x: "100%" }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="absolute inset-0 bg-white/50 blur-[2px]" />
                      </div>
                      <div className="h-16 w-16 rounded-2xl bg-zinc-800 flex items-center justify-center border border-zinc-700 shadow-lg z-10">
                         <Zap className="h-8 w-8 text-zinc-300" />
                      </div>
                    </div>
                    <p className="text-zinc-500 font-mono text-sm tracking-widest uppercase">Agent Crew Executing Action...</p>
                </div>
             </div>
          </motion.div>
        </section>

        {/* --- FEATURES SECTION --- */}
        <section id="features" className="px-6 py-24 max-w-7xl mx-auto w-full">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="text-center mb-16 md:mb-24">
             <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Built for Professional Growth</motion.h2>
             <motion.p variants={fadeUp} className="text-muted-foreground text-lg max-w-2xl mx-auto">Everything you need to automate your social presence without losing your authentic voice.</motion.p>
          </motion.div>
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid md:grid-cols-3 gap-8 md:gap-12 text-left">
            <motion.div variants={fadeUp} className="p-8 rounded-3xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary border border-primary/20">
                <Bot className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">CrewAI Integration</h3>
              <p className="text-muted-foreground leading-relaxed">Deploy sophisticated multi-agent crews. Roles organically collaborate to research trending topics and draft engaging posts exactly to your specifications.</p>
            </motion.div>
            
            <motion.div variants={fadeUp} className="p-8 rounded-3xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary border border-primary/20">
                <Zap className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Background Automation</h3>
              <p className="text-muted-foreground leading-relaxed">Fully cron-enabled background task execution using APScheduler means your agents work tirelessly even when your browser is closed.</p>
            </motion.div>
            
            <motion.div variants={fadeUp} className="p-8 rounded-3xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary border border-primary/20">
                <Shield className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Fact-Checked Output</h3>
              <p className="text-muted-foreground leading-relaxed">Eliminate hallucinations. Our agents strictly limit content exclusively to live internet sources and guarantee factual citations in every drafted post.</p>
            </motion.div>
          </motion.div>
        </section>

        {/* --- HOW IT WORKS --- */}
        <section id="how-it-works" className="px-6 py-24 border-y border-border/50 bg-muted/10">
          <div className="max-w-7xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="text-center mb-20">
              <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold tracking-tight mb-4">How AutoSync Works</motion.h2>
              <motion.p variants={fadeUp} className="text-muted-foreground text-lg max-w-2xl mx-auto">From setup to publishing in three simple steps.</motion.p>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid md:grid-cols-3 gap-12 relative">
              {/* Connector Line */}
              <div className="hidden md:block absolute top-[45px] left-[15%] right-[15%] h-0.5 bg-border/80 border-t border-dashed border-muted-foreground/30 -z-10"></div>
              
              <motion.div variants={fadeUp} className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-background border-4 border-border flex items-center justify-center mb-6 relative">
                   <div className="absolute -inset-1 bg-primary/10 rounded-full blur-sm" />
                   <LayoutDashboard className="h-8 w-8 text-primary relative z-10" />
                   <div className="absolute -bottom-3 -right-3 h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center shadow-md">1</div>
                </div>
                <h3 className="text-xl font-bold mb-3">Define Your Agent</h3>
                <p className="text-muted-foreground">Select your areas of interest (AI, SaaS, Marketing) and pick trusted data sources like Google News or Reddit.</p>
              </motion.div>
              
              <motion.div variants={fadeUp} className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-background border-4 border-border flex items-center justify-center mb-6 relative">
                   <div className="absolute -inset-1 bg-primary/10 rounded-full blur-sm" />
                   <Workflow className="h-8 w-8 text-primary relative z-10" />
                   <div className="absolute -bottom-3 -right-3 h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center shadow-md">2</div>
                </div>
                <h3 className="text-xl font-bold mb-3">Crew Takes Over</h3>
                <p className="text-muted-foreground">Our multi-agent Crew AI scans the internet, selects the best articles, and drafts a compelling LinkedIn post in your brand voice.</p>
              </motion.div>
              
              <motion.div variants={fadeUp} className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-background border-4 border-border flex items-center justify-center mb-6 relative">
                   <div className="absolute -inset-1 bg-primary/10 rounded-full blur-sm" />
                   <Clock className="h-8 w-8 text-primary relative z-10" />
                   <div className="absolute -bottom-3 -right-3 h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center shadow-md">3</div>
                </div>
                <h3 className="text-xl font-bold mb-3">Review and Publish</h3>
                <p className="text-muted-foreground">Check the generated dashboard history, quickly update it if needed, and effortlessly copy to LinkedIn to hit publish!</p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* --- PRICING --- */}
        <section id="pricing" className="px-6 py-24 max-w-7xl mx-auto w-full">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="text-center mb-16 md:mb-24">
             <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Simple, Transparent Pricing</motion.h2>
             <motion.p variants={fadeUp} className="text-muted-foreground text-lg max-w-2xl mx-auto">Scale your automated LinkedIn presence without breaking the bank.</motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
             
             {/* Starter */}
             <motion.div variants={fadeUp} className="p-8 rounded-3xl bg-card border border-border flex flex-col relative overflow-hidden">
                <h3 className="text-xl font-semibold text-muted-foreground mb-4">Starter</h3>
                <div className="mb-6">
                  <span className="text-5xl font-extrabold">$0</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-muted-foreground" /> <span>5 AI posts per month</span></li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-muted-foreground" /> <span>1 Agent Configuration</span></li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-muted-foreground" /> <span>Google News Source</span></li>
                </ul>
                <Button variant="outline" className="w-full" onClick={() => router.push('/sign-up')}>Get Started</Button>
             </motion.div>

             {/* Pro */}
             <motion.div variants={fadeUp} className="p-8 rounded-3xl bg-card border-2 border-primary shadow-xl shadow-primary/10 flex flex-col relative overflow-hidden transform md:-translate-y-4">
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Most Popular</div>
                <h3 className="text-xl font-semibold text-primary mb-4">Pro</h3>
                <div className="mb-6">
                  <span className="text-5xl font-extrabold">$29</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> <span className="font-medium">Unlimited AI Posts</span></li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> <span className="font-medium">5 Agent Configurations</span></li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> <span className="font-medium">All Data Sources</span></li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> <span className="font-medium">One-Click Rewrites</span></li>
                </ul>
                <Button className="w-full font-bold shadow-md shadow-primary/20" onClick={() => router.push('/sign-up')}>Upgrade to Pro</Button>
             </motion.div>

             {/* Teams */}
             <motion.div variants={fadeUp} className="p-8 rounded-3xl bg-card border border-border flex flex-col relative overflow-hidden">
                <h3 className="text-xl font-semibold text-muted-foreground mb-4">Teams</h3>
                <div className="mb-6">
                  <span className="text-5xl font-extrabold">$99</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-muted-foreground" /> <span>Everything in Pro</span></li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-muted-foreground" /> <span>Unlimited Agents</span></li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-muted-foreground" /> <span>Custom API Data Sources</span></li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-muted-foreground" /> <span>White-labeling</span></li>
                </ul>
                <Button variant="outline" className="w-full" onClick={() => router.push('#contact')}>Contact Sales</Button>
             </motion.div>

          </motion.div>
        </section>

        {/* --- CTA SECTION --- */}
        <section className="px-6 py-24 relative overflow-hidden mt-12">
          <div className="absolute inset-0 bg-primary/5 border-t border-b border-primary/20" />
          <div className="absolute left-[30%] top-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="relative z-10 max-w-4xl mx-auto text-center">
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Ready to hypercharge your authentic growth?</motion.h2>
            <motion.p variants={fadeUp} className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join thousands of professionals relying on AutoSync to passively dominate their LinkedIn feed.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Button size="lg" className="px-10 h-14 text-lg font-bold shadow-xl shadow-primary/20 hover:scale-[1.03] transition-transform cursor-pointer" onClick={handleRoute}>
                Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
        </section>

      </main>
      
      {/* Footer */}
      <footer className="py-12 border-t border-border/40 bg-zinc-950 text-center">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="flex items-center gap-2 text-white">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="font-bold tracking-tight text-lg">AutoSync AI</span>
             </div>
             <p className="text-sm text-zinc-400">Copyright 2026 AutoSync AI. Built for the modern professional.</p>
             <div className="flex gap-6 text-sm font-medium text-zinc-400">
               <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
               <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
             </div>
         </div>
      </footer>
    </div>
  );
}
