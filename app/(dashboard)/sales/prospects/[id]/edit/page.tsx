import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProspectForm from '@/components/sales/ProspectForm';
import { requireSalesAccess } from '@/lib/salesAccess';

export default async function EditProspectPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const { supabase } = await requireSalesAccess();

  const [{ data: prospect }, { data: companies }] = await Promise.all([
    supabase.from('Prospect').select('*').eq('id', id).single(),
    supabase.from('Company').select('id, company_name').order('company_name'),
  ]);
  if (!prospect) notFound();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-10">
        <nav className="flex items-center gap-2 text-xs md:text-sm mb-6">
          <Link href="/sales/prospects" className="text-slate-400 hover:text-cyan-600 transition-colors">Calon Client</Link>
          <span className="text-slate-300">/</span>
          <Link href={`/sales/prospects/${prospect.id}`} className="text-slate-400 hover:text-cyan-600 transition-colors truncate">{prospect.full_name}</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-bold">Edit</span>
        </nav>

        <h1 className="text-2xl md:text-3xl font-black text-slate-800 mb-8">Edit Calon Client</h1>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-6 md:p-10">
          <ProspectForm mode="edit" prospectId={prospect.id} defaultValues={prospect} companyOptions={companies || []} />
        </div>
      </div>
    </div>
  );
}
