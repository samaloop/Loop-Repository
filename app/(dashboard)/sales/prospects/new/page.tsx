import Link from 'next/link';
import ProspectForm from '@/components/sales/ProspectForm';
import { requireSalesAccess } from '@/lib/salesAccess';

export default async function NewProspectPage({
  searchParams,
}: {
  searchParams: Promise<{ company_id?: string }>;
}) {
  const { supabase } = await requireSalesAccess();
  const { company_id } = await searchParams;
  const [{ data: companies }, { data: sectors }] = await Promise.all([
    supabase.from('Company').select('id, company_name').order('company_name'),
    supabase.from('IndustrySector').select('name').order('name'),
  ]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-10">
        <nav className="flex items-center gap-2 text-xs md:text-sm mb-6">
          <Link href="/sales/prospects" className="text-slate-400 hover:text-cyan-600 transition-colors">Calon Client</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-bold">Tambah Calon Client</span>
        </nav>

        <h1 className="text-2xl md:text-3xl font-black text-slate-800 mb-8">Tambah Calon Client</h1>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-6 md:p-10">
          <ProspectForm
            mode="create"
            companyOptions={companies || []}
            industrySectorOptions={(sectors || []).map((s) => s.name)}
            defaultCompanyId={company_id ? Number(company_id) : undefined}
          />
        </div>
      </div>
    </div>
  );
}
