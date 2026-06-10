interface ScoreRingProps {
  score: number; // 0–100
}

const CIRCUMFERENCE = 2 * Math.PI * 54; // r=54

function scoreColor(score: number): string {
  if (score >= 75) return "#c8f562";
  if (score >= 50) return "#f5d162";
  return "#f56262";
}

function scoreLabel(score: number): string {
  if (score >= 75) return "Competitivo";
  if (score >= 50) return "En desarrollo";
  if (score >= 30) return "Alto potencial";
  return "En construcción";
}

export function ScoreRing({ score }: ScoreRingProps) {
  const color = scoreColor(score);
  const dash = (score / 100) * CIRCUMFERENCE;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-36 h-36">
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full -rotate-90"
          aria-label={`Puntaje: ${score} de 100`}
        >
          {/* Track */}
          <circle
            cx="60" cy="60" r="54"
            fill="none"
            stroke="#1a2e29"
            strokeWidth="10"
          />
          {/* Progress */}
          <circle
            cx="60" cy="60" r="54"
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${CIRCUMFERENCE}`}
            style={{ transition: "stroke-dasharray 1s ease" }}
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-4xl font-bold tabular-nums"
            style={{ color }}
          >
            {score}
          </span>
          <span className="text-[#8a9e93] text-xs">/ 100</span>
        </div>
      </div>

      <span className="text-sm font-semibold" style={{ color }}>
        {scoreLabel(score)}
      </span>
    </div>
  );
}
