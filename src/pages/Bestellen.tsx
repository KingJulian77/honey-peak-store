import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

const Bestellen = () => {
  const [form, setForm] = useState({ strasse: "", hausnummer: "", plz: "", stadt: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.strasse || !form.hausnummer || !form.plz || !form.stadt) {
      setError("Bitte fülle alle Felder aus.");
      return;
    }
    if (form.stadt.trim().toLowerCase() !== "hamburg") {
      setError("Wir liefern leider nur innerhalb von Hamburg. Bitte gib eine Hamburger Lieferadresse an.");
      return;
    }
    setSuccess(true);
  };

  if (success) {
    return (
      <Layout>
        <section className="container-narrow py-16 md:py-24 text-center max-w-xl mx-auto">
          <h1 className="text-3xl md:text-5xl mb-6">Bestellung eingegangen</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Vielen Dank für deine Bestellung! Wir melden uns bei dir, sobald deine Zahlung eingegangen ist.
          </p>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="container-narrow py-16 md:py-24 max-w-lg mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-primary font-medium">Bestellung</span>
          <h1 className="mt-4 text-3xl md:text-5xl">Jetzt bestellen</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5">Straße</label>
            <Input value={form.strasse} onChange={handleChange("strasse")} placeholder="Musterstraße" className="rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Hausnummer</label>
            <Input value={form.hausnummer} onChange={handleChange("hausnummer")} placeholder="12a" className="rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Postleitzahl</label>
              <Input value={form.plz} onChange={handleChange("plz")} placeholder="22111" className="rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Stadt</label>
              <Input value={form.stadt} onChange={handleChange("stadt")} placeholder="Hamburg" className="rounded-xl" />
            </div>
          </div>

          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 flex gap-3 items-start mt-2">
            <Info className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <p className="text-sm leading-relaxed text-foreground">
              Bitte überweise den Betrag per PayPal an folgende Adresse:{" "}
              <strong>[PayPal-Adresse hier einfügen]</strong>. Deine Bestellung wird erst nach Zahlungseingang bearbeitet.
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="rounded-xl">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" variant="honey" size="xl" className="w-full mt-4">
            Kostenpflichtig bestellen →
          </Button>
        </form>
      </section>
    </Layout>
  );
};

export default Bestellen;
