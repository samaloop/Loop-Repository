import Link from 'next/link';
import { Plus, BarChart3, MessagesSquare } from 'lucide-react';
import { requireSalesAccess } from '@/lib/salesAccess';
import { computeStatus, reportTypeLabel, type ReportType, type ActivityEntry } from '@/lib/reportActivities';

function overallStatus(activities: ActivityEntry[]) {
  const done = activities.filter((a) => computeStatus(a.target, a.actual) === 'Tercapai').length;
  return `${done}/${activities.length} tercapai`;
}

export default async function ReportsPage() {
  const { supabase } = await requireSalesAccess();

  const { data: reports } = await supabase
    .from('WeeklyReport')
    .select('*')
    .order('week_start_date', { ascending: false });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-10 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800">Weekly Relationship Report</h1>
            <p className="text-sm text-slate-400 mt-1">Progress mingguan tim Sales, Marketing & Relation.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              href="/sales/reports/team-review"
              className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-6 py-3.5 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all"
            >
              <MessagesSquare size={16} /> Team Review
            </Link>
            <Link
              href="/sales/reports/monthly"
              className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-6 py-3.5 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all"
            >
              <BarChart3 size={16} /> Rekap Bulanan
            </Link>
            <Link
              href="/sales/reports/new"
              className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-cyan-100 transition-all"
            >
              <Plus size={16} /> Tambah Laporan
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="p-6 text-slate-500 font-bold uppercase text-[10px] tracking-widest text-left">Nama</th>
                <th className="p-6 text-slate-500 font-bold uppercase text-[10px] tracking-widest text-left">Jenis Laporan</th>
                <th className="p-6 text-slate-500 font-bold uppercase text-[10px] tracking-widest text-left">Minggu</th>
                <th className="p-6 text-slate-500 font-bold uppercase text-[10px] tracking-widest text-center">Ringkasan</th>
                <th className="p-6 text-slate-500 font-bold uppercase text-[10px] tracking-widest text-right">Opsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {reports && reports.length > 0 ? (
                reports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-6 font-bold text-slate-700">{report.reporter_name}</td>
                    <td className="p-6 text-slate-600 text-sm">{reportTypeLabel(report.report_type as ReportType)}</td>
                    <td className="p-6 text-slate-600 text-sm">{report.week_start_date}</td>
                    <td className="p-6 text-center text-slate-600 text-sm">{overallStatus(report.activities || [])}</td>
                    <td className="p-6 text-right">
                      <Link href={`/sales/reports/${report.id}`} className="text-cyan-600 font-bold hover:text-cyan-700 text-sm">Detail</Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="p-20 text-center text-slate-400 italic">Belum ada laporan mingguan.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

