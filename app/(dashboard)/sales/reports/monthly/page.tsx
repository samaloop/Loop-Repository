import Link from 'next/link';
import { requireSalesAccess } from '@/lib/salesAccess';
import { REPORT_TYPES, type ActivityEntry, type ReportType } from '@/lib/reportActivities';
import ActivityStatusTable from '@/components/sales/ActivityStatusTable';

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

function aggregateActivities(reports: { activities: ActivityEntry[] }[]): ActivityEntry[] {
  const map = new Map<string, ActivityEntry>();
  for (const report of reports) {
    for (const entry of report.activities || []) {
      const existing = map.get(entry.activity);
      if (existing) {
        existing.target += entry.target;
        existing.actual += entry.actual;
      } else {
        map.set(entry.activity, { ...entry });
      }
    }
  }
  return Array.from(map.values());
}

export default async function MonthlyReportPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; month?: string; year?: string }>;
}) {
  const { supabase } = await requireSalesAccess();
  const params = await searchParams;

  const now = new Date();
  const month = Number(params.month) || now.getMonth() + 1;
  const year = Number(params.year) || now.getFullYear();
  const reportType = (params.type as ReportType) || '';

  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = new Date(year, month, 0).toISOString().slice(0, 10);

  let aggregated: ActivityEntry[] = [];
  let reportCount = 0;

  if (reportType) {
    const { data: reports } = await supabase
      .from('WeeklyReport')
      .select('activities')
      .eq('report_type', reportType)
      .gte('week_start_date', startDate)
      .lte('week_start_date', endDate);

    reportCount = reports?.length || 0;
    aggregated = aggregateActivities(reports || []);
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-10 space-y-8">
        <nav className="flex items-center gap-2 text-xs md:text-sm">
          <Link href="/sales/reports" className="text-slate-400 hover:text-cyan-600 transition-colors">Weekly Report</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-bold">Rekap Bulanan</span>
        </nav>

        <h1 className="text-2xl md:text-3xl font-black text-slate-800">Rekap Bulanan</h1>

        <form method="get" className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-6 md:p-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Jenis Laporan</label>
            <select name="type" defaultValue={reportType} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none appearance-none font-medium">
              <option value="">Pilih jenis laporan</option>
              {REPORT_TYPES.map((rt) => (
                <option key={rt.key} value={rt.key}>{rt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Bulan</label>
            <select name="month" defaultValue={month} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none appearance-none font-medium">
              {MONTH_NAMES.map((name, i) => (
                <option key={name} value={i + 1}>{name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Tahun</label>
            <input type="number" name="year" defaultValue={year} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none font-medium" />
          </div>
          <button type="submit" className="py-3.5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-cyan-600 transition-all">
            Tampilkan
          </button>
        </form>

        {reportType ? (
          <>
            <p className="text-sm text-slate-400">
              Menampilkan agregat dari {reportCount} laporan mingguan untuk {MONTH_NAMES[month - 1]} {year}.
            </p>
            {aggregated.length > 0 ? (
              <ActivityStatusTable activities={aggregated} />
            ) : (
              <p className="p-10 text-center text-slate-400 italic bg-white rounded-[2.5rem] border border-slate-100">
                Belum ada laporan mingguan untuk kombinasi jenis laporan & bulan ini.
              </p>
            )}
          </>
        ) : (
          <p className="p-10 text-center text-slate-400 italic bg-white rounded-[2.5rem] border border-slate-100">
            Pilih jenis laporan untuk melihat rekap.
          </p>
        )}
      </div>
    </div>
  );
}
