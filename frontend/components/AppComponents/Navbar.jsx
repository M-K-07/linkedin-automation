"use client";
import React from "react";
import { UserButton } from "@clerk/nextjs";
import { TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      <div className="flex px-6 py-4 text-2xl justify-between items-center">
        <a
          onClick={() => router.push(`/dashboard`)}
          className="flex cursor-pointer items-center select-none"
          style={{ lineHeight: 1 }}
        >
          <h1 className="flex font-bold items-center gap-2">
            AutoGrow <TrendingUp />
          </h1>
        </a>
        <div className="flex gap-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
