'use server'

import { revalidatePath } from 'next/cache';
import { getAuthorizedSalesContext } from '@/lib/serverAuth';

function extractCommunityProgramData(formData: FormData) {
  const field = (key: string) => {
    const value = (formData.get(key) as string || '').trim();
    return value === '' ? null : value;
  };

  return {
    community_name: (formData.get('community_name') as string || '').trim(),
    category: field('category'),
    event_date: field('event_date'),
    event_time: field('event_time'),
    blast_date: field('blast_date'),
  };
}

export async function createCommunityProgram(formData: FormData) {
  const { supabase, authorized } = await getAuthorizedSalesContext();
  if (!authorized) return { success: false, error: 'Tidak memiliki akses.' };

  const data = extractCommunityProgramData(formData);
  if (!data.community_name) return { success: false, error: 'Nama Komunitas wajib diisi.' };

  const { error, data: inserted } = await supabase.from('CommunityProgram').insert(data).select('id').single();
  if (error) return { success: false, error: error.message };

  revalidatePath('/sales/community-programs');
  return { success: true, id: inserted.id };
}

export async function updateCommunityProgram(id: number, formData: FormData) {
  const { supabase, authorized } = await getAuthorizedSalesContext();
  if (!authorized) return { success: false, error: 'Tidak memiliki akses.' };

  const data = extractCommunityProgramData(formData);
  if (!data.community_name) return { success: false, error: 'Nama Komunitas wajib diisi.' };

  const { error } = await supabase.from('CommunityProgram').update(data).eq('id', id);
  if (error) return { success: false, error: error.message };

  revalidatePath('/sales/community-programs');
  revalidatePath(`/sales/community-programs/${id}`);
  return { success: true };
}

export async function deleteCommunityProgram(id: number) {
  const { supabase, authorized } = await getAuthorizedSalesContext();
  if (!authorized) return { success: false, error: 'Tidak memiliki akses.' };

  const { error } = await supabase.from('CommunityProgram').delete().eq('id', id);
  if (error) return { success: false, error: error.message };

  revalidatePath('/sales/community-programs');
  return { success: true };
}

export async function linkProspectToProgram(programId: number, formData: FormData) {
  const { supabase, authorized } = await getAuthorizedSalesContext();
  if (!authorized) return { success: false, error: 'Tidak memiliki akses.' };

  const prospectIdRaw = (formData.get('prospect_id') as string || '').trim();
  if (!prospectIdRaw) return { success: false, error: 'Pilih calon client terlebih dahulu.' };

  const { error } = await supabase.from('ProspectCommunityProgram').insert({
    prospect_id: Number(prospectIdRaw),
    community_program_id: programId,
  });
  if (error) {
    if (error.code === '23505') return { success: false, error: 'Calon client ini sudah terkait dengan program ini.' };
    return { success: false, error: error.message };
  }

  revalidatePath(`/sales/community-programs/${programId}`);
  return { success: true };
}

export async function unlinkProspectFromProgram(programId: number, prospectId: number) {
  const { supabase, authorized } = await getAuthorizedSalesContext();
  if (!authorized) return { success: false, error: 'Tidak memiliki akses.' };

  const { error } = await supabase
    .from('ProspectCommunityProgram')
    .delete()
    .eq('community_program_id', programId)
    .eq('prospect_id', prospectId);
  if (error) return { success: false, error: error.message };

  revalidatePath(`/sales/community-programs/${programId}`);
  return { success: true };
}
