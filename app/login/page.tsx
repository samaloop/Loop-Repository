// app/login/page.tsx
'use client'
import { login } from '../auth/actions';
import { useState } from 'react';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-cyan-500 tracking-tight">LOGIN</h1>
          <h2 className="text-xl font-semibold text-gray-600 mt-1">Loop Repository</h2>
        </div>

        <form action={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <input
              name="email"
              type="email"
              placeholder="Masukan Email"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-center"
            />
          </div>

          <div>
            <input
              name="password"
              type="password"
              placeholder="Masukan Password"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-center"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 rounded-lg transition-colors mt-2 uppercase"
          >
            {loading ? 'Processing...' : 'Login'}
          </button>
        </form>

        <div className="text-center mt-6">
          {/* <button className="text-gray-400 hover:text-gray-600 text-sm transition-colors">
            Registrasi
          </button> */}
        </div>
      </div>
    </div>
  );
}