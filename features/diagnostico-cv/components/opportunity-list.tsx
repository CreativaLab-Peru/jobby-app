import { MatchedOpportunity } from "../actions/get-diagnostic-result-action";

interface OpportunityListProps {
  opportunities: MatchedOpportunity[];
}

const TYPE_LABELS: Record<string, string> = {
  MASTER:    "Maestría",
  PHD:       "Doctorado",
  FELLOWSHIP: "Fellowship",
};

export function OpportunityList({ opportunities }: OpportunityListProps) {
  if (opportunities.length === 0) return null;

  // Sort by match descending
  const sorted = [...opportunities].sort(
    (a, b) => b.matchPercentage - a.matchPercentage
  );

  return (
    <section className="bg-[#0d1a17] border border-[rgba(255,255,255,.07)] rounded-2xl p-6">
      <h2 className="text-base font-semibold mb-5">
        Oportunidades que coinciden con tu perfil
      </h2>

      <div className="space-y-3">
        {sorted.map((opp) => (
          <a
            key={opp.id}
            href={opp.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 bg-[#111f1b] rounded-xl hover:bg-[#162820] transition-colors group"
          >
            {/* Flag */}
            <span className="text-2xl flex-shrink-0" aria-hidden="true">
              {opp.flag}
            </span>

            {/* Name + country */}
            <div className="flex-1 min-w-0">
              <p className="text-[#f4f0e6] font-medium text-sm truncate group-hover:text-[#c8f562] transition-colors">
                {opp.name}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[#8a9e93] text-xs">{opp.country}</span>
                <span className="text-[#2a3e39] text-xs">·</span>
                <span className="text-[#8a9e93] text-xs">
                  {TYPE_LABELS[opp.type] ?? opp.type}
                </span>
              </div>

              {/* Match bar */}
              <div className="mt-2 h-1 w-full bg-[#1a2e29] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#c8f562] rounded-full"
                  style={{ width: `${opp.matchPercentage}%` }}
                />
              </div>
            </div>

            {/* Percentage */}
            <div className="flex-shrink-0 text-right">
              <span className="text-[#c8f562] font-bold text-sm tabular-nums">
                {opp.matchPercentage}%
              </span>
              <p className="text-[#8a9e93] text-[10px] mt-0.5">match</p>
            </div>

            {/* Arrow */}
            <svg
              className="w-4 h-4 text-[#8a9e93] flex-shrink-0 group-hover:text-[#c8f562] transition-colors"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        ))}
      </div>
    </section>
  );
}
