import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Plus } from 'lucide-react';
import { requireSalesAccess } from '@/lib/salesAccess';
import { ringBadgeClass } from '@/lib/prospectFields';
import ProposalTable from '@/components/sales/ProposalTable';
import DeleteCompanyButton from '@/components/sales/DeleteCompanyButton';

export default async function CompanyDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const { supabase } = await requireSalesAccess();

  const { data: company } = await supabase.from('Company').select('*').eq('id', id).single();
  if (!company) notFound();

  const [{ data: clients }, { data: prospects }, { data: proposals }] = await Promise.all([
    supabase.from('Client').select('id, full_name, email, phone, payment_status').eq('company_id', id).order('full_name'),
    supabase.from('Prospect').select('id, full_name, email, whatsapp, ring').eq('company_id', id).order('full_name'),
    supabase.from('Proposal').select('*').eq('company_id', id).order('created_at', { ascending: false }),
  ]);

  const proposalRows = (proposals || []).map((p) => ({
    id: p.id,
    proposal_no: p.proposal_no,
    company_id: p.company_id,
    companyName: company.company_name,
    program_name: p.program_name,
    invest_amount: p.invest_amount,
    status: p.status,
    contact_person: p.contact_person,
  }));

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-10 space-y-8">
        <nav className="flex items-center gap-2 text-xs md:text-sm">
          <Link href="/sales/companies" className="text-slate-400 hover:text-cyan-600 transition-colors">Perusahaan</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-bold truncate">{company.company_name}</span>
        </nav>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-black text-slate-800">{company.company_name}</h1>
          <div className="flex gap-3">
            <Link
              href={`/sales/companies/${company.id}/edit`}
              className="flex items-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-600 px-6 py-3 rounded-2xl text-sm font-black transition-all border border-amber-100/50"
            >
              Edit
            </Link>
            <DeleteCompanyButton id={company.id} name={company.company_name} />
          </div>
        </div>

        <div>
          <h2 className="text-sm font-black text-slate-700 uppercase tracking-widest mb-4">Client Terdaftar</h2>
          {clients && clients.length > 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50">
              {clients.map((client) => (
                <Link
                  key={client.id}
                  href={`/sales/clients/${client.id}`}
                  className="flex items-center justify-between p-5 hover:bg-slate-50/50 transition-colors"
                >
                  <div>
                    <p className="font-bold text-slate-700 text-sm">{client.full_name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{client.email || client.phone || '-'}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      client.payment_status === 'Lunas' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {client.payment_status}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="p-8 text-center text-slate-400 italic bg-white rounded-2xl border border-slate-100">
              Belum ada client yang terkait dengan perusahaan ini.
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-slate-700 uppercase tracking-widest">Prospek Terkait</h2>
            <Link
              href={`/sales/prospects/new?company_id=${company.id}`}
              className="flex items-center gap-2 bg-cyan-600 hover:bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-cyan-100 transition-all"
            >
              <Plus size={14} /> Tambah Prospek
            </Link>
          </div>
          {prospects && prospects.length > 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50">
              {prospects.map((prospect) => (
                <Link
                  key={prospect.id}
                  href={`/sales/prospects/${prospect.id}`}
                  className="flex items-center justify-between p-5 hover:bg-slate-50/50 transition-colors"
                >
                  <div>
                    <p className="font-bold text-slate-700 text-sm">{prospect.full_name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{prospect.email || prospect.whatsapp || '-'}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${ringBadgeClass(prospect.ring)}`}>
                    {prospect.ring}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="p-8 text-center text-slate-400 italic bg-white rounded-2xl border border-slate-100">
              Belum ada prospek yang terkait dengan perusahaan ini.
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-slate-700 uppercase tracking-widest">Proposal</h2>
            <Link
              href={`/sales/proposals/new?company_id=${company.id}`}
              className="flex items-center gap-2 bg-cyan-600 hover:bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-cyan-100 transition-all"
            >
              <Plus size={14} /> Tambah Proposal
            </Link>
          </div>

          <ProposalTable initialProposals={proposalRows} showCompanyColumn={false} />
        </div>
      </div>
    </div>
  );
}
