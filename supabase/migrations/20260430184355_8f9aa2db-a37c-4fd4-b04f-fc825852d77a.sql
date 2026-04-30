
-- Inventory table (single row for stock count)
CREATE TABLE public.inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name text NOT NULL DEFAULT 'honig',
  stock integer NOT NULL DEFAULT 10,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- Anyone can read inventory
CREATE POLICY "Anyone can read inventory" ON public.inventory FOR SELECT USING (true);

-- Only admins can update inventory
CREATE POLICY "Admins can update inventory" ON public.inventory FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Insert initial row
INSERT INTO public.inventory (product_name, stock) VALUES ('honig', 10);

-- Waitlist table
CREATE TABLE public.waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT waitlist_email_unique UNIQUE (email)
);

ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Anyone can insert into waitlist
CREATE POLICY "Anyone can join waitlist" ON public.waitlist FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Admins can view waitlist
CREATE POLICY "Admins can view waitlist" ON public.waitlist FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete waitlist entries
CREATE POLICY "Admins can delete waitlist" ON public.waitlist FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
