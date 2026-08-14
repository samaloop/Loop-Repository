'use client'
import { useState } from 'react';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { createIndustrySector, deleteIndustrySector } from '@/app/actions/industrySectors';

interface IndustrySectorRecord {
  id: number;
  name: string;
}

interface IndustrySectorManagerProps {
  initialSectors: IndustrySectorRecord[];
}

export default function IndustrySectorManager({ initialSectors }: IndustrySectorManagerProps) {
  const [sectors, setSectors] = useState(initialSectors);
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const formData = new FormData();
    formData.set('name', name);
    const result = await createIndustrySector(formData);

    if (!result.success) {
      setError(result.error || 'Terjadi kesalahan.');
      setIsSaving(false);
      return;
    }

    setSectors((prev) => [...prev, { id: Date.now(), name: name.trim() }].sort((a, b) => a.name.localeCompare(b.name)));
    setName('');
    setIsSaving(false);
  };

  const handleDelete = async (id: number, sectorName: string) => {
    if (!confirm(`Hapus sektor industri "${sectorName}"?`)) return;

    const result = await deleteIndustrySector(id);
    if (!result.success) {
      alert('Gagal menghapus: ' + result.error);
      return;
    }
    setSectors((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 flex flex-col sm:flex-row gap-3">
        {error && (
          <div className="sm:hidden bg-rose-50 text-rose-600 p-3 rounded-2xl text-sm font-bold border border-rose-100">
            {error}
          </div>
        )}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama sektor industri baru"
          required
          className="flex-1 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none font-medium"
        />
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold text-sm shadow-lg shadow-cyan-100 transition-all disabled:bg-slate-200"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus size={16} />}
          Tambah
        </button>
      </form>
      {error && (
        <div className="hidden sm:block bg-rose-50 text-rose-600 p-4 rounded-2xl text-sm font-bold border border-rose-100">
          {error}
        </div>
      )}

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm divide-y divide-slate-50">
        {sectors.length > 0 ? (
          sectors.map((sector) => (
            <div key={sector.id} className="flex items-center justify-between gap-3 p-5">
              <p className="font-bold text-slate-700 text-sm">{sector.name}</p>
              <button
                onClick={() => handleDelete(sector.id, sector.name)}
                className="flex items-center gap-1.5 text-rose-500 font-bold hover:text-rose-600 text-sm"
              >
                <Trash2 size={14} /> Hapus
              </button>
            </div>
          ))
        ) : (
          <p className="p-10 text-center text-slate-400 italic">Belum ada sektor industri.</p>
        )}
      </div>
    </div>
  );
}
