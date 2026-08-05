import { createClient } from '@/utils/supabase/server';

// Dipakai oleh server actions di app/actions/*.ts untuk re-check role admin/sales
// di server sebelum mutasi data (server action adalah endpoint publik, cek role di client saja tidak cukup).
export async function getAuthorizedSalesContext() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, authorized: false as const, picUserId: null };

  const { data: userData } = await supabase
    .from('User')
    .select('id, role')
    .eq('auth_id', user.id)
    .single();

  const authorized = userData?.role === 'admin' || userData?.role === 'sales';
  return { supabase, authorized, picUserId: userData?.id ?? null };
}
