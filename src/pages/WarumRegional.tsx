import Layout from "@/components/Layout";
import Placeholder from "@/components/Placeholder";

const TXT =
  "Unser Honig wird direkt in Hochkamp von unseren Bienen gesammelt – dabei fliegen sie die Blüten der umliegenden Gärten und Grünflächen an. Das bedeutet, dass in unserem Honig auch Pollen aus Ihrem eigenen Garten enthalten sein könnten – ein kleines Stück Ihrer Nachbarschaft im Glas.";

const blocks = [
  { title: "Kurze Wege, frischer Honig." },
  { title: "Bienenwohl an erster Stelle." },
  { title: "Vielfalt der Region bewahren." },
  { title: "Transparenz, von Wabe bis Glas." },
];

const WarumRegional = () => {
  return (
    <Layout>
      <section className="container-narrow py-12 md:py-20">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-xs uppercase tracking-[0.25em] text-primary font-medium">Unsere Werte</span>
          <h1 className="mt-4 text-4xl md:text-6xl">
            Warum <span className="italic text-primary">Regional?</span>
          </h1>
          <p className="mt-5 text-muted-foreground">{TXT.slice(0, 200)}</p>
        </div>

        <div className="space-y-24 md:space-y-32">
          {blocks.map((b, i) => {
            const reverse = i % 2 === 1;
            return (
              <div
                key={i}
                className={`grid gap-10 md:gap-16 md:grid-cols-2 items-center ${
                  reverse ? "md:[&>div:first-child]:order-2" : ""
                }`}
              >
                <div className="aspect-[4/3]">
                  <Placeholder />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-[0.25em] text-primary font-medium">0{i + 1} — Grund</span>
                  <h2 className="mt-3 text-3xl md:text-4xl">{b.title}</h2>
                  <p className="mt-5 text-muted-foreground leading-relaxed">{TXT}</p>
                  <p className="mt-4 text-muted-foreground leading-relaxed">{TXT.slice(0, 120)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </Layout>
  );
};

export default WarumRegional;
