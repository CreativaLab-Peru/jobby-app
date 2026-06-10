import { Recommendation } from "../actions/get-diagnostic-result-action";

interface RecommendationListProps {
  recommendations: Recommendation[];
}

const PRIORITY_CONFIG = {
  HIGH:   { label: "Alta",  dot: "bg-red-500",    pill: "bg-red-500/10 text-red-400"    },
  MEDIUM: { label: "Media", dot: "bg-yellow-500",  pill: "bg-yellow-500/10 text-yellow-400" },
  LOW:    { label: "Baja",  dot: "bg-[#8a9e93]",   pill: "bg-[#1a2e29] text-[#8a9e93]"  },
} as const;

export function RecommendationList({ recommendations }: RecommendationListProps) {
  if (recommendations.length === 0) return null;

  return (
    <section className="bg-[#0d1a17] border border-[rgba(255,255,255,.07)] rounded-2xl p-6">
      <h2 className="text-base font-semibold mb-5">Áreas de mejora</h2>

      <div className="space-y-5">
        {recommendations.map((rec, i) => {
          const cfg = PRIORITY_CONFIG[rec.priority] ?? PRIORITY_CONFIG.MEDIUM;
          return (
            <div key={i} className="flex items-start gap-3">
              {/* Priority dot */}
              <div className={`w-2 h-2 rounded-full mt-[6px] flex-shrink-0 ${cfg.dot}`} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[#f4f0e6] text-sm font-medium">{rec.area}</span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${cfg.pill}`}>
                    {cfg.label}
                  </span>
                </div>
                <p className="text-[#8a9e93] text-sm leading-relaxed">{rec.suggestion}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
