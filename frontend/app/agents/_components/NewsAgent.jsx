'use client'
import React from "react";
import { Loader, Newspaper } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useRouter } from "next/navigation";

const NewsAgent = () => {
    const [loading, setLoading] = React.useState(false);
    const router = useRouter();
    const handleClick = () => {
        setLoading(true);
        router.push('/agents/news-agent');
        setLoading(false);
    }
  return (
    <div className="px-10 flex gap-5 flex-wrap">
      <div className="border p-5 rounded-2xl shadow-2xl w-[400px] hover:scale-[1.02] transition-transform cursor-pointer">
        <h1 className="text-xl font-bold mb-3 flex gap-2 items-center">
          News Agent <Newspaper size={20} />{" "}
        </h1>
        <p className="text-sm text-gray-500 mb-3">
          Grow your LinkedIn audience and keep them informed with our AI-powered
          News Agent. This intelligent assistant curates the latest news
          articles, summarizes key points, and delivers personalized updates
          straight to your readers.
        </p>
        <Button className="w-full hover:scale-[1.02] transition-transform cursor-pointer" onClick={handleClick} disabled={loading}>Get Started {loading && <Loader className="animate-spin" />}</Button>
      </div>
    </div>
  );
};

export default NewsAgent;
