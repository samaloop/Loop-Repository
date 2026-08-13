import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProposalForm from '@/components/sales/ProposalForm';
import { requireSalesAccess } from '@/lib/salesAccess';

export default async function EditProposalPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const { supabase } = await requireSalesAccess();

  const [{ data: proposal }, { data: companies }] = await Promise.all([
    supabase.from('Proposal').select('*').eq('id', id).single(),
    supabase.from('Company').select('id, company_name').order('company_name'),
  ]);
  if (!proposal) notFound();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-10">
        <nav className="flex items-center gap-2 text-xs md:text-sm mb-6">
          <Link href="/sales/proposals" className="text-slate-400 hover:text-cyan-600 transition-colors">Proposal</Link>
          <span className="text-slate-300">/</span>
          <Link href={`/sales/proposals/${proposal.id}`} className="text-slate-400 hover:text-cyan-600 transition-colors truncate">
            {proposal.proposal_no || proposal.program_name || 'Detail'}
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-bold">Edit</span>
        </nav>

        <h1 className="text-2xl md:text-3xl font-black text-slate-800 mb-8">Edit Proposal</h1>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-6 md:p-10">
          <ProposalForm
            mode="edit"
            proposalId={proposal.id}
            companyOptions={companies || []}
            defaultValues={{
              company_id: proposal.company_id,
              proposal_no: proposal.proposal_no,
              category: proposal.category,
              program_name: proposal.program_name,
              invest_amount: proposal.invest_amount,
              status: proposal.status,
              contact_person: proposal.contact_person,
              phone_number: proposal.phone_number,
              email: proposal.email,
              description: proposal.description,
            }}
          />
        </div>
      </div>
    </div>
  );
}
