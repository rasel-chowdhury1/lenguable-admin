"use client";

import {
  // LayoutDashboard,
  Settings,
  GraduationCap,
  Users,
  // CalendarClock,
  BookOpen,
  // List,
  DollarSign,
  Package,
} from "lucide-react";

import { NavItems } from "@/components/nav-items";
// import { NavUser } from "@/components/nav-user";
import { SidebarLogo } from "@/components/sidebar-logo";
import {
  Sidebar,
  SidebarContent,
  // SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// const user = {
//   name: "Admin",
//   email: "admin@gmail.com",
//   avatar: "/avatars/shadcn.jpg",
// };

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const navItems = [
    {
      title: "Overview",
      url: "/dashboard",
      icon: DollarSign,
    },
    {
      title: "Manage Teachers",
      url: "/dashboard/mange-teachers",
      icon: Users,
    },
    {
      title: "Hero",
      url: "/dashboard/hero",
      icon: BookOpen,
    },
    // {
    //   title: "Teacher Schedules",
    //   url: "/dashboard/teacher-schedules",
    //   icon: CalendarClock,
    // },
    {
      title: "Manage Students",
      url: "/dashboard/manage-students",
      icon: GraduationCap,
    },
    {
      title: "Pricing Packages",
      url: "/dashboard/pricing",
      icon: Package,
    },
    {
      title: "Content & Lessons",
      url: "/dashboard/content-lessons",
      icon: BookOpen,
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

      {/* <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter> */}

      <SidebarRail />
    </Sidebar>
  );
}
