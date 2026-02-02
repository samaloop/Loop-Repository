// import { supabase } from '@/lib/supabase';
import FileTable from '@/components/FileTable';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
// ... (import tetap sama seperti sebelumnya)

export default async function ProgramDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null; 

  const { data: userData } = await supabase
    .from('User')
    .select('role')
    .eq('auth_id', user.id)
    .single();

  const isEditor = userData?.role === 'admin' || userData?.role ===  'editor';

  const { data: program } = await supabase.from('Program').select('*').eq('id', id).single();
  const { data: files } = await supabase.from('File').select('*').eq('program_id', id).order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* HEADER & NAVIGASI: Lebih bersih dan responsif */}
      <nav className="max-w-6xl mx-auto px-4 md:px-6 py-6 flex items-center gap-2 text-xs md:text-sm">
        <Link href="/dashboard" className="text-slate-400 hover:text-cyan-600 transition-colors">Dashboard</Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-800 font-bold truncate">{program?.name}</span>
      </nav>

      {/* BANNER: Efek Mesh Gradient */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 mb-10">
        <div className="relative overflow-hidden bg-linear-to-br from-[#0E7490] to-[#155E75] p-8 md:p-14 rounded-4xl md:rounded-[3rem] shadow-2xl shadow-cyan-100">
          {/* Dekorasi Latar Belakang */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          
          <div className="relative z-10 text-center md:text-left">
            <span className="inline-block px-3 py-1 mb-4 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
              Program ID: {id}
            </span>
            <h1 className="text-2xl md:text-4xl font-black text-white leading-tight uppercase tracking-tight">
              {program?.name || 'Memuat Program...'}
            </h1>
            <p className="text-cyan-100 mt-4 text-xs md:text-sm font-medium opacity-90 max-w-xl">

            </p>
          </div>
        </div>
      </div>

      {/* FILE TABLE/LIST AREA */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 pb-20">
        <FileTable 
          initialFiles={files || []} 
          programId={id} 
          isEditor={isEditor}
        />
      </div>
    </div>
  );
}