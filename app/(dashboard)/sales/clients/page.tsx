import ClientTable from '@/components/sales/ClientTable';
import ClientsToolbar from '@/components/sales/ClientsToolbar';
import { requireSalesAccess } from '@/lib/salesAccess';

export default async function ClientsPage() {
  const { supabase } = await requireSalesAccess();

  const { data: clients } = await supabase
    .from('Client')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-10 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800">Data Peserta</h1>
            <p className="text-sm text-slate-400 mt-1">Kelola data peserta program sertifikasi & training.</p>
          </div>
          <ClientsToolbar />
        </div>

        <ClientTable initialClients={clients || []} />
      </div>
    </div>
  );
}
