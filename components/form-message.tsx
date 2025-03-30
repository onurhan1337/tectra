import { AlertCircle, CheckCircle2, Info } from "lucide-react";

export type Message =
  | { success: string }
  | { error: string }
  | { message: string };

export function FormMessage({ message }: { message: Message }) {
  if (!message || Object.keys(message).length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      {"success" in message && (
        <div className="bg-success/10 text-success border border-success/20 rounded-lg p-3 flex items-start gap-2">
          <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <p className="text-sm">{message.success}</p>
        </div>
      )}
      {"error" in message && (
        <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <p className="text-sm">{message.error}</p>
        </div>
      )}
      {"message" in message && (
        <div className="bg-muted text-foreground border rounded-lg p-3 flex items-start gap-2">
          <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <p className="text-sm">{message.message}</p>
        </div>
      )}
    </div>
  );
}
