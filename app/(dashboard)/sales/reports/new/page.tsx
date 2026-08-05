import Link from 'next/link';
import WeeklyReportForm from '@/components/sales/WeeklyReportForm';
import { requireSalesAccess } from '@/lib/salesAccess';

export default async function NewReportPage() {
  const { supabase } = await requireSalesAccess();
  const { data: { user } } = await supabase.auth.getUser();
  const defaultReporterName = user?.email?.split('@')[0] || '';

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-10">
        <nav className="flex items-center gap-2 text-xs md:text-sm mb-6">
          <Link href="/sales/reports" className="text-slate-400 hover:text-cyan-600 transition-colors">Weekly Report</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-bold">Tambah Laporan</span>
        </nav>

        <h1 className="text-2xl md:text-3xl font-black text-slate-800 mb-8">Tambah Laporan Mingguan</h1>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-6 md:p-10">
          <WeeklyReportForm defaultReporterName={defaultReporterName} />
        </div>
      </div>
    </div>
  );
}
