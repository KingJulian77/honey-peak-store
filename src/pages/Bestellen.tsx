import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const PAYPAL_ADDRESS = "[PayPal-Adresse hier einfügen]";

interface StepData {
  vorname: string;
  nachname: string;
  strasse: string;
  hausnummer: string;
  plz: string;
  stadt: string;
}

const Bestellen = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<StepData>({
    vorname: "", nachname: "", strasse: "", hausnummer: "", plz: "", stadt: "",
  });
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState<number | null>(null);
  const [stock, setStock] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchInventory = async () => {
      const { data } = await supabase
        .from("inventory")
        .select("stock, price")
        .eq("product_name", "honig")
        .single();
      if (data) {
        setStock(data.stock);
        setPrice(Number(data.price));
      }
    };
    fetchInventory();
  }, []);

  useEffect(() => {
    if (price !== null) setTotal(quantity * price);
  }, [quantity, price]);

  const handleChange = (field: keyof StepData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((f) => ({ ...f, [field]: e.target.value }));
    setError("");
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    const { vorname, nachname, strasse, hausnummer, plz, stadt } = formData;
    if (!vorname || !nachname || !strasse || !hausnummer || !plz || !stadt) {
      setError("Bitte fülle alle Felder aus.");
      return;
    }
    if (stadt.trim().toLowerCase() !== "hamburg") {
      setError("Wir liefern leider nur innerhalb von Hamburg. Bitte gib eine Hamburger Lieferadresse an.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // Re-check stock
    const { data: inv } = await supabase
      .from("inventory")
      .select("stock")
      .eq("product_name", "honig")
      .single();

    if (!inv || inv.stock <= 0) {
      setError("Leider ist unser Honig gerade ausverkauft. Trag dich auf unsere Warteliste ein!");
      return;
    }
    if (quantity > inv.stock) {
      setError(`Es sind nur noch ${inv.stock} Gläser verfügbar.`);
      setStock(inv.stock);
      return;
    }

    setSubmitting(true);
    const orderTotal = quantity * (price ?? 12);

    const { error: dbError } = await supabase.from("orders").insert({
      vorname: formData.vorname.trim(),
      nachname: formData.nachname.trim(),
      strasse: formData.strasse.trim(),
      hausnummer: formData.hausnummer.trim(),
      plz: formData.plz.trim(),
      stadt: formData.stadt.trim(),
      quantity,
      total: orderTotal,
    });

    if (dbError) {
      setSubmitting(false);
      setError("Es ist ein Fehler aufgetreten. Bitte versuche es erneut.");
      return;
    }

    // Reduce stock
    await supabase
      .from("inventory")
      .update({ stock: inv.stock - quantity })
      .eq("product_name", "honig");

    setTotal(orderTotal);
    setSubmitting(false);
    setSuccess(true);
  };

  const stepIndicator = (
    <div className="flex items-center justify-center gap-2 mb-10">
      {/* Step 1 */}
      <div className="flex items-center gap-2">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
            step === 1
              ? "bg-[#C8860A] text-white"
              : "bg-green-600 text-white"
          }`}
        >
          {step > 1 ? <Check className="w-4 h-4" /> : "1"}
        </div>
        <span className={`text-sm font-medium ${step === 1 ? "text-[#C8860A]" : "text-green-600"}`}>
          Deine Daten
        </span>
      </div>

      <div className="w-10 h-px bg-muted-foreground/30" />

      {/* Step 2 */}
      <div className="flex items-center gap-2">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
            step === 2
              ? "bg-[#C8860A] text-white"
              : "bg-muted-foreground/30 text-muted-foreground"
          }`}
        >
          2
        </div>
        <span className={`text-sm font-medium ${step === 2 ? "text-[#C8860A]" : "text-muted-foreground"}`}>
          Bestellung &amp; Zahlung
        </span>
      </div>
    </div>
  );

  if (success) {
    return (
      <Layout>
        <section className="container-narrow py-16 md:py-24 text-center max-w-xl mx-auto">
          <h1 className="text-3xl md:text-5xl mb-6">Bestellung eingegangen</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Vielen Dank für deine Bestellung, {formData.vorname}! Bitte überweise{" "}
            {total.toFixed(2).replace(".", ",")} € per PayPal an {PAYPAL_ADDRESS}. Wir bearbeiten deine
            Bestellung sobald die Zahlung eingegangen ist. 🍯
          </p>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="container-narrow py-16 md:py-24 max-w-lg mx-auto">
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-[0.25em] text-primary font-medium">Bestellung</span>
          <h1 className="mt-4 text-3xl md:text-5xl">Jetzt bestellen</h1>
        </div>

        {stepIndicator}

        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Vorname</label>
                <Input value={formData.vorname} onChange={handleChange("vorname")} placeholder="Max" className="rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Nachname</label>
                <Input value={formData.nachname} onChange={handleChange("nachname")} placeholder="Mustermann" className="rounded-xl" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Straße</label>
              <Input value={formData.strasse} onChange={handleChange("strasse")} placeholder="Musterstraße" className="rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Hausnummer</label>
              <Input value={formData.hausnummer} onChange={handleChange("hausnummer")} placeholder="12a" className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Postleitzahl</label>
                <Input value={formData.plz} onChange={handleChange("plz")} placeholder="22111" className="rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Stadt</label>
                <Input value={formData.stadt} onChange={handleChange("stadt")} placeholder="Hamburg" className="rounded-xl" />
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="rounded-xl">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" variant="honey" size="xl" className="w-full mt-4">
              Weiter →
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleOrder} className="space-y-6">
            {/* Address summary */}
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm">
              <p className="text-muted-foreground mb-1">Lieferung an:</p>
              <p className="font-medium">
                {formData.vorname} {formData.nachname}, {formData.strasse} {formData.hausnummer},{" "}
                {formData.plz} {formData.stadt}
              </p>
              <button
                type="button"
                onClick={() => { setStep(1); setError(""); }}
                className="text-xs text-primary underline mt-2"
              >
                Daten ändern
              </button>
            </div>

            {stock !== null && stock <= 0 ? (
              <Alert className="rounded-xl border-primary/30">
                <AlertDescription>
                  Leider ist unser Honig gerade ausverkauft. Trag dich auf unsere Warteliste ein!
                </AlertDescription>
              </Alert>
            ) : (
              <>
                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Anzahl Honiggläser</label>
                  <Input
                    type="number"
                    min={1}
                    max={stock ?? 99}
                    value={quantity}
                    onChange={(e) => {
                      const val = Math.max(1, Math.min(Number(e.target.value), stock ?? 99));
                      setQuantity(val);
                    }}
                    className="rounded-xl w-32"
                  />
                  {price !== null && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {quantity} {quantity === 1 ? "Glas" : "Gläser"} × {price.toFixed(2).replace(".", ",")} € ={" "}
                      <span className="font-semibold text-foreground">{total.toFixed(2).replace(".", ",")} €</span>
                    </p>
                  )}
                </div>

                {/* Payment info */}
                <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 flex gap-3 items-start">
                  <Info className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm leading-relaxed text-foreground">
                    Bitte überweise den Betrag von{" "}
                    <strong>{total.toFixed(2).replace(".", ",")} €</strong> per PayPal an folgende
                    Adresse: <strong>{PAYPAL_ADDRESS}</strong> – Deine Bestellung wird erst nach
                    Zahlungseingang bearbeitet.
                  </p>
                </div>

                {error && (
                  <Alert variant="destructive" className="rounded-xl">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" variant="honey" size="xl" className="w-full" disabled={submitting}>
                  {submitting ? "Wird gesendet..." : "Kostenpflichtig bestellen →"}
                </Button>
              </>
            )}
          </form>
        )}
      </section>
    </Layout>
  );
};

export default Bestellen;
