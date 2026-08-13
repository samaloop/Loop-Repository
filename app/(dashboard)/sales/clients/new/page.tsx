import Link from 'next/link';
import ClientForm from '@/components/sales/ClientForm';
import { requireSalesAccess } from '@/lib/salesAccess';

export default async function NewClientPage() {
  const { supabase } = await requireSalesAccess();
  const { data: companies } = await supabase.from('Company').select('id, company_name').order('company_name');

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-10">
        <nav className="flex items-center gap-2 text-xs md:text-sm mb-6">
          <Link href="/sales/clients" className="text-slate-400 hover:text-cyan-600 transition-colors">Data Peserta</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-bold">Tambah Peserta</span>
        </nav>

        <h1 className="text-2xl md:text-3xl font-black text-slate-800 mb-8">Tambah Peserta Baru</h1>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-6 md:p-10">
          <ClientForm mode="create" companyOptions={companies || []} />
        </div>
      </div>
    </div>
  );
}
