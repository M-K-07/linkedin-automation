import React from 'react'
import { Command } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { ThemeToggle } from '../ThemeToggle'

const RootNavbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="flex h-16 items-center px-6 md:px-12 justify-between max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg shadow-sm">
            <Command className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">AutoSync</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</Link>
          <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="h-5 w-px bg-border hidden sm:block"></div>
          
          <Link href="/sign-in">
             <Button variant="ghost" className="hidden sm:inline-flex cursor-pointer">Sign In</Button>
          </Link>
          <Link href="/sign-up">
             <Button className="cursor-pointer shadow-sm">Get Started</Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default RootNavbar;
