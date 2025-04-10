import { InfoIcon } from "lucide-react";
import { ReactNode } from "react";
import { Alert, AlertDescription } from "./ui/alert";

export function StatusAlert({
  icon: Icon = InfoIcon,
  variant,
  className,
  children,
}: {
  icon?: typeof InfoIcon;
  variant?: "default" | "destructive";
  className?: string;
  children: ReactNode;
}) {
  return (
    <Alert variant={variant} className={className}>
      <AlertDescription className="flex items-center gap-2">
        <Icon size="16" strokeWidth={2} />
        {children}
      </AlertDescription>
    </Alert>
  );
}
