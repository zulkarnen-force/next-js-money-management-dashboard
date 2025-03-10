"use client";

import type React from "react";

// This is a custom hook for the toast component from shadcn/ui
import { useState, useEffect, useCallback } from "react";

// Define the toast types
export type ToastType =
  | "default"
  | "destructive"
  | "success"
  | "warning"
  | "info";

// Define the toast props
export interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: ToastType;
  duration?: number;
}

// Define the toast context value
export interface ToastContextValue {
  toasts: Toast[];
  toast: (props: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
}

// Generate a unique ID for each toast
const generateId = () => Math.random().toString(36).substring(2, 9);

export function useToast(): ToastContextValue {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Add a new toast
  const toast = useCallback(({ ...props }: Omit<Toast, "id">) => {
    const id = generateId();
    const newToast = { id, ...props };

    setToasts((prevToasts) => [...prevToasts, newToast]);

    // Auto-dismiss toast after duration (default: 5000ms)
    if (props.duration !== Number.POSITIVE_INFINITY) {
      setTimeout(() => {
        dismiss(id);
      }, props.duration || 5000);
    }

    return id;
  }, []);

  // Remove a toast by ID
  const dismiss = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  // Clean up any toasts when component unmounts
  useEffect(() => {
    return () => {
      setToasts([]);
    };
  }, []);

  return {
    toasts,
    toast,
    dismiss,
  };
}

// For use with the Toaster component
export type ToasterToast = Toast & {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
};
