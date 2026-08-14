'use server'

import { revalidatePath } from 'next/cache';
import { getAuthorizedSalesContext } from '@/lib/serverAuth';

export async function createIndustrySector(formData: FormData) {
  const { supabase, authorized } = await getAuthorizedSalesContext();
  if (!authorized) return { success: false, error: 'Tidak memiliki akses.' };

  const name = (formData.get('name') as string || '').trim();
  if (!name) return { success: false, error: 'Nama sektor wajib diisi.' };

  const { error } = await supabase.from('IndustrySector').insert({ name });
  if (error) return { success: false, error: error.message };

  revalidatePath('/sales/prospects/industry-sectors');
  revalidatePath('/sales/prospects');
  return { success: true };
}

export async function deleteIndustrySector(id: number) {
  const { supabase, authorized } = await getAuthorizedSalesContext();
  if (!authorized) return { success: false, error: 'Tidak memiliki akses.' };

  const { error } = await supabase.from('IndustrySector').delete().eq('id', id);
  if (error) return { success: false, error: error.message };

  revalidatePath('/sales/prospects/industry-sectors');
  revalidatePath('/sales/prospects');
  return { success: true };
}
