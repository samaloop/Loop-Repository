'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Upload, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { importClientsFromExcel } from '@/app/actions/sales';

interface ExcelUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ImportResult {
  success: boolean;
  insertedCount: number;
  skippedCount: number;
  errors: string[];
}

export default function ExcelUploadModal({ isOpen, onClose }: ExcelUploadModalProps) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setFileName(null);
    setResult(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get('file') as File;

    if (!file || file.size === 0) {
      alert('Pilih file Excel terlebih dahulu.');
      return;
    }

    setIsUploading(true);
    setResult(null);
    try {
      const res = await importClientsFromExcel(formData);
      setResult(res);
      if (res.success) router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setResult({ success: false, insertedCount: 0, skippedCount: 0, errors: [message] });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-lg p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">Upload Excel Peserta</h2>
          <button onClick={handleClose} disabled={isUploading} className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50">
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {!result && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className={`border-3 border-dashed rounded-[1.5rem] p-8 text-center transition-all group ${fileName ? 'border-cyan-400 bg-cyan-50/50' : 'border-gray-200 hover:border-cyan-400 hover:bg-gray-50'}`}>
              <input
                type="file"
                name="file"
                id="excel-upload"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) setFileName(e.target.files[0].name);
                }}
              />
              <label htmlFor="excel-upload" className="cursor-pointer flex flex-col items-center">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-all shadow-sm ${fileName ? 'bg-cyan-100 text-cyan-600 scale-110' : 'bg-gray-100 text-gray-400 group-hover:bg-cyan-100 group-hover:text-cyan-600'}`}>
                  <Upload className="w-7 h-7" strokeWidth={2} />
                </div>
                <span className="text-base text-gray-700 font-bold max-w-full truncate px-4">
                  {fileName || 'Klik untuk pilih file'}
                </span>
                {!fileName && <span className="text-xs text-gray-400 font-medium mt-1">.xlsx, .xls, atau .csv</span>}
              </label>
            </div>

            <button
              type="submit"
              disabled={isUploading}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-cyan-600 disabled:bg-slate-300 transition-all shadow-lg shadow-slate-200 flex justify-center items-center gap-3"
            >
              {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
              <span>{isUploading ? 'Memproses...' : 'Upload & Import'}</span>
            </button>
          </form>
        )}

        {result && (
          <div className="space-y-5">
            <div className={`p-5 rounded-2xl flex items-start gap-3 ${result.success ? 'bg-emerald-50' : 'bg-rose-50'}`}>
              {result.success
                ? <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={22} />
                : <AlertTriangle className="text-rose-600 shrink-0 mt-0.5" size={22} />}
              <div>
                <p className={`font-black text-sm ${result.success ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {result.success ? 'Import berhasil' : 'Import gagal'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {result.insertedCount} data berhasil ditambahkan, {result.skippedCount} baris dilewati.
                </p>
              </div>
            </div>

            {result.errors.length > 0 && (
              <div className="bg-amber-50 rounded-2xl p-5 max-h-48 overflow-y-auto">
                <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-2">Catatan</p>
                <ul className="text-xs text-amber-700 space-y-1 list-disc list-inside">
                  {result.errors.map((err, i) => <li key={i}>{err}</li>)}
                </ul>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => { setResult(null); setFileName(null); }} className="flex-1 py-4 border border-slate-100 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all">
                Upload Lagi
              </button>
              <button onClick={handleClose} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-cyan-600 transition-all">
                Selesai
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
