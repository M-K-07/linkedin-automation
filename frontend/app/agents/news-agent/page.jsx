"use client";
import React, { useEffect, useState } from "react";
import NavLayout from "../../../components/Layouts/NavLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import { Loader } from "lucide-react";

const NewsAgentPage = () => {
  const { user, isLoaded } = useUser();
  const [days, setDays] = useState([]);
  const [hour, setHour] = useState("09");
  const [minute, setMinute] = useState("00");
  const [period, setPeriod] = useState("AM");
  const [userEmail, setUserEmail] = useState("");
  const [areaOfInterest, setAreaOfInterest] = useState([]);
  const [interestedSources, setInterestedSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scheduleExists, setScheduleExists] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const baseURL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!isLoaded || !user) return;
    setUserEmail(user.emailAddresses[0].emailAddress);
  }, [user, isLoaded]);

  useEffect(() => {
    const fetchExistingSettings = async () => {
      setLoading(true);
      if (!user) return;
      const response = await fetch(`${baseURL}/api/agents/news-agent/schedule/${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserEmail(data.email);
        setAreaOfInterest(data.areas_of_interest);
        setInterestedSources(data.interested_sources);
        setDays(data.days);
        setHour(data.hour.toString().padStart(2, "0"));
        setMinute(data.minute.toString().padStart(2, "0"));
        setPeriod(data.period);
        setScheduleExists(true);
      }
    };
    fetchExistingSettings();
    setLoading(false);
  }, [user]);

  const handleSourceChange = (checked, source) => {
    setInterestedSources((prev) => {
      if (checked) {
        return [...prev, source];
      } else {
        return prev.filter((s) => s !== source);
      }
    });
  };

  const handleStartScheduling = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const response = await fetch(`${baseURL}/api/agents/news-agent/schedule`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clerk_id: user.id,
        email: userEmail,
        areas_of_interest: areaOfInterest,
        interested_sources: interestedSources,
        days: days,
        hour: parseInt(hour),
        minute: parseInt(minute),
        period: period,
      }),
    });
    if (response.ok) {
      setScheduleExists(true);
    }
    setLoading(false);
    console.log(response);
  };

  const handleUpdateDetails = async(e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const payload = {
      email: userEmail,
      areas_of_interest: areaOfInterest,
      interested_sources: interestedSources,
      days: days,
      hour: parseInt(hour),
      minute: parseInt(minute),
      period: period,
    }
    const response = await fetch(`${baseURL}/api/agents/news-agent/schedule/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
  });
    if (response.ok) { 
      setIsEditing(false);
      console.log("Details updated successfully");
    } else {
      const data = await response.json();
      console.error("Error updating details:", data);
    }
  }

  const handleCancelEdit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // Here you might want to refetch the data to discard changes
    // or reset the state to the initial fetched values.
    
  }

  return (
    <NavLayout>
      <div className="p-10">
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">News Agent</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Automate your content creation. Configure your preferences, and let
            our AI deliver engaging news posts for your audience.
          </p>
        </header>

        <div className="space-y-12">
          <div className="border rounded-xl shadow-lg p-8">
            <form className="space-y-10">
              <div className="grid gap-3">
                <Label htmlFor="email" className="text-lg font-medium">
                  Delivery Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your preferred email for post delivery"
                  // value={userEmail}
                  defaultValue={userEmail}
                  disabled={!isEditing && scheduleExists}
                  onChange={(e) => setUserEmail(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  We'll send generated posts here for your review.
                </p>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="interests" className="text-lg font-medium">
                  Areas of Interest
                </Label>
                <Input
                disabled={!isEditing && scheduleExists}
                  id="interests"
                  placeholder="e.g., AI, Blockchain, Marketing, Future of Work"
                  value={areaOfInterest.join(", ")}
                  onChange={(e) => setAreaOfInterest(e.target.value.split(",").map(item => item.trim()))}
                />
                <p className="text-sm text-muted-foreground">
                  Separate different topics with a comma.
                </p>
              </div>

              <div className="grid gap-3">
                <Label className="text-lg font-medium">
                  Interested Sources
                </Label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                    disabled={!isEditing && scheduleExists}
                      id="source-reddit"
                      checked={interestedSources.includes("reddit")}
                      onCheckedChange={(checked) =>
                        handleSourceChange(checked, "reddit")
                      }
                    />
                    <Label htmlFor="source-reddit">Reddit</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                    disabled={!isEditing && scheduleExists}
                      id="source-google"
                      checked={interestedSources.includes("google-news")}
                      onCheckedChange={(checked) =>
                        handleSourceChange(checked, "google-news")
                      }
                    />
                    <Label htmlFor="source-google">Google News</Label>
                  </div>
                </div>
              </div>

              <div className="grid gap-3">
                <Label className="text-lg font-medium">Days to Post</Label>
                <ToggleGroup
                  type="multiple"
                  value={days}
                  onValueChange={setDays}
                  variant="outline"
                  disabled={!isEditing && scheduleExists}
                >
                  <ToggleGroupItem
                    value="sun"
                    className="data-[state=on]:bg-black data-[state=on]:text-white"
                  >
                    Sun
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="mon"
                    className="data-[state=on]:bg-black data-[state=on]:text-white"
                  >
                    Mon
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="tue"
                    className="data-[state=on]:bg-black data-[state=on]:text-white"
                  >
                    Tue
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="wed"
                    className="data-[state=on]:bg-black data-[state=on]:text-white"
                  >
                    Wed
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="thu"
                    className="data-[state=on]:bg-black data-[state=on]:text-white"
                  >
                    Thu
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="fri"
                    className="data-[state=on]:bg-black data-[state=on]:text-white"
                  >
                    Fri
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="sat"
                    className="data-[state=on]:bg-black data-[state=on]:text-white"
                  >
                    Sat
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              <div className="grid gap-3">
                <Label className="text-lg font-medium">Time Frame</Label>
                <div className="flex items-center gap-2">
                  <Select value={hour} onValueChange={setHour} disabled={!isEditing && scheduleExists}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem
                          key={i}
                          value={(i + 1).toString().padStart(2, "0")}
                        >
                          {(i + 1).toString().padStart(2, "0")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={minute} onValueChange={setMinute} disabled={!isEditing && scheduleExists}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 60 }, (_, i) => (
                        <SelectItem
                          key={i}
                          value={i.toString().padStart(2, "0")}
                        >
                          {i.toString().padStart(2, "0")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={period} onValueChange={setPeriod} disabled={!isEditing && scheduleExists}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AM">AM</SelectItem>
                      <SelectItem value="PM">PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                {!scheduleExists ? (
                  <Button size="lg" onClick={handleStartScheduling} disabled={loading}>
                    {loading ? <><Loader className="animate-spin mr-2" /> Scheduling...</> : "Start Scheduling"}
                  </Button>
                ) : isEditing ? (
                  <>
                    <Button size="lg" onClick={handleUpdateDetails} disabled={loading}>
                      {loading ? <><Loader className="animate-spin mr-2" /> Updating...</> : "Update Schedule"}
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={handleCancelEdit}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsEditing(true);
                    }}
                    // disabled={loading}
                  >
                    Edit Details
                  </Button>
                )}
              </div>
            </form>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Generated Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <p>
                  Your generated content will appear here once the agent runs.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </NavLayout>
  );
};

export default NewsAgentPage;
