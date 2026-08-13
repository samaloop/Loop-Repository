import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireSalesAccess } from '@/lib/salesAccess';
import { proposalStatusBadgeClass, formatInvestAmount } from '@/lib/proposalStatus';
import DeleteProposalButton from '@/components/sales/DeleteProposalButton';

const DETAIL_FIELDS: { key: string; label: string }[] = [
  { key: 'proposal_no', label: 'No. Proposal' },
  { key: 'category', label: 'Kategori' },
  { key: 'program_name', label: 'Nama Program' },
  { key: 'contact_person', label: 'Contact Person' },
  { key: 'phone_number', label: 'Nomor Telepon' },
  { key: 'email', label: 'Email' },
];

export default async function ProposalDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const { supabase } = await requireSalesAccess();

  const { data: proposal } = await supabase.from('Proposal').select('*').eq('id', id).single();
  if (!proposal) notFound();

  const { data: company } = proposal.company_id
    ? await supabase.from('Company').select('id, company_name').eq('id', proposal.company_id).single()
    : { data: null };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-10">
        <nav className="flex items-center gap-2 text-xs md:text-sm mb-6">
          <Link href="/sales/proposals" className="text-slate-400 hover:text-cyan-600 transition-colors">Proposal</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-bold truncate">{proposal.proposal_no || proposal.program_name || 'Detail'}</span>
        </nav>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800">{proposal.proposal_no || proposal.program_name || 'Proposal'}</h1>
            {company && (
              <Link href={`/sales/companies/${company.id}`} className="text-sm text-cyan-600 font-medium hover:underline mt-1 inline-block">
                {company.company_name}
              </Link>
            )}
            <div className="mt-2">
              <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${proposalStatusBadgeClass(proposal.status)}`}>
                {proposal.status}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/sales/proposals/${proposal.id}/edit`}
              className="flex items-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-600 px-6 py-3 rounded-2xl text-sm font-black transition-all border border-amber-100/50"
            >
              Edit
            </Link>
            <DeleteProposalButton id={proposal.id} companyId={proposal.company_id} label={proposal.proposal_no || proposal.program_name || 'ini'} />
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-6 md:p-10 space-y-6">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Invest Amount</p>
            <p className="text-2xl font-black text-slate-800">{formatInvestAmount(proposal.invest_amount)}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            {DETAIL_FIELDS.map((field) => (
              <div key={field.key}>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{field.label}</p>
                <p className="text-slate-700 font-medium">{proposal[field.key] || '-'}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Deskripsi</p>
            <p className="text-slate-700 font-medium whitespace-pre-wrap">{proposal.description || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
