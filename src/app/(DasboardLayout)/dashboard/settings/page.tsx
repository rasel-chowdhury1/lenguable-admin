"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

// ── Types ─────────────────────────────────────────────────────────────────────
type SettingsFormData = {
  announcementTitle: string;
  announcementText: string;
};

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [enableAnnouncement, setEnableAnnouncement] = useState<boolean>(false);
  const [sendReminder, setSendReminder] = useState<boolean>(true);
  const [sendReview, setSendReview] = useState<boolean>(true);

  const { register, handleSubmit } = useForm<SettingsFormData>({
    defaultValues: {
      announcementTitle: "Important Update",
      announcementText: "",
    },
  });

  function onSubmit(data: SettingsFormData): void {
    console.log("Settings saved:", {
      enableAnnouncement,
      sendReminder,
      sendReview,
      ...data,
    });
  }

  return (
    <div className="max-w-6xl mx-auto p-5 my-10">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Announcements Section */}
        <div className="border border-gray-200 rounded-xl bg-white p-6 space-y-5">
          <h2 className="text-base font-semibold text-gray-900">
            Announcements
          </h2>

          {/* Subtitle + Toggle */}
          <div>
            <p className="text-sm text-gray-500 mb-1">
              Create announcements for students and teachers
            </p>
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold text-gray-800">
                Enable Announcement
              </Label>
              <Switch
                checked={enableAnnouncement}
                onCheckedChange={setEnableAnnouncement}
                className="data-[state=checked]:bg-[#A9F877]"
              />
            </div>
          </div>

          {/* Announcement Title */}
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-gray-800">
              Announcement Title
            </Label>
            <Input
              {...register("announcementTitle")}
              placeholder="Important Update"
              className="bg-gray-50 border-gray-200"
            />
          </div>

          {/* Announcement Text */}
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-gray-800">
              Announcement Text
            </Label>
            <Textarea
              {...register("announcementText")}
              placeholder="Enter your announcement message here..."
              className="bg-gray-50 border-gray-200 resize-none h-24"
            />
          </div>
        </div>

        {/* Email Settings Section */}
        <div className="border border-gray-200 rounded-xl bg-white p-6 space-y-4">
          <h2 className="text-base font-semibold text-gray-900">
            Email Settings
          </h2>

          <p className="text-sm text-gray-500">
            Configure automated email notifications
          </p>

          {/* Send Reminder Emails */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Send Reminder Emails
              </p>
              <p className="text-sm text-gray-400">
                Send reminders 24h and 2h before class
              </p>
            </div>
            <Switch
              checked={sendReminder}
              onCheckedChange={setSendReminder}
              className="data-[state=checked]:bg-[#A9F877]"
            />
          </div>

          {/* Send Review Request Emails */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Send Review Request Emails
              </p>
              <p className="text-sm text-gray-400">
                Request reviews after completed classes
              </p>
            </div>
            <Switch
              checked={sendReview}
              onCheckedChange={setSendReview}
              className="data-[state=checked]:bg-[#A9F877]"
            />
          </div>
        </div>

        {/* Save Button */}
        <Button
          type="submit"
          className="w-full bg-[#A9F877] hover:bg-[#C1FF72] text-black"
        >
          Save Changes
        </Button>
      </form>
    </div>
  );
}
