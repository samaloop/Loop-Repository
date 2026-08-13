import Link from 'next/link';
import { Plus } from 'lucide-react';
import { requireSalesAccess } from '@/lib/salesAccess';
import CommunityProgramTable from '@/components/sales/CommunityProgramTable';

export default async function CommunityProgramsPage() {
  const { supabase } = await requireSalesAccess();

  const { data: programs } = await supabase
    .from('CommunityProgram')
    .select('*')
    .order('event_date', { ascending: false });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-10 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800">Program Komunitas</h1>
            <p className="text-sm text-slate-400 mt-1">Seminar/webinar komunitas & calon client yang terkait.</p>
          </div>
          <Link
            href="/sales/community-programs/new"
            className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-cyan-100 transition-all w-full md:w-auto"
          >
            <Plus size={16} /> Tambah Program
          </Link>
        </div>

        <CommunityProgramTable initialPrograms={programs || []} />
      </div>
    </div>
  );
}
