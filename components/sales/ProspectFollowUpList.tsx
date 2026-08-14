'use client'
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, Pencil, Trash2, X } from 'lucide-react';
import { createFollowUp, updateFollowUp, deleteFollowUp } from '@/app/actions/prospectFollowUps';

interface FollowUpRecord {
  id: number;
  follow_up_date: string;
  detail: string | null;
}

interface ProspectFollowUpListProps {
  prospectId: number;
  initialFollowUps: FollowUpRecord[];
}

function sortFollowUps(followUps: FollowUpRecord[]) {
  return [...followUps].sort((a, b) => {
    if (a.follow_up_date !== b.follow_up_date) return a.follow_up_date.localeCompare(b.follow_up_date);
    return a.id - b.id;
  });
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function ProspectFollowUpList({ prospectId, initialFollowUps }: ProspectFollowUpListProps) {
  const router = useRouter();
  const followUps = useMemo(() => sortFollowUps(initialFollowUps), [initialFollowUps]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await createFollowUp(prospectId, formData);

    if (!result.success) {
      setError(result.error || 'Terjadi kesalahan.');
      setIsSaving(false);
      return;
    }

    (e.target as HTMLFormElement).reset();
    setIsSaving(false);
    router.refresh();
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>, id: number) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await updateFollowUp(id, prospectId, formData);

    if (!result.success) {
      setError(result.error || 'Terjadi kesalahan.');
      setIsSaving(false);
      return;
    }

    setIsSaving(false);
    setEditingId(null);
    router.refresh();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus follow up ini?')) return;

    const result = await deleteFollowUp(id, prospectId);
    if (!result.success) {
      alert('Gagal menghapus: ' + result.error);
      return;
    }
    router.refresh();
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleAdd} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col sm:flex-row gap-3 sm:items-start">
        <input
          type="date"
          name="follow_up_date"
          required
          className="sm:w-48 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none font-medium text-sm"
        />
        <textarea
          name="detail"
          placeholder="Detail follow up (opsional)"
          rows={1}
          className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none font-medium text-sm resize-none"
        />
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-slate-900 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg shadow-cyan-100 transition-all disabled:opacity-60 shrink-0"
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
          Tambah Follow Up
        </button>
      </form>
      {error && (
        <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-sm font-bold border border-rose-100">
          {error}
        </div>
      )}

      {followUps.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50">
          {followUps.map((followUp, index) =>
            editingId === followUp.id ? (
              <form
                key={followUp.id}
                onSubmit={(e) => handleUpdate(e, followUp.id)}
                className="flex flex-col sm:flex-row gap-3 sm:items-start p-5"
              >
                <input
                  type="date"
                  name="follow_up_date"
                  defaultValue={followUp.follow_up_date}
                  required
                  className="sm:w-48 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none font-medium text-sm"
                />
                <textarea
                  name="detail"
                  defaultValue={followUp.detail || ''}
                  rows={1}
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none font-medium text-sm resize-none"
                />
                <div className="flex gap-2 shrink-0">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-cyan-600 transition-all disabled:opacity-60"
                  >
                    Simpan
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="px-4 py-3 border border-slate-100 text-slate-500 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all"
                  >
                    <X size={16} />
                  </button>
                </div>
              </form>
            ) : (
              <div key={followUp.id} className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 p-5">
                <div className="flex gap-3 min-w-0">
                  <span className="shrink-0 px-3 py-1 h-fit rounded-full text-[10px] font-black uppercase tracking-widest bg-cyan-50 text-cyan-700">
                    Follow Up {index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-500">{formatDate(followUp.follow_up_date)}</p>
                    <p className="text-sm text-slate-700 mt-1 whitespace-pre-wrap">{followUp.detail || '-'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <button onClick={() => setEditingId(followUp.id)} className="flex items-center gap-1.5 text-amber-500 font-bold hover:text-amber-600 text-sm">
                    <Pencil size={14} /> Edit
                  </button>
                  <button onClick={() => handleDelete(followUp.id)} className="flex items-center gap-1.5 text-rose-500 font-bold hover:text-rose-600 text-sm">
                    <Trash2 size={14} /> Hapus
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <p className="p-8 text-center text-slate-400 italic bg-white rounded-2xl border border-slate-100">
          Belum ada follow up yang tercatat.
        </p>
      )}
    </div>
  );
}
