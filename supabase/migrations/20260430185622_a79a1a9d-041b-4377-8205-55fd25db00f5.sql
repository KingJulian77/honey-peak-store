
-- Add price to inventory
ALTER TABLE public.inventory ADD COLUMN price numeric(10,2) NOT NULL DEFAULT 12.00;

-- Add quantity and total to orders
ALTER TABLE public.orders ADD COLUMN quantity integer NOT NULL DEFAULT 1;
ALTER TABLE public.orders ADD COLUMN total numeric(10,2) NOT NULL DEFAULT 12.00;
