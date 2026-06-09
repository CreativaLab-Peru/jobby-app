"use client";

interface DiagnosticoResultsProps {
  overallScore: number;
  profileType: string;
  profileDescription: string;
  recommendations: Array<{
    area: string;
    suggestion: string;
    priority: string;
  }>;
  opportunities: Array<{
    id: string;
    name: string;
    country: string;
    flag: string;
    type: string;
    url: string;
    matchPercentage: number;
  }>;
}

export function DiagnosticoResults({
  overallScore,
  profileType,
  profileDescription,
  recommendations,
  opportunities,
}: DiagnosticoResultsProps) {
  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Competitivo";
    if (score >= 60) return "En desarrollo";
    if (score >= 40) return "Alto potencial";
    return "En construccion";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#c8f562";
    if (score >= 60) return "#a8d444";
    if (score >= 40) return "#e8ff9a";
    return "#8a9e93";
  };

  return (
    <div className="min-h-screen bg-[#080f0d] text-[#f4f0e6] font-sans">
<div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
            Tu diagnostico esta listo
          </h2>
          <p className="text-[#8a9e93]">
            Aqui estan los resultados del analisis de tu CV
          </p>
        </div>

        {/* Score Ring */}
        <div className="flex flex-col items-center mb-12">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="#111f1b"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke={getScoreColor(overallScore)}
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${(overallScore / 100) * 440} 440`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold" style={{ color: getScoreColor(overallScore) }}>
                {overallScore}
              </span>
              <span className="text-[#8a9e93] text-sm">/ 100</span>
            </div>
          </div>
          <div className="mt-4 text-center">
            <span className="text-lg font-medium" style={{ color: getScoreColor(overallScore) }}>
              {getScoreLabel(overallScore)}
            </span>
          </div>
        </div>

        {/* Profile Type */}
        <div className="bg-[#0d1a17] border border-[rgba(255,255,255,.08)] rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-[#c8f562]/20 text-[#c8f562] rounded-full text-sm font-medium">
              Tu Perfil
            </span>
          </div>
          <h3 className="text-xl font-serif font-bold mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
            {profileType}
          </h3>
          <p className="text-[#8a9e93]">{profileDescription}</p>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="bg-[#0d1a17] border border-[rgba(255,255,255,.08)] rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-bold mb-4">Areas de mejora</h3>
            <div className="space-y-4">
              {recommendations.slice(0, 3).map((rec, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    rec.priority === "HIGH" ? "bg-red-500" :
                    rec.priority === "MEDIUM" ? "bg-yellow-500" : "bg-[#8a9e93]"
                  }`} />
                  <div>
                    <p className="font-medium text-sm">{rec.area}</p>
                    <p className="text-[#8a9e93] text-sm">{rec.suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Opportunities */}
        {opportunities.length > 0 && (
          <div className="bg-[#0d1a17] border border-[rgba(255,255,255,.08)] rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-bold mb-4">Oportunidades que matchearon</h3>
            <div className="space-y-3">
              {opportunities.slice(0, 5).map((opp, index) => (
                <a
                  key={index}
                  href={opp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-[#111f1b] rounded-xl hover:bg-[#111f1b]/80 transition-colors"
                >
                  <span className="text-xl">{opp.flag}</span>
                  <div className="flex-1">
                    <p className="font-medium">{opp.name}</p>
                    <p className="text-[#8a9e93] text-sm">{opp.country}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[#c8f562] font-bold">{opp.matchPercentage}%</span>
                    <p className="text-[#8a9e93] text-xs">match</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Email Confirmation */}
        <div className="bg-[#c8f562]/10 border border-[#c8f562]/20 rounded-2xl p-6 text-center">
          <svg className="w-8 h-8 text-[#c8f562] mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p className="text-[#f4f0e6] font-medium mb-1">Resultados enviados por email</p>
          <p className="text-[#8a9e93] text-sm">
            Revisa tu correo para ver el diagnostico completo
          </p>
        </div>
      </div>
    </div>
  );
}
