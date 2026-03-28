import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  sublabel?: string;
  variant?: "default" | "primary" | "warning" | "success";
}

const variantStyles = {
  default: "bg-card border border-border",
  primary: "bg-primary/5 border border-primary/20",
  warning: "bg-warning-bg border border-warning/20",
  success: "bg-success-bg border border-success/20",
};

const iconVariantStyles = {
  default: "text-muted-foreground",
  primary: "text-primary",
  warning: "text-warning",
  success: "text-success",
};

export function StatCard({ icon: Icon, label, value, sublabel, variant = "default" }: StatCardProps) {
  return (
    <div className={cn("rounded-xl p-5 animate-fade-in", variantStyles[variant])}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-3xl font-heading font-bold text-foreground mt-1">{value}</p>
          {sublabel && <p className="text-xs text-muted-foreground mt-1">{sublabel}</p>}
        </div>
        <div className={cn("p-2 rounded-lg bg-background/50", iconVariantStyles[variant])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
