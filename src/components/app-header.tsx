"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "./ui/sidebar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Globe } from "lucide-react";
import { useState } from "react";

const AppHeader = () => {
  const [language, setLanguage] = useState<"en" | "es">("en");

  return (
    <div className="flex h-16 shrink-0 items-center border-b bg-sidebar sticky top-0 z-50">
      <div className="flex w-full items-center justify-between">
        {/* LEFT SIDE */}
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3 px-4">
          {/* LANGUAGE DROPDOWN */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Globe className="h-4 w-4" />
                {language === "en" ? "English" : "Spanish"}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage("en")}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("es")}>
                Spanish
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* LOGIN BUTTON */}
          <Button size="sm" className="gap-2">
            <LogOut className="h-4 w-4" />
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
