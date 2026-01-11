import {getSession} from "@/lib/shared/session";
import {redirect} from "next/navigation";
import {RegisterForm} from "@/features/auth/components/register-form";
import {Card} from "@/components/ui/card";

export default async function RegisterPage() {
  const session = await getSession()
  if (session?.success) {
    return redirect('/cv');
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      <div className="relative z-10">

        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">
                Crea tu <span className="text-gradient">cuenta gratis</span>
              </h1>
              <p className="text-muted-foreground">
                Empieza a construir tu CV profesional en minutos
              </p>
            </div>
            <Card className="p-8 bg-card shadow-glow">
              <RegisterForm />
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
