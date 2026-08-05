import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

// Dipakai di tiap halaman /sales/* untuk memastikan hanya role admin/sales yang bisa masuk.
export async function requireSalesAccess() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: userData } = await supabase
    .from('User')
    .select('role')
    .eq('auth_id', user!.id)
    .single();

  const role = userData?.role;
  if (role !== 'admin' && role !== 'sales') redirect('/dashboard');

  return { supabase, role };
}
