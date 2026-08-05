import { PILLARS, computeStatus, formatTargetValue, type ActivityEntry } from '@/lib/reportActivities';

interface ActivityStatusTableProps {
  activities: ActivityEntry[];
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

export default function ActivityStatusTable({ activities }: ActivityStatusTableProps) {
  return (
    <div className="space-y-8">
      {PILLARS.map((pillar) => {
        const rows = activities.filter((a) => a.pillar === pillar);
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
                    <th className="p-4 text-slate-500 font-bold uppercase text-[10px] tracking-widest text-center">Aktual</th>
                    <th className="p-4 text-slate-500 font-bold uppercase text-[10px] tracking-widest text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {rows.map((row) => (
                    <tr key={row.activity}>
                      <td className="p-4 font-medium text-slate-700">{row.activity}</td>
                      <td className="p-4 text-center text-slate-500">{formatTargetValue(row.target, row.targetType)}</td>
                      <td className="p-4 text-center text-slate-700 font-bold">{formatTargetValue(row.actual, row.targetType)}</td>
                      <td className="p-4 text-center">
                        <StatusBadge status={computeStatus(row.target, row.actual)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
