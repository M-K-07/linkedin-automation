"use client";
import React, { useEffect, useState } from "react";
import NavLayout from "../../components/Layouts/NavLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Loader2, User as UserIcon, Mail, ShieldAlert, Fingerprint, Edit2, Save, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const UserInfo = () => {
  const { user, isLoaded } = useUser();
  const [userInfo, setUserInfo] = useState({});
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  
  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    if (!isLoaded || !user) return;
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`${baseURL}/api/user/${user.id}`);
        const data = await response.json();
        setUserInfo(data);
      } catch (err) {
        console.error("Error fetching user data", err);
      } finally {
        setPageLoading(false);
      }
    };
    fetchUserInfo();
  }, [isLoaded, user]);

  const handleUpdate = async () => {
    if (disabled) {
      setDisabled(false);
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/api/user/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInfo),
      });

      if (response.ok) {
        setDisabled(true);
      } else {
        console.error("Error updating user:", await response.json());
      }
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    // Optionally fetch again to reset or just toggle
    setDisabled(true);
  };

  return (
    <NavLayout>
      <div className="p-4 md:p-8 min-h-screen bg-slate-50/50 dark:bg-zinc-950/50">
        <div className="max-w-3xl mx-auto space-y-8">
          
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
            <p className="text-muted-foreground mt-2">
              Manage your profile information and account preferences.
            </p>
          </div>

          <Card className="border-border/60 shadow-sm overflow-hidden bg-card">
            {pageLoading ? (
              <div className="flex flex-col items-center justify-center p-16 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
                <p>Loading your profile...</p>
              </div>
            ) : (
              <>
                <CardHeader className="pb-8 pt-8 border-b bg-muted/10">
                  <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                    <div className="h-24 w-24 rounded-full bg-primary/10 border-4 border-background flex items-center justify-center shadow-sm shrink-0 overflow-hidden">
                      {user?.imageUrl ? (
                        <img src={user.imageUrl} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        <UserIcon className="h-10 w-10 text-primary" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{userInfo.full_name || "User Profile"}</CardTitle>
                      <CardDescription className="mt-1.5 text-base">{userInfo.email || "No email available"}</CardDescription>
                      <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                          {userInfo.role || "Standard User"}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6 md:p-8">
                  <div className="grid gap-8 md:grid-cols-2">
                    
                    <div className="space-y-2.5">
                      <Label className="flex items-center gap-2 text-muted-foreground">
                        <Fingerprint className="h-4 w-4" /> User ID
                      </Label>
                      <Input 
                        disabled={true} 
                        className="bg-muted/30 font-mono text-sm" 
                        value={userInfo.clerk_id ? `${userInfo.clerk_id.substring(0, userInfo.clerk_id.indexOf('_') + 3)}**************` : ''} 
                      />
                    </div>
                    
                    <div className="space-y-2.5">
                      <Label className="flex items-center gap-2 text-muted-foreground">
                        <UserIcon className="h-4 w-4" /> Full Name
                      </Label>
                      <Input 
                        disabled={disabled} 
                        className={`transition-colors ${!disabled && 'border-primary ring-1 ring-primary/20 bg-background'}`}
                        value={userInfo.full_name || ''} 
                        onChange={(e) => setUserInfo({ ...userInfo, full_name: e.target.value })} 
                      />
                    </div>

                    <div className="space-y-2.5">
                      <Label className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" /> Email Address
                      </Label>
                      <Input 
                        disabled={disabled} 
                        className={`transition-colors ${!disabled && 'border-primary ring-1 ring-primary/20 bg-background'}`}
                        value={userInfo.email || ''} 
                        onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })} 
                      />
                    </div>

                    <div className="space-y-2.5">
                      <Label className="flex items-center gap-2 text-muted-foreground">
                        <ShieldAlert className="h-4 w-4" /> Role & Permissions
                      </Label>
                      <Input 
                        disabled={disabled} 
                        className={`transition-colors ${!disabled && 'border-primary ring-1 ring-primary/20 bg-background'}`}
                        value={userInfo.role || ''} 
                        onChange={(e) => setUserInfo({ ...userInfo, role: e.target.value })} 
                      />
                    </div>

                  </div>
                </CardContent>

                <CardFooter className="p-6 bg-muted/5 border-t flex flex-col-reverse sm:flex-row justify-end gap-3">
                  {!disabled && (
                    <Button 
                      variant="ghost" 
                      onClick={cancelEdit}
                      disabled={loading}
                      className="cursor-pointer font-medium w-full sm:w-auto"
                    >
                      <X className="mr-2 h-4 w-4" /> Cancel
                    </Button>
                  )}
                  <Button 
                    className="cursor-pointer font-medium shadow-sm transition-all w-full sm:w-auto" 
                    disabled={loading} 
                    onClick={handleUpdate}
                  >
                    {loading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                    ) : disabled ? (
                      <><Edit2 className="mr-2 h-4 w-4" /> Edit Profile</>
                    ) : (
                      <><Save className="mr-2 h-4 w-4" /> Save Changes</>
                    )}
                  </Button>
                </CardFooter>
              </>
            )}
          </Card>
        </div>
      </div>
    </NavLayout>
  );
};

export default UserInfo;
