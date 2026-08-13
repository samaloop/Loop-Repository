'use server'

import { revalidatePath } from 'next/cache';
import { getAuthorizedSalesContext } from '@/lib/serverAuth';
import { PROPOSAL_STATUS_OPTIONS } from '@/lib/proposalStatus';

function extractProposalData(formData: FormData) {
  const field = (key: string) => {
    const value = (formData.get(key) as string || '').trim();
    return value === '' ? null : value;
  };

  const companyIdRaw = (formData.get('company_id') as string || '').trim();
  const investAmountRaw = (formData.get('invest_amount') as string || '').trim();
  const status = (formData.get('status') as string || '').trim();

  return {
    company_id: companyIdRaw === '' ? null : Number(companyIdRaw),
    proposal_no: field('proposal_no'),
    category: field('category'),
    program_name: field('program_name'),
    invest_amount: investAmountRaw === '' ? null : Number(investAmountRaw),
    status: (PROPOSAL_STATUS_OPTIONS as readonly string[]).includes(status) ? status : 'Draft',
    contact_person: field('contact_person'),
    phone_number: field('phone_number'),
    email: field('email'),
    description: field('description'),
  };
}

export async function createProposal(formData: FormData) {
  const { supabase, authorized } = await getAuthorizedSalesContext();
  if (!authorized) return { success: false, error: 'Tidak memiliki akses.' };

  const data = extractProposalData(formData);
  if (!data.company_id) return { success: false, error: 'Perusahaan wajib dipilih.' };

  const { error, data: inserted } = await supabase.from('Proposal').insert(data).select('id').single();
  if (error) return { success: false, error: error.message };

  revalidatePath('/sales/proposals');
  revalidatePath(`/sales/companies/${data.company_id}`);
  return { success: true, id: inserted.id };
}

export async function updateProposal(id: number, formData: FormData) {
  const { supabase, authorized } = await getAuthorizedSalesContext();
  if (!authorized) return { success: false, error: 'Tidak memiliki akses.' };

  const data = extractProposalData(formData);
  if (!data.company_id) return { success: false, error: 'Perusahaan wajib dipilih.' };

  const { error } = await supabase.from('Proposal').update(data).eq('id', id);
  if (error) return { success: false, error: error.message };

  revalidatePath('/sales/proposals');
  revalidatePath(`/sales/proposals/${id}`);
  revalidatePath(`/sales/companies/${data.company_id}`);
  return { success: true };
}

export async function deleteProposal(id: number, companyId: number) {
  const { supabase, authorized } = await getAuthorizedSalesContext();
  if (!authorized) return { success: false, error: 'Tidak memiliki akses.' };

  const { error } = await supabase.from('Proposal').delete().eq('id', id);
  if (error) return { success: false, error: error.message };

  revalidatePath('/sales/proposals');
  revalidatePath(`/sales/companies/${companyId}`);
  return { success: true };
}
