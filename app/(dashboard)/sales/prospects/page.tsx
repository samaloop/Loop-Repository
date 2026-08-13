import ProspectTable from '@/components/sales/ProspectTable';
import ProspectsToolbar from '@/components/sales/ProspectsToolbar';
import { requireSalesAccess } from '@/lib/salesAccess';

export default async function ProspectsPage() {
  const { supabase } = await requireSalesAccess();

  const { data: prospects } = await supabase
    .from('Prospect')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-10 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800">Calon Client (Prospek)</h1>
            <p className="text-sm text-slate-400 mt-1">Lead pra-registrasi yang masih di-follow up tim sales.</p>
          </div>
          <ProspectsToolbar />
        </div>

        <ProspectTable initialProspects={prospects || []} />
      </div>
    </div>
  );
}
