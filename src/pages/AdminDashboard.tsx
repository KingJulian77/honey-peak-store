import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BarChart3, ShoppingCart, Mail, LogOut, Trash2, Package } from "lucide-react";
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
  { id: "bestand", label: "Bestand", icon: Package },
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

type WaitlistEntry = {
  id: string;
  email: string;
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
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [waitlistLoading, setWaitlistLoading] = useState(false);
  const [stock, setStock] = useState<number>(0);
  const [stockLoading, setStockLoading] = useState(false);
  const [stockInput, setStockInput] = useState("");
  const [notifying, setNotifying] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/admin-login", { replace: true });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    if (activeTab === "verkaeufe") fetchOrders();
    if (activeTab === "newsletter") fetchWaitlist();
    if (activeTab === "bestand") {
      fetchStock();
      fetchWaitlist();
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

  const fetchWaitlist = async () => {
    setWaitlistLoading(true);
    const { data } = await supabase
      .from("waitlist")
      .select("*")
      .order("created_at", { ascending: false });
    setWaitlist((data as WaitlistEntry[]) || []);
    setWaitlistLoading(false);
  };

  const fetchStock = async () => {
    setStockLoading(true);
    const { data } = await supabase
      .from("inventory")
      .select("stock")
      .eq("product_name", "honig")
      .single();
    if (data) {
      setStock(data.stock);
      setStockInput(String(data.stock));
    }
    setStockLoading(false);
  };

  const updateStock = async () => {
    const val = parseInt(stockInput);
    if (isNaN(val) || val < 0) {
      toast.error("Bitte gib eine gültige Zahl ein.");
      return;
    }
    const { error } = await supabase
      .from("inventory")
      .update({ stock: val, updated_at: new Date().toISOString() } as any)
      .eq("product_name", "honig");
    if (error) {
      toast.error("Fehler beim Aktualisieren.");
      return;
    }
    setStock(val);
    toast.success("Bestand aktualisiert.");
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

  const deleteOrder = async (orderId: string) => {
    const { error } = await supabase.from("orders").delete().eq("id", orderId);
    if (error) {
      toast.error("Fehler beim Löschen der Bestellung.");
      return;
    }
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    toast.success("Bestellung gelöscht.");
  };

  const notifyWaitlist = async () => {
    setNotifying(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { data, error } = await supabase.functions.invoke("notify-waitlist", {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (error) throw error;
      toast.success(data?.message || "Warteliste benachrichtigt.");
      setWaitlist([]);
    } catch {
      toast.error("Fehler beim Benachrichtigen.");
    }
    setNotifying(false);
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
      if (ordersLoading) return <p className="text-muted-foreground text-center py-12">Laden...</p>;
      if (orders.length === 0) return <p className="text-muted-foreground text-center py-12">Noch keine Bestellungen.</p>;
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
                  <TableHead className="w-10"></TableHead>
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
                      <Select value={order.status} onValueChange={(val) => updateStatus(order.id, val)}>
                        <SelectTrigger className={`w-[160px] ml-auto text-xs font-medium rounded-full ${STATUS_COLORS[order.status] || ""}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(STATUS_LABELS).map(([value, label]) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Bestellung löschen?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Möchtest du die Bestellung von {order.vorname} {order.nachname} wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteOrder(order.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Löschen</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      );
    }

    if (activeTab === "newsletter") {
      if (waitlistLoading) return <p className="text-muted-foreground text-center py-12">Laden...</p>;
      return (
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Warteliste</h2>
          {waitlist.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">Keine Einträge auf der Warteliste.</p>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>E-Mail</TableHead>
                    <TableHead>Eingetragen am</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {waitlist.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{entry.email}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(entry.created_at).toLocaleDateString("de-DE", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      );
    }

    if (activeTab === "bestand") {
      return (
        <div className="p-6 space-y-8">
          <div>
            <h2 className="text-xl font-bold mb-4">Bestand verwalten</h2>
            <div className="flex items-center gap-4 max-w-sm">
              <label className="text-sm font-medium whitespace-nowrap">Honig (Gläser):</label>
              <Input
                type="number"
                min="0"
                value={stockInput}
                onChange={(e) => setStockInput(e.target.value)}
                className="w-24 rounded-xl"
              />
              <Button onClick={updateStock} variant="honey" disabled={stockLoading}>
                Speichern
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Aktueller Bestand: <strong>{stock}</strong> Gläser
            </p>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-bold mb-2">Warteliste benachrichtigen</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {waitlist.length === 0
                ? "Keine Personen auf der Warteliste."
                : `${waitlist.length} Person(en) auf der Warteliste.`}
            </p>
            {waitlist.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="honey" disabled={notifying}>
                    {notifying ? "Wird gesendet..." : "Bestand aufgefüllt – Warteliste benachrichtigen"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Warteliste benachrichtigen?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Es werden {waitlist.length} Person(en) per E-Mail benachrichtigt und die Warteliste anschließend geleert.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                    <AlertDialogAction onClick={notifyWaitlist}>Benachrichtigen</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
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
