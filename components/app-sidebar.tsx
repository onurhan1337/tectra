"use client";

import * as React from "react";
import {
  BarChart2,
  BookTemplate,
  FileText,
  FormInput,
  Home,
  Settings2,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SidebarCreditSection } from "./sidebar-credit-section";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
      items: [],
    },
    {
      title: "Forms",
      url: "/dashboard/forms",
      icon: FileText,
      items: [],
    },
    {
      title: "Templates",
      url: "/dashboard/templates",
      icon: BookTemplate,
      items: [],
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: BarChart2,
      items: [],
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2,
      items: [],
    },
  ],
};

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user?: {
    name?: string;
    email?: string;
    avatar?: string;
  };
}) {
  const userData = user
    ? {
        name: user.name || user.email?.split("@")[0] || "User",
        email: user.email || "",
        avatar: user.avatar || "",
      }
    : undefined;

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <FormInput className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Tectra</span>
                  <span className="truncate text-xs">Form Builder</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarCreditSection />
        {userData && <NavUser user={userData} />}
      </SidebarFooter>
    </Sidebar>
  );
}
