import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { Library, Users, ArrowRight } from 'lucide-react';

export default async function DashboardHubPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let role: string | undefined;
  if (user) {
    const { data: userData } = await supabase
      .from('User')
      .select('role')
      .eq('auth_id', user.id)
      .single();
    role = userData?.role;
  }
  const canAccessSales = role === 'admin' || role === 'sales';

  const modules = [
    {
      href: '/repository',
      icon: Library,
      title: 'Repository',
      description: 'Master modul pelatihan & materi sertifikasi.',
      show: true,
    },
    {
      href: '/sales',
      icon: Users,
      title: 'Sales, Marketing & Relation',
      description: 'Data peserta, klien, & laporan progress tim.',
      show: canAccessSales,
    },
  ].filter((m) => m.show);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto px-4 md:px-6 pt-6 md:pt-8 pb-10 w-full">
        <div className="text-center mb-8">
          <div className="inline-block px-3 py-1 mb-4 bg-cyan-100 text-cyan-700 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest">
            Loop Institute of Coaching
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-800 leading-tight">
            Mau buka apa hari ini?
          </h1>
        </div>

        <div className={`grid grid-cols-1 ${modules.length > 1 ? 'sm:grid-cols-2' : ''} gap-4 md:gap-6`}>
          {modules.map((mod) => (
            <Link
              key={mod.href}
              href={mod.href}
              className="group bg-white rounded-4xl md:rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 p-8 md:p-10 flex flex-col items-start gap-4"
            >
              <div className="bg-cyan-50 group-hover:bg-cyan-100 p-4 rounded-2xl transition-colors">
                <mod.icon className="text-cyan-600" size={28} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">{mod.title}</h3>
                <p className="text-sm text-slate-400 mt-1">{mod.description}</p>
              </div>
              <span className="flex items-center gap-1 text-cyan-600 font-bold text-sm mt-auto pt-2">
                Buka
                <ArrowRight className="group-hover:translate-x-1 transition-all" size={16} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
