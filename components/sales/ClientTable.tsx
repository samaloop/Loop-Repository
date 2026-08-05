'use client'
import { useState } from 'react';
import Link from 'next/link';
import { deleteClientRecord } from '@/app/actions/sales';
import type { ClientRecord } from '@/lib/clientFields';

interface ClientTableProps {
  initialClients: ClientRecord[];
}

function StatusBadge({ status }: { status: string }) {
  const isLunas = status === 'Lunas';
  return (
    <span
      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
        isLunas ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
      }`}
    >
      {status}
    </span>
  );
}

export default function ClientTable({ initialClients }: ClientTableProps) {
  const [clients, setClients] = useState(initialClients);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Hapus data peserta "${name}"? Tindakan ini tidak bisa dibatalkan.`)) return;

    const result = await deleteClientRecord(id);
    if (!result.success) {
      alert('Gagal menghapus: ' + result.error);
      return;
    }
    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  const programOf = (c: ClientRecord) => c.certification_program || c.training_program || '-';

  return (
    <div className="space-y-6">
      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="p-6 text-slate-500 font-bold uppercase text-[10px] tracking-widest text-left">Nama</th>
              <th className="p-6 text-slate-500 font-bold uppercase text-[10px] tracking-widest text-left">Perusahaan</th>
              <th className="p-6 text-slate-500 font-bold uppercase text-[10px] tracking-widest text-left">Program</th>
              <th className="p-6 text-slate-500 font-bold uppercase text-[10px] tracking-widest text-center">Status Pembayaran</th>
              <th className="p-6 text-slate-500 font-bold uppercase text-[10px] tracking-widest text-right">Opsi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {clients.length > 0 ? (
              clients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-6">
                    <p className="font-bold text-slate-700">{client.full_name}</p>
                    <p className="text-[11px] text-slate-400 mt-1">{client.email || client.phone || '-'}</p>
                  </td>
                  <td className="p-6 text-slate-600 text-sm">{client.company || '-'}</td>
                  <td className="p-6 text-slate-600 text-sm">{programOf(client)}</td>
                  <td className="p-6 text-center">
                    <StatusBadge status={client.payment_status} />
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end items-center gap-4">
                      <Link href={`/sales/clients/${client.id}`} className="text-cyan-600 font-bold hover:text-cyan-700 text-sm">Detail</Link>
                      <Link href={`/sales/clients/${client.id}/edit`} className="text-amber-500 font-bold hover:text-amber-600 text-sm">Edit</Link>
                      <button onClick={() => handleDelete(client.id, client.full_name)} className="text-rose-500 font-bold hover:text-rose-600 text-sm">Hapus</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} className="p-20 text-center text-slate-400 italic">Belum ada data peserta.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-4">
        {clients.length === 0 && (
          <p className="p-10 text-center text-slate-400 italic">Belum ada data peserta.</p>
        )}
        {clients.map((client) => (
          <div key={client.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <StatusBadge status={client.payment_status} />
              <div className="flex gap-3 text-xs font-bold">
                <Link href={`/sales/clients/${client.id}`} className="text-cyan-600">Detail</Link>
                <Link href={`/sales/clients/${client.id}/edit`} className="text-amber-500">Edit</Link>
                <button onClick={() => handleDelete(client.id, client.full_name)} className="text-rose-500">Hapus</button>
              </div>
            </div>
            <h3 className="font-bold text-slate-800">{client.full_name}</h3>
            <p className="text-xs text-slate-400 mt-1">{client.company || '-'}</p>
            <p className="text-xs text-slate-500 mt-1">{programOf(client)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
