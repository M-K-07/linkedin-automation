"use client";
import React from "react";
import { UserButton } from "@clerk/nextjs";
import { TrendingUp } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-background border-b shadow-xl">
      <div className="flex h-16 items-center px-6 justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            AutoGrow <TrendingUp />
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
