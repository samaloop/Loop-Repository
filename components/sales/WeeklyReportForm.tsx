'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { submitWeeklyReport } from '@/app/actions/reports';
import {
  ACTIVITY_CATALOG,
  PILLARS,
  REPORT_TYPES,
  activitySlug,
  computeStatus,
  formatTargetValue,
  type ReportType,
} from '@/lib/reportActivities';

interface WeeklyReportFormProps {
  defaultReporterName: string;
}

function StatusBadge({ status }: { status: 'Tercapai' | 'Belum Tercapai' }) {
  const isDone = status === 'Tercapai';
  return (
    <span
      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
        isDone ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
      }`}
    >
      {status}
    </span>
  );
}

export default function WeeklyReportForm({ defaultReporterName }: WeeklyReportFormProps) {
  const router = useRouter();
  const [reportType, setReportType] = useState<ReportType | ''>('');
  const [actuals, setActuals] = useState<Record<string, number>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const catalog = reportType ? ACTIVITY_CATALOG[reportType] : [];

  const handleReportTypeChange = (value: ReportType | '') => {
    setReportType(value);
    setActuals({});
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!reportType) {
      setError('Pilih jenis laporan terlebih dahulu.');
      return;
    }
    setIsSaving(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await submitWeeklyReport(formData);

    if (!result.success) {
      setError(result.error || 'Terjadi kesalahan.');
      setIsSaving(false);
      return;
    }
    router.push('/sales/reports');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-sm font-bold border border-rose-100">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">
            Jenis Laporan <span className="text-rose-500">*</span>
          </label>
          <select
            name="report_type"
            value={reportType}
            onChange={(e) => handleReportTypeChange(e.target.value as ReportType | '')}
            required
            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none appearance-none font-medium"
          >
            <option value="">Pilih jenis laporan</option>
            {REPORT_TYPES.map((rt) => (
              <option key={rt.key} value={rt.key}>{rt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">
            Nama <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="reporter_name"
            defaultValue={defaultReporterName}
            required
            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none font-medium"
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">
            Minggu <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            name="week_start_date"
            defaultValue={new Date().toISOString().slice(0, 10)}
            required
            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none font-medium"
          />
        </div>
      </div>

      {reportType && (
        <div className="space-y-8">
          {PILLARS.map((pillar) => {
            const rows = catalog.filter((a) => a.pillar === pillar);
            if (rows.length === 0) return null;
            return (
              <div key={pillar}>
                <h3 className="text-xs font-black text-cyan-700 uppercase tracking-widest mb-3">{pillar}</h3>
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                  <table className="w-full border-collapse">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                      <tr>
                        <th className="p-4 text-slate-500 font-bold uppercase text-[10px] tracking-widest text-left">Aktivitas</th>
                        <th className="p-4 text-slate-500 font-bold uppercase text-[10px] tracking-widest text-center">Target</th>
                        <th className="p-4 text-slate-500 font-bold uppercase text-[10px] tracking-widest text-center w-32">Aktual</th>
                        <th className="p-4 text-slate-500 font-bold uppercase text-[10px] tracking-widest text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {rows.map((row) => {
                        const slug = activitySlug(row.activity);
                        const fieldName = `actual__${row.pillar}__${slug}`;
                        const actualValue = actuals[fieldName] ?? 0;
                        return (
                          <tr key={row.activity}>
                            <td className="p-4 font-medium text-slate-700">{row.activity}</td>
                            <td className="p-4 text-center text-slate-500">{formatTargetValue(row.target, row.targetType)}</td>
                            <td className="p-4 text-center">
                              <input
                                type="number"
                                min={0}
                                max={row.targetType === 'percentage' ? 100 : undefined}
                                name={fieldName}
                                value={actualValue}
                                onChange={(e) => setActuals((prev) => ({ ...prev, [fieldName]: Number(e.target.value) || 0 }))}
                                className="w-24 mx-auto px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-center focus:ring-2 focus:ring-cyan-500 outline-none font-bold"
                              />
                            </td>
                            <td className="p-4 text-center">
                              <StatusBadge status={computeStatus(row.target, actualValue)} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isSaving}
          className="flex-1 md:flex-none md:px-10 py-4 border border-slate-100 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-all"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSaving || !reportType}
          className="flex-1 md:flex-none md:px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-cyan-600 disabled:bg-slate-200 transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
        >
          {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSaving ? 'Menyimpan...' : 'Simpan Laporan'}
        </button>
      </div>
    </form>
  );
}
