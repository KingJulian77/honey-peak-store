import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import Placeholder from "@/components/Placeholder";
import { Button } from "@/components/ui/button";

const PLACEHOLDER_TEXT =
  "ABBCCCABBCCCABBCCCABBCCCABBCCCABBCCCABBCCCABBCCCABBCCCABBCCCABBCCCABBCCCABBCCCABBCCCABBCCCABBCCCABBCCCABBCCCABBCCC.";

const HERO_IMAGE = "https://atdoofvtgsjahixpqtzn.supabase.co/storage/v1/object/public/bilder-startseite/PHOTO-2026-04-30-16-11-08.jpg";

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="container-narrow grid gap-12 md:grid-cols-2 md:gap-16 items-center py-12 md:py-20">
        <div className="aspect-[4/5] animate-fade-up rounded-2xl overflow-hidden">
          <img src={HERO_IMAGE} alt="Honig aus Hochkamp" className="w-full h-full object-cover" />
        </div>
        <div className="animate-fade-up [animation-delay:120ms]">
          <span className="text-xs uppercase tracking-[0.25em] text-primary font-medium">
            Honig aus Hochkamp
          </span>
          <h1 className="mt-4 text-4xl md:text-6xl leading-[1.05] text-foreground">
            Reiner Honig.<br />
            <span className="italic text-primary">Direkt aus den Gärten Hochkamps.</span>
          </h1>
          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-md leading-relaxed">
            {PLACEHOLDER_TEXT.slice(0, 220)}
          </p>
          <div className="mt-8">
            <Button asChild variant="honey" size="xl">
              <Link to="/unser-honig">Jetzt kaufen →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trennlinie */}
      <div className="container-narrow">
        <div className="h-px w-full bg-border my-8 md:my-16" />
      </div>

      {/* Produktbereich – alternierend */}
      <section className="container-narrow space-y-24 md:space-y-32 py-8">
        {[0, 1, 2].map((i) => {
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
                <span className="text-xs uppercase tracking-[0.25em] text-primary font-medium">
                  Kapitel 0{i + 1}
                </span>
                <h2 className="mt-3 text-3xl md:text-4xl">
                  {["Aus der Region.", "Mit Sorgfalt geerntet.", "Naturbelassen genießen."][i]}
                </h2>
                <p className="mt-5 text-muted-foreground leading-relaxed">
                  {PLACEHOLDER_TEXT}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* CTA Band */}
      <section className="mt-24 md:mt-32 bg-secondary/50 border-y border-border">
        <div className="container-narrow py-16 md:py-20 text-center">
          <h2 className="text-3xl md:text-5xl">
            Ein Glas, eine <span className="italic text-primary">Geschichte.</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            {PLACEHOLDER_TEXT.slice(0, 160)}
          </p>
          <Button asChild variant="honey" size="xl" className="mt-8">
            <Link to="/unser-honig">Jetzt kaufen →</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
