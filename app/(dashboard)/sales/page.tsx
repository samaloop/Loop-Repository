import Link from 'next/link';
import { Users, ArrowRight, ClipboardList } from 'lucide-react';
import { requireSalesAccess } from '@/lib/salesAccess';

export default async function SalesPage() {
  const { supabase } = await requireSalesAccess();

  const { data: clients } = await supabase.from('Client').select('payment_status');

  const total = clients?.length ?? 0;
  const lunas = clients?.filter((c) => c.payment_status === 'Lunas').length ?? 0;
  const bertahap = total - lunas;

  const stats = [
    { label: 'Total Peserta', value: total },
    { label: 'Lunas', value: lunas },
    { label: 'Pembayaran Bertahap', value: bertahap },
  ];

  const menuItems = [
    {
      href: '/sales/clients',
      icon: Users,
      title: 'Data Peserta',
      description: 'Tambah manual atau upload Excel.',
    },
    {
      href: '/sales/reports',
      icon: ClipboardList,
      title: 'Weekly Relationship Report',
      description: 'Laporan mingguan, rekap bulanan, & team review.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6">
        <div className="flex items-center gap-3">
          <span className="inline-block px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-[10px] font-black uppercase tracking-widest">
            Sales, Marketing & Relation
          </span>
          <h1 className="text-lg md:text-xl font-black text-slate-800">Data Peserta & Klien</h1>
        </div>

        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-4 md:p-5 border border-slate-100 shadow-sm text-center">
              <p className="text-xl md:text-2xl font-black text-slate-800">{stat.value}</p>
              <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-slate-100 p-4 md:p-5 flex items-center gap-4"
            >
              <div className="bg-cyan-50 group-hover:bg-cyan-100 p-3 rounded-xl transition-colors shrink-0">
                <item.icon className="text-cyan-600" size={20} />
              </div>
              <div className="min-w-0 grow">
                <h3 className="text-sm font-bold text-slate-800">{item.title}</h3>
                <p className="text-xs text-slate-400 truncate">{item.description}</p>
              </div>
              <ArrowRight className="text-slate-300 group-hover:text-cyan-600 group-hover:translate-x-1 transition-all shrink-0" size={18} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
