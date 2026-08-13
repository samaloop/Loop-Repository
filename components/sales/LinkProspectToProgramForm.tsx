'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, Loader2 } from 'lucide-react';
import { linkProspectToProgram } from '@/app/actions/communityPrograms';

interface ProspectOption {
  id: number;
  full_name: string;
}

export default function LinkProspectToProgramForm({ programId, prospectOptions }: { programId: number; prospectOptions: ProspectOption[] }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await linkProspectToProgram(programId, formData);

    if (!result.success) {
      setError(result.error || 'Terjadi kesalahan.');
      setIsSaving(false);
      return;
    }

    (e.target as HTMLFormElement).reset();
    setIsSaving(false);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <select
        name="prospect_id"
        required
        className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none appearance-none font-medium text-sm"
      >
        <option value="">Pilih calon client</option>
        {prospectOptions.map((p) => (
          <option key={p.id} value={p.id}>{p.full_name}</option>
        ))}
      </select>
      <button
        type="submit"
        disabled={isSaving}
        className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-slate-900 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg shadow-cyan-100 transition-all disabled:opacity-60"
      >
        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
        Tambah ke Program
      </button>
      {error && <p className="text-rose-600 text-xs font-bold sm:self-center">{error}</p>}
    </form>
  );
}
