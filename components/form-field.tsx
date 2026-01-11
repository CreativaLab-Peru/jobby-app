import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LucideIcon } from "lucide-react";

interface FormFieldProps {
  label: string;
  error?: string;
  icon?: LucideIcon;
  type?: string;
  register: any;
}

export function FormField({
                            label,
                            error,
                            icon: Icon,
                            type = "text",
                            register,
                          }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        )}
        <Input
          type={type}
          className={Icon ? "pl-10" : ""}
          {...register}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
