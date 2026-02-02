import { supabase } from '@/lib/supabase';
import FileTable from '@/components/FileTable';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

// Definisikan tipe untuk params sebagai Promise (Standar Next.js 15/16)
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProgramDetailPage({ params }: PageProps) {
  
  // 1. UNWRAP PARAMS
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null; 

  
  const { data: userData } = await supabase
    .from('User') // Pastikan menggunakan 'User' sesuai diagram
    .select('role')
    .eq('auth_id', user.id) // Mencocokkan UUID dengan kolom auth_id
    .single();

    

  const isEditor = userData?.role === 'admin' || userData?.role ==='editor';

  // 2. Ambil data Program untuk judul banner
  const { data: program } = await supabase
    .from('Program')
    .select('*')
    .eq('id', id)
    .single();

  // 3. Ambil data Files yang memiliki program_id sesuai ID di URL
  const { data: files } = await supabase
    .from('File')
    .select('*')
    .eq('program_id', id)
    .order('created_at', { ascending: false }); // order by terbaru dulu

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      {/* Tombol Kembali */}
      <div className="max-w-5xl mx-auto mb-6">
        <Link href="/dashboard" className="text-cyan-600 hover:text-cyan-700 font-semibold flex items-center gap-2">
          ← Kembali ke Dashboard
        </Link>
      </div>

      {/* Header Banner */}
      <div className="bg-[#0E7490] text-white p-8 rounded-[2rem] mb-10 text-center shadow-xl max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-widest">
          {program?.name || 'Memuat Program...'}
        </h1>
        <p className="text-cyan-100 mt-2 text-sm opacity-80">
          ID Program: {id} • Manajemen Materi Pelatihan {userData?.role}
        </p>
      </div>

      {/* Bagian Tabel & Tombol Tambah Materi */}
      <div className="max-w-5xl mx-auto">
        {/* Pastikan component FileTable menerima 'initialFiles' 
            dan 'programId' yang sudah valid (bukan promise)
        */}

        
        <FileTable 
          initialFiles={files || []} 
          programId={id} 
          isEditor={isEditor}
        />
      </div>
    </div>
  );
}