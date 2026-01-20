import { UseFormReturn } from "react-hook-form";
import { Badge } from "@/components/ui/badge"; // Shadcn
import { cn } from "@/lib/utils";
import {TalentOnboardingFormData} from "@/features/onboarding/schemas";

const ROLE_OPTIONS = [
  "Frontend Developer", "Backend Developer", "Fullstack",
  "Mobile Dev", "UI/UX Designer", "Data Analyst", "DevOps"
];

export function RolesStep({ form }: { form: UseFormReturn<TalentOnboardingFormData> }) {
  const selectedRoles = form.watch("preferredRoles");

  const toggleRole = (role: string) => {
    const current = new Set(selectedRoles);
    if (current.has(role)) current.delete(role);
    else current.add(role);
    form.setValue("preferredRoles", Array.from(current));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">¿Qué roles te interesan?</h2>
        <p className="text-muted-foreground">Selecciona las posiciones donde te gustaría hacer match.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {ROLE_OPTIONS.map((role) => (
          <div
            key={role}
            onClick={() => toggleRole(role)}
            className={cn(
              "cursor-pointer px-4 py-2 rounded-full border-2 transition-all",
              selectedRoles.includes(role)
                ? "border-primary bg-primary/10 text-primary"
                : "border-muted bg-transparent hover:border-primary/50"
            )}
          >
            {role}
          </div>
        ))}
      </div>
      {form.formState.errors.preferredRoles && (
        <p className="text-sm text-destructive">{form.formState.errors.preferredRoles.message}</p>
      )}
    </div>
  );
}
