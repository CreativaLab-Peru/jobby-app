import React from "react";

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type TrustItem = {
  title: string;
  icon: IconComponent;
  description: string;
};

export default function TrustLevelyGrid({ TrustLevely }: { TrustLevely: TrustItem[] }) {
  return (
    <section className="section-padding bg-background">
      <div className="container-levely">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="headline-lg text-4xl text-foreground">
            ¿Por qué las instituciones eligen Levely?
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {TrustLevely.map((item, index) => (
            <div
              key={index}
              className="group flex flex-col p-8 rounded-3xl border border-border/50 bg-card hover:border-levely-blue/30 hover:shadow-lg hover:shadow-levely-blue/5 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-levely-blue/10 dark:bg-levely-blue/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-levely-blue/20 transition-all">
                <item.icon className="w-7 h-7 text-levely-blue" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
