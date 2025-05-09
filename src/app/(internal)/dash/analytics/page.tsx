"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Overview } from "@/components/analytics/overview";
import { CategoryAnalytics } from "@/components/analytics/category-analytics";
import { WalletAnalytics } from "@/components/analytics/wallet-analytics";
import { TransactionTrends } from "@/components/analytics/transaction-trends";

export default function AnalyticsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="wallets">Wallets</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Overview />
        </TabsContent>
        <TabsContent value="categories" className="space-y-4">
          <CategoryAnalytics />
        </TabsContent>
        <TabsContent value="wallets" className="space-y-4">
          <WalletAnalytics />
        </TabsContent>
        <TabsContent value="trends" className="space-y-4">
          <TransactionTrends />
        </TabsContent>
      </Tabs>
    </div>
  );
} 