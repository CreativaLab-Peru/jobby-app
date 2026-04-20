import React from "react";

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type PartnerType = {
  icon: IconComponent;
  title: string;
  description: string;
  words?: string[];
};

export default function PartnerTypes({ partnerTypes }: { partnerTypes: PartnerType[] }) {
  return (
    <section className="section-padding bg-background">
      <div className="container-levely">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="headline-lg text-4xl">¿Para quién es Levely?</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Soluciones adaptadas a diferentes tipos de instituciones
          </p>
        </div>

        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
          {partnerTypes.map((type) => (
            <div
              key={type.title}
              className="group flex flex-col sm:flex-row items-start gap-6 p-6 sm:p-8 rounded-3xl border border-border/50 bg-card hover:border-levely-blue/30 hover:shadow-lg hover:shadow-levely-blue/5 transition-all duration-300 text-left"
            >
              <div className="w-16 h-16 shrink-0 rounded-2xl bg-levely-blue/10 dark:bg-levely-blue/20 flex items-center justify-center group-hover:bg-levely-blue/20 dark:group-hover:bg-levely-blue/30 transition-colors">
                <type.icon className="w-8 h-8 text-levely-blue" />
              </div>

              <div className="flex flex-col flex-1">
                <h3 className="text-xl font-bold mb-2 text-foreground">{type.title}</h3>
                <p className="text-muted-foreground mb-4">{type.description}</p>

                {type.words && type.words.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mt-auto">
                    {type.words.map((word, index) => (
                      <span
                        key={index}
                        className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border/50"
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
