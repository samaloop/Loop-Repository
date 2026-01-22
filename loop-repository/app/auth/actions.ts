'use server'

import { createClient } from '@/lib/supabase-server'; // Kita akan buat helper ini
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: 'Email atau Password salah' };
  }

  redirect('/dashboard');
}

export async function register(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const role = 'user'; // Default role
  
  const supabase = createClient();

  // 1. Sign up ke Supabase Auth
  const { data, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    return { error: authError.message };
  }

  // 2. Simpan ke tabel "User" milik Anda jika auth berhasil
  if (data.user) {
    const { error: dbError } = await supabase
      .from('User')
      .insert({
        id: Date.now(), // Jika id Anda int8 manual, atau biarkan jika auto-increment
        email: email,
        password: password, // Catatan: Sebaiknya jangan simpan raw password di tabel profil
        role: role,
        created_at: new Date().toISOString()
      });

    if (dbError) {
      console.error("Gagal simpan ke tabel User:", dbError.message);
    }
  }

  redirect('/login?message=Registrasi berhasil, silakan cek email untuk verifikasi atau langsung login.');
}