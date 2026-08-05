'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteClientRecord } from '@/app/actions/sales';

export default function DeleteClientButton({ id, name }: { id: number; name: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Hapus data peserta "${name}"? Tindakan ini tidak bisa dibatalkan.`)) return;

    setIsDeleting(true);
    const result = await deleteClientRecord(id);
    if (!result.success) {
      alert('Gagal menghapus: ' + result.error);
      setIsDeleting(false);
      return;
    }
    router.push('/sales/clients');
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 px-6 py-3 rounded-2xl text-sm font-black transition-all border border-rose-100/50 disabled:opacity-50"
    >
      {isDeleting ? 'Menghapus...' : 'Hapus'}
    </button>
  );
}
