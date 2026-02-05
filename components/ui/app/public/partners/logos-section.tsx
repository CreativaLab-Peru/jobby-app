const partnerLogos = [
  // { name: "AIESEC", light: "/partners/AIESEC-light.png", dark: "/partners/AIESEC-dark.png" },
  { name: "Universidad Continental", light: "/partners/Continental-light.png", dark: "/partners/Continental-dark.png" },
  { name: "Mujeres Digitales", light: "/partners/MujeresDigitales-light.png", dark: "/partners/MujeresDigitales-dark.png" },
  { name: "Data Science Perú", light: "/partners/data_science-light.png", dark: "/partners/data_science-dark.png" },
];

export function LogosSection() {
  return (
    <section className="py-16 bg-background">
            <div className="container-levely">
              <p className="text-2xl text-center font-medium text-muted-foreground mb-10">
                Instituciones que ya confían en Levely
              </p>
                <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-14">
                {partnerLogos.map((partner) => (
                  <div key={partner.name} className="group flex items-center justify-center">
                    <div className="w-36 h-20 sm:w-65 sm:h-30 rounded-xl bg-transparent borde flex items-center justify-center group-hover:border-levely-blue/30 group-hover:shadow-md transition-all duration-300 p-2">
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
          </section>
  );
}
