import * as LucideIcons from "lucide-react";

export const getIconComponent = (iconName: string) => {
  // Retornamos el icono de Lucide, o el de HelpCircle por defecto si no existe
  return (LucideIcons as any)[iconName] || LucideIcons.HelpCircle;
};
