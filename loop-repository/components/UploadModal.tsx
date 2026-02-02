// components/UploadModal.tsx
'use client'
import { useState } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
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

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get('file') as File;

    if (!file || file.size === 0) {
      alert("Pilih file terlebih dahulu");
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadToDrive(formData, programId, selectedCategory);
      
      if (result.error) throw result.error;

      // Beritahu parent component bahwa upload berhasil
      onSuccess(result.data);
      onClose();
      alert("File berhasil diunggah!");
    } catch (error) {
      console.error(error);
      alert("Gagal mengunggah file");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Tambah Materi Baru</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input File */}
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
            <input 
              type="file" 
              name="file" 
              id="file-upload" 
              className="hidden" 
              onChange={(e) => {
                const label = document.getElementById('file-label');
                if (label && e.target.files?.[0]) label.innerText = e.target.files[0].name;
              }}
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
              <Upload className="w-10 h-10 text-blue-500 mb-2" />
              <span id="file-label" className="text-sm text-gray-600 font-medium">
                Klik untuk pilih file
              </span>
            </label>
          </div>

          {/* Pilih Kategori */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <select 
              className="w-full border rounded-lg p-2.5 bg-gray-50"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="Materi">Materi / Modul</option>
              <option value="Slide">Slide Presentasi</option>
              <option value="Form">Form / Workbook</option>
            </select>
          </div>

          {/* Tombol Aksi */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-300 rounded-full font-medium text-gray-600 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="flex-1 py-2.5 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 disabled:bg-blue-300 flex justify-center items-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Mengunggah...
                </>
              ) : (
                'Simpan ke Drive'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}