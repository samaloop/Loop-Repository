'use client'
import { useState } from 'react';
import { uploadToDrive, updateFile, deleteFile } from '@/app/actions/gdrive';
import { Loader2, Upload } from 'lucide-react'; // Pastikan sudah install lucide-react

interface FileTableProps {
  initialFiles: any[];
  programId: string;
  isEditor: boolean;
}

export default function FileTable({ initialFiles, programId, isEditor }: FileTableProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingFile, setEditingFile] = useState<any | null>(null);

  // Fungsi untuk Simpan atau Update Materi
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);

    const formData = new FormData(e.currentTarget);
    const category = formData.get('category') as string;

    try {
      if (editingFile) {
        await updateFile(editingFile.id, editingFile.gdrive_id, formData, programId);
      } else {
        await uploadToDrive(formData, programId, category);
      }
      setIsOpen(false);
      setEditingFile(null);
    } catch (error) {
      alert("Terjadi kesalahan saat memproses file.");
    } finally {
      setIsUploading(false);
    }
  };

  // Fungsi untuk Hapus Materi
  const handleDeleteClick = async (fileId: number, gdriveId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus materi ini secara permanen?")) {
      try {
        const result = await deleteFile(fileId, gdriveId, programId);
        if (!result.success) alert("Gagal menghapus: " + result.error);
      } catch (error) {
        alert("Terjadi kesalahan sistem.");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER: Judul & Tombol Tambah (Khusus Admin/Editor) */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-black text-slate-800">Materi Pelatihan</h2>
        {isEditor && (
          <button
            onClick={() => { setEditingFile(null); setIsOpen(true); }}
            className="w-full md:w-auto bg-cyan-600 hover:bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-cyan-100 transition-all flex items-center justify-center gap-2"
          >
            <span className="text-xl">+</span> Tambah Materi
          </button>
        )}
      </div>

      {/* VERSI DESKTOP: Tabel (Hidden di Mobile) */}
      <div className="hidden md:block bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="p-6 text-slate-500 font-bold uppercase text-[10px] tracking-widest text-left">Materi</th>
              <th className="p-6 text-slate-500 font-bold uppercase text-[10px] tracking-widest text-center">Kategori</th>
              <th className="p-6 text-slate-500 font-bold uppercase text-[10px] tracking-widest text-right">Opsi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {initialFiles.length > 0 ? (
              initialFiles.map((file) => (
                <tr key={file.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl p-2 bg-slate-100 rounded-xl group-hover:bg-white transition-colors">📄</span>
                      <div>
                        <p className="font-bold text-slate-700">{file.name}</p>
                        <p className="text-[9px] text-slate-400 font-mono mt-1 uppercase">ID: {file.gdrive_id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <span className="bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                      {file.category}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end items-center gap-4">
                      {isEditor && (
                        <>
                          <button onClick={() => { setEditingFile(file); setIsOpen(true); }} className="text-amber-500 font-bold hover:text-amber-600 text-sm">Edit</button>
                          <button onClick={() => handleDeleteClick(file.id, file.gdrive_id)} className="text-rose-500 font-bold hover:text-rose-600 text-sm">Hapus</button>
                        </>
                      )}
                      <a href={file.view_link} target="_blank" className="text-cyan-600 font-bold hover:text-cyan-700 text-sm border-l border-slate-200 pl-4">Lihat</a>
                      <a href={file.download_link} className="text-emerald-600 font-bold hover:text-emerald-700 text-sm">Unduh</a>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={3} className="p-20 text-center text-slate-400 italic">Belum ada materi.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* VERSI MOBILE: Kartu (Hidden di Desktop) */}
      <div className="md:hidden space-y-4">
        {initialFiles.map((file) => (
          <div key={file.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm active:scale-[0.98] transition-all">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">{file.category}</span>
              <div className="flex gap-4 text-xs font-bold">
                {isEditor && <button onClick={() => { setEditingFile(file); setIsOpen(true); }} className="text-amber-500">Edit</button>}
                {isEditor && <button onClick={() => handleDeleteClick(file.id, file.gdrive_id)} className="text-rose-500">Hapus</button>}
              </div>
            </div>
            <h3 className="font-bold text-slate-800 mb-6">{file.name}</h3>
            <div className="grid grid-cols-2 gap-3">
              <a href={file.view_link} target="_blank" className="bg-slate-50 text-slate-600 py-3.5 rounded-xl text-center font-bold text-xs">Lihat</a>
              <a href={file.download_link} className="bg-emerald-600 text-white py-3.5 rounded-xl text-center font-bold text-xs">Unduh</a>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: Tambah/Edit (Desain Premium) */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-100 flex items-center justify-center p-4">

          {/* --- LOADING OVERLAY --- */}
          {isUploading && (
            <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-[2px] flex flex-col items-center justify-center transition-all duration-300">
              <div className="relative flex h-20 w-20 mb-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-100 opacity-75"></span>
                <Loader2 className="relative inline-flex h-20 w-20 text-cyan-600 animate-spin" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-1 tracking-tight animate-pulse">Memproses File...</h3>
              <p className="text-xs text-slate-500 font-medium text-center px-8">
                Mohon jangan tutup jendela ini sampai proses selesai.
              </p>
            </div>
          )}
          {/* ----------------------- */}

          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-black text-slate-800 mb-6">{editingFile ? 'Update Materi' : 'Materi Baru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Nama File</label>
                <input type="text" name="displayName" defaultValue={editingFile?.name || ""} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none font-medium" required />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Kategori</label>
                <select name="category" defaultValue={editingFile?.category || "Materi"} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none appearance-none font-medium">
                  <option value="Materi">Materi / Modul</option>
                  <option value="Rekaman">Rekaman Video</option>
                  <option value="Tugas">Tugas / Case Study</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">{editingFile ? 'Ganti File (Opsional)' : 'Pilih File'}</label>
                <input type="file" name="file" required={!editingFile} className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:bg-cyan-50 file:text-cyan-700 file:font-bold" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 py-4 border border-slate-100 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-all">Batal</button>
                <button type="submit" disabled={isUploading} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-cyan-600 disabled:bg-slate-200 transition-all shadow-lg shadow-slate-200">
                  {isUploading ? 'Proses...' : editingFile ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}