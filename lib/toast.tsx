"use client";

import { toast } from "sonner";

export type NotificationType = "success" | "error" | "info" | "warning";

type ActionProps = {
  label: string;
  onClick: () => void;
};

type ToastParams = {
  description?: string;
  action?: ActionProps;
  duration?: number;
};

export const showToast = {
  success: (message: string, params?: ToastParams) => {
    if (params) {
      return toast.success(message, params);
    }
    return toast.success(message);
  },

  error: (message: string, params?: ToastParams) => {
    if (params) {
      return toast.error(message, params);
    }
    return toast.error(message);
  },

  info: (message: string, params?: ToastParams) => {
    if (params) {
      return toast.info(message, params);
    }
    return toast.info(message);
  },

  warning: (message: string, params?: ToastParams) => {
    if (params) {
      return toast.warning(message, params);
    }
    return toast.warning(message);
  },

  message: (message: string, params?: ToastParams) => {
    if (params) {
      return toast(message, params);
    }
    return toast(message);
  },

  promise: <T,>(
    promise: Promise<T>,
    options: { loading: string; success: string; error: string }
  ) => toast.promise(promise, options),

  notification: (notification: { type: NotificationType; message: string }) => {
    if (!notification) return;

    switch (notification.type) {
      case "success":
        toast.success(notification.message);
        break;
      case "error":
        toast.error(notification.message);
        break;
      case "info":
        toast.info(notification.message);
        break;
      case "warning":
        toast.warning(notification.message);
        break;
    }
  },
};
