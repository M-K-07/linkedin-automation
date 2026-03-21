"use client";
import React from "react";
import { UserButton } from "@clerk/nextjs";
import { Command, Bell, Search, TrendingUp } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "../ThemeToggle";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50 supports-backdrop-filter:bg-background/60">
      <div className="flex h-16 items-center px-4 md:px-6 justify-between max-w-[2000px] mx-auto">
        
        {/* Logo Section */}
        <Link href="/dashboard" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg shadow-sm">
            <Command className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight hidden sm:inline-block">AutoSync</span>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          <div className="hidden md:flex items-center gap-2 mr-1">
            <ThemeToggle />
            <button className="text-muted-foreground hover:text-foreground transition-colors h-9 w-9 flex items-center justify-center rounded-full hover:bg-muted cursor-pointer">
              <Search className="h-4 w-4" />
            </button>
            <button className="text-muted-foreground hover:text-foreground transition-colors h-9 w-9 flex items-center justify-center rounded-full hover:bg-muted cursor-pointer relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-2 right-2.5 h-1.5 w-1.5 rounded-full bg-primary" />
            </button>
            <div className="h-5 w-px bg-border mx-2"></div>
          </div>
          
          <div className="flex items-center justify-center rounded-full bg-muted/40 p-0.5 border border-border/50 shadow-sm transition-transform hover:scale-105">
            <UserButton 
              afterSignOutUrl="/" 
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8"
                }
              }}
            />
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
