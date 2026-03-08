"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OpportunityType } from "@prisma/client";
import { Label } from "@/components/ui/label"; // Asegúrate de tener este componente

interface AdminCreateOpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (opportunityId: string) => void;
}

const formSchema = z.object({
  description: z.string().min(1, "Description is required"),
  company: z.string().min(1, "Company is required"),
  requirements: z.string().min(1, "Requirements are required"),
  linkUrl: z.string().url("Invalid URL"),
  location: z.string().optional(),
  modality: z.string().optional(),
  salary: z.string().optional(),
  benefits: z.string().optional(),
  type: z.nativeEnum(OpportunityType),
  cvId: z.string().min(1, "CV ID is required"),
});

type FormValues = z.infer<typeof formSchema>;

export function AdminCreateOpportunityModal({
                                              isOpen,
                                              onClose,
                                              onCreated,
                                            }: AdminCreateOpportunityModalProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      company: "",
      requirements: "",
      linkUrl: "",
      location: "",
      modality: "",
      salary: "",
      benefits: "",
      type: "EMPLOYMENT",
      cvId: "",
    },
  });

  // Suscribirse al valor de 'type' para el Select
  const typeValue = watch("type");

  const onSubmit = async (values: FormValues) => {
    try {
      const response = await fetch("/api/admin/opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error("Failed to create");

      const data = await response.json();
      toast.success("Opportunity created successfully");
      reset();
      onCreated(data.id);
      router.refresh();
    } catch (error) {
      toast.error("An error occurred while creating the opportunity.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Opportunity</DialogTitle>
          <DialogDescription>
            Fill in the form below to create a new opportunity.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          {/* Company */}
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input id="company" {...register("company")} placeholder="Company name" />
            {errors.company && <p className="text-xs text-destructive">{errors.company.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} placeholder="Job description" />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          {/* Requirements */}
          <div className="space-y-2">
            <Label htmlFor="requirements">Requirements</Label>
            <Textarea id="requirements" {...register("requirements")} placeholder="Job requirements" />
            {errors.requirements && <p className="text-xs text-destructive">{errors.requirements.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" {...register("location")} placeholder="e.g. Remote" />
            </div>
            {/* Modality */}
            <div className="space-y-2">
              <Label htmlFor="modality">Modality</Label>
              <Input id="modality" {...register("modality")} placeholder="Hybrid/On-site" />
            </div>
          </div>

          {/* Link URL */}
          <div className="space-y-2">
            <Label htmlFor="linkUrl">Link URL</Label>
            <Input id="linkUrl" {...register("linkUrl")} placeholder="https://..." />
            {errors.linkUrl && <p className="text-xs text-destructive">{errors.linkUrl.message}</p>}
          </div>

          {/* Opportunity Type (Select especial) */}
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              onValueChange={(value) => setValue("type", value as OpportunityType)}
              value={typeValue}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(OpportunityType).map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* CV ID */}
          <div className="space-y-2">
            <Label htmlFor="cvId">CV ID</Label>
            <Input id="cvId" {...register("cvId")} placeholder="Associate CV ID" />
            {errors.cvId && <p className="text-xs text-destructive">{errors.cvId.message}</p>}
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
