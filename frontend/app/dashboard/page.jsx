"use client";
import { useUser } from "@clerk/nextjs";
import NavLayout from "../../components/Layouts/NavLayout";
import InitialDialogBox from "../../components/AppComponents/InitialDialogBox";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  Newspaper, 
  PlayCircle,
  Users,
  Zap,
  Sparkles
} from "lucide-react";

// Mock data for demonstration
const MOCK_STATS = [
  { title: "Total Posts Generated", value: "24", icon: Newspaper, change: "+12% from last week", trend: "up" },
  { title: "Active Agents", value: "3", icon: Activity, change: "1 running right now", trend: "neutral" },
  { title: "Pending Approvals", value: "5", icon: Clock, change: "Requires your review", trend: "warning" },
  { title: "Success Rate", value: "98%", icon: CheckCircle2, change: "Over the last 30 days", trend: "up" },
];

const MOCK_RECENT_ACTIVITY = [
  { id: 1, agent: "News Agent", action: "Generated 3 new posts about AI", time: "2 hours ago", status: "success" },
  { id: 2, agent: "Engagement Agent", action: "Commented on 15 posts", time: "5 hours ago", status: "success" },
  { id: 3, agent: "Outreach Agent", action: "Sent 10 connection requests", time: "1 day ago", status: "success" },
  { id: 4, agent: "News Agent", action: "Failed to fetch from source", time: "2 days ago", status: "error" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const Page = () => {
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <NavLayout>
      <div className="p-4 md:p-8 min-h-screen bg-transparent relative">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-[20%] w-[500px] h-[400px] bg-primary/10 blur-[100px] rounded-full pointer-events-none -z-10" />
        
        <motion.div 
          className="max-w-7xl mx-auto space-y-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          
          {/* Header Section */}
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/40 pb-8">
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-[11px] font-bold text-primary uppercase tracking-wider mb-4">
                <Sparkles className="h-3 w-3" />
                <span>Dashboard Overview</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
                Hello, {user?.firstName || "there"} 👋
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Your autonomous agents are hard at work. Here's your summary.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button asChild size="lg" className="shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform cursor-pointer font-bold px-8">
                <Link href="/agents/news-agent">
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Run News Agent
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Stats Overview */}
          <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_STATS.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="border-border/60 bg-card/60 backdrop-blur-xl shadow-sm transition-all hover:shadow-md hover:border-border overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
                    <CardHeader className="flex flex-row items-center justify-between pb-2 z-10 relative">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </CardTitle>
                      <div className={`p-2 rounded-lg ${stat.trend === 'up' ? 'bg-green-500/10 text-green-500' : stat.trend === 'warning' ? 'bg-amber-500/10 text-amber-500' : 'bg-primary/10 text-primary'}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                    </CardHeader>
                    <CardContent className="z-10 relative">
                      <div className="text-3xl font-extrabold tracking-tight text-foreground">{stat.value}</div>
                      <p className="text-xs text-muted-foreground mt-2 font-medium">
                        {stat.change}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
              {/* Recent Activity */}
              <Card className="border-border/60 bg-card/60 backdrop-blur-xl shadow-sm">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <Activity className="h-5 w-5" />
                    </div>
                    Recent Activity Log
                  </CardTitle>
                  <CardDescription className="text-base mt-1">
                    Your latest agent executions and their status.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {MOCK_RECENT_ACTIVITY.map((activity, idx) => (
                      <div key={activity.id} className={`flex items-start gap-4 pb-6 ${idx !== MOCK_RECENT_ACTIVITY.length - 1 ? 'border-b border-border/40' : ''}`}>
                        <div className={`mt-0.5 rounded-full p-2 ${activity.status === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                          {activity.status === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <Activity className="h-4 w-4" />}
                        </div>
                        <div className="flex-1 space-y-1.5">
                          <p className="text-base font-semibold text-foreground leading-none">
                            {activity.agent} 
                          </p>
                          <p className="text-muted-foreground text-sm flex items-center gap-2">
                             <span>{activity.action}</span>
                             <span className="text-border">•</span>
                             <span className="text-xs uppercase tracking-wider font-mono">{activity.time}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right Column - Sidebar */}
            <motion.div variants={itemVariants} className="space-y-8">
              
              <Card className="border-border/60 bg-linear-to-b from-card/60 to-card/20 backdrop-blur-xl shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Zap className="h-5 w-5 text-amber-500 fill-amber-500/20" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3">
                  <Button variant="outline" className="justify-start h-auto py-3.5 bg-background/50 hover:bg-muted border-border/50 group" asChild>
                    <Link href="/agents/news-agent">
                      <div className="p-2 rounded-md bg-blue-500/10 mr-3 group-hover:scale-110 transition-transform">
                        <Newspaper className="h-4 w-4 text-blue-500" />
                      </div>
                      <div className="flex flex-col items-start gap-0.5">
                        <span className="font-semibold text-sm text-foreground">Create News Post</span>
                        <span className="text-xs text-muted-foreground">Run news research agent</span>
                      </div>
                      <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto py-3.5 bg-background/50 hover:bg-muted border-border/50 group" asChild>
                    <Link href="#">
                      <div className="p-2 rounded-md bg-green-500/10 mr-3 group-hover:scale-110 transition-transform">
                        <MessageSquare className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="flex flex-col items-start gap-0.5">
                        <span className="font-semibold text-sm text-foreground">Engage Network</span>
                        <span className="text-xs text-muted-foreground">Auto-comment on feed</span>
                      </div>
                      <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto py-3.5 bg-background/50 hover:bg-muted border-border/50 group" asChild>
                    <Link href="/history">
                      <div className="p-2 rounded-md bg-purple-500/10 mr-3 group-hover:scale-110 transition-transform">
                        <Clock className="h-4 w-4 text-purple-500" />
                      </div>
                      <div className="flex flex-col items-start gap-0.5">
                        <span className="font-semibold text-sm text-foreground">View Full History</span>
                        <span className="text-xs text-muted-foreground">Review drafted posts</span>
                      </div>
                      <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Agent Status */}
              <Card className="border-border/60 bg-card/60 backdrop-blur-xl shadow-sm">
                <CardHeader>
                   <CardTitle className="text-xl flex items-center gap-2">
                    <Users className="h-5 w-5 text-indigo-500" />
                    Agent Fleet Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 mt-2">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-muted/20">
                    <div className="flex items-center space-x-3">
                      <span className="flex h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                      <span className="text-sm font-semibold text-foreground">News Agent</span>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded bg-green-500/10 text-green-500 uppercase tracking-widest">Ready</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-primary/30 bg-primary/5">
                    <div className="flex items-center space-x-3">
                      <span className="flex h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
                      <span className="text-sm font-semibold text-primary">Engagement Agent</span>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 rounded bg-blue-500/10 text-blue-500 uppercase tracking-widest animate-pulse">Running</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-muted/20 opacity-60">
                    <div className="flex items-center space-x-3">
                      <span className="flex h-2.5 w-2.5 rounded-full bg-slate-500"></span>
                      <span className="text-sm font-semibold text-muted-foreground">Outreach Agent</span>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded bg-slate-500/10 text-slate-500 uppercase tracking-widest">Offline</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          <InitialDialogBox />
        </motion.div>
      </div>
    </NavLayout>
  );
};

export default Page;
