
-- Revoke public/anon execute on has_role
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, app_role) FROM public;
-- Only authenticated users can call it
GRANT EXECUTE ON FUNCTION public.has_role(UUID, app_role) TO authenticated;
