import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Startseite", end: true },
  { to: "/unser-honig", label: "Unser Honig" },
  { to: "/warum-regional", label: "Warum Regional?" },
  { to: "/kontakt", label: "Kontakt" },
];

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-background/85 backdrop-blur-md border-b border-border">
      <div className="container-narrow flex flex-col items-center pt-4 pb-3">
        <Logo />
        <nav className="hidden md:flex items-center gap-10 mt-3">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                cn(
                  "text-sm tracking-wide uppercase transition-colors",
                  isActive ? "text-primary" : "text-foreground/80 hover:text-primary"
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <button
          className="md:hidden absolute right-4 top-5 p-2 text-foreground"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menü öffnen"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <nav className="md:hidden border-t border-border bg-background">
          <div className="container-narrow flex flex-col py-4 gap-3">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "text-sm uppercase tracking-wide py-2",
                    isActive ? "text-primary" : "text-foreground/80"
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
