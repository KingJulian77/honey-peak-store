import Layout from "@/components/Layout";

const TXT = "ABBCCC.";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="py-6 border-b border-border last:border-0">
    <h2 className="text-xl md:text-2xl mb-3">{title}</h2>
    <div className="text-muted-foreground leading-relaxed text-sm space-y-1">{children}</div>
  </div>
);

const Impressum = () => {
  return (
    <Layout>
      <section className="container-narrow py-12 md:py-20 max-w-3xl">
        <div className="mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-primary font-medium">Rechtliches</span>
          <h1 className="mt-4 text-4xl md:text-5xl">Impressum</h1>
        </div>

        <Section title="Angaben gemäß § 5 TMG">
          <p>Honig aus Hochkamp</p>
          <p>Inhaber: ABBCCCABB</p>
          <p>Hochkamper Weg 7</p>
          <p>12345 Hochkamp</p>
        </Section>

        <Section title="Kontakt">
          <p>Telefon: +49 (0) 123 456 789</p>
          <p>E-Mail: hallo@honig-aus-hochkamp.de</p>
        </Section>

        <Section title="Umsatzsteuer-ID">
          <p>USt-IdNr. gemäß § 27 a UStG: DE000000000</p>
        </Section>

        <Section title="Verantwortlich für den Inhalt">
          <p>ABBCCCABB, Hochkamper Weg 7, 12345 Hochkamp</p>
        </Section>

        <Section title="Streitschlichtung">
          <p>{TXT}</p>
          <p>{TXT}</p>
        </Section>

        <Section title="Haftung für Inhalte">
          <p>{TXT}</p>
          <p>{TXT}</p>
        </Section>
      </section>
    </Layout>
  );
};

export default Impressum;
