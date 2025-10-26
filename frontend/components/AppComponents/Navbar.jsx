"use client";
import React from "react";
import { SignOutButton, UserButton } from "@clerk/nextjs";
import { TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
const Navbar = () => {
  const router = useRouter();
  return (
    <div>
      <div className="flex px-6 py-5 text-2xl justify-between shadow-xl">
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
    </div>
  );
};

export default Navbar;
