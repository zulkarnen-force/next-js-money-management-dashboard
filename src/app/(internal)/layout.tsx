import { AppSidebar } from "@/components/app-sidebar";
import { WalletProvider } from "@/components/wallet-switcher";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AddShortcutDialog } from "@/components/shortcut/add-income-expense";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { JobStatusNotifier } from "@/components/job-status-notifier";
import { Toaster } from "@/components/ui/toaster";

export default async function Page({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  const user = {
    name: session.user?.name || "User",
    email: session.user?.email || "user@example.com",
    avatar: session.user?.image || "/avatars/default.jpg",
  };
  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <Toaster />
            <JobStatusNotifier />
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Savvie</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Track, spend, chill</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main>{children}</main>
      </SidebarInset>
      <div className="fixed bottom-5 right-4 z-50 flex flex-col gap-2">
        <AddShortcutDialog></AddShortcutDialog>
      </div>
    </SidebarProvider>
  );
}
