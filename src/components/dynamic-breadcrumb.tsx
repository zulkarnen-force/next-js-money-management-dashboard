"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

// Map of route segments to display names
const routeNames: { [key: string]: string } = {
  dash: "Dashboard",
  analytics: "Analytics",
  transactions: "Transactions",
  settings: "Settings",
  profile: "Profile",
  wallets: "Wallets",
  categories: "Categories",
};

export function DynamicBreadcrumb() {
  const pathname = usePathname();
  
  // Split the pathname into segments and remove empty strings
  const segments = pathname.split("/").filter(Boolean);
  
  // If we're at the root, show default breadcrumb
  if (segments.length === 0) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Monee</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Track, spend, chill</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Monee</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        
        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join("/")}`;
          const isLast = index === segments.length - 1;
          const displayName = routeNames[segment] || segment;

          return (
            <BreadcrumbItem key={segment}>
              {isLast ? (
                <BreadcrumbPage>{displayName}</BreadcrumbPage>
              ) : (
                <>
                  <BreadcrumbLink href={href}>{displayName}</BreadcrumbLink>
                  <BreadcrumbSeparator />
                </>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
} 