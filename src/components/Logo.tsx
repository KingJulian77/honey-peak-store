import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" aria-label="Zur Startseite" className="inline-flex">
      <div
        className="flex h-12 w-12 items-center justify-center rounded-full text-white font-bold text-sm tracking-widest shadow-card"
        style={{ backgroundColor: "hsl(var(--placeholder))" }}
      >
        !!!
      </div>
    </Link>
  );
};

export default Logo;
