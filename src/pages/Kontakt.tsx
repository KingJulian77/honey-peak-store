import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { FormEvent } from "react";
import { Mail, MapPin, Phone } from "lucide-react";

const Kontakt = () => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    toast.success("Vielen Dank! Wir melden uns in Kürze.");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <Layout>
      <section className="container-narrow py-12 md:py-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-primary font-medium">
            Kontakt
          </span>
          <h1 className="mt-4 text-4xl md:text-6xl">Schreib uns gerne.</h1>
          <p className="mt-5 text-muted-foreground">
            ABBCCCABBCCCABBABBCCCABBCCCABBABBCCCABBCCCABBABBCCCABB.
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-2">
          <div className="space-y-6">
            {[
              { Icon: MapPin, label: "Adresse", text: "Hochkamper Weg 7, 12345 Hochkamp" },
              { Icon: Mail, label: "E-Mail", text: "hallo@honig-aus-hochkamp.de" },
              { Icon: Phone, label: "Telefon", text: "+49 (0) 123 456 789" },
            ].map(({ Icon, label, text }) => (
              <div key={label} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6 shadow-card">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Icon size={18} />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
                  <div className="mt-1 text-foreground">{text}</div>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-8 shadow-card space-y-5">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" required className="mt-2 bg-background" />
            </div>
            <div>
              <Label htmlFor="email">E-Mail</Label>
              <Input id="email" type="email" required className="mt-2 bg-background" />
            </div>
            <div>
              <Label htmlFor="msg">Nachricht</Label>
              <Textarea id="msg" rows={5} required className="mt-2 bg-background" />
            </div>
            <Button type="submit" variant="honey" size="lg" className="w-full">
              Nachricht senden →
            </Button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default Kontakt;
