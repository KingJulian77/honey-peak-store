import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import Placeholder from "@/components/Placeholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

const TXT = "";

const UnserHonig = () => {
  const [stock, setStock] = useState<number | null>(null);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistMsg, setWaitlistMsg] = useState("");
  const [waitlistError, setWaitlistError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchStock = async () => {
      const { data } = await supabase
        .from("inventory")
        .select("stock")
        .eq("product_name", "honig")
        .single();
      if (data) setStock(data.stock);
    };
    fetchStock();
  }, []);

  const isSoldOut = stock !== null && stock <= 0;

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    setWaitlistMsg("");
    setWaitlistError("");

    if (!waitlistEmail.trim()) return;

    setSubmitting(true);
    const { error } = await supabase
      .from("waitlist")
      .insert({ email: waitlistEmail.trim().toLowerCase() });

    setSubmitting(false);

    if (error) {
      if (error.code === "23505") {
        setWaitlistError("Diese E-Mail-Adresse ist bereits eingetragen.");
      } else {
        setWaitlistError("Es ist ein Fehler aufgetreten. Bitte versuche es erneut.");
      }
      return;
    }
    setWaitlistMsg("Super! Wir melden uns, sobald unser Honig wieder verfügbar ist. 🍯");
    setWaitlistEmail("");
  };

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
              {isSoldOut ? (
                <Button variant="honey" size="xl" disabled className="opacity-60 cursor-not-allowed">
                  Ausverkauft
                </Button>
              ) : (
                <Button variant="honey" size="xl" asChild>
                  <Link to="/bestellen">Jetzt kaufen →</Link>
                </Button>
              )}
            </div>

            {isSoldOut && (
              <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-5">
                {waitlistMsg ? (
                  <p className="text-sm text-foreground font-medium">{waitlistMsg}</p>
                ) : (
                  <>
                    <p className="text-sm text-foreground mb-3">
                      Unser Honig ist gerade ausverkauft. Gib deine E-Mail-Adresse an und wir
                      benachrichtigen dich, sobald neuer Honig verfügbar ist!
                    </p>
                    <form onSubmit={handleWaitlist} className="flex gap-2">
                      <Input
                        type="email"
                        placeholder="deine@email.de"
                        value={waitlistEmail}
                        onChange={(e) => {
                          setWaitlistEmail(e.target.value);
                          setWaitlistError("");
                        }}
                        className="rounded-xl flex-1"
                        required
                      />
                      <Button type="submit" variant="honey" disabled={submitting}>
                        {submitting ? "..." : "Benachrichtigen →"}
                      </Button>
                    </form>
                    {waitlistError && (
                      <p className="text-sm text-destructive mt-2">{waitlistError}</p>
                    )}
                  </>
                )}
              </div>
            )}
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
