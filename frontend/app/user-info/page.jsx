"use client";
import React, { useEffect, useState } from "react";
import NavLayout from "../../components/Layouts/NavLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {useUser} from '@clerk/nextjs';
import {Button} from '@/components/ui/button';
import { Loader } from "lucide-react";

const UserInfo = () => {
  const {user, isLoaded} = useUser();
  const [userInfo, setUserInfo] = useState({})
  const baseURL = process.env.NEXT_PUBLIC_API_URL;
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user) return;
    const fetchUserInfo = async () => {
      const response = await fetch(`${baseURL}/api/user/${user.id}`);
      const data = await response.json();
      setUserInfo(data);
    };

    fetchUserInfo();
  }, [isLoaded, user]);

  const handleUpdate = async () => {
    if (disabled) {
      setDisabled(false);
      return;
    }
    setLoading(true);
    const response = await fetch(`${baseURL}/api/user/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    });

    if (response.ok) {
      setDisabled(true);
      console.log("User updated successfully");
      setLoading(false);
    } else {
      const data = await response.json();
      console.error("Error updating user:", data);
      setLoading(false);
    }
  };

  return (
    <NavLayout>
      <div className="p-10">
        <h1 className="text-2xl font-semibold">User Information</h1>
        <div className="mt-10">
          <div className="flex mb-5 items-center">
            <Label className="w-[100px]">User ID:</Label>
            <Input placeholder="User ID" disabled={true} className="w-[300px]" value={userInfo.clerk_id ? `${userInfo.clerk_id.substring(0, userInfo.clerk_id.indexOf('_') + 3)}**************` : ''} />
          </div>
          <div className="flex mb-5 items-center">
            <Label className="w-[100px]">Name:</Label>
            <Input placeholder="Name" disabled={disabled} className="w-[300px]" value={userInfo.full_name} onChange={(e) => setUserInfo({ ...userInfo, full_name: e.target.value })} />
          </div>
          <div className="flex mb-5 items-center">
            <Label className="w-[100px]">Email:</Label>
            <Input placeholder="Email" disabled={disabled} className="w-[300px]" value={userInfo.email} onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })} />
          </div>
          <div className="flex mb-5 items-center">
            <Label className="w-[100px]">Role:</Label>
            <Input placeholder="Role" disabled={disabled} className="w-[300px]" value={userInfo.role} onChange={(e) => setUserInfo({ ...userInfo, role: e.target.value })} />
          </div>
        </div>

        <Button className="cursor-pointer" disabled={loading} onClick={handleUpdate}>{disabled ? "Update" : "Save"} {loading && <Loader className="animate-spin"/>}</Button>
      </div>
    </NavLayout>
  );
};

export default UserInfo;
