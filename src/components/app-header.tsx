"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "./ui/sidebar";
import { Button } from "./ui/button";
import { LogOut, LogIn } from "lucide-react";
import { useGetMeQuery } from "@/redux/features/userApi";
import { useLogoutMutation } from "@/redux/features/authApi";
import { useRouter } from "next/navigation";
import GoogleTranslate from "./shared/GoogleTranslate";

const AppHeader = () => {
  const router = useRouter();
  const { data } = useGetMeQuery(undefined);
  const [logout] = useLogoutMutation();
  const user = data?.data;

  const handleLogout = async () => {
    try {
      await logout(undefined).unwrap();
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

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
          {/* LANGUAGE TRANSLATE */}
          <GoogleTranslate />

          {/* LOGIN / LOGOUT BUTTON */}
          {user ? (
            <Button
              onClick={handleLogout}
              size="sm"
              className="gap-2 bg-sidebar text-black hover:bg-sidebar hover:cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          ) : (
            <Button
              onClick={() => router.push("/")}
              size="sm"
              className="gap-2 bg-sidebar text-black hover:bg-sidebar hover:cursor-pointer"
            >
              <LogIn className="h-4 w-4" />
              Login
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
