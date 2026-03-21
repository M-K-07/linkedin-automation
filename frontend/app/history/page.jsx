"use client";
import React, { useEffect, useState } from "react";
import NavLayout from "../../components/Layouts/NavLayout";
import { useUser } from "@clerk/nextjs";
import { Clock, CalendarDays, Bot, Loader2, Copy, Maximize2, RefreshCw, Check, Send } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Helper to format timestamps
const formatDate = (dateString) => {
  if (!dateString) return "Unknown Date";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const History = () => {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [showPromptFor, setShowPromptFor] = useState(null);
  const [regenerationPrompt, setRegenerationPrompt] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      if (!isUserLoaded || !user) return;
      
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/history/${user.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch history data');
        }
        
        const data = await response.json();
        setHistoryItems(data);
      } catch (err) {
        console.error("Error fetching history:", err);
        setError("Could not load history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user, isUserLoaded]);

  const handleCopy = (content, id) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleRegenerate = async (id) => {
    if (!regenerationPrompt.trim()) return;
    
    setIsRegenerating(true);
    try {
      const response = await fetch(`http://localhost:8000/api/history/${id}/regenerate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: regenerationPrompt })
      });
      
      if (!response.ok) {
        throw new Error("Failed to regenerate post");
      }
      
      const data = await response.json();
      
      // Update the state locally to reflect the new regenerated content immediately
      setHistoryItems(prevItems => 
        prevItems.map(item => 
          item.id === id ? { ...item, content: data.content } : item
        )
      );
      
      setShowPromptFor(null);
      setRegenerationPrompt("");
      
    } catch (err) {
      console.error("Error regenerating:", err);
      alert("Failed to regenerate the post. Please try again.");
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <NavLayout>
      <div className="p-4 md:p-8 min-h-screen bg-slate-50/50 dark:bg-zinc-950/50">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Automation History</h1>
            <p className="text-muted-foreground mt-2">
              Review all AI-generated content and past actions executed by your agents.
            </p>
          </div>
          
          {/* Content Area */}
          {loading ? (
            <div className="bg-card rounded-xl border shadow-sm flex flex-col items-center justify-center p-12 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
              <p>Loading your history...</p>
            </div>
          ) : error ? (
            <div className="bg-card rounded-xl border shadow-sm flex flex-col items-center justify-center p-12 text-red-500">
              <p className="mb-2 font-medium">Something went wrong</p>
              <p className="text-sm">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer"
              >
                Retry
              </button>
            </div>
          ) : historyItems.length === 0 ? (
            <div className="bg-card rounded-xl border shadow-sm flex flex-col items-center justify-center p-16 text-center">
              <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-6">
                <Clock className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No history yet</h3>
              <p className="text-muted-foreground max-w-md">
                It looks like your agents haven't generated any content yet. Once they start running, your past posts will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {historyItems.map((item) => (
                <Card key={item.id} className="flex flex-col h-[280px] hover:shadow-md transition-shadow border-muted/60 overflow-hidden relative group bg-card">
                  <CardHeader className="pb-3 pt-4 px-4 flex flex-row items-center justify-between border-b border-muted/30 bg-muted/10 h-14 shrink-0">
                    <div className="flex items-center gap-2 text-primary font-medium text-xs">
                      <Bot className="h-4 w-4 shrink-0" />
                      <span className="capitalize line-clamp-1 text-sm">{item.agent_type || "News Agent"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-medium whitespace-nowrap">
                      <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                      <span>{formatDate(item.created_at)}</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1 p-5 overflow-hidden relative">
                    <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed break-words">
                      {item.content ? item.content : "No content found for this automation."}
                    </div>
                    {/* Fade out effect */}
                    <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-card to-transparent pointer-events-none" />
                  </CardContent>
                  
                  <CardFooter className="p-3 mt-auto border-t border-muted/50 bg-muted/5 shrink-0 flex items-center justify-between z-10">
                    <div className="flex flex-wrap gap-1.5 overflow-hidden max-h-6 flex-1 mr-2">
                      {item.areas_of_interest && item.areas_of_interest.length > 0 ? (
                        item.areas_of_interest.slice(0, 2).map((tag, idx) => (
                          <span key={idx} className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 text-[10px] px-2 py-0.5 rounded-full font-medium truncate max-w-[80px] sm:max-w-[100px]">
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-muted-foreground/60 font-medium bg-muted/20 px-2 py-0.5 rounded-full">General</span>
                      )}
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="default" size="sm" className="h-8 text-xs font-semibold px-4 shadow-sm cursor-pointer hover:bg-primary/90 transition-colors">
                          <Maximize2 className="h-3.5 w-3.5 mr-1.5" /> View Post
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden shadow-2xl border-muted">
                        <DialogHeader className="p-6 pb-4 border-b bg-muted/10 shrink-0">
                          <DialogTitle className="flex flex-col gap-3">
                            <div className="flex flex-wrap items-center justify-between w-full">
                              <div className="flex items-center gap-2 text-xl">
                                <Bot className="h-6 w-6 text-primary shrink-0" /> 
                                <span className="capitalize">{item.agent_type || "News Agent"} Post</span>
                              </div>
                              <div className="flex items-center gap-1.5 font-medium text-sm text-muted-foreground mr-6">
                                <CalendarDays className="h-4 w-4 shrink-0" />
                                {formatDate(item.created_at)}
                              </div>
                            </div>
                            
                            {/* Tags inside dialog */}
                            {item.areas_of_interest && item.areas_of_interest.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {item.areas_of_interest.map((tag, idx) => (
                                  <span key={idx} className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 text-xs px-2.5 py-1 rounded-full font-medium shadow-sm transition-colors hover:bg-green-200">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </DialogTitle>
                        </DialogHeader>
                        
                        {/* Scrollable text area with fixed max height constraint */}
                        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-zinc-950/50 flex flex-col gap-4">
                          <div className={`text-sm md:text-base text-foreground whitespace-pre-wrap leading-relaxed break-words break-all bg-card p-6 md:p-8 rounded-xl border shadow-sm transition-all duration-300 ${isRegenerating ? "opacity-50 blur-[2px]" : "opacity-100"}`}>
                            {item.content || "No content found."}
                          </div>
                          
                          {/* Regeneration Prompt Input */}
                          {showPromptFor === item.id && (
                            <div className="bg-accent/30 border border-border rounded-xl p-4 animate-in slide-in-from-bottom-2 fade-in mt-auto">
                              <div className="flex flex-col gap-3">
                                <label className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                                  <RefreshCw className="h-4 w-4 text-primary" /> How should I rewrite this?
                                </label>
                                <textarea 
                                  className="w-full text-sm rounded-md border border-input bg-background px-3 py-2 disabled:opacity-50 min-h-[80px] max-h-[150px] resize-y placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                  placeholder="e.g., 'Make it more enthusiastic', 'Shorten it to 3 sentences', 'Translate to Spanish'"
                                  value={regenerationPrompt}
                                  onChange={(e) => setRegenerationPrompt(e.target.value)}
                                  disabled={isRegenerating}
                                  autoFocus
                                />
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="cursor-pointer"
                                    onClick={() => setShowPromptFor(null)}
                                    disabled={isRegenerating}
                                  >
                                    Cancel
                                  </Button>
                                  <Button 
                                    size="sm"
                                    className="cursor-pointer flex items-center gap-1.5"
                                    onClick={() => handleRegenerate(item.id)}
                                    disabled={isRegenerating || !regenerationPrompt.trim()}
                                  >
                                    {isRegenerating ? (
                                      <><Loader2 className="h-4 w-4 animate-spin" /> Rewriting...</>
                                    ) : (
                                      <><Send className="h-3.5 w-3.5" /> Submit Rewrite</>
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="p-4 border-t bg-muted/10 flex justify-between items-center shrink-0">
                          {showPromptFor !== item.id ? (
                            <Button 
                              variant="outline" 
                              className="bg-background shadow-sm hover:bg-muted font-medium text-sm cursor-pointer"
                              onClick={() => setShowPromptFor(item.id)}
                              disabled={isRegenerating}
                            >
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Rewrite / Adjust
                            </Button>
                          ) : (
                            <div /> /* Empty div keeps spacing right when prompt is open */
                          )}
                          <Button 
                            onClick={() => handleCopy(item.content, item.id)} 
                            className={`flex items-center gap-2 font-medium shadow-sm cursor-pointer transition-colors ${copiedId === item.id ? 'bg-black hover:bg-black/80 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200' : ''}`}
                            variant={copiedId === item.id ? "secondary" : "default"}
                          >
                            {copiedId === item.id ? "Copied!" : "Copy to Clipboard"} 
                            {copiedId === item.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </NavLayout>
  );
};

export default History;
