import { redirect } from "next/navigation";
import { getRouteDossier } from "@/features/booking/actions/get-route-dossier";
import {AgendaScreen} from "@/features/booking/screens/agenda-screen";

export default async function AgendaPage() {
  const result = await getRouteDossier();
  if (!result.success) {
    redirect("/dashboard");
  }

  return (
    <AgendaScreen
      dossier={result.data}
    />
  );
}
