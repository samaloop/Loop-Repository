'use server'

import { revalidatePath } from 'next/cache';
import { getAuthorizedSalesContext } from '@/lib/serverAuth';

function extractFollowUpData(formData: FormData) {
  const followUpDate = (formData.get('follow_up_date') as string || '').trim();
  const detail = (formData.get('detail') as string || '').trim();
  return {
    follow_up_date: followUpDate,
    detail: detail === '' ? null : detail,
  };
}

export async function createFollowUp(prospectId: number, formData: FormData) {
  const { supabase, authorized } = await getAuthorizedSalesContext();
  if (!authorized) return { success: false, error: 'Tidak memiliki akses.' };

  const data = extractFollowUpData(formData);
  if (!data.follow_up_date) return { success: false, error: 'Tanggal Follow Up wajib diisi.' };

  const { error } = await supabase.from('ProspectFollowUp').insert({ ...data, prospect_id: prospectId });
  if (error) return { success: false, error: error.message };

  revalidatePath(`/sales/prospects/${prospectId}`);
  return { success: true };
}

export async function updateFollowUp(id: number, prospectId: number, formData: FormData) {
  const { supabase, authorized } = await getAuthorizedSalesContext();
  if (!authorized) return { success: false, error: 'Tidak memiliki akses.' };

  const data = extractFollowUpData(formData);
  if (!data.follow_up_date) return { success: false, error: 'Tanggal Follow Up wajib diisi.' };

  const { error } = await supabase.from('ProspectFollowUp').update(data).eq('id', id);
  if (error) return { success: false, error: error.message };

  revalidatePath(`/sales/prospects/${prospectId}`);
  return { success: true };
}

export async function deleteFollowUp(id: number, prospectId: number) {
  const { supabase, authorized } = await getAuthorizedSalesContext();
  if (!authorized) return { success: false, error: 'Tidak memiliki akses.' };

  const { error } = await supabase.from('ProspectFollowUp').delete().eq('id', id);
  if (error) return { success: false, error: error.message };

  revalidatePath(`/sales/prospects/${prospectId}`);
  return { success: true };
}
