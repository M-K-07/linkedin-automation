"use client";
import React, { useEffect, useState } from "react";
import NavLayout from "../../../components/Layouts/NavLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import { Loader, PlayCircle, Terminal, CheckCircle2, CircleDashed } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PROGRESS_STEPS = [
  { id: 1, label: "Initializing CrewAI Agents", desc: "Setting up sophisticated logic bounds..." },
  { id: 2, label: "Scanning Data Sources", desc: "Crawling Google News & Reddit for latest updates..." },
  { id: 3, label: "Synthesizing Content", desc: "Extracting key insights and filtering out noise..." },
  { id: 4, label: "Drafting LinkedIn Post", desc: "Writing engaging copy with final citations..." },
];

export default function NewsAgentPage() {
  const { user, isLoaded } = useUser();
  const [days, setDays] = useState([]);
  const [hour, setHour] = useState("09");
  const [minute, setMinute] = useState("00");
  const [period, setPeriod] = useState("AM");
  const [userEmail, setUserEmail] = useState("");
  const [areaOfInterest, setAreaOfInterest] = useState("");
  const [interestedSources, setInterestedSources] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [scheduleExists, setScheduleExists] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Execution state
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [generatedContent, setGeneratedContent] = useState("");

  const baseURL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!isLoaded || !user) return;
    setUserEmail(user.emailAddresses[0].emailAddress);
  }, [user, isLoaded]);

  useEffect(() => {
    const fetchExistingSettings = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const response = await fetch(`${baseURL}/api/agents/news-agent/schedule/${user.id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          const data = await response.json();
          setUserEmail(data.email);
          setAreaOfInterest(data.areas_of_interest.join(", "));
          setInterestedSources(data.interested_sources);
          setDays(data.days);
          setHour(data.hour.toString().padStart(2, "0"));
          setMinute(data.minute.toString().padStart(2, "0"));
          setPeriod(data.period);
          setScheduleExists(true);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchExistingSettings();
  }, [user]);

  // Simulate progress when API runs since CrewAI takes ~30 seconds
  useEffect(() => {
    if (isRunning && currentStep < PROGRESS_STEPS.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 7500); 
      return () => clearTimeout(timer);
    }
  }, [isRunning, currentStep]);

  const handleSourceChange = (checked, source) => {
    setInterestedSources((prev) => {
      if (checked) return [...prev, source];
      return prev.filter((s) => s !== source);
    });
  };

  const handleStartScheduling = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const response = await fetch(`${baseURL}/api/agents/news-agent/schedule`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clerk_id: user.id,
        email: userEmail,
        areas_of_interest: areaOfInterest.split(",").map(item => item.trim()).filter(Boolean),
        interested_sources: interestedSources,
        days: days,
        hour: parseInt(hour),
        minute: parseInt(minute),
        period: period,
      }),
    });
    if (response.ok) setScheduleExists(true);
    setLoading(false);
  };

  const handleUpdateDetails = async(e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const payload = {
      email: userEmail,
      areas_of_interest: areaOfInterest.split(",").map(item => item.trim()).filter(Boolean),
      interested_sources: interestedSources,
      days: days,
      hour: parseInt(hour),
      minute: parseInt(minute),
      period: period,
    };
    const response = await fetch(`${baseURL}/api/agents/news-agent/schedule/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (response.ok) { 
      setIsEditing(false);
    }
    setLoading(false);
  };

  const handleRunAgentNow = async (e) => {
    e.preventDefault();
    setIsRunning(true);
    setCurrentStep(0);
    setGeneratedContent("");

    try {
      const res = await fetch(`${baseURL}/api/agents/news-agent/schedule/run/${user.id}`, {
        method: 'POST'
      });
      const data = await res.json();
      
      if (res.ok) {
         setCurrentStep(PROGRESS_STEPS.length); // Instant visual completion of all steps
         setGeneratedContent(data.content);
      } else {
         console.error(data.detail);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <NavLayout>
      <div className="p-6 md:p-10 max-w-6xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">News Agent</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Automate content creation. Configure your preferences, and let our AI deliver engaging news posts.
            </p>
          </div>
          {scheduleExists && !isEditing && !isRunning && (
            <Button size="lg" onClick={handleRunAgentNow} className="shadow-lg shadow-primary/20 bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 cursor-pointer animate-pulse transition-all hover:scale-105">
              <PlayCircle className="mr-2 h-5 w-5 fill-primary text-background" />
              ▶ Run Agent Now
            </Button>
          )}
        </header>

        <div className={`grid gap-12 transition-all duration-700 ${isRunning || generatedContent ? 'lg:grid-cols-2' : 'max-w-3xl mx-auto'}`}>
          
          <AnimatePresence mode="popLayout">
            {!isRunning ? (
              <motion.div 
                key="config-form"
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                className="lg:col-span-1"
              >
                <Card className="border-border/50 shadow-sm">
                  <CardHeader>
                    <CardTitle>Agent Configuration</CardTitle>
                    <CardDescription>Configure topics, sources, and automation timing.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-8">
                      {/* Configuration Form Body (Same as before) */}
                      <div className="grid gap-3">
                        <Label htmlFor="email" className="font-semibold">Delivery Email</Label>
                        <Input id="email" type="email" placeholder="Enter your preferred email" defaultValue={userEmail} disabled={!isEditing && scheduleExists} onChange={(e) => setUserEmail(e.target.value)} />
                      </div>

                      <div className="grid gap-3">
                        <Label htmlFor="interests" className="font-semibold">Areas of Interest</Label>
                        <Input disabled={!isEditing && scheduleExists} id="interests" placeholder="e.g., AI, Blockchain, Marketing" value={areaOfInterest} onChange={(e) => setAreaOfInterest(e.target.value)} />
                        <p className="text-xs text-muted-foreground">Separate topics with a comma.</p>
                      </div>

                      <div className="grid gap-3">
                        <Label className="font-semibold">Data Sources</Label>
                        <div className="flex flex-wrap items-center gap-6 p-4 border border-border/50 rounded-lg bg-muted/20">
                          <div className="flex items-center space-x-2">
                            <Checkbox disabled={!isEditing && scheduleExists} id="source-reddit" checked={interestedSources.includes("reddit")} onCheckedChange={(checked) => handleSourceChange(checked, "reddit")} />
                            <Label htmlFor="source-reddit" className="cursor-pointer">Reddit Forums</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox disabled={!isEditing && scheduleExists} id="source-google" checked={interestedSources.includes("google-news")} onCheckedChange={(checked) => handleSourceChange(checked, "google-news")} />
                            <Label htmlFor="source-google" className="cursor-pointer">Google News API</Label>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-3">
                        <Label className="font-semibold">Schedule Automation</Label>
                        <ToggleGroup type="multiple" value={days} onValueChange={setDays} variant="outline" disabled={!isEditing && scheduleExists} className="justify-start">
                          <ToggleGroupItem value="sun" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">Sun</ToggleGroupItem>
                          <ToggleGroupItem value="mon" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">Mon</ToggleGroupItem>
                          <ToggleGroupItem value="tue" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">Tue</ToggleGroupItem>
                          <ToggleGroupItem value="wed" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">Wed</ToggleGroupItem>
                          <ToggleGroupItem value="thu" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">Thu</ToggleGroupItem>
                          <ToggleGroupItem value="fri" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">Fri</ToggleGroupItem>
                          <ToggleGroupItem value="sat" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">Sat</ToggleGroupItem>
                        </ToggleGroup>
                        <div className="flex items-center gap-2 mt-2">
                          <Select value={hour} onValueChange={setHour} disabled={!isEditing && scheduleExists}>
                            <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                            <SelectContent>{Array.from({ length: 12 }, (_, i) => (<SelectItem key={i} value={(i + 1).toString().padStart(2, "0")}>{(i + 1).toString().padStart(2, "0")}</SelectItem>))}</SelectContent>
                          </Select>
                          <Select value={minute} onValueChange={setMinute} disabled={!isEditing && scheduleExists}>
                            <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                            <SelectContent>{Array.from({ length: 60 }, (_, i) => (<SelectItem key={i} value={i.toString().padStart(2, "0")}>{i.toString().padStart(2, "0")}</SelectItem>))}</SelectContent>
                          </Select>
                          <Select value={period} onValueChange={setPeriod} disabled={!isEditing && scheduleExists}>
                            <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="AM">AM</SelectItem><SelectItem value="PM">PM</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex gap-4 pt-6 border-t border-border/50">
                        {!scheduleExists ? (
                          <Button onClick={handleStartScheduling} disabled={loading} className="w-full cursor-pointer">{loading ? <><Loader className="animate-spin mr-2" /> Saving...</> : "Publish Configuration"}</Button>
                        ) : isEditing ? (
                          <>
                            <Button onClick={handleUpdateDetails} disabled={loading} className="w-full cursor-pointer">{loading ? <><Loader className="animate-spin mr-2" /> Updating...</> : "Save Changes"}</Button>
                            <Button variant="outline" onClick={() => setIsEditing(false)} disabled={loading} className="w-full cursor-pointer">Cancel</Button>
                          </>
                        ) : (
                          <Button variant="outline" onClick={(e) => { e.preventDefault(); setIsEditing(true); }} className="w-full cursor-pointer bg-muted/30">Modify Settings</Button>
                        )}
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              // EXECUTING PROGRESS UI
              <motion.div 
                key="execution-progress"
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="lg:col-span-1"
              >
                <Card className="border-border/60 shadow-2xl bg-linear-to-br from-card to-muted/20 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-32 bg-primary/10 rounded-full blur-[80px]" />
                   <CardHeader className="pb-8">
                     <CardTitle className="text-2xl flex items-center gap-3">
                       <Terminal className="h-6 w-6 text-primary" />
                       Live Processing Pipeline
                     </CardTitle>
                     <CardDescription>Your multi-agent Crew is currently executing tasks dynamically across the internet.</CardDescription>
                   </CardHeader>
                   <CardContent className="space-y-8">
                      {PROGRESS_STEPS.map((step, idx) => {
                         const isActive = currentStep === idx;
                         const isPast = currentStep > idx;
                         return (
                           <div key={step.id} className="flex relative">
                             {/* Line Connector */}
                             {idx !== PROGRESS_STEPS.length - 1 && (
                               <div className={`absolute left-4 top-10 bottom-[-32px] w-[2px] ${isPast ? 'bg-primary' : 'bg-border'} transition-colors duration-1000`} />
                             )}
                             
                             <div className="relative z-10 mr-4 mt-1 bg-background">
                                {isPast ? (
                                   <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary text-primary">
                                     <CheckCircle2 className="h-5 w-5" />
                                   </div>
                                ) : isActive ? (
                                   <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500 text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                                     <Loader className="h-4 w-4 animate-spin" />
                                   </div>
                                ) : (
                                   <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border border-border text-muted-foreground">
                                     <CircleDashed className="h-4 w-4" />
                                   </div>
                                )}
                             </div>

                             <div className={`flex flex-col pb-2 transition-all duration-500 ${isActive ? 'opacity-100 transform translate-x-1' : isPast ? 'opacity-70' : 'opacity-40'}`}>
                               <span className={`text-base font-bold ${isActive ? 'text-blue-500' : isPast ? 'text-primary' : 'text-muted-foreground'}`}>{step.label}</span>
                               <span className="text-sm text-muted-foreground mt-1 leading-relaxed">{step.desc}</span>
                             </div>
                           </div>
                         )
                      })}

                      <div className="pt-6 flex justify-center mt-4">
                        <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold flex items-center gap-2">
                           <Loader className="h-3 w-3 animate-spin" /> Do not close window
                        </span>
                      </div>
                   </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* GENERATED CONTENT CARD */}
          <AnimatePresence>
          {(isRunning || generatedContent) && (
            <motion.div layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1 h-full">
              <Card className={`h-full border-border/50 shadow-sm transition-colors duration-500 ${generatedContent ? 'bg-primary/5 border-primary/20' : ''}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                   {generatedContent && <Sparkles className="h-5 w-5 text-primary" />}
                   Generated Result
                </CardTitle>
              </CardHeader>
              <CardContent>
                {generatedContent ? (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="prose prose-sm dark:prose-invert max-w-none">
                     <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground bg-background/50 p-6 rounded-xl border border-border/50 shadow-inner">
                        {typeof generatedContent === 'string' ? generatedContent : JSON.stringify(generatedContent, null, 2)}
                     </div>
                   </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-20 px-4 h-full">
                    <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-6 border border-border/50">
                      <Terminal className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <p className="text-lg font-medium text-foreground mb-1">Waiting for execution</p>
                    <p className="text-sm">
                      Your highly targeted content will be delivered instantly after the agent finishes its rigorous processing pipeline.
                    </p>
                  </div>
                )}
              </CardContent>
              </Card>
            </motion.div>
          )}
          </AnimatePresence>

        </div>
      </div>
    </NavLayout>
  );
}
