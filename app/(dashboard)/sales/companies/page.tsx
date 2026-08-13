import Link from 'next/link';
import { Plus, FileStack } from 'lucide-react';
import { requireSalesAccess } from '@/lib/salesAccess';
import CompanyTable from '@/components/sales/CompanyTable';

export default async function CompaniesPage() {
  const { supabase } = await requireSalesAccess();

  const { data: companies } = await supabase.from('Company').select('*').order('created_at', { ascending: false });

  const rows = (companies || []).map((c) => ({
    id: c.id,
    company_name: c.company_name,
  }));

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-10 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800">Perusahaan</h1>
            {/* <p className="text-sm text-slate-400 mt-1">Perusahaan yang terdaftar untuk program corporate.</p> */}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              href="/sales/proposals"
              className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-6 py-3.5 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all"
            >
              <FileStack size={16} /> Lihat Semua Proposal
            </Link>
            <Link
              href="/sales/companies/new"
              className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-cyan-100 transition-all"
            >
              <Plus size={16} /> Tambah Perusahaan
            </Link>
          </div>
        </div>

        <CompanyTable initialCompanies={rows} />
      </div>
    </div>
  );
}
