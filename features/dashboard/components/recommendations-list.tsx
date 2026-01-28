"use client";

import { AlertCircle, Search } from "lucide-react";

interface Recommendation {
    id: string;
    sectionType: string;
    text: string;
    severity: string;
}

export function RecommendationsList({ recommendations }: { recommendations: Recommendation[] }) {
    return (
        <div className="bg-card border border-border rounded-2xl p-6 hover:border-levely-blue/30 dark:hover:border-levely-green/30 transition-colors shadow-sm">
            <div className="flex items-center gap-2 mb-6">
                <Search className="w-5 h-5 text-levely-blue dark:text-levely-green" />
                <h3 className="font-semibold uppercase tracking-wide text-sm text-levely-blue dark:text-levely-green">
                    Áreas de Crecimiento
                </h3>
            </div>
            <div className="space-y-4">
                {recommendations.length > 0 ? (
                    recommendations.map((rec) => (
                        <div
                            key={rec.id}
                            className="flex items-start gap-4 bg-muted/40 rounded-xl p-4"
                        >
                            <div
                                className={`flex items-center justify-center p-2 rounded-lg shadow-sm ${
                                    rec.severity === "high"
                                        ? "bg-red-100 text-red-600"
                                        : "bg-amber-100 text-amber-600"
                                }`}
                            >
                                <AlertCircle className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-xs uppercase tracking-widest mb-1 text-muted-foreground">
                                    {rec.sectionType}
                                </h4>
                                <p className="text-sm text-foreground">{rec.text}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground italic p-4 border border-dashed rounded-xl text-center">
                        Analiza un CV para recibir recomendaciones.
                    </p>
                )}
            </div>
        </div>
    );
}
