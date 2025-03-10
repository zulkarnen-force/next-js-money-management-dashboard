// Types for our shortcut data
export type ShortcutType = "income" | "expense";

export interface ShortcutData {
  type: ShortcutType;
  name: string;
  amount: number;
  category: string;
}

// API function to create a new shortcut
export async function createShortcut(
  data: ShortcutData
): Promise<{ success: boolean; message?: string; data?: any }> {
  try {
    // Replace with your actual API endpoint
    const response = await fetch("/api/shortcuts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to create shortcut");
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error creating shortcut:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
