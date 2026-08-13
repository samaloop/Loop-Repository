'use client'
import { useState } from 'react';
import Link from 'next/link';
import { deleteProposal } from '@/app/actions/proposals';
import { proposalStatusBadgeClass, formatInvestAmount } from '@/lib/proposalStatus';

interface ProposalRow {
  id: number;
  proposal_no: string | null;
  company_id: number;
  companyName: string;
  program_name: string | null;
  invest_amount: number | null;
  status: string;
  contact_person: string | null;
}

interface ProposalTableProps {
  initialProposals: ProposalRow[];
  showCompanyColumn?: boolean;
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${proposalStatusBadgeClass(status)}`}>
      {status}
    </span>
  );
}

export default function ProposalTable({ initialProposals, showCompanyColumn = true }: ProposalTableProps) {
  const [proposals, setProposals] = useState(initialProposals);

  const handleDelete = async (id: number, companyId: number, label: string) => {
    if (!confirm(`Hapus proposal "${label}"?`)) return;

    const result = await deleteProposal(id, companyId);
    if (!result.success) {
      alert('Gagal menghapus: ' + result.error);
      return;
    }
    setProposals((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="hidden md:block bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="p-6 text-slate-500 font-bold uppercase text-[10px] tracking-widest text-left">No. Proposal</th>
              {showCompanyColumn && <th className="p-6 text-slate-500 font-bold uppercase text-[10px] tracking-widest text-left">Perusahaan</th>}
              <th className="p-6 text-slate-500 font-bold uppercase text-[10px] tracking-widest text-left">Program</th>
              <th className="p-6 text-slate-500 font-bold uppercase text-[10px] tracking-widest text-right">Invest</th>
              <th className="p-6 text-slate-500 font-bold uppercase text-[10px] tracking-widest text-center">Status</th>
              <th className="p-6 text-slate-500 font-bold uppercase text-[10px] tracking-widest text-right">Opsi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {proposals.length > 0 ? (
              proposals.map((proposal) => (
                <tr key={proposal.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-6 font-bold text-slate-700">{proposal.proposal_no || '-'}</td>
                  {showCompanyColumn && (
                    <td className="p-6 text-slate-600 text-sm">
                      <Link href={`/sales/companies/${proposal.company_id}`} className="hover:text-cyan-600">{proposal.companyName}</Link>
                    </td>
                  )}
                  <td className="p-6 text-slate-600 text-sm">{proposal.program_name || '-'}</td>
                  <td className="p-6 text-right text-slate-600 text-sm font-medium">{formatInvestAmount(proposal.invest_amount)}</td>
                  <td className="p-6 text-center"><StatusBadge status={proposal.status} /></td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end items-center gap-4">
                      <Link href={`/sales/proposals/${proposal.id}`} className="text-cyan-600 font-bold hover:text-cyan-700 text-sm">Detail</Link>
                      <Link href={`/sales/proposals/${proposal.id}/edit`} className="text-amber-500 font-bold hover:text-amber-600 text-sm">Edit</Link>
                      <button onClick={() => handleDelete(proposal.id, proposal.company_id, proposal.proposal_no || proposal.program_name || 'ini')} className="text-rose-500 font-bold hover:text-rose-600 text-sm">Hapus</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={showCompanyColumn ? 6 : 5} className="p-20 text-center text-slate-400 italic">Belum ada proposal.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4">
        {proposals.length === 0 && (
          <p className="p-10 text-center text-slate-400 italic">Belum ada proposal.</p>
        )}
        {proposals.map((proposal) => (
          <div key={proposal.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <StatusBadge status={proposal.status} />
              <div className="flex gap-3 text-xs font-bold">
                <Link href={`/sales/proposals/${proposal.id}`} className="text-cyan-600">Detail</Link>
                <Link href={`/sales/proposals/${proposal.id}/edit`} className="text-amber-500">Edit</Link>
                <button onClick={() => handleDelete(proposal.id, proposal.company_id, proposal.proposal_no || proposal.program_name || 'ini')} className="text-rose-500">Hapus</button>
              </div>
            </div>
            <h3 className="font-bold text-slate-800">{proposal.proposal_no || proposal.program_name || 'Proposal'}</h3>
            {showCompanyColumn && <p className="text-xs text-slate-400 mt-1">{proposal.companyName}</p>}
            <p className="text-xs text-slate-500 mt-1">{formatInvestAmount(proposal.invest_amount)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
