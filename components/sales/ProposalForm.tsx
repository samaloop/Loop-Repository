'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { createProposal, updateProposal } from '@/app/actions/proposals';
import { PROPOSAL_STATUS_OPTIONS } from '@/lib/proposalStatus';

interface CompanyOption {
  id: number;
  company_name: string;
}

interface ProposalDefaults {
  company_id: number | null;
  proposal_no: string | null;
  category: string | null;
  program_name: string | null;
  invest_amount: number | null;
  status: string;
  contact_person: string | null;
  phone_number: string | null;
  email: string | null;
  description: string | null;
}

interface ProposalFormProps {
  mode: 'create' | 'edit';
  proposalId?: number;
  defaultValues?: ProposalDefaults;
  defaultCompanyId?: number;
  companyOptions: CompanyOption[];
}

export default function ProposalForm({ mode, proposalId, defaultValues, defaultCompanyId, companyOptions }: ProposalFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    if (mode === 'create') {
      const result = await createProposal(formData);
      if (!result.success) {
        setError(result.error || 'Terjadi kesalahan.');
        setIsSaving(false);
        return;
      }
      router.push(`/sales/proposals/${result.id}`);
      return;
    }

    const result = await updateProposal(proposalId!, formData);
    if (!result.success) {
      setError(result.error || 'Terjadi kesalahan.');
      setIsSaving(false);
      return;
    }
    router.push(`/sales/proposals/${proposalId}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-sm font-bold border border-rose-100">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">
            Perusahaan <span className="text-rose-500">*</span>
          </label>
          <select
            name="company_id"
            defaultValue={defaultValues?.company_id ?? defaultCompanyId ?? ''}
            required
            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none appearance-none font-medium"
          >
            <option value="">Pilih perusahaan</option>
            {companyOptions.map((c) => (
              <option key={c.id} value={c.id}>{c.company_name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">No. Proposal</label>
          <input type="text" name="proposal_no" defaultValue={defaultValues?.proposal_no || ''} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none font-medium" />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Kategori</label>
          <input type="text" name="category" defaultValue={defaultValues?.category || ''} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none font-medium" />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Nama Program</label>
          <input type="text" name="program_name" defaultValue={defaultValues?.program_name || ''} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none font-medium" />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Invest Amount (Rp)</label>
          <input type="number" name="invest_amount" min={0} step="any" defaultValue={defaultValues?.invest_amount ?? ''} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none font-medium" />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Status</label>
          <select name="status" defaultValue={defaultValues?.status || 'Draft'} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none appearance-none font-medium">
            {PROPOSAL_STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Contact Person</label>
          <input type="text" name="contact_person" defaultValue={defaultValues?.contact_person || ''} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none font-medium" />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Nomor Telepon</label>
          <input type="tel" name="phone_number" defaultValue={defaultValues?.phone_number || ''} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none font-medium" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Email</label>
          <input type="email" name="email" defaultValue={defaultValues?.email || ''} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none font-medium" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Deskripsi</label>
          <textarea name="description" rows={3} defaultValue={defaultValues?.description || ''} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none font-medium resize-none" />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isSaving}
          className="flex-1 md:flex-none md:px-10 py-4 border border-slate-100 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-all"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="flex-1 md:flex-none md:px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-cyan-600 disabled:bg-slate-200 transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
        >
          {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSaving ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>
    </form>
  );
}
