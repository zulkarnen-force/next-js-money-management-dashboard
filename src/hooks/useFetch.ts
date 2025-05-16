import { useEffect, useState } from "react";
import { fetcher } from "@/lib/fetcher";

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getData() {
      try {
        setLoading(true);
        const result = await fetcher<T>(url);
        setData(result);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    if (url) getData();
  }, [url]);

  return { data, loading, error };
}
