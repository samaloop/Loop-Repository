import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default async function DashboardPage() {
  const { data: programs, error } = await supabase.from('Program').select('*');

  if (error) return <div className="p-10 text-center">Gagal mengambil data.</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12">
      {/* HEADER */}
      <div className="w-full max-w-4xl bg-white border-2 border-blue-100 rounded-full py-4 px-8 mb-12 text-center shadow-sm mx-4">
        <h1 className="text-xl md:text-2xl font-bold text-[#0E7490]">
          Data Master Loop Institute of Coaching
        </h1>
      </div>

      {/* GRID KARTU */}
      <div className="w-full max-w-6xl px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {programs?.map((program) => (
          <div 
            key={program.id} 
            className="bg-white rounded-[2.5rem] shadow-lg overflow-hidden border-2 border-blue-200 flex flex-col"
          >
            {/* Card Header  */}
            <div className="bg-[#0284C7] py-4 text-center">
              <span className="text-white font-bold uppercase tracking-widest">Master</span>
            </div>
            <div className="p-8 flex flex-col items-center text-center flex-grow min-h-[200px] justify-between">
              <p className="text-gray-600 font-medium px-4">{program.name}</p>
              <Link href={`/program/${program.id}`} className="w-full bg-[#0EA5E9] text-white py-3 rounded-2xl font-bold">
                Lihat
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}