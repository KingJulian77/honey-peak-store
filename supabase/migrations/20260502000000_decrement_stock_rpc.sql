-- RPC function to atomically decrement inventory stock.
-- Uses SECURITY DEFINER so anon users can call it without needing
-- direct UPDATE access on the inventory table.
CREATE OR REPLACE FUNCTION public.decrement_stock(product text, amount int)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE inventory
  SET stock = stock - amount,
      updated_at = now()
  WHERE product_name = product
    AND stock >= amount;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'not_enough_stock';
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.decrement_stock(text, int) TO anon, authenticated;
