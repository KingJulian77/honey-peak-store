import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { FormEvent, useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Danke! Wir benachrichtigen dich, sobald neuer Honig verfügbar ist.");
    setEmail("");
  };

  return (
    <footer className="mt-32 border-t border-forest/30 bg-forest/5">
      <div className="container-narrow py-16 grid gap-12 md:grid-cols-3">
        <div className="md:col-span-2">
          <h3 className="text-2xl md:text-3xl mb-3">Bleib auf dem Laufenden</h3>
          <p className="text-muted-foreground max-w-xl mb-5 leading-relaxed">
            Unser Honig ist gerade ausverkauft? Kein Problem! Trag dich hier ein und wir benachrichtigen dich per E-Mail, sobald neuer Honig verfügbar ist.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md">
            <Input
              type="email"
              required
              placeholder="deine@email.de"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background"
            />
            <Button type="submit" variant="honey">
              Benachrichtigen →
            </Button>
          </form>
        </div>

        <div>
          <h4 className="text-lg mb-4">Honig aus Hochkamp</h4>
          <ul className="space-y-2 text-sm text-foreground/80">
            <li><Link to="/" className="hover:text-primary">Startseite</Link></li>
            <li><Link to="/unser-honig" className="hover:text-primary">Unser Honig</Link></li>
            <li><Link to="/warum-regional" className="hover:text-primary">Warum Regional?</Link></li>
            <li><Link to="/kontakt" className="hover:text-primary">Kontakt</Link></li>
            <li><Link to="/impressum" className="hover:text-primary">Impressum</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-narrow py-6 text-center text-xs text-muted-foreground">
          © 2025 Honig aus Hochkamp. Alle Rechte vorbehalten.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
