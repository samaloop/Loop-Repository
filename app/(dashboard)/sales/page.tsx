import Link from 'next/link';
import { Users, ArrowRight, ClipboardList, Building2, UserSearch, CalendarDays } from 'lucide-react';
import { requireSalesAccess } from '@/lib/salesAccess';

export default async function SalesPage() {
  const { supabase } = await requireSalesAccess();

  const [{ count: clientCount }, { count: companyCount }, { count: proposalCount }, { count: prospectCount }] = await Promise.all([
    supabase.from('Client').select('*', { count: 'exact', head: true }),
    supabase.from('Company').select('*', { count: 'exact', head: true }),
    supabase.from('Proposal').select('*', { count: 'exact', head: true }),
    supabase.from('Prospect').select('*', { count: 'exact', head: true }),
  ]);

  const stats = [
    { label: 'Total Peserta', value: clientCount ?? 0 },
    { label: 'Perusahaan', value: companyCount ?? 0 },
    { label: 'Proposal', value: proposalCount ?? 0 },
    { label: 'Calon Client', value: prospectCount ?? 0 },
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
    {
      href: '/sales/companies',
      icon: Building2,
      title: 'Perusahaan & Proposal',
      description: 'Company terdaftar & proposal corporate.',
    },
    {
      href: '/sales/prospects',
      icon: UserSearch,
      title: 'Calon Client (Prospek)',
      description: 'Lead pra-registrasi berdasarkan Kategori-Ring.',
    },
    {
      href: '/sales/community-programs',
      icon: CalendarDays,
      title: 'Program Komunitas',
      description: 'Seminar/webinar komunitas & peserta terkait.',
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

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-4 md:p-5 border border-slate-100 shadow-sm text-center">
              <p className="text-xl md:text-2xl font-black text-slate-800">{stat.value}</p>
              <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
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
