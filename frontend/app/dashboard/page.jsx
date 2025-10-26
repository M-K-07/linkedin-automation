"use client";
import { useUser } from "@clerk/nextjs";
import Navbar from "../../components/AppComponents/Navbar";
import Layout from "../../components/Layout";
const Page = () => {
  const { user } = useUser();
  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-semibold">Welcome, {user?.firstName}!</h1>
        <p>This is your dashboard 🎉</p>
      </div>
    </Layout>
  );
};

export default Page;
