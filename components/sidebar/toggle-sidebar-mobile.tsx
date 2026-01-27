import { useSidebarStore } from "@/store/use-sidebar-store";
import { Menu } from "lucide-react";
import {Button} from "@/components/ui/button";

export function ToggleSidebarMobile() {
  const toggleMobile = useSidebarStore((state) => state.toggleMobile);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="sm:hidden"
      onClick={toggleMobile}
    >
      <Menu className="h-6 w-6" />
    </Button>
  );
}
