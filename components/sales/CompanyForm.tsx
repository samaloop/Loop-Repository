'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { createCompany, updateCompany } from '@/app/actions/companies';

interface CompanyFormProps {
  mode: 'create' | 'edit';
  companyId?: number;
  defaultValues?: { company_name: string };
}

export default function CompanyForm({ mode, companyId, defaultValues }: CompanyFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    if (mode === 'create') {
      const result = await createCompany(formData);
      if (!result.success) {
        setError(result.error || 'Terjadi kesalahan.');
        setIsSaving(false);
        return;
      }
      router.push(`/sales/companies/${result.id}`);
      return;
    }

    const result = await updateCompany(companyId!, formData);
    if (!result.success) {
      setError(result.error || 'Terjadi kesalahan.');
      setIsSaving(false);
      return;
    }
    router.push(`/sales/companies/${companyId}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-sm font-bold border border-rose-100">
          {error}
        </div>
      )}

      <div>
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">
          Nama Perusahaan <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          name="company_name"
          defaultValue={defaultValues?.company_name || ''}
          required
          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none font-medium"
        />
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
