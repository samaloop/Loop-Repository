import Link from 'next/link';
import IndustrySectorManager from '@/components/sales/IndustrySectorManager';
import { requireSalesAccess } from '@/lib/salesAccess';

export default async function IndustrySectorsPage() {
  const { supabase } = await requireSalesAccess();
  const { data: sectors } = await supabase.from('IndustrySector').select('*').order('name');

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-10">
        <nav className="flex items-center gap-2 text-xs md:text-sm mb-6">
          <Link href="/sales/prospects" className="text-slate-400 hover:text-cyan-600 transition-colors">Calon Client</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-bold">Kelola Sektor Industri</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-slate-800">Kelola Sektor Industri</h1>
          <p className="text-sm text-slate-400 mt-1">Daftar pilihan Sektor Industri yang muncul di form Calon Client.</p>
        </div>

        <IndustrySectorManager initialSectors={sectors || []} />
      </div>
    </div>
  );
}
