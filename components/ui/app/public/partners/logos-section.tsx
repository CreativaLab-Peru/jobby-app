const partnerLogos = [
  { name: "AIESEC", light: "/partners/AIESEC-light.png", dark: "/partners/AIESEC-dark.png" },
  {
    name: "Universidad Continental",
    light: "/partners/Continental-light.png",
    dark: "/partners/Continental-dark.png",
  },
  {
    name: "PROinnóvate",
    light: "/partners/PROINNOVATE-light.png",
    dark: "/partners/PROINNOVATE-dark.png",
  },
  {
    name: "Mujeres Digitales",
    light: "/partners/MujeresDigitales-light.png",
    dark: "/partners/MujeresDigitales-dark.png",
  },
  {
    name: "STARTUP PERÚ",
    light: "/partners/STARTUP-light.png",
    dark: "/partners/STARTUP-dark.png",
  },
  {
    name: "Data Science Perú",
    light: "/partners/data_science-light.png",
    dark: "/partners/data_science-dark.png",
  },
  {
    name: "Ministerio de la Producción",
    light: "/partners/MINISTERIO-light.png",
    dark: "/partners/MINISTERIO-dark.png",
  },
];

export function LogosSection() {
  const carouselLogos = [...partnerLogos, ...partnerLogos];

  return (
    <section className="py-16 bg-background">
      <div className="container-levely">
        <p className="text-2xl text-center font-medium text-muted-foreground mb-10">
          Instituciones que ya confían en Levely
        </p>
        <div className="overflow-hidden">
          <div
            className="flex items-center gap-8 lg:gap-14 w-max"
            style={{ animation: "logos-carousel 24s linear infinite" }}
          >
            {carouselLogos.map((partner, index) => (
              <div
                key={`${partner.name}-${index}`}
                className="group flex items-center justify-center shrink-0"
              >
                <div className="w-36 h-20 sm:w-65 sm:h-30 rounded-xl bg-transparent borde flex items-center justify-center transition-all duration-300 p-2">
                  {/* Logo para modo claro */}
                  <img
                    src={partner.light}
                    alt={partner.name}
                    width={220}
                    height={90}
                    className="object-contain w-full h-full dark:hidden"
                  />
                  {/* Logo para modo oscuro */}
                  <img
                    src={partner.dark}
                    alt={partner.name}
                    width={220}
                    height={90}
                    className="object-contain w-full h-full hidden dark:block"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes logos-carousel {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
