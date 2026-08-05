import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CLIENT_FIELDS, CLIENT_FIELD_SECTIONS } from '@/lib/clientFields';
import { requireSalesAccess } from '@/lib/salesAccess';
import DeleteClientButton from '@/components/sales/DeleteClientButton';

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const { supabase } = await requireSalesAccess();

  const { data: client } = await supabase.from('Client').select('*').eq('id', id).single();
  if (!client) notFound();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-10">
        <nav className="flex items-center gap-2 text-xs md:text-sm mb-6">
          <Link href="/sales/clients" className="text-slate-400 hover:text-cyan-600 transition-colors">Data Peserta</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-bold truncate">{client.full_name}</span>
        </nav>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800">{client.full_name}</h1>
            <span
              className={`inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                client.payment_status === 'Lunas' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
              }`}
            >
              {client.payment_status}
            </span>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/sales/clients/${client.id}/edit`}
              className="flex items-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-600 px-6 py-3 rounded-2xl text-sm font-black transition-all border border-amber-100/50"
            >
              Edit
            </Link>
            <DeleteClientButton id={client.id} name={client.full_name} />
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-6 md:p-10 space-y-10">
          {CLIENT_FIELD_SECTIONS.map((section) => (
            <div key={section} className="space-y-5">
              <h2 className="text-sm font-black text-cyan-700 uppercase tracking-widest border-b border-slate-100 pb-3">
                {section}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                {CLIENT_FIELDS.filter((f) => f.section === section && f.key !== 'payment_status').map((field) => (
                  <div key={field.key}>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{field.label}</p>
                    <p className="text-slate-700 font-medium whitespace-pre-wrap">{client[field.key] || '-'}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
