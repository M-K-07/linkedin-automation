"use client";
import React, { useEffect } from "react";
import { Button } from "../../components/ui/button";
import Navbar from "../../components/AppComponents/RootNavbar";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const Page = () => {
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
      router.push("/sign-in");
    }
  };


  return (
    <div className="h-screen bg-zinc-800">
      <Navbar />
      <div className="my-29 flex flex-col justify-center items-center">
        <p className="text-white text-4xl">Linkedin Content Automation</p>
        <Button
          className="cursor-pointer mt-4"
          variant='outline'
          onClick={handleRoute}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default Page;
