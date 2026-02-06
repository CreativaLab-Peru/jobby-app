"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"; // Ajusta la ruta según tu proyecto
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  image?: string | null;
  name?: string | null;
  className?: string;
}

export function UserAvatar({ image, name, className }: UserAvatarProps) {
  // Lógica simple para extraer iniciales (KISS)
  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "??";

  return (
    <Avatar className={cn("h-12 w-12", className)}>
      {image && (
        <AvatarImage
          src={image}
          alt={name || "User Avatar"}
          className="object-cover"
        />
      )}
      <AvatarFallback className="font-medium">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
