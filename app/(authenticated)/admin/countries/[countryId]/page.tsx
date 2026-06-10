import { redirect } from "next/navigation";
import { getCountryById } from "@/features/scholarships/actions/admin/get-country-by-id";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Edit, Globe, Trash } from "lucide-react";
import Link from "next/link";

export default async function AdminCountryDetailPage({
  params,
}: {
  params: Promise<{ countryId: string }>;
}) {
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect("/dashboard");
  }

  const { countryId } = await params;
  const result = await getCountryById(countryId);

  if (!result.success || !result.data) {
    redirect("/admin/countries");
  }

  const country = result.data;

  return (
    <main className="min-h-[90vh] p-4 md:p-8">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/admin/countries">
            <ArrowLeft className="h-4 w-4" />
            Volver a países
          </Link>
        </Button>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{country.flag}</span>
            <div>
              <h1 className="text-3xl font-bold">{country.name}</h1>
              <p className="text-muted-foreground font-mono">{country.code}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" asChild>
              <Link href={`/admin/countries/${country.id}/edit`}>
                <Edit className="h-4 w-4" />
                Editar
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-border/60">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
            Información
          </h3>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">ID</dt>
              <dd className="font-mono text-sm">{country.id}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Creado</dt>
              <dd>{new Date(country.createdAt).toLocaleDateString("es-ES")}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Actualizado</dt>
              <dd>{new Date(country.updatedAt).toLocaleDateString("es-ES")}</dd>
            </div>
          </dl>
        </Card>

        <Card className="p-6 border-border/60">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
            Becas asociadas
          </h3>
          {country.opportunities.length === 0 ? (
            <p className="text-muted-foreground">No hay becas asociadas</p>
          ) : (
            <ul className="space-y-2">
              {country.opportunities.map((opp) => (
                <li
                  key={opp.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{opp.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded bg-muted">{opp.type}</span>
                    {!opp.isActive && (
                      <span className="text-xs px-2 py-1 rounded bg-destructive/10 text-destructive">
                        Inactivo
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </main>
  );
}