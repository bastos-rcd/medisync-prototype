import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, AlertCircle, Info } from "lucide-react";

interface NotificationCardProps {
  type: "warning" | "danger" | "success" | "info";
  message: string;
  detail?: string;
}

const styles = {
  warning: { bg: "bg-warning-bg", border: "border-warning/30", text: "text-warning-foreground", icon: AlertTriangle, iconColor: "text-warning" },
  danger: { bg: "bg-alert-bg", border: "border-destructive/30", text: "text-alert-foreground", icon: AlertCircle, iconColor: "text-destructive" },
  success: { bg: "bg-success-bg", border: "border-success/30", text: "text-success-foreground", icon: CheckCircle2, iconColor: "text-success" },
  info: { bg: "bg-info-bg", border: "border-info/30", text: "text-info-foreground", icon: Info, iconColor: "text-info" },
};

export function NotificationCard({ type, message, detail }: NotificationCardProps) {
  const s = styles[type];
  const Icon = s.icon;

  return (
    <div className={cn("flex items-start gap-3 px-4 py-3 rounded-xl border animate-fade-in", s.bg, s.border)}>
      <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", s.iconColor)} />
      <div>
        <p className={cn("text-sm font-semibold", s.text)}>{message}</p>
        {detail && <p className={cn("text-xs mt-0.5 opacity-80", s.text)}>{detail}</p>}
      </div>
    </div>
  );
}
