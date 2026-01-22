import { supabase } from '@/lib/supabase';
import FileTable from '@/components/FileTable';

// Definisikan tipe params sebagai Promise
export default async function ProgramDetailPage({ params }: { params: Promise<{ id: string }> }) {
  
  // 1. UNWRAP PARAMS (Wajib di Next.js 15)
  const { id } = await params;

  // 2. Ambil data Program menggunakan 'id' yang sudah di-unwrap
  const { data: program } = await supabase
    .from('Program')
    .select('*')
    .eq('id', id)
    .single();

  // 3. Ambil data Files terkait
  const { data: files } = await supabase
    .from('File')
    .select('*')
    .eq('program_id', id);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Blue Header Banner */}
      <div className="bg-[#0e7490] text-white p-6 rounded-xl mb-8 text-center shadow-lg max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold uppercase tracking-wide">
          {program?.name || 'Loading Program...'}
        </h1>
      </div>

      <div className="max-w-5xl mx-auto">
        <FileTable initialFiles={files || []} programId={id} />
      </div>
    </div>
  );
}