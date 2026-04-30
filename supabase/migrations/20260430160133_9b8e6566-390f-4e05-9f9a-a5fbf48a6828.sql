
-- Create order status enum
CREATE TYPE public.order_status AS ENUM ('offen', 'geld_erhalten', 'bearbeitung', 'fertig');

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vorname TEXT NOT NULL,
  nachname TEXT NOT NULL,
  strasse TEXT NOT NULL,
  hausnummer TEXT NOT NULL,
  plz TEXT NOT NULL,
  stadt TEXT NOT NULL,
  status order_status NOT NULL DEFAULT 'offen',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Anyone can insert orders (public checkout)
CREATE POLICY "Anyone can place orders"
ON public.orders
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can view orders
CREATE POLICY "Admins can view all orders"
ON public.orders
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can update order status
CREATE POLICY "Admins can update orders"
ON public.orders
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
