"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { uploadCompanyLogoAction } from "../../actions/upload-company-logo.action";
import { cn } from "@/lib/utils";

interface LogoUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export function LogoUpload({ value, onChange }: LogoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadCompanyLogoAction(formData);
      if (res.error) {
        toast.error(res.error);
      } else if (res.url) {
        onChange(res.url);
        toast.success("Logo subido correctamente");
      }
    } catch (error) {
      toast.error("Error al subir el logo");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <div
        onClick={() => !value && inputRef.current?.click()}
        className={cn(
          "relative h-32 w-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden",
          value.length > 0
            ? "border-primary"
            : "border-border/60 hover:border-primary/50 cursor-pointer bg-card/50",
        )}
      >
        {isUploading ? (
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        ) : value.length > 0 ? (
          <>
            <img src={value} alt="Logo Preview" className="h-full w-full object-contain p-2" />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                variant="destructive"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange("");
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <>
            <ImageIcon className="h-8 w-8 text-muted-foreground mb-1" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Logo
            </span>
          </>
        )}
      </div>
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
}
