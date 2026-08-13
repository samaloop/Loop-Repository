import Link from 'next/link';
import { Plus, Building2 } from 'lucide-react';
import { requireSalesAccess } from '@/lib/salesAccess';
import ProposalTable from '@/components/sales/ProposalTable';

export default async function ProposalsPage({
  searchParams,
}: {
  searchParams: Promise<{ company_id?: string }>;
}) {
  const { supabase } = await requireSalesAccess();
  const { company_id } = await searchParams;

  const [proposalsQuery, { data: companies }] = await Promise.all([
    (() => {
      let query = supabase.from('Proposal').select('*').order('created_at', { ascending: false });
      if (company_id) query = query.eq('company_id', company_id);
      return query;
    })(),
    supabase.from('Company').select('id, company_name').order('company_name'),
  ]);
  const proposals = proposalsQuery.data;

  const companyNameById = new Map((companies || []).map((c) => [c.id, c.company_name as string]));

  const rows = (proposals || []).map((p) => ({
    id: p.id,
    proposal_no: p.proposal_no,
    company_id: p.company_id,
    companyName: companyNameById.get(p.company_id) || 'Tidak diketahui',
    program_name: p.program_name,
    invest_amount: p.invest_amount,
    status: p.status,
    contact_person: p.contact_person,
  }));

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-10 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800">Proposal</h1>
            {/* <p className="text-sm text-slate-400 mt-1">Semua proposal corporate lintas perusahaan.</p> */}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              href="/sales/companies"
              className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-6 py-3.5 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all"
            >
              <Building2 size={16} /> Lihat Perusahaan
            </Link>
            <Link
              href="/sales/proposals/new"
              className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-cyan-100 transition-all"
            >
              <Plus size={16} /> Tambah Proposal
            </Link>
          </div>
        </div>

        <form method="get" className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-5 flex flex-col sm:flex-row sm:items-end gap-3">
          <div className="flex-1">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Filter Perusahaan</label>
            <select
              name="company_id"
              defaultValue={company_id || ''}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none appearance-none font-medium text-sm"
            >
              <option value="">Semua Perusahaan</option>
              {(companies || []).map((c) => (
                <option key={c.id} value={c.id}>{c.company_name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-cyan-600 transition-all">
              Terapkan
            </button>
            {company_id && (
              <Link href="/sales/proposals" className="px-6 py-3 border border-slate-100 text-slate-500 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center">
                Reset
              </Link>
            )}
          </div>
        </form>

        <ProposalTable initialProposals={rows} />
      </div>
    </div>
  );
}
