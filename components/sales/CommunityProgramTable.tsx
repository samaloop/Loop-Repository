'use client'
import { useState } from 'react';
import Link from 'next/link';
import { deleteCommunityProgram } from '@/app/actions/communityPrograms';

interface CommunityProgramRow {
  id: number;
  community_name: string;
  category: string | null;
  event_date: string | null;
  event_time: string | null;
}

interface CommunityProgramTableProps {
  initialPrograms: CommunityProgramRow[];
}

export default function CommunityProgramTable({ initialPrograms }: CommunityProgramTableProps) {
  const [programs, setPrograms] = useState(initialPrograms);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Hapus program komunitas "${name}"? Keterkaitan dengan calon client juga akan terhapus.`)) return;

    const result = await deleteCommunityProgram(id);
    if (!result.success) {
      alert('Gagal menghapus: ' + result.error);
      return;
    }
    setPrograms((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="hidden md:block bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="p-6 text-slate-500 font-bold uppercase text-[10px] tracking-widest text-left">Nama Komunitas</th>
              <th className="p-6 text-slate-500 font-bold uppercase text-[10px] tracking-widest text-left">Kategori</th>
              <th className="p-6 text-slate-500 font-bold uppercase text-[10px] tracking-widest text-left">Tanggal & Jam</th>
              <th className="p-6 text-slate-500 font-bold uppercase text-[10px] tracking-widest text-right">Opsi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {programs.length > 0 ? (
              programs.map((program) => (
                <tr key={program.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-6 font-bold text-slate-700">{program.community_name}</td>
                  <td className="p-6 text-slate-600 text-sm">{program.category || '-'}</td>
                  <td className="p-6 text-slate-600 text-sm">
                    {program.event_date || '-'} {program.event_time ? `· ${program.event_time}` : ''}
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end items-center gap-4">
                      <Link href={`/sales/community-programs/${program.id}`} className="text-cyan-600 font-bold hover:text-cyan-700 text-sm">Detail</Link>
                      <Link href={`/sales/community-programs/${program.id}/edit`} className="text-amber-500 font-bold hover:text-amber-600 text-sm">Edit</Link>
                      <button onClick={() => handleDelete(program.id, program.community_name)} className="text-rose-500 font-bold hover:text-rose-600 text-sm">Hapus</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={4} className="p-20 text-center text-slate-400 italic">Belum ada program komunitas.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4">
        {programs.length === 0 && (
          <p className="p-10 text-center text-slate-400 italic">Belum ada program komunitas.</p>
        )}
        {programs.map((program) => (
          <div key={program.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-slate-800">{program.community_name}</h3>
              <div className="flex gap-3 text-xs font-bold shrink-0">
                <Link href={`/sales/community-programs/${program.id}`} className="text-cyan-600">Detail</Link>
                <Link href={`/sales/community-programs/${program.id}/edit`} className="text-amber-500">Edit</Link>
                <button onClick={() => handleDelete(program.id, program.community_name)} className="text-rose-500">Hapus</button>
              </div>
            </div>
            <p className="text-xs text-slate-400">{program.category || '-'}</p>
            <p className="text-xs text-slate-500 mt-1">{program.event_date || '-'} {program.event_time ? `· ${program.event_time}` : ''}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
