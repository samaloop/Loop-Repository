import { createClient } from '@/utils/supabase/server'; // Memastikan sesi login terbaca di server
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await createClient(); //
  const { data: programs, error } = await supabase.from('Program').select('*');

  if (error) return (
    <div className="min-h-[50vh] flex items-center justify-center p-6">
      <div className="text-center p-6 bg-rose-50 rounded-2xl border border-rose-100 w-full max-w-sm">
        <p className="text-rose-600 font-bold text-sm">Gagal memuat data program.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* HERO SECTION: Penyesuaian padding dan ukuran font untuk HP */}
      <section className="relative pt-8 pb-12 md:pt-12 md:pb-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block px-3 py-1 mb-4 bg-cyan-100 text-cyan-700 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest">
            Master Repository
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-800 leading-tight mb-4 px-2">
            Loop Institute of <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-600 to-blue-700">Coaching</span>
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto text-xs md:text-base px-4">
            Akses master modul pelatihan dan materi.
          </p>
        </div>
      </section>

      {/* GRID KARTU: Mengatur kolom secara dinamis (1 kolom di HP, 2 di Tablet, 3 di Desktop) */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 pb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {programs?.map((program) => (
          <div 
            key={program.id} 
            className="group bg-white rounded-4xl md:rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col overflow-hidden"
          >
            {/* Area Visual: Dikecilkan sedikit untuk layar HP agar hemat ruang */}
            <div className="h-24 md:h-32 bg-slate-50 flex items-center justify-center relative">
              <div className="z-10 bg-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                <span className="text-2xl md:text-3xl">📘</span>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-6 md:p-8 flex flex-col grow">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-cyan-600 w-1.5 h-1.5 rounded-full"></span>
                <span className="text-[9px] md:text-[10px] font-bold text-cyan-600 uppercase tracking-widest">Master Program</span>
              </div>
              
              <h3 className="text-base md:text-lg font-bold text-slate-800 leading-snug mb-6">
                {program.name}
              </h3>

              <div className="mt-auto">
                <Link 
                  href={`/program/${program.id}`} 
                  className="inline-flex items-center justify-center w-full bg-slate-900 text-white py-3.5 md:py-4 rounded-xl md:rounded-2xl font-bold text-xs md:text-sm hover:bg-cyan-600 transition-all active:scale-95"
                >
                  Buka Modul
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}