import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { BarChart3, ShoppingCart, Mail, LogOut } from "lucide-react";

const TABS = [
  { id: "statistiken", label: "Statistiken", icon: BarChart3 },
  { id: "verkaeufe", label: "Verkäufe", icon: ShoppingCart },
  { id: "newsletter", label: "Newsletter", icon: Mail },
] as const;

type TabId = (typeof TABS)[number]["id"];

const AdminDashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("statistiken");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/admin-login", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Laden...</p>
      </div>
    );
  }

  if (!user) return null;

  const handleLogout = async () => {
    await signOut();
    navigate("/admin-login", { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[#1A3C2A] text-white py-4 px-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold mx-auto">Admin Dashboard</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-white hover:text-white/80 hover:bg-white/10 absolute right-4"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Abmelden
        </Button>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <nav className="w-56 bg-[#1A3C2A] text-white flex flex-col gap-1 p-3">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-white/20"
                  : "hover:bg-white/10"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <main className="flex-1 flex items-center justify-center bg-background">
          <p className="text-2xl text-muted-foreground">⚙️ In Bearbeitung...</p>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
