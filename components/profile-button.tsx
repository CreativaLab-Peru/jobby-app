"use client"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, LogOut, Settings, BookA, Loader2, Home } from "lucide-react"
import { useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { authClient } from "@/lib/auth-client"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface ProfileButtonProps {
  user: {
    id: string
    name: string
    email: string
    image?: string
  }
}

export function ProfileButton({ user }: ProfileButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoading(true)
      await authClient.signOut()
      router.push("/login")
    } catch (error) {
      console.error("Error during logout:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="h-10 w-10 rounded-full p-0"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={user?.image || "/images/user-avatar.png"}
              alt="User avatar"
            />
            <AvatarFallback>
              <User className="h-5 w-5 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-48 rounded-lg border bg-popover p-2 text-popover-foreground shadow-md"
      >
        <div className="flex flex-col gap-1">

          {/* USER INFO */}
          <div className="flex items-center gap-2 px-2 py-2 border-b">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user?.image || "/images/user-avatar.png"}
                alt="User avatar"
              />
              <AvatarFallback>
                <User className="h-4 w-4 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <div className="text-sm font-medium truncate">
              {user.name || "Usuario"}
            </div>
          </div>

          {/* ACTIONS */}
          <MenuButton onClick={() => router.push("/cv")}>
            <Home className="h-4 w-4 text-muted-foreground" />
            Inicio
          </MenuButton>

          <MenuButton onClick={() => router.push("/settings")}>
            <Settings className="h-4 w-4 text-muted-foreground" />
            Configuración
          </MenuButton>

          <MenuButton
            disabled={isLoading}
            onClick={handleLogout}
            className={cn(
              "text-destructive",
              isLoading && "justify-center"
            )}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </>
            )}
          </MenuButton>

          <Separator className="my-2" />

          <MenuButton onClick={() => router.push("/complaints")}>
            <BookA className="h-4 w-4 text-muted-foreground" />
            Reclamaciones
          </MenuButton>

          <Separator className="my-2" />

          {/* VERSION */}
          <div className="text-center text-xs text-muted-foreground">
            Versión 1.0.0
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

/* -------------------------------------------------------------------------- */
/*                               Helper Button                                */
/* -------------------------------------------------------------------------- */

function MenuButton({
                      children,
                      className,
                      ...props
                    }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
        "text-foreground hover:bg-accent hover:text-accent-foreground",
        "disabled:opacity-50 disabled:pointer-events-none",
        className
      )}
    >
      {children}
    </button>
  )
}
