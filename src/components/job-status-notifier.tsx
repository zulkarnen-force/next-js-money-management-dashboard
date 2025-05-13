// app/components/job-status-notifier.tsx
"use client";

import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

export function JobStatusNotifier() {
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
            const jobId = localStorage.getItem("importJobId");
      if (!jobId) return;

      const res = await fetch(`/api/import/status?jobId=${jobId}`);
      const { status, error } = await res.json();
      if (status === "done") {
        clearInterval(interval);
        localStorage.removeItem("importJobId");
        toast({
          title: "✅ Import Completed",
          description: "Your import has finished successfully.",
        });
      } else if (status === "failed") {
        clearInterval(interval);
        localStorage.removeItem("importJobId");
        toast({
          title: "❌ Import Failed",
          description: error || "Something went wrong.",
          variant: "destructive",
        });
      }
    }, 3000);

    setHasChecked(true);

    return () => clearInterval(interval);
  }, [hasChecked]);

  return null;
}
