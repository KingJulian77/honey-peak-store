import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { BarChart3, ShoppingCart, Mail, LogOut, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TABS = [
  { id: "statistiken", label: "Statistiken", icon: BarChart3 },
  { id: "verkaeufe", label: "Verkäufe", icon: ShoppingCart },
  { id: "newsletter", label: "Newsletter", icon: Mail },
] as const;

type TabId = (typeof TABS)[number]["id"];

type Order = {
  id: string;
  vorname: string;
  nachname: string;
  strasse: string;
  hausnummer: string;
  plz: string;
  stadt: string;
  status: string;
  created_at: string;
};

const STATUS_LABELS: Record<string, string> = {
  offen: "Offen",
  geld_erhalten: "Geld erhalten",
  bearbeitung: "Bearbeitung",
  fertig: "Fertig",
};

const STATUS_COLORS: Record<string, string> = {
  offen: "bg-yellow-100 text-yellow-800",
  geld_erhalten: "bg-blue-100 text-blue-800",
  bearbeitung: "bg-orange-100 text-orange-800",
  fertig: "bg-green-100 text-green-800",
};

const AdminDashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("statistiken");
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/admin-login", { replace: true });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user && activeTab === "verkaeufe") {
      fetchOrders();
    }
  }, [user, activeTab]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    setOrders((data as Order[]) || []);
    setOrdersLoading(false);
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    await supabase
      .from("orders")
      .update({ status: newStatus as any })
      .eq("id", orderId);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

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

  const renderContent = () => {
    if (activeTab === "verkaeufe") {
      if (ordersLoading) {
        return <p className="text-muted-foreground text-center py-12">Laden...</p>;
      }
      if (orders.length === 0) {
        return <p className="text-muted-foreground text-center py-12">Noch keine Bestellungen.</p>;
      }
      return (
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Bestellungen</h2>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Datum</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Adresse</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="whitespace-nowrap text-sm">
                      {new Date(order.created_at).toLocaleDateString("de-DE")}
                    </TableCell>
                    <TableCell className="font-medium">
                      {order.vorname} {order.nachname}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {order.strasse} {order.hausnummer}, {order.plz} {order.stadt}
                    </TableCell>
                    <TableCell className="text-right">
                      <Select
                        value={order.status}
                        onValueChange={(val) => updateStatus(order.id, val)}
                      >
                        <SelectTrigger className={`w-[160px] ml-auto text-xs font-medium rounded-full ${STATUS_COLORS[order.status] || ""}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(STATUS_LABELS).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-2xl text-muted-foreground">⚙️ In Bearbeitung...</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
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
        <nav className="w-56 bg-[#1A3C2A] text-white flex flex-col gap-1 p-3">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-medium transition-colors ${
                activeTab === tab.id ? "bg-white/20" : "hover:bg-white/10"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>

        <main className="flex-1 bg-background">{renderContent()}</main>
      </div>
    </div>
  );
};

export default AdminDashboard;
