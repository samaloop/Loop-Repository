// components/UploadModal.tsx
'use client'
import { useState, useEffect } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
// Pastikan path ini sesuai dengan lokasi file action Anda
import { uploadToDrive } from '@/app/actions/gdrive';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  programId: string;
  onSuccess: (newFile: any) => void;
}

export default function UploadModal({ isOpen, onClose, programId, onSuccess }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Materi');
  const [fileName, setFileName] = useState<string | null>(null);

  // Reset state saat modal dibuka/ditutup
  useEffect(() => {
    if (!isOpen) {
      setFileName(null);
      setIsUploading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get('file') as File;

    if (!file || file.size === 0) {
      alert("Pilih file terlebih dahulu");
      return;
    }

    // Mulai Animasi Loading
    setIsUploading(true);

    try {
      // Panggil Server Action yang sudah ada
      const result = await uploadToDrive(formData, programId, selectedCategory);
      
      if (result.error) throw new Error(result.error);

      // Beritahu parent component bahwa upload berhasil
      onSuccess(result.data);
      alert("File berhasil diunggah!");
      onClose();
    } catch (error: any) {
      console.error(error);
      alert("Gagal mengunggah file: " + error.message);
    } finally {
      // Hentikan Animasi Loading
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* --- LOADING OVERLAY ANIMATION --- */}
        {/* Ini akan muncul menutupi form saat isUploading = true */}
        {isUploading && (
          <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-[2px] flex flex-col items-center justify-center transition-all duration-300 rounded-[2rem]">
            <div className="relative flex h-20 w-20 mb-4">
               {/* Efek "Ping" berdenyut di belakang */}
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-200 opacity-75"></span>
               {/* Ikon Spinner berputar */}
               <Loader2 className="relative inline-flex rounded-full h-20 w-20 text-blue-600 animate-spin" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-black text-gray-800 mb-2 tracking-tight animate-pulse">Sedang Mengunggah...</h3>
            <p className="text-sm text-gray-500 font-medium text-center px-8">
              Mohon jangan tutup halaman ini sampai proses selesai.
            </p>
          </div>
        )}
        {/* ---------------------------------- */}


        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">Materi Baru</h2>
          <button onClick={onClose} disabled={isUploading} className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50">
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input File dengan Style Baru */}
          <div className={`border-3 border-dashed rounded-[1.5rem] p-8 text-center transition-all group ${fileName ? 'border-blue-400 bg-blue-50/50' : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'}`}>
            <input 
              type="file" 
              name="file" 
              id="file-upload" 
              className="hidden" 
              onChange={(e) => {
                if (e.target.files?.[0]) setFileName(e.target.files[0].name);
              }}
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-all shadow-sm ${fileName ? 'bg-blue-100 text-blue-600 scale-110' : 'bg-gray-100 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600 group-hover:scale-110'}`}>
                <Upload className="w-7 h-7" strokeWidth={2} />
              </div>
              <span className="text-base text-gray-700 font-bold max-w-full truncate px-4">
                {fileName || "Klik untuk pilih file"}
              </span>
              {!fileName && <span className="text-xs text-gray-400 font-medium mt-1">Dokumen, PDF, atau Video</span>}
            </label>
          </div>

          {/* Pilih Kategori */}
          <div>
            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Kategori</label>
            <select 
              className="w-full border-2 border-gray-200 rounded-2xl p-4 bg-gray-50/50 font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none transition-all cursor-pointer"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="Materi">📘 Materi / Modul</option>
              <option value="Slide">📊 Slide Presentasi</option>
              <option value="Form">📝 Form / Workbook</option>
              <option value="Rekaman">🎥 Rekaman Video</option>
            </select>
          </div>

          {/* Tombol Aksi */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="flex-1 py-4 border-2 border-gray-200 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 hover:shadow-blue-200 disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none flex justify-center items-center gap-3 transition-all"
            >
              {/* Loader di tombol tetap ada sebagai pelengkap */}
              {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
              <span>{isUploading ? 'Memproses...' : 'Simpan Materi'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}