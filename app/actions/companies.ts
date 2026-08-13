'use server'

import { revalidatePath } from 'next/cache';
import { getAuthorizedSalesContext } from '@/lib/serverAuth';

function extractCompanyData(formData: FormData) {
  const companyName = (formData.get('company_name') as string || '').trim();
  return {
    company_name: companyName,
  };
}

export async function createCompany(formData: FormData) {
  const { supabase, authorized } = await getAuthorizedSalesContext();
  if (!authorized) return { success: false, error: 'Tidak memiliki akses.' };

  const data = extractCompanyData(formData);
  if (!data.company_name) return { success: false, error: 'Nama Perusahaan wajib diisi.' };

  const { error, data: inserted } = await supabase.from('Company').insert(data).select('id').single();
  if (error) return { success: false, error: error.message };

  revalidatePath('/sales/companies');
  return { success: true, id: inserted.id };
}

export async function updateCompany(id: number, formData: FormData) {
  const { supabase, authorized } = await getAuthorizedSalesContext();
  if (!authorized) return { success: false, error: 'Tidak memiliki akses.' };

  const data = extractCompanyData(formData);
  if (!data.company_name) return { success: false, error: 'Nama Perusahaan wajib diisi.' };

  const { error } = await supabase.from('Company').update(data).eq('id', id);
  if (error) return { success: false, error: error.message };

  revalidatePath('/sales/companies');
  revalidatePath(`/sales/companies/${id}`);
  return { success: true };
}

export async function deleteCompany(id: number) {
  const { supabase, authorized } = await getAuthorizedSalesContext();
  if (!authorized) return { success: false, error: 'Tidak memiliki akses.' };

  const { error } = await supabase.from('Company').delete().eq('id', id);
  if (error) return { success: false, error: error.message };

  revalidatePath('/sales/companies');
  return { success: true };
}
