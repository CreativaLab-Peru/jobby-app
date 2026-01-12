import ChangePassword from "@/features/user/components/change-password";
import {getUser} from "@/features/authentication/actions/get-user";

export const dynamic = "force-dynamic";
export default async function ChangePasswordPage() {
  const user = await getUser();
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">No tienes acceso a esta página. Por favor, inicia sesión.</p>
      </div>
    );
  }
  return (
    <ChangePassword user={user} />
  )
}
