'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { createProspect, updateProspect } from '@/app/actions/prospects';
import { RING_OPTIONS, CONTACT_TYPE_OPTIONS, type ProspectRecord } from '@/lib/prospectFields';
import { GENDER_OPTIONS } from '@/lib/clientFields';

interface CompanyOption {
  id: number;
  company_name: string;
}

interface ProspectFormProps {
  mode: 'create' | 'edit';
  prospectId?: number;
  defaultValues?: ProspectRecord;
  defaultCompanyId?: number;
  companyOptions: CompanyOption[];
  industrySectorOptions: string[];
}

export default function ProspectForm({ mode, prospectId, defaultValues, defaultCompanyId, companyOptions, industrySectorOptions }: ProspectFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentIndustrySector = defaultValues?.industry_sector || '';
  const industrySectorSelectOptions = currentIndustrySector && !industrySectorOptions.includes(currentIndustrySector)
    ? [currentIndustrySector, ...industrySectorOptions]
    : industrySectorOptions;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = mode === 'create'
      ? await createProspect(formData)
      : await updateProspect(prospectId!, formData);

    if (!result.success) {
      setError(result.error || 'Terjadi kesalahan.');
      setIsSaving(false);
      return;
    }

    router.push('/sales/prospects');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-sm font-bold border border-rose-100">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">
            Nama Lengkap <span className="text-rose-500">*</span>
          </label>
          <input type="text" name="full_name" defaultValue={defaultValues?.full_name || ''} required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none font-medium" />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Jenis Kelamin</label>
          <select name="gender" defaultValue={defaultValues?.gender || ''} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none appearance-none font-medium">
            <option value="">-</option>
            {GENDER_OPTIONS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Perusahaan/Organisasi</label>
          <input type="text" name="company" defaultValue={defaultValues?.company || ''} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none font-medium" />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Perusahaan Terdaftar (opsional)</label>
          <select
            name="company_id"
            defaultValue={defaultValues?.company_id ?? defaultCompanyId ?? ''}
            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none appearance-none font-medium"
          >
            <option value="">Tidak ada</option>
            {companyOptions.map((c) => (
              <option key={c.id} value={c.id}>{c.company_name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Jabatan</label>
          <input type="text" name="job_title" defaultValue={defaultValues?.job_title || ''} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none font-medium" />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Whatsapp</label>
          <input type="tel" name="whatsapp" defaultValue={defaultValues?.whatsapp || ''} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none font-medium" />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Email</label>
          <input type="email" name="email" defaultValue={defaultValues?.email || ''} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none font-medium" />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Sumber Informasi</label>
          <input type="text" name="source" defaultValue={defaultValues?.source || ''} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none font-medium" />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Kategori-Ring</label>
          <select name="ring" defaultValue={defaultValues?.ring || RING_OPTIONS[2]} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none appearance-none font-medium">
            {RING_OPTIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Jenis Kontak</label>
          <select name="contact_type" defaultValue={defaultValues?.contact_type || ''} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none appearance-none font-medium">
            <option value="">-</option>
            {CONTACT_TYPE_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Tertarik Program Apa</label>
          <input type="text" name="interested_program" defaultValue={defaultValues?.interested_program || ''} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none font-medium" />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Tahun</label>
          <input type="number" name="year" defaultValue={defaultValues?.year ?? ''} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none font-medium" />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Usia</label>
          <input type="number" name="age" min={0} defaultValue={defaultValues?.age ?? ''} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none font-medium" />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Domisili</label>
          <input type="text" name="domicile" defaultValue={defaultValues?.domicile || ''} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none font-medium" />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Sektor Industri</label>
          <select name="industry_sector" defaultValue={currentIndustrySector} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none appearance-none font-medium">
            <option value="">-</option>
            {industrySectorSelectOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

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
