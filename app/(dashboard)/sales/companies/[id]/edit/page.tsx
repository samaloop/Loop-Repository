import Link from 'next/link';
import { notFound } from 'next/navigation';
import CompanyForm from '@/components/sales/CompanyForm';
import { requireSalesAccess } from '@/lib/salesAccess';

export default async function EditCompanyPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const { supabase } = await requireSalesAccess();

  const { data: company } = await supabase.from('Company').select('*').eq('id', id).single();
  if (!company) notFound();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 md:py-10">
        <nav className="flex items-center gap-2 text-xs md:text-sm mb-6">
          <Link href="/sales/companies" className="text-slate-400 hover:text-cyan-600 transition-colors">Perusahaan</Link>
          <span className="text-slate-300">/</span>
          <Link href={`/sales/companies/${company.id}`} className="text-slate-400 hover:text-cyan-600 transition-colors truncate">{company.company_name}</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-bold">Edit</span>
        </nav>

        <h1 className="text-2xl md:text-3xl font-black text-slate-800 mb-8">Edit Perusahaan</h1>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-6 md:p-10">
          <CompanyForm
            mode="edit"
            companyId={company.id}
            defaultValues={{ company_name: company.company_name }}
          />
        </div>
      </div>
    </div>
  );
}
