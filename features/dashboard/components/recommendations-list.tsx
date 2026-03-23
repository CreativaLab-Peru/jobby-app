"use client";

import {AlertCircle, Search} from "lucide-react";
import {Card} from "@/components/ui/card";
import {CvSectionType} from "@/features/cv/consts";

interface Recommendation {
  id: string;
  sectionType: string;
  text: string;
  severity: string;
}

export function RecommendationsList({recommendations}: { recommendations: Recommendation[] }) {
  return (
    <Card
      className="bg-card border-border/40 rounded-lg overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 p-5">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2.5 bg-primary/10 rounded-xl">
          <Search className="w-5 h-5 text-primary"/>
        </div>
        <h3 className="font-black text-sm text-primary">
          Áreas de Crecimiento
        </h3>
      </div>
      <div className="space-y-4">
        {recommendations.length > 0 ? (
          recommendations.map((rec) => (
            <div
              key={rec.id}
              className="flex items-start gap-4 rounded-xl p-4"
            >
              <div
                className={`flex items-center justify-center p-2 rounded-lg shadow-sm ${
                  rec.severity === "high"
                    ? "bg-red-200 text-red-600"
                    : "bg-amber-200 text-amber-600"
                }`}
              >
                <AlertCircle className="w-5 h-5"/>
              </div>
              <div className="flex-1">
                <h4
                  className="font-bold text-sm mb-1 text-primary">
                  {CvSectionType[rec.sectionType] || rec.sectionType}
                </h4>
                <p className="text-sm text-foreground">{rec.text}</p>
              </div>
            </div>
          ))
        ) : (
          <p
            className="text-sm text-muted-foreground italic p-4 border border-dashed rounded-xl text-center">
            Analiza un CV para recibir recomendaciones.
          </p>
        )}
      </div>
    </Card>
  );
}
