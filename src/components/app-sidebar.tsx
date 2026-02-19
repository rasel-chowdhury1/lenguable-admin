"use client";

import {
  LayoutDashboard,
  Settings,
  GraduationCap,
  Users,
  CalendarClock,
  BookOpen,
  List,
} from "lucide-react";

import { NavItems } from "@/components/nav-items";
import { NavUser } from "@/components/nav-user";
import { SidebarLogo } from "@/components/sidebar-logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const user = {
  name: "Admin",
  email: "admin@gmail.com",
  avatar: "/avatars/shadcn.jpg",
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const navItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Manage Teachers",
      url: "/dashboard/mange-teachers",
      icon: Users,
    },
    {
      title: "Teacher Schedules",
      url: "/dashboard/teacher-schedules",
      icon: CalendarClock,
    },
    {
      title: "Manage Students",
      url: "/dashboard/manage-students",
      icon: GraduationCap,
    },
    {
      title: "Content & Lessons",
      url: "/dashboard/content-lessons",
      icon: BookOpen,
    },
    {
      title: "Subscription",
      url: "/dashboard/subscription",
      icon: List,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>

      <SidebarContent>
        <NavItems items={navItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
