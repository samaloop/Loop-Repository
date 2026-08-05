import Link from 'next/link';
import { Users, ArrowRight } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <section className="pt-8 pb-12 px-4 md:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block px-3 py-1 mb-4 bg-cyan-100 text-cyan-700 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest">
            Sales, Marketing & Relation
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-800 leading-tight mb-4 px-2">
            Data Peserta & <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-600 to-blue-700">Klien</span>
          </h1>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 md:px-6 pb-8 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm text-center">
            <p className="text-3xl md:text-4xl font-black text-slate-800">{stat.value}</p>
            <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 pb-20">
        <Link
          href="/sales/clients"
          className="group bg-white rounded-4xl md:rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 p-8 md:p-10 flex items-center justify-between"
        >
          <div className="flex items-center gap-5">
            <div className="bg-cyan-50 group-hover:bg-cyan-100 p-4 rounded-2xl transition-colors">
              <Users className="text-cyan-600" size={28} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Data Peserta</h3>
              <p className="text-sm text-slate-400">Kelola data peserta, tambah manual, atau upload Excel.</p>
            </div>
          </div>
          <ArrowRight className="text-slate-300 group-hover:text-cyan-600 group-hover:translate-x-1 transition-all" size={22} />
        </Link>
      </div>
    </div>
  );
}
