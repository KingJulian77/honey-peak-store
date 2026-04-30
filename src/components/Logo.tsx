import { Link } from "react-router-dom";

const LOGO_URL =
  "https://atdoofvtgsjahixpqtzn.supabase.co/storage/v1/object/public/logo/Unbenanntes_Projekt.jpg";

const Logo = ({ size = 64 }: { size?: number }) => {
  return (
    <Link to="/" aria-label="Honig aus Hochkamp – Startseite" className="inline-flex">
      <img
        src={LOGO_URL}
        alt="Honig aus Hochkamp Logo"
        width={size}
        height={size}
        className="rounded-full object-cover shadow-card ring-1 ring-border bg-background"
        style={{ width: size, height: size }}
      />
    </Link>
  );
};

export default Logo;
