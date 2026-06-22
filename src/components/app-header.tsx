"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "./ui/sidebar";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { useGetMeQuery } from "@/redux/features/userApi";
import { useLogoutMutation } from "@/redux/features/authApi";
import { useRouter } from "next/navigation";
import GoogleTranslate from "./shared/GoogleTranslate";
import { useDispatch } from "react-redux";
import { baseApi } from "@/redux/api/baseApi";

const AppHeader = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data } = useGetMeQuery(undefined);
  const [logout] = useLogoutMutation();
  const user = data?.data;

  const handleLogout = async () => {
    try {
      await logout(undefined).unwrap();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      dispatch(baseApi.util.resetApiState());
      router.push("/");
      router.refresh();
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

          {/* USER INFO */}
          {user && (
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-900 leading-tight">
                {user.name}
              </p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          )}

          {/* LOGOUT BUTTON — always visible inside the protected dashboard */}
          <Button
            onClick={handleLogout}
            size="sm"
            className="gap-2 bg-sidebar text-black hover:bg-sidebar hover:cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppHeader;