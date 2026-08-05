'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { upsertTeamReview } from '@/app/actions/reports';
import { TEAM_REVIEW_QUESTIONS } from '@/lib/reportActivities';

interface TeamReviewFormProps {
  defaultValues?: Record<string, string | null>;
}

export default function TeamReviewForm({ defaultValues }: TeamReviewFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await upsertTeamReview(formData);

    if (!result.success) {
      setError(result.error || 'Terjadi kesalahan.');
      setIsSaving(false);
      return;
    }
    router.refresh();
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-sm font-bold border border-rose-100">
          {error}
        </div>
      )}

      <div>
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">
          Minggu <span className="text-rose-500">*</span>
        </label>
        <input
          type="date"
          name="week_start_date"
          defaultValue={new Date().toISOString().slice(0, 10)}
          required
          className="w-full md:w-64 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none font-medium"
        />
      </div>

      {TEAM_REVIEW_QUESTIONS.map((q) => (
        <div key={q.key}>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">
            {q.label}
          </label>
          <textarea
            name={q.key}
            defaultValue={defaultValues?.[q.key] ?? ''}
            rows={3}
            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none font-medium resize-none"
          />
        </div>
      ))}

      <button
        type="submit"
        disabled={isSaving}
        className="w-full md:w-auto md:px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-cyan-600 disabled:bg-slate-200 transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
      >
        {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
        {isSaving ? 'Menyimpan...' : 'Simpan Team Review'}
      </button>
    </form>
  );
}
