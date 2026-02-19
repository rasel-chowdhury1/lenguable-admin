// app/my-account/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function MyAccountPage() {
  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold text-center mb-8">My Account</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Personal Information</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="flex justify-center">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-lg font-medium">
                MJ
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input value="Mitchel Jack" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input value="jackydude@gmail.com" disabled />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Interests</label>
            <Input value="Travel, Music, Technology" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">About Me</label>
            <Textarea placeholder="Tell us about yourself and your learning goals..." />
          </div>

          <Button className="w-full">Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
