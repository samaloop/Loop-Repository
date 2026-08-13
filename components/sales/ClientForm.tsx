'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { createClientRecord, updateClientRecord } from '@/app/actions/sales';
import { CLIENT_FIELDS, CLIENT_FIELD_SECTIONS, type ClientRecord } from '@/lib/clientFields';

interface CompanyOption {
  id: number;
  company_name: string;
}

interface ClientFormProps {
  mode: 'create' | 'edit';
  clientId?: number;
  defaultValues?: ClientRecord;
  companyOptions: CompanyOption[];
}

export default function ClientForm({ mode, clientId, defaultValues, companyOptions }: ClientFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = mode === 'create'
      ? await createClientRecord(formData)
      : await updateClientRecord(clientId!, formData);

    if (!result.success) {
      setError(result.error || 'Terjadi kesalahan.');
      setIsSaving(false);
      return;
    }

    router.push(mode === 'create' ? '/sales/clients' : `/sales/clients/${clientId}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {error && (
        <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-sm font-bold border border-rose-100">
          {error}
        </div>
      )}

      {CLIENT_FIELD_SECTIONS.map((section) => (
        <div key={section} className="space-y-5">
          <h2 className="text-sm font-black text-cyan-700 uppercase tracking-widest border-b border-slate-100 pb-3">
            {section}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {CLIENT_FIELDS.filter((f) => f.section === section).map((field) => {
              const defaultValue = defaultValues?.[field.key] ?? '';
              const isWide = field.type === 'textarea';
              return (
                <div key={field.key} className={isWide ? 'md:col-span-2' : ''}>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">
                    {field.label}{field.required && <span className="text-rose-500"> *</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      name={field.key}
                      defaultValue={defaultValue}
                      rows={3}
                      required={field.required}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none font-medium resize-none"
                    />
                  ) : field.type === 'select' ? (
                    <select
                      name={field.key}
                      defaultValue={defaultValue}
                      required={field.required}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none appearance-none font-medium"
                    >
                      {!field.required && <option value="">-</option>}
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      name={field.key}
                      defaultValue={defaultValue}
                      required={field.required}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none font-medium"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {section === 'Data Perusahaan' && (
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">
                Perusahaan Terdaftar (opsional)
              </label>
              <select
                name="company_id"
                defaultValue={defaultValues?.company_id ?? ''}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none appearance-none font-medium"
              >
                <option value="">Tidak ada</option>
                {companyOptions.map((c) => (
                  <option key={c.id} value={c.id}>{c.company_name}</option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 mt-1.5 px-1">Kaitkan peserta ini ke salah satu perusahaan terdaftar di modul Perusahaan & Proposal.</p>
            </div>
          )}
        </div>
      ))}

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isSaving}
          className="flex-1 md:flex-none md:px-10 py-4 border border-slate-100 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-all"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="flex-1 md:flex-none md:px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-cyan-600 disabled:bg-slate-200 transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
        >
          {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSaving ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>
    </form>
  );
}
