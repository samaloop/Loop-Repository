'use client'
import { useState } from 'react';
import Link from 'next/link';
import { deleteProspect } from '@/app/actions/prospects';
import { ringBadgeClass, type ProspectRecord } from '@/lib/prospectFields';

interface ProspectTableProps {
  initialProspects: ProspectRecord[];
}

function RingBadge({ ring }: { ring: string }) {
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${ringBadgeClass(ring)}`}>
      {ring}
    </span>
  );
}

export default function ProspectTable({ initialProspects }: ProspectTableProps) {
  const [prospects, setProspects] = useState(initialProspects);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Hapus calon client "${name}"? Tindakan ini tidak bisa dibatalkan.`)) return;

    const result = await deleteProspect(id);
    if (!result.success) {
      alert('Gagal menghapus: ' + result.error);
      return;
    }
    setProspects((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="hidden md:block bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="p-6 text-slate-500 font-bold uppercase text-[10px] tracking-widest text-left">Nama</th>
              <th className="p-6 text-slate-500 font-bold uppercase text-[10px] tracking-widest text-left">Perusahaan/Organisasi</th>
              <th className="p-6 text-slate-500 font-bold uppercase text-[10px] tracking-widest text-left">Tertarik Program</th>
              <th className="p-6 text-slate-500 font-bold uppercase text-[10px] tracking-widest text-center">Kategori-Ring</th>
              <th className="p-6 text-slate-500 font-bold uppercase text-[10px] tracking-widest text-right">Opsi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {prospects.length > 0 ? (
              prospects.map((prospect) => (
                <tr key={prospect.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-6">
                    <p className="font-bold text-slate-700">{prospect.full_name}</p>
                    <p className="text-[11px] text-slate-400 mt-1">{prospect.email || prospect.whatsapp || '-'}</p>
                  </td>
                  <td className="p-6 text-slate-600 text-sm">{prospect.company || '-'}</td>
                  <td className="p-6 text-slate-600 text-sm">{prospect.interested_program || '-'}</td>
                  <td className="p-6 text-center">
                    <RingBadge ring={prospect.ring} />
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end items-center gap-4">
                      <Link href={`/sales/prospects/${prospect.id}`} className="text-cyan-600 font-bold hover:text-cyan-700 text-sm">Detail</Link>
                      <Link href={`/sales/prospects/${prospect.id}/edit`} className="text-amber-500 font-bold hover:text-amber-600 text-sm">Edit</Link>
                      <button onClick={() => handleDelete(prospect.id, prospect.full_name)} className="text-rose-500 font-bold hover:text-rose-600 text-sm">Hapus</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} className="p-20 text-center text-slate-400 italic">Belum ada calon client.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4">
        {prospects.length === 0 && (
          <p className="p-10 text-center text-slate-400 italic">Belum ada calon client.</p>
        )}
        {prospects.map((prospect) => (
          <div key={prospect.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <RingBadge ring={prospect.ring} />
              <div className="flex gap-3 text-xs font-bold">
                <Link href={`/sales/prospects/${prospect.id}`} className="text-cyan-600">Detail</Link>
                <Link href={`/sales/prospects/${prospect.id}/edit`} className="text-amber-500">Edit</Link>
                <button onClick={() => handleDelete(prospect.id, prospect.full_name)} className="text-rose-500">Hapus</button>
              </div>
            </div>
            <h3 className="font-bold text-slate-800">{prospect.full_name}</h3>
            <p className="text-xs text-slate-400 mt-1">{prospect.company || '-'}</p>
            <p className="text-xs text-slate-500 mt-1">{prospect.interested_program || '-'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
