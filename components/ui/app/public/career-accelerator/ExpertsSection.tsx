"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Sparkles,
  Briefcase,
  Brain,
  Code,
  Palette,
  Rocket,
  GraduationCap
} from "lucide-react";

const categories = [
  { id: "all", label: "Todos", icon: Briefcase },
  { id: "career", label: "Career", icon: Briefcase },
  { id: "data-ai", label: "Data & AI", icon: Brain },
  { id: "software", label: "Software", icon: Code },
  { id: "design", label: "Product & Design", icon: Palette },
  { id: "startups", label: "Startups", icon: Rocket },
  { id: "scholarships", label: "Scholarships", icon: GraduationCap },
];

const mentors = [
  {
    id: 1,
    name: "María García",
    role: "Head of Talent",
    company: "Google",
    location: "Madrid, España",
    focus: "Desarrollo de carrera en tech y estrategias de búsqueda de empleo",
    skills: ["Career Planning", "Tech Hiring", "Interview Prep"],
    matchScore: 95,
    category: "career",
    initials: "MG",
  },
  {
    id: 2,
    name: "Carlos Mendoza",
    role: "Senior Data Scientist",
    company: "Meta",
    location: "Ciudad de México",
    focus: "Machine Learning aplicado y transición a roles de Data Science",
    skills: ["Python", "ML/AI", "Data Analytics"],
    matchScore: 92,
    category: "data-ai",
    initials: "CM",
  },
  {
    id: 3,
    name: "Ana Rodríguez",
    role: "Staff Engineer",
    company: "Stripe",
    location: "San Francisco, USA",
    focus: "Desarrollo de software y preparación para entrevistas técnicas",
    skills: ["System Design", "Algorithms", "Backend"],
    matchScore: 88,
    category: "software",
    initials: "AR",
  },
  {
    id: 4,
    name: "Diego Fernández",
    role: "Product Design Lead",
    company: "Figma",
    location: "Lima, Perú",
    focus: "UX/UI y construcción de portfolio para diseñadores",
    skills: ["UX Design", "Figma", "Design Systems"],
    matchScore: 91,
    category: "design",
    initials: "DF",
  },
  {
    id: 5,
    name: "Laura Sánchez",
    role: "Founder & CEO",
    company: "TechStartup",
    location: "Buenos Aires, Argentina",
    focus: "Emprendimiento tecnológico y fundraising para startups",
    skills: ["Startups", "Fundraising", "Leadership"],
    matchScore: 87,
    category: "startups",
    initials: "LS",
  },
  {
    id: 6,
    name: "Roberto Vásquez",
    role: "Scholarship Advisor",
    company: "Fulbright",
    location: "Washington D.C., USA",
    focus: "Becas internacionales y aplicaciones a programas de postgrado",
    skills: ["Fulbright", "MBA Apps", "Essay Review"],
    matchScore: 94,
    category: "scholarships",
    initials: "RV",
  },
  {
    id: 7,
    name: "Sofía Torres",
    role: "Engineering Manager",
    company: "Spotify",
    location: "Barcelona, España",
    focus: "Liderazgo técnico y crecimiento en engineering management",
    skills: ["Leadership", "Agile", "Team Building"],
    matchScore: 89,
    category: "software",
    initials: "ST",
  },
  {
    id: 8,
    name: "Andrés Herrera",
    role: "AI Research Scientist",
    company: "OpenAI",
    location: "San Francisco, USA",
    focus: "Investigación en IA y transición a roles de research",
    skills: ["Deep Learning", "NLP", "Research"],
    matchScore: 96,
    category: "data-ai",
    initials: "AH",
  },
];

export function ExpertsSection() {
  const [activeCategory, setActiveCategory] = useState("all");
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredMentors = activeCategory === "all" 
    ? mentors 
    : mentors.filter(mentor => mentor.category === activeCategory);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 340;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="p-10 md:p-20 md:px-40 lg:px-80 section-padding bg-secondary dark:bg-[#19282D]">
      <div className="container-levely">
      {/* Header */}
      <div className="text-3xl md:text-5xl text-center max-w-xl md:max-w-2xl mx-auto mb-6 md:mb-10">
        <h2 className="headline-lg mb-4">Nuestra red de expertos</h2>
        <p className="text-base md:text-lg text-muted-foreground">
        Conecta con mentores de las mejores empresas y universidades del mundo
        </p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-6 md:mb-10">
        {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => setActiveCategory(category.id)}
          className={`
          inline-flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-full text-sm font-medium transition-all
          ${activeCategory === category.id 
            ? "bg-coral text-white shadow-lg shadow-coral/20" 
            : "bg-card hover:bg-card/80 text-muted-foreground hover:text-foreground border border-border/50"
          }
          `}
        >
          <category.icon className="w-4 h-4" />
          {category.label}
        </button>
        ))}
      </div>

      {/* Mentor cards carousel */}
      <div className="relative">
        {/* Navigation buttons */}
        <button
        onClick={() => scroll("left")}
        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-card border border-border/50 shadow-lg items-center justify-center hover:bg-card/80 transition-colors"
        >
        <ChevronLeft className="w-5 h-5" />
        </button>
        <button
        onClick={() => scroll("right")}
        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-card border border-border/50 shadow-lg items-center justify-center hover:bg-card/80 transition-colors"
        >
        <ChevronRight className="w-5 h-5" />
        </button>

        {/* Scrollable container */}
        <div 
        ref={scrollRef}
        className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory px-4 sm:px-6 md:px-10 lg:px-16"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
        {filteredMentors.map((mentor) => (
          <div
          key={mentor.id}
          className="flex-shrink-0 w-[260px] sm:w-[300px] md:w-[320px] snap-start bg-card rounded-2xl border border-border/50 p-4 sm:p-6 hover:border-coral/30 hover:shadow-lg transition-all duration-300"
          >
          {/* AI Match badge */}
          <div className="flex justify-end mb-4">
            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-gradient-to-r from-purple-500/10 to-coral/10 border border-purple-500/20">
            <Sparkles className="w-3 h-3 text-purple-500" />
            <span className="text-xs font-semibold text-purple-500">{mentor.matchScore}% Match</span>
            </div>
          </div>

          {/* Profile */}
          <div className="flex items-start gap-3 sm:gap-4 mb-4">
            <Avatar className="w-12 h-12 sm:w-14 sm:h-14 border-2 border-coral/20">
            <AvatarFallback className="bg-gradient-to-br from-red-500 to-purple-500 text-white font-bold">
              {mentor.initials}
            </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base sm:text-lg truncate">{mentor.name}</h3>
            <p className="text-sm text-muted-foreground truncate">{mentor.role}</p>
            <p className="text-sm font-medium text-red-400">{mentor.company}</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <MapPin className="w-4 h-4" />
            <span>{mentor.location}</span>
          </div>

          {/* Focus */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {mentor.focus}
          </p>

          {/* Skills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {mentor.skills.map((skill) => (
            <Badge 
              key={skill} 
              variant="secondary"
              className="text-xs bg-secondary dark:bg-white/10 hover:bg-secondary"
            >
              {skill}
            </Badge>
            ))}
          </div>
          </div>
        ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 md:mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div className="text-center">
        <p className="text-2xl md:text-3xl font-bold text-red-500">+20</p>
        <p className="text-xs md:text-sm text-muted-foreground">Mentores activos</p>
        </div>
        <div className="text-center">
        <p className="text-2xl md:text-3xl font-bold text-red-500">15+</p>
        <p className="text-xs md:text-sm text-muted-foreground">Países representados</p>
        </div>
        <div className="text-center">
        <p className="text-2xl md:text-3xl font-bold text-red-500">50+</p>
        <p className="text-xs md:text-sm text-muted-foreground">Empresas top</p>
        </div>
        <div className="text-center">
        <p className="text-2xl md:text-3xl font-bold text-red-500">95%</p>
        <p className="text-xs md:text-sm text-muted-foreground">Satisfacción</p>
        </div>
      </div>
      </div>
    </section>
  );
}