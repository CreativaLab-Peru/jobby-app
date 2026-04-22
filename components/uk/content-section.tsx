"use client";

import React from 'react';
import {
  Library,
  GraduationCap,
  MapPin,
  Building2,
  PlusCircle,
  Database,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Sparkles
} from 'lucide-react';

const universityPrograms = [
  { name: 'Oxford', school: 'Saïd Business School', icon: <Library size={32} />, highlight: false },
  { name: 'LSE', school: 'London School of Economics', icon: <GraduationCap size={32} />, highlight: true },
  { name: 'Leeds', school: 'University of Leeds', icon: <Building2 size={32} />, highlight: true },
  { name: 'Edimburgo', school: 'University of Edinburgh', icon: <MapPin size={32} />, highlight: true },
  { name: 'Manchester', school: 'Alliance MBS', icon: <Building2 size={32} />, highlight: false },
  { name: '+ 5 más', school: 'Bristol, Warwick, UCL...', icon: <PlusCircle size={32} />, highlight: false },
];

const notionFeatures = [
  {
    icon: <Database size={24} />,
    title: 'Base de datos completa de becas UK',
    text: 'Chevening, Commonwealth, Gates Cambridge y más — con fechas de apertura, cierre, montos y requisitos.',
    active: false,
  },
  {
    icon: <GraduationCap size={24} />,
    title: 'Programas de 10+ universidades',
    text: 'Rankings, costos, requisitos y enlaces directos a cada programa en negocios, innovación y emprendimiento.',
    active: false,
  },
  {
    icon: <CheckCircle2 size={24} />,
    title: 'Checklist de aplicación paso a paso',
    text: 'Documentos, plazos y orden correcto — para que no se te pase nada antes del cierre.',
    active: false,
  },
  {
    icon: <AlertTriangle size={24} />,
    title: 'Errores que eliminan candidatos',
    text: 'Lo que aprendí leyendo rechazos reales — y cómo evitarlos en tu aplicación.',
    active: false,
  },
  {
    icon: <Mail size={24} />,
    title: 'BONO · Ensayos ganadores reales',
    tag: 'Solo hoy',
    text: 'Mis cartas de motivación que me hicieron entrar a LSE, Leeds y Edimburgo — con comentarios de por qué cada párrafo funciona.',
    active: true,
  },
];

const ContentSection: React.FC = () => {
  return (
    <section className="py-20 px-4 bg-background">
      {/* Grid de Universidades */}
      <div className="max-w-5xl mx-auto mb-32">
        <h2 className="text-4xl font-extrabold text-center mb-4 text-foreground tracking-tight">
          Programas dentro de la guía
        </h2>
        <p className="text-muted-foreground text-center mb-16 text-lg">
          Con requisitos, fechas y enlaces directos a cada beca.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {universityPrograms.map((univ) => (
            <div
              key={univ.name}
              className={`relative bg-card p-10 rounded-[2.5rem] border transition-all duration-500 ${
                univ.highlight
                  ? 'border-primary shadow-xl shadow-primary/5 ring-1 ring-primary/20'
                  : 'border-border hover:border-primary/30'
              } flex flex-col items-center text-center group hover:-translate-y-2`}
            >
              {univ.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest flex items-center gap-1 shadow-lg">
                  <Sparkles size={10} /> Ensayo ganador
                </div>
              )}
              <div className={`mb-6 transition-colors duration-300 ${univ.highlight ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`}>
                {univ.icon}
              </div>
              <h3 className="font-bold text-foreground text-xl tracking-tight">{univ.name}</h3>
              <p className="text-xs text-muted-foreground mt-2 font-medium">{univ.school}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Lista de Contenido Notion */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-16 text-foreground">
          Todo lo que incluye el Notion
        </h2>
        <div className="bg-card border border-border rounded-[3rem] p-4 md:p-6 shadow-2xl shadow-black/5 relative overflow-hidden">
          {/* Decoración de fondo sutil */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

          <ul className="space-y-4">
            {notionFeatures.map((feat, idx) => (
              <li
                key={idx}
                className={`flex gap-6 p-6 rounded-[2rem] transition-all duration-300 items-start ${
                  feat.active
                    ? 'bg-zinc-800 text-white shadow-xl scale-[1.02] ring-1 ring-white/10'
                    : 'hover:bg-secondary/50 group'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 border border-border/50 shadow-inner ${
                  feat.active
                    ? 'bg-white/10 text-primary-foreground'
                    : 'bg-secondary group-hover:bg-primary/10 group-hover:text-primary'
                }`}>
                  {feat.icon}
                </div>
                <div className="flex-grow pt-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h4 className={`font-bold text-xl leading-tight tracking-tight ${
                      feat.active ? 'text-white' : 'text-card-foreground'
                    }`}>
                      {feat.title}
                    </h4>
                    {feat.tag && (
                      <span className="bg-destructive text-destructive-foreground text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter border border-white/20">
                        {feat.tag}
                      </span>
                    )}
                  </div>
                  <p className={`leading-relaxed text-[15px] ${
                    feat.active ? 'text-zinc-300' : 'text-muted-foreground'
                  }`}>
                    {feat.text}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ContentSection;
