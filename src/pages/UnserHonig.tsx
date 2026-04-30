import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import Placeholder from "@/components/Placeholder";
import { Button } from "@/components/ui/button";

const TXT = "";

const UnserHonig = () => {
  return (
    <Layout>
      <section className="container-narrow py-12 md:py-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-primary font-medium">
            Unser Produkt
          </span>
          <h1 className="mt-4 text-4xl md:text-6xl">Unser Honig</h1>
          <p className="mt-5 text-muted-foreground">{TXT.slice(0, 180)}</p>
        </div>

        <div className="grid gap-12 md:grid-cols-2 items-center">
          <div className="aspect-square">
            <Placeholder />
          </div>
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-primary font-medium">
              Sortenrein · 500g
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl">
              Hochkamp-<span className="italic">Honig</span>
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">{TXT}</p>
            <p className="mt-4 text-muted-foreground leading-relaxed">{TXT.slice(0, 140)}</p>

            <div className="mt-8 flex items-center gap-6">
              <span className="text-3xl font-serif text-foreground">12,90 €</span>
              <Button variant="honey" size="xl" asChild><Link to="/bestellen">Jetzt kaufen →</Link></Button>
            </div>
          </div>
        </div>

        {/* Detail-Bereich */}
        <div className="mt-24 grid gap-10 md:grid-cols-3">
          {["Herkunft", "Geschmack", "Versand"].map((title) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-card p-8 shadow-card hover:shadow-soft transition-shadow"
            >
              <h3 className="text-2xl mb-3">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{TXT.slice(0, 140)}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default UnserHonig;
