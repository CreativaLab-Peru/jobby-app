"use client";

import { useState } from "react";
import { useCompanyOnboardingStore } from "../../store/company-onboarding-store";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CompanyRole } from "@prisma/client";
import { Plus, X, UserPlus, Users2, ShieldCheck, UserCog, User } from "lucide-react";
import { cn } from "@/lib/utils";

const ROLE_ICONS = {
  [CompanyRole.ENCARGADO]: ShieldCheck,
  [CompanyRole.SUB_ENCARGADO]: UserCog,
  [CompanyRole.MIEMBRO]: User,
  [CompanyRole.ADMIN]: ShieldCheck,
};

const ROLE_LABELS = {
  [CompanyRole.ENCARGADO]: "Encargado",
  [CompanyRole.SUB_ENCARGADO]: "Subencargado",
  [CompanyRole.MIEMBRO]: "Miembro",
  [CompanyRole.ADMIN]: "Admin",
};

export function StepTeam() {
  const { formData, updateFormData } = useCompanyOnboardingStore();
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<CompanyRole>(CompanyRole.MIEMBRO);
  const [category, setCategory] = useState<"students" | "generalMembers">("students");

  const addMember = () => {
    if (!newEmail || !newEmail.includes("@")) return;

    const currentList = formData[category];
    if (currentList.some((m) => m.email === newEmail)) return;

    updateFormData({
      [category]: [...currentList, { email: newEmail, role: newRole }],
    });
    setNewEmail("");
  };

  const removeMember = (cat: "students" | "generalMembers", email: string) => {
    updateFormData({
      [cat]: formData[cat].filter((m) => m.email !== email),
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Estructura de Equipo</h2>
        <p className="text-muted-foreground">Define quiénes te acompañarán en la gestión.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-10">
        {/* Panel de Invitación */}
        <Card className="p-8 space-y-6 border-border/60 bg-card/50 rounded-[2rem] shadow-xl h-fit sticky top-24">
          <div className="space-y-4">
            <div className="flex gap-2 p-1 bg-muted/50 rounded-xl">
              <Button
                variant={category === "students" ? "secondary" : "ghost"}
                className="flex-1 rounded-lg font-bold"
                onClick={() => setCategory("students")}
              >
                <Users2 className="mr-2 h-4 w-4" /> Estudiantes
              </Button>
              <Button
                variant={category === "generalMembers" ? "secondary" : "ghost"}
                className="flex-1 rounded-lg font-bold"
                onClick={() => setCategory("generalMembers")}
              >
                <UserPlus className="mr-2 h-4 w-4" /> General
              </Button>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Email
              </Label>
              <Input
                placeholder="colaborador@empresa.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Rol Asignado
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {[CompanyRole.ENCARGADO, CompanyRole.SUB_ENCARGADO, CompanyRole.MIEMBRO].map(
                  (role) => (
                    <Button
                      key={role}
                      type="button"
                      variant={newRole === role ? "secondary" : "outline"}
                      className={cn(
                        "h-14 flex-col gap-1 rounded-xl transition-all",
                        newRole === role
                          ? "ring-2 ring-primary/20 border-primary"
                          : "border-border/60",
                      )}
                      onClick={() => setNewRole(role)}
                    >
                      <span className="text-[10px] font-bold uppercase">{ROLE_LABELS[role]}</span>
                    </Button>
                  ),
                )}
              </div>
            </div>

            <Button
              className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20"
              onClick={addMember}
              disabled={!newEmail || !newEmail.includes("@")}
            >
              <Plus className="mr-2 h-4 w-4 stroke-[3px]" /> Agregar Invitado
            </Button>
          </div>
        </Card>

        {/* Listado de Miembros */}
        <div className="space-y-8">
          {["students", "generalMembers"].map((cat) => {
            const list = formData[cat as "students" | "generalMembers"];
            const isStudents = cat === "students";

            return (
              <div key={cat} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    {isStudents ? (
                      <Users2 className="h-5 w-5 text-blue-500" />
                    ) : (
                      <UserPlus className="h-5 w-5 text-emerald-500" />
                    )}
                    {isStudents ? "Invitados para Estudiantes" : "Miembros General"}
                    <span className="ml-2 text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                      {list.length}
                    </span>
                  </h3>
                </div>

                {list.length === 0 ? (
                  <div className="p-10 border-2 border-dashed border-border/60 rounded-[2rem] text-center bg-muted/10">
                    <p className="text-muted-foreground text-sm italic">
                      Aún no has agregado invitados en esta categoría.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {list.map((member) => {
                      const Icon = ROLE_ICONS[member.role];
                      return (
                        <Card
                          key={member.email}
                          className="p-4 flex items-center justify-between border-border/40 bg-card hover:shadow-md transition-shadow rounded-2xl group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center">
                              <Icon className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-bold text-sm leading-none mb-1">{member.email}</p>
                              <p className="text-[10px] uppercase font-bold text-primary tracking-widest">
                                {ROLE_LABELS[member.role]}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() =>
                              removeMember(cat as "students" | "generalMembers", member.email)
                            }
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
