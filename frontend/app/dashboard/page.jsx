"use client";
import { useUser } from "@clerk/nextjs";
import NavLayout from "../../components/Layouts/NavLayout";
import InitialDialogBox from "../../components/AppComponents/InitialDialogBox";
import { useEffect } from "react";
const Page = () => {
  const { user } = useUser();

  return (
    <NavLayout>
      <div className="p-4 min-h-screen">
        <div className="text-center ">
          <h1 className="text-2xl font-semibold">
            Welcome, {user?.firstName}!
          </h1>
          <p>This is your dashboard 🎉</p>
          <InitialDialogBox />
        </div>
      </div>
    </NavLayout>
  );
};

export default Page;
