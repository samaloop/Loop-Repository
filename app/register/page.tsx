'use client'
import { register } from '../auth/actions';
import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await register(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-emerald-500 tracking-tight">REGISTRASI</h1>
          <h2 className="text-xl font-semibold text-gray-600 mt-1">Loop Repository</h2>
        </div>

        <form action={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <input
            name="email"
            type="email"
            placeholder="Masukan Email Baru"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-center placeholder:text-gray-600 text-gray-900"
          />

          <input
            name="password"
            type="password"
            placeholder="Masukan Password"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-center placeholder:text-gray-600 text-gray-900"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg transition-colors mt-2 uppercase"
          >
            {loading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link href="/login" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">
            Sudah punya akun? Login di sini
          </Link>
        </div>
      </div>
    </div>
  );
}