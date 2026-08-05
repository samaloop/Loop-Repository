import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireSalesAccess } from '@/lib/salesAccess';
import { reportTypeLabel, type ReportType } from '@/lib/reportActivities';
import ActivityStatusTable from '@/components/sales/ActivityStatusTable';

export default async function ReportDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const { supabase } = await requireSalesAccess();

  const { data: report } = await supabase.from('WeeklyReport').select('*').eq('id', id).single();
  if (!report) notFound();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-10">
        <nav className="flex items-center gap-2 text-xs md:text-sm mb-6">
          <Link href="/sales/reports" className="text-slate-400 hover:text-cyan-600 transition-colors">Weekly Report</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-bold truncate">{report.reporter_name}</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-slate-800">{report.reporter_name}</h1>
          <p className="text-sm text-slate-400 mt-1">
            {reportTypeLabel(report.report_type as ReportType)} &middot; Minggu {report.week_start_date}
          </p>
        </div>

        <ActivityStatusTable activities={report.activities || []} />
      </div>
    </div>
  );
}
