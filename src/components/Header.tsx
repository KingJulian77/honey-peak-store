import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import { cn } from "@/lib/utils";

const leftLinks = [
  { to: "/", label: "Startseite", end: true },
  { to: "/unser-honig", label: "Unser Honig" },
];

const rightLinks = [
  { to: "/warum-regional", label: "Warum Regional?" },
  { to: "/kontakt", label: "Kontakt" },
];

const allLinks = [...leftLinks, ...rightLinks];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "text-sm tracking-wide uppercase transition-colors whitespace-nowrap",
    isActive ? "text-primary" : "text-foreground/80 hover:text-primary"
  );

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-background/85 backdrop-blur-md border-b border-border">
      <div className="container-narrow relative flex items-center justify-center py-4 min-h-[112px]">
        {/* Desktop Nav with centered logo between Unser Honig and Warum Regional */}
        <nav className="hidden md:flex items-center gap-10">
          {leftLinks.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
              {l.label}
            </NavLink>
          ))}

          <div className="mx-6">
            <Logo size={88} />
          </div>

          {rightLinks.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile: centered logo + menu button */}
        <div className="md:hidden">
          <Logo size={64} />
        </div>
        <button
          className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 p-2 text-foreground"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menü öffnen"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-border bg-background">
          <div className="container-narrow flex flex-col py-4 gap-3">
            {allLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={"end" in l ? (l as { end?: boolean }).end : undefined}
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
