'use client'
import { useState } from 'react';
import Link from 'next/link';
import { deleteCompany } from '@/app/actions/companies';

interface CompanyRow {
  id: number;
  company_name: string;
}

interface CompanyTableProps {
  initialCompanies: CompanyRow[];
}

export default function CompanyTable({ initialCompanies }: CompanyTableProps) {
  const [companies, setCompanies] = useState(initialCompanies);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Hapus perusahaan "${name}"? Proposal terkait tidak akan otomatis terhapus.`)) return;

    const result = await deleteCompany(id);
    if (!result.success) {
      alert('Gagal menghapus: ' + result.error);
      return;
    }
    setCompanies((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="hidden md:block bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="p-6 text-slate-500 font-bold uppercase text-[10px] tracking-widest text-left">Nama Perusahaan</th>
              <th className="p-6 text-slate-500 font-bold uppercase text-[10px] tracking-widest text-right">Opsi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {companies.length > 0 ? (
              companies.map((company) => (
                <tr key={company.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-6 font-bold text-slate-700">{company.company_name}</td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end items-center gap-4">
                      <Link href={`/sales/companies/${company.id}`} className="text-cyan-600 font-bold hover:text-cyan-700 text-sm">Detail</Link>
                      <Link href={`/sales/companies/${company.id}/edit`} className="text-amber-500 font-bold hover:text-amber-600 text-sm">Edit</Link>
                      <button onClick={() => handleDelete(company.id, company.company_name)} className="text-rose-500 font-bold hover:text-rose-600 text-sm">Hapus</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={2} className="p-20 text-center text-slate-400 italic">Belum ada perusahaan terdaftar.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4">
        {companies.length === 0 && (
          <p className="p-10 text-center text-slate-400 italic">Belum ada perusahaan terdaftar.</p>
        )}
        {companies.map((company) => (
          <div key={company.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-800">{company.company_name}</h3>
              <div className="flex gap-3 text-xs font-bold shrink-0">
                <Link href={`/sales/companies/${company.id}`} className="text-cyan-600">Detail</Link>
                <Link href={`/sales/companies/${company.id}/edit`} className="text-amber-500">Edit</Link>
                <button onClick={() => handleDelete(company.id, company.company_name)} className="text-rose-500">Hapus</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
