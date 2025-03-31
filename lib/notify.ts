export type NotificationType = "success" | "error" | "info" | "warning";

export interface Notification {
  type: NotificationType;
  message: string;
}

export const notify = {
  success: (message: string) => {
    console.log(`[SUCCESS] ${message}`);
    return { type: "success" as const, message };
  },
  error: (message: string) => {
    console.error(`[ERROR] ${message}`);
    return { type: "error" as const, message };
  },
  info: (message: string) => {
    console.log(`[INFO] ${message}`);
    return { type: "info" as const, message };
  },
  warning: (message: string) => {
    console.warn(`[WARNING] ${message}`);
    return { type: "warning" as const, message };
  },
  promise: <T>(
    promise: Promise<T>,
    options: { loading: string; success: string; error: string }
  ) => {
    console.log(`[PROMISE] ${options.loading}`);
    return promise
      .then((result) => {
        console.log(`[PROMISE SUCCESS] ${options.success}`);
        return result;
      })
      .catch((error) => {
        console.error(`[PROMISE ERROR] ${options.error}`, error);
        throw error;
      });
  },
};
