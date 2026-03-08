"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/shared/page-header";
import { UserPreference } from "@prisma/client";
import {
  updateUserPreference,
  type UpdateUserPreferenceInput,
} from "@/features/settings/actions/update-user-preference";
import { AREAS, SKILLS } from "@/features/onboarding/consts/talent-onboarding-data";

/* ── Options ── */
const EXP_LEVELS = [
  { value: "EGRESADO", label: "Recién egresado/a" },
  { value: "JUNIOR", label: "Junior" },
  { value: "MID", label: "Mid / Senior" },
];

const WORK_MODALITIES = [
  { value: "REMOTE_ONLY", label: "Remoto" },
  { value: "HYBRID", label: "Híbrido" },
  { value: "ONSITE_ONLY", label: "Presencial" },
];

const AVAILABILITY_OPTIONS = [
  { value: "IMMEDIATE", label: "Inmediata" },
  { value: "ONE_MONTH", label: "1 mes" },
  { value: "TWO_MONTHS", label: "2 meses" },
  { value: "LISTENING_OFFERS", label: "Escuchando ofertas" },
];

const OPPORTUNITY_TYPES = [
  { value: "INTERNSHIP", label: "Pasantía" },
  { value: "SCHOLARSHIP", label: "Beca" },
  { value: "EXCHANGE_PROGRAM", label: "Intercambio" },
  { value: "EMPLOYMENT", label: "Empleo" },
  { value: "STARTUP", label: "Startup" },
];

const CURRENCIES = [
  { value: "USD", label: "USD" },
  { value: "PEN", label: "PEN" },
];

const AREA_OPTIONS = Object.entries(AREAS).map(([key, val]) => ({ value: key, label: val.label }));

const ALL_SKILLS = Object.values(SKILLS).flatMap((group) =>
  Object.entries(group).map(([key, label]) => ({ value: key, label: label as string }))
);

interface MyPreferencesScreenProps {
  preference: UserPreference;
}

type Feedback = { type: "success" | "error"; message: string } | null;

export function MyPreferencesScreen({ preference }: MyPreferencesScreenProps) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<Feedback>(null);

  // Form state
  const [country, setCountry] = useState(preference.country ?? "");
  const [expLevel, setExpLevel] = useState(preference.expLevel ?? "");
  const [workModality, setWorkModality] = useState<string[]>(preference.workModality ?? []);
  const [relocation, setRelocation] = useState(preference.relocation);
  const [availability, setAvailability] = useState<string[]>(preference.availability ?? []);
  const [opportunityTypes, setOpportunityTypes] = useState<string[]>(preference.opportunityTypes ?? []);
  const [preferredRoles, setPreferredRoles] = useState(preference.preferredRoles?.join(", ") ?? "");
  const [targetIndustries, setTargetIndustries] = useState<string[]>(preference.targetIndustries ?? []);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    (preference.skills as { name: string }[] | null)?.map((s) => s.name) ?? []
  );
  const [portfolioUrl, setPortfolioUrl] = useState(preference.portfolioUrl ?? "");
  const [minSalary, setMinSalary] = useState(preference.minSalary?.toString() ?? "");
  const [maxSalary, setMaxSalary] = useState(preference.maxSalary?.toString() ?? "");
  const [currency, setCurrency] = useState(preference.currency ?? "USD");

  const toggleArray = (arr: string[], value: string, setter: (v: string[]) => void) => {
    setter(arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);
  };

  const handleSave = () => {
    setFeedback(null);
    const input: UpdateUserPreferenceInput = {
      country: country.trim() || undefined,
      expLevel: expLevel || undefined,
      workModality,
      relocation,
      availability,
      opportunityTypes,
      preferredRoles: preferredRoles.split(",").map((s) => s.trim()).filter(Boolean),
      targetIndustries,
      skills: selectedSkills.map((name) => ({ name, level: "Intermedio" })),
      portfolioUrl: portfolioUrl.trim() || undefined,
      minSalary: minSalary ? Number(minSalary) : null,
      maxSalary: maxSalary ? Number(maxSalary) : null,
      currency,
    };

    startTransition(async () => {
      const result = await updateUserPreference(input);
      if (result.success) {
        setFeedback({ type: "success", message: "Preferencias guardadas correctamente." });
      } else {
        setFeedback({ type: "error", message: (result as { success: false; error: string }).error });
      }
    });
  };

  return (
    <main className="min-h-[90vh] p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <PageHeader
            title="Mis Preferencias"
            description="Ajusta tu perfil profesional para recibir mejores recomendaciones."
          />

          {/* ── Perfil profesional ── */}
          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Perfil profesional</h2>
            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">País</Label>
                <Input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Ej: Perú" className="h-9 text-sm" />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">Nivel de experiencia</Label>
                <Select value={expLevel || "none"} onValueChange={(v) => setExpLevel(v === "none" ? "" : v)}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin definir</SelectItem>
                    {EXP_LEVELS.map((l) => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/*<div className="space-y-2">*/}
            {/*  <Label className="text-xs font-semibold text-muted-foreground">Roles preferidos <span className="font-normal text-muted-foreground/60">(separados por coma)</span></Label>*/}
            {/*  <Input value={preferredRoles} onChange={(e) => setPreferredRoles(e.target.value)} placeholder="Ej: Frontend Developer, Tech Lead" className="h-9 text-sm" />*/}
            {/*</div>*/}

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground">Áreas de interés</Label>
              <div className="flex flex-wrap gap-2">
                {AREA_OPTIONS.map((a) => (
                  <Badge
                    key={a.value}
                    variant={targetIndustries.includes(a.value) ? "default" : "outline"}
                    className="cursor-pointer text-xs px-3 py-1"
                    onClick={() => toggleArray(targetIndustries, a.value, setTargetIndustries)}
                  >
                    {a.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/*<div className="space-y-2">*/}
            {/*  <Label className="text-xs font-semibold text-muted-foreground">Habilidades</Label>*/}
            {/*  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">*/}
            {/*    {ALL_SKILLS.map((s) => (*/}
            {/*      <Badge*/}
            {/*        key={s.value}*/}
            {/*        variant={selectedSkills.includes(s.value) ? "default" : "outline"}*/}
            {/*        className="cursor-pointer text-xs px-2.5 py-1"*/}
            {/*        onClick={() => toggleArray(selectedSkills, s.value, setSelectedSkills)}*/}
            {/*      >*/}
            {/*        {s.label}*/}
            {/*      </Badge>*/}
            {/*    ))}*/}
            {/*  </div>*/}
            {/*  {selectedSkills.length > 0 && (*/}
            {/*    <p className="text-[10px] text-muted-foreground">{selectedSkills.length} seleccionadas</p>*/}
            {/*  )}*/}
            {/*</div>*/}

            {/*<div className="space-y-2">*/}
            {/*  <Label className="text-xs font-semibold text-muted-foreground">Portfolio URL</Label>*/}
            {/*  <Input value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} placeholder="https://..." className="h-9 text-sm" />*/}
            {/*</div>*/}
          </section>

          {/* ── Modalidad y disponibilidad ── */}
          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Modalidad y disponibilidad</h2>
            <Separator />

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground">Modalidad de trabajo</Label>
              <div className="flex flex-wrap gap-2">
                {WORK_MODALITIES.map((m) => (
                  <Badge
                    key={m.value}
                    variant={workModality.includes(m.value) ? "default" : "outline"}
                    className="cursor-pointer text-xs px-3 py-1"
                    onClick={() => toggleArray(workModality, m.value, setWorkModality)}
                  >
                    {m.label}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground">Disponibilidad</Label>
              <div className="flex flex-wrap gap-2">
                {AVAILABILITY_OPTIONS.map((a) => (
                  <Badge
                    key={a.value}
                    variant={availability.includes(a.value) ? "default" : "outline"}
                    className="cursor-pointer text-xs px-3 py-1"
                    onClick={() => toggleArray(availability, a.value, setAvailability)}
                  >
                    {a.label}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground">Tipos de oportunidad</Label>
              <div className="flex flex-wrap gap-2">
                {OPPORTUNITY_TYPES.map((o) => (
                  <Badge
                    key={o.value}
                    variant={opportunityTypes.includes(o.value) ? "default" : "outline"}
                    className="cursor-pointer text-xs px-3 py-1"
                    onClick={() => toggleArray(opportunityTypes, o.value, setOpportunityTypes)}
                  >
                    {o.label}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <span className="text-sm font-semibold">Dispuesto a reubicarse</span>
                <p className="text-xs text-muted-foreground">¿Consideras mudarte por una oportunidad?</p>
              </div>
              <Switch checked={relocation} onCheckedChange={setRelocation} />
            </div>
          </section>

          {/* ── Expectativa salarial ── */}
            {/*<section className="space-y-4">*/}
            {/*  <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Expectativa salarial</h2>*/}
            {/*  <Separator />*/}

            {/*  <div className="grid grid-cols-3 gap-3">*/}
            {/*    <div className="space-y-2">*/}
            {/*      <Label className="text-xs font-semibold text-muted-foreground">Mínimo</Label>*/}
            {/*      <Input type="number" value={minSalary} onChange={(e) => setMinSalary(e.target.value)} placeholder="0" className="h-9 text-sm" />*/}
            {/*    </div>*/}
            {/*    <div className="space-y-2">*/}
            {/*      <Label className="text-xs font-semibold text-muted-foreground">Máximo</Label>*/}
            {/*      <Input type="number" value={maxSalary} onChange={(e) => setMaxSalary(e.target.value)} placeholder="0" className="h-9 text-sm" />*/}
            {/*    </div>*/}
            {/*    <div className="space-y-2">*/}
            {/*      <Label className="text-xs font-semibold text-muted-foreground">Moneda</Label>*/}
            {/*      <Select value={currency} onValueChange={setCurrency}>*/}
            {/*        <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>*/}
            {/*        <SelectContent>*/}
            {/*          {CURRENCIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}*/}
            {/*        </SelectContent>*/}
            {/*      </Select>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*</section>*/}

          {/* ── Feedback + Save ── */}
          {feedback && (
            <div className={`flex items-center gap-2 text-sm rounded-lg px-3 py-2 ${feedback.type === "success" ? "bg-green-500/10 text-green-600" : "bg-destructive/10 text-destructive"}`}>
              {feedback.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              {feedback.message}
            </div>
          )}

          <Button onClick={handleSave} disabled={isPending} className="w-full h-10 font-semibold">
            {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Guardar preferencias
          </Button>
        </motion.div>
      </div>
    </main>
  );
}

