export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const errorBody = await res.json();
    throw new Error(errorBody.error || "Something went wrong");
  }
  const json = await res.json();
  return json;
}
