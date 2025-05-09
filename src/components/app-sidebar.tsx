"use client";

import * as React from "react";
import {
  BarChart3,
  Calendar,
  CreditCard,
  FileText,
  PieChart,
  Settings2,
  Wallet,
  WalletCards,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { WalletSwitcher } from "@/components/wallet-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";

// Navigation items for money management system
const navigation = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: BarChart3,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dash",
        },
        {
          title: "Analytics",
          url: "/dash/analytics",
        },
      ],
    },
    {
      title: "Transactions",
      url: "/transactions",
      icon: WalletCards,
      items: [
        {
          title: "All Transactions",
          url: "/transactions",
        },
        {
          title: "Income",
          url: "/transactions/income",
        },
        {
          title: "Expenses",
          url: "/transactions/expenses",
        },
        {
          title: "Transfers",
          url: "/transactions/transfers",
        },
      ],
    },
    {
      title: "Budgets",
      url: "/budgets",
      icon: PieChart,
      items: [
        {
          title: "Overview",
          url: "/budgets",
        },
        {
          title: "Categories",
          url: "/budgets/categories",
        },
        {
          title: "Reports",
          url: "/budgets/reports",
        },
      ],
    },
    {
      title: "Calendar",
      url: "/calendar",
      icon: Calendar,
      items: [
        {
          title: "Monthly View",
          url: "/calendar",
        },
        {
          title: "Upcoming",
          url: "/calendar/upcoming",
        },
      ],
    },
    {
      title: "Reports",
      url: "/reports",
      icon: FileText,
      items: [
        {
          title: "Monthly Report",
          url: "/reports/monthly",
        },
        {
          title: "Yearly Report",
          url: "/reports/yearly",
        },
        {
          title: "Custom Report",
          url: "/reports/custom",
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      items: [
        {
          title: "Profile",
          url: "/settings/profile",
        },
        {
          title: "Wallets",
          url: "/settings/wallets",
        },
        {
          title: "Categories",
          url: "/settings/categories",
        },
        {
          title: "Preferences",
          url: "/settings/preferences",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Personal Finance",
      url: "/dashboard",
      icon: Wallet,
    },
    {
      name: "Business Account",
      url: "/dashboard/business",
      icon: CreditCard,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <WalletSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigation.navMain} />
        <NavProjects projects={navigation.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: session?.user?.name || "User",
            email: session?.user?.email || "user@example.com",
            avatar: session?.user?.image || "/avatars/default.jpg",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

