import { Link as LinkIcon } from "lucide-react";
import {useOnboardingStore} from "@/features/onboarding/store/talent-onboarding-store";
import {Input} from "@/components/ui/input";

export function PortfolioStep() {
  const { formData, updateFormData } = useOnboardingStore();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Tu Portafolio</h2>
        <p className="text-muted-foreground">Comparte tus trabajos previos (Drive, Notion, Behance, etc.)</p>
      </div>

      <div className="relative">
        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-10 h-14"
          placeholder="https://my-portfolio.com"
          value={formData.portfolioUrl || ""}
          onChange={(e) => updateFormData({ portfolioUrl: e.target.value })}
        />
      </div>
      <p className="text-xs text-primary bg-primary/5 p-3 rounded-md">
        Un buen portafolio aumenta tus posibilidades de match en un 40%.
      </p>
    </div>
  );
}
