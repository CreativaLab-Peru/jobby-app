import { getUserCompanyAction } from "@/features/company/actions/get-user-company.action";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Building2, Users, Target, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// TODO: Creado solo para testear el omboarding, no se debe utilizar en producción, reemplazar con la página de company dashboard correcta

export default async function CompanyDashboardPage() {
  const company = await getUserCompanyAction();

  if (!company) {
    redirect("/onboarding/companies");
  }

  const primaryColor = company.primaryColor || "#000000";

  return (
    <div className="p-6 md:p-10 space-y-10 max-w-7xl mx-auto">
      {/* Header con Branding */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div
            className="h-20 w-24 rounded-2xl flex items-center justify-center border-2 border-border/40 bg-white shadow-sm overflow-hidden"
            style={{ borderColor: `${primaryColor}20` }}
          >
            {company.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={company.name}
                className="h-full w-full object-contain p-2"
              />
            ) : (
              <Building2 className="h-10 w-10 text-muted-foreground" />
            )}
          </div>
          <div>
            <h1
              className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
              style={{ color: primaryColor }}
            >
              {company.name}
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Globe className="h-4 w-4" /> {company.website || "Sin sitio web"}
            </p>
          </div>
        </div>
        <Button
          asChild
          className="rounded-xl font-bold shadow-lg"
          style={{ backgroundColor: primaryColor }}
        >
          <Link href={`/empresas/${company.slug}`} target="_blank">
            Ver Perfil Público
          </Link>
        </Button>
      </div>

      {/* Stats / Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-border/40 shadow-sm hover:shadow-md transition-shadow rounded-[2rem]">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Equipo
              </p>
              <p className="text-2xl font-bold">{company.members.length}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Miembros activos gestionando la organización.
          </p>
        </Card>

        <Card className="p-6 border-border/40 shadow-sm hover:shadow-md transition-shadow rounded-[2rem]">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Target className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Propósito
              </p>
              <p className="text-sm font-bold">
                {company.preference?.seekingTypes.length || 0} Objetivos
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {company.preference?.seekingTypes.map((type) => (
              <span
                key={type}
                className="text-[9px] font-bold bg-muted px-2 py-0.5 rounded-full uppercase tracking-tighter"
              >
                {type}
              </span>
            ))}
          </div>
        </Card>

        <Card className="p-6 border-border/40 shadow-sm hover:shadow-md transition-shadow rounded-[2rem]">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Identificación
              </p>
              <p className="text-sm font-bold">RUC: {company.ruc || "No registrado"}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Información corporativa verificada.</p>
        </Card>
      </div>

      {/* Placeholder para futuras acciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-20 rounded-2xl flex-col gap-1 border-dashed border-2 hover:border-primary/50"
            >
              <Users className="h-5 w-5 text-primary" />
              <span className="font-bold">Invitar Miembros</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 rounded-2xl flex-col gap-1 border-dashed border-2 hover:border-primary/50"
            >
              <Target className="h-5 w-5 text-primary" />
              <span className="font-bold">Publicar Oportunidad</span>
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Miembros Recientes</h2>
          <div className="bg-card border border-border/40 rounded-[2rem] p-4 divide-y">
            {company.members.slice(0, 3).map((member) => (
              <div key={member.user.email} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted overflow-hidden">
                    {member.user.image && <img src={member.user.image} alt={member.user.name} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold leading-none">{member.user.name}</p>
                    <p className="text-[10px] text-muted-foreground">{member.user.email}</p>
                  </div>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
