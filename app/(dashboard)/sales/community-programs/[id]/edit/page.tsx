import Link from 'next/link';
import { notFound } from 'next/navigation';
import CommunityProgramForm from '@/components/sales/CommunityProgramForm';
import { requireSalesAccess } from '@/lib/salesAccess';

export default async function EditCommunityProgramPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const { supabase } = await requireSalesAccess();

  const { data: program } = await supabase.from('CommunityProgram').select('*').eq('id', id).single();
  if (!program) notFound();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 md:py-10">
        <nav className="flex items-center gap-2 text-xs md:text-sm mb-6">
          <Link href="/sales/community-programs" className="text-slate-400 hover:text-cyan-600 transition-colors">Program Komunitas</Link>
          <span className="text-slate-300">/</span>
          <Link href={`/sales/community-programs/${program.id}`} className="text-slate-400 hover:text-cyan-600 transition-colors truncate">{program.community_name}</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-bold">Edit</span>
        </nav>

        <h1 className="text-2xl md:text-3xl font-black text-slate-800 mb-8">Edit Program Komunitas</h1>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-6 md:p-10">
          <CommunityProgramForm
            mode="edit"
            programId={program.id}
            defaultValues={{
              community_name: program.community_name,
              category: program.category,
              event_date: program.event_date,
              event_time: program.event_time,
              blast_date: program.blast_date,
            }}
          />
        </div>
      </div>
    </div>
  );
}
