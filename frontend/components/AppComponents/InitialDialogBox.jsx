"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@clerk/nextjs";
import {Loader} from 'lucide-react'

const InitialDialogBox = () => {
  const { user, isLoaded } = useUser(); // include isLoaded
  const [showDialog, setShowDialog] = useState(false);
  const baseURL = process.env.NEXT_PUBLIC_API_URL;
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [roleValue, setRoleValue] = useState("");

  // Wait for user to load
  useEffect(() => {
    if (!isLoaded || !user) return; // wait until user is ready
    setEmail(user.emailAddresses[0].emailAddress);
    setFullName(`${user.firstName || ""} ${user.lastName || ""}`.trim());
  }, [user, isLoaded]);


  useEffect(() => {
    if (!user) return;
    const checkUserInfo = async () => {
      try {
        const response = await fetch(`${baseURL}/api/user/${user.id}`);
        if (!response.ok) {
          setShowDialog(true); // show dialog if 404 or error
          return;
        }
        const data = await response.json();
        if (!data.role || !data.email) {
          setShowDialog(true);
        } else {
          setShowDialog(false);
        }
      } catch (error) {
        console.error("Error checking user info:", error);
      }
    };

    checkUserInfo();
  }, [user]);

  // console.log(roleValue)

  const handleSubmit=async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      setLoading(true);
      const response = await fetch(`${baseURL}/api/user/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerk_id: user.id,
          email: email,
          full_name: fullName,
          role: roleValue,
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setLoading(false);
      setShowDialog(false);
      console.log('User Inserted Successfully');
    } catch (error) {
      console.error("Error inserting user:", error);
    }   
  }

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Wanna Know About You</DialogTitle>
            <DialogDescription>
              Please provide the following information to get started.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" name="name" defaultValue={fullName} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Email</Label>
              <Input id="username-1" name="username" defaultValue={email} />
            </div>
            <div className="grid gap-3">
              <Label>Role</Label>
              <Select value={roleValue} onValueChange={setRoleValue}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="influencer">Influencer</SelectItem>
                  <SelectItem value="marketer">Marketer</SelectItem>
                  <SelectItem value="tech-enthusiast">Tech Enthusiast</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSubmit} disabled={loading} className="cursor-pointer">Update {loading && <Loader className="animate-spin" />}</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default InitialDialogBox;
