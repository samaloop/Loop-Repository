'use client'
import { useState } from 'react';
import { uploadToDrive, updateFile } from '@/app/actions/gdrive';
import { deleteFile } from '@/app/actions/gdrive';

export default function FileTable({ initialFiles, programId }: { initialFiles: any[], programId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingFile, setEditingFile] = useState<any | null>(null);

  // Fungsi untuk menangani form Simpan/Update
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);

    const formData = new FormData(e.currentTarget);
    const category = formData.get('category') as string;

    try {
      if (editingFile) {
        // Logika UPDATE
        await updateFile(editingFile.id, editingFile.gdrive_id, formData, programId);
      } else {
        // Logika UPLOAD BARU
        await uploadToDrive(formData, programId, category);
      }
      setIsOpen(false);
      setEditingFile(null);
    } catch (error) {
      console.error("Gagal memproses file:", error);
      alert("Terjadi kesalahan saat memproses file.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (fileId: number, gdriveId: string) => {
  if (confirm("Apakah Anda yakin ingin menghapus materi ini secara permanen?")) {
    try {
      const result = await deleteFile(fileId, gdriveId, programId);
      if (!result.success) {
        alert("Gagal menghapus: " + result.error);
      }
    } catch (error) {
      alert("Terjadi kesalahan sistem.");
    }
  }
};

  return (
    <div className="space-y-6">
      {/* HEADER: Tombol Tambah Materi yang sebelumnya hilang */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-700">Materi Pelatihan</h2>
        <button 
          onClick={() => { setEditingFile(null); setIsOpen(true); }}
          className="bg-[#0EA5E9] hover:bg-cyan-600 text-white px-6 py-2 rounded-full font-bold shadow-md transition-all flex items-center gap-2"
        >
          <span className="text-xl">+</span> Tambah Materi
        </button>
      </div>

      {/* TABEL DATA */}
      <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-6 text-gray-600 font-bold uppercase text-xs">Nama Materi</th>
              <th className="p-6 text-gray-600 font-bold uppercase text-xs text-center">Kategori</th>
              <th className="p-6 text-gray-600 font-bold uppercase text-xs text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {initialFiles.length > 0 ? (
              initialFiles.map((file) => (
                <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-6 font-medium text-gray-700">
                    <div className="flex flex-col">
                      <span>{file.name}</span>
                      <span className="text-[10px] text-gray-400 italic">ID: {file.gdrive_id}</span>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <span className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-xs font-bold">
                      {file.category}
                    </span>
                  </td>
                  <td className="p-6 text-right space-x-4">
                    <button 
                      onClick={() => { setEditingFile(file); setIsOpen(true); }}
                      className="text-amber-500 font-bold hover:text-amber-600"
                    >
                      Edit
                    </button>

                    <button 
                      onClick={() => handleDelete(file.id, file.gdrive_id)}
                      className="text-rose-500 font-bold hover:text-rose-600"
                    >
                      Hapus
                    </button>
                    
                    <a href={file.view_link} target="_blank" className="text-cyan-600 font-bold">Lihat</a>
                    <a href={file.download_link} className="text-emerald-600 font-bold">Unduh</a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="p-20 text-center text-gray-400 italic">
                  Belum ada materi yang diunggah.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL TAMBAH / EDIT MATERI */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editingFile ? 'Update Materi' : 'Tambah Materi Baru'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* INPUT NAMA MATERI */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nama Materi (Tampilan)</label>
                <input 
                  type="text"
                  name="displayName"
                  defaultValue={editingFile?.name || ""}
                  placeholder="Contoh: Modul Dasar Coaching"
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                  required
                />
              </div>

              {/* INPUT KATEGORI */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Kategori</label>
                <select 
                  name="category" 
                  defaultValue={editingFile?.category || "Materi"}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none appearance-none bg-white"
                >
                  <option value="Materi">Materi / Modul</option>
                  <option value="Rekaman">Rekaman Video</option>
                  <option value="Tugas">Tugas / Case Study</option>
                </select>
              </div>

              {/* INPUT FILE */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {editingFile ? 'Ganti File (Opsional)' : 'Pilih File'}
                </label>
                <input 
                  type="file" 
                  name="file" 
                  required={!editingFile}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                />
              </div>

              {/* TOMBOL AKSI */}
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={isUploading}
                  className="flex-1 py-3 bg-cyan-600 text-white rounded-2xl font-bold shadow-lg shadow-cyan-100 hover:bg-cyan-700 disabled:bg-gray-300 transition-all"
                >
                  {isUploading ? 'Memproses...' : editingFile ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}