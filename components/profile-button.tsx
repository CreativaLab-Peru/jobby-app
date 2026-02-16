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
          className="h-10 w-10 rounded-full p-0 ring-offset-background transition-colors hover:bg-accent"
        >
          <Avatar className="h-10 w-10 border border-border">
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
        className="w-56 rounded-xl border border-border bg-popover p-2 text-popover-foreground shadow-lg"
      >
        <div className="flex flex-col gap-1">

          {/* USER INFO */}
          <div className="flex items-center gap-3 px-2 py-3 mb-1 border-b border-border">
            <Avatar className="h-9 w-9 border border-border">
              <AvatarImage
                src={user?.image || "/images/user-avatar.png"}
                alt="User avatar"
              />
              <AvatarFallback>
                <User className="h-4 w-4 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold truncate leading-none mb-1">
                {user.name || "Usuario"}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {user.email}
              </span>
            </div>
          </div>

          {/* ACTIONS */}
          <MenuButton onClick={() => router.push("/")}>
            <Home className="h-4 w-4 text-muted-foreground" />
            <span>Inicio</span>
          </MenuButton>

          <MenuButton onClick={() => router.push("/settings")}>
            <Settings className="h-4 w-4 text-muted-foreground" />
            <span>Configuración</span>
          </MenuButton>



          <Separator className="my-1 bg-border" />

          <MenuButton onClick={() => router.push("/complaints")}>
            <BookA className="h-4 w-4 text-muted-foreground" />
            <span className='text-start'>Libro de reclamaciones</span>
          </MenuButton>

          <Separator className="my-1 bg-border" />

          <MenuButton
            disabled={isLoading}
            onClick={handleLogout}
            // @ts-ignore
            variant={'destructive'}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <LogOut className="h-4 w-4" />
                <span>Cerrar sesión</span>
              </>
            )}
          </MenuButton>

          {/* VERSION */}
          <div className="py-1 text-center text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium">
            Versión 1.0.0
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

/* -------------------------------------------------------------------------- */
/* Helper Button                                */
/* -------------------------------------------------------------------------- */

function MenuButton({
                      children,
                      className = "",
                      ...props
                    }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "w-full justify-start",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
}
