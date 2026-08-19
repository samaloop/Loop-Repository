'use server'

import * as XLSX from 'xlsx';
import { revalidatePath } from 'next/cache';
import { CLIENT_FIELDS, PAYMENT_STATUS_OPTIONS, GENDER_OPTIONS, mapExcelHeaderToKey } from '@/lib/clientFields';
import { getAuthorizedSalesContext as getAuthorizedContext } from '@/lib/serverAuth';
import { parseDateValue } from '@/lib/dateUtils';
import { buildExcelTemplateBase64 } from '@/lib/excelTemplate';

function extractClientData(formData: FormData) {
  const data: Record<string, string | number | null> = {};
  for (const field of CLIENT_FIELDS) {
    const raw = formData.get(field.key);
    const value = typeof raw === 'string' ? raw.trim() : '';
    data[field.key] = value === '' ? null : value;
  }
  if (!data.payment_status || !PAYMENT_STATUS_OPTIONS.includes(data.payment_status as string)) {
    data.payment_status = 'Lunas';
  }

  const companyIdRaw = (formData.get('company_id') as string || '').trim();
  data.company_id = companyIdRaw === '' ? null : Number(companyIdRaw);

  return data;
}

export async function createClientRecord(formData: FormData) {
  const { supabase, authorized, picUserId } = await getAuthorizedContext();
  if (!authorized) return { success: false, error: 'Tidak memiliki akses.' };

  const data = extractClientData(formData);
  if (!data.full_name) return { success: false, error: 'Nama Lengkap wajib diisi.' };

  const { error } = await supabase.from('Client').insert({ ...data, pic_user_id: picUserId });
  if (error) return { success: false, error: error.message };

  revalidatePath('/sales/clients');
  revalidatePath('/sales');
  return { success: true };
}

export async function updateClientRecord(id: number, formData: FormData) {
  const { supabase, authorized } = await getAuthorizedContext();
  if (!authorized) return { success: false, error: 'Tidak memiliki akses.' };

  const data = extractClientData(formData);
  if (!data.full_name) return { success: false, error: 'Nama Lengkap wajib diisi.' };

  const { error } = await supabase.from('Client').update(data).eq('id', id);
  if (error) return { success: false, error: error.message };

  revalidatePath('/sales/clients');
  revalidatePath(`/sales/clients/${id}`);
  revalidatePath('/sales');
  return { success: true };
}

export async function deleteClientRecord(id: number) {
  const { supabase, authorized } = await getAuthorizedContext();
  if (!authorized) return { success: false, error: 'Tidak memiliki akses.' };

  const { error } = await supabase.from('Client').delete().eq('id', id);
  if (error) return { success: false, error: error.message };

  revalidatePath('/sales/clients');
  revalidatePath('/sales');
  return { success: true };
}

interface ImportResult {
  success: boolean;
  insertedCount: number;
  skippedCount: number;
  errors: string[];
}

export async function importClientsFromExcel(formData: FormData): Promise<ImportResult> {
  const { supabase, authorized, picUserId } = await getAuthorizedContext();
  if (!authorized) {
    return { success: false, insertedCount: 0, skippedCount: 0, errors: ['Tidak memiliki akses.'] };
  }

  const file = formData.get('file') as File | null;
  if (!file || file.size === 0) {
    return { success: false, insertedCount: 0, skippedCount: 0, errors: ['File tidak ditemukan.'] };
  }

  const errors: string[] = [];
  let rows: Record<string, unknown>[];
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    rows = XLSX.utils.sheet_to_json(sheet, { raw: false, defval: '' });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { success: false, insertedCount: 0, skippedCount: 0, errors: [`Gagal membaca file: ${message}`] };
  }

  if (rows.length === 0) {
    return { success: false, insertedCount: 0, skippedCount: 0, errors: ['File tidak berisi data.'] };
  }

  // Petakan header kolom Excel (baris pertama) ke field Client, sekali di awal.
  const excelHeaders = Object.keys(rows[0]);
  const headerToKey = new Map<string, string>();
  for (const header of excelHeaders) {
    const key = mapExcelHeaderToKey(header);
    if (key) headerToKey.set(header, key);
    else errors.push(`Kolom "${header}" tidak dikenali dan diabaikan.`);
  }

  const records: Record<string, string | null>[] = [];
  let skippedCount = 0;

  rows.forEach((row, index) => {
    const record: Record<string, string | null> = {};
    for (const [header, key] of headerToKey) {
      const raw = row[header];
      const value = typeof raw === 'string' ? raw.trim() : String(raw ?? '').trim();

      if (key === 'date_of_birth') {
        if (value === '') {
          record[key] = null;
        } else {
          const parsed = parseDateValue(value);
          if (parsed === null) errors.push(`Baris ${index + 2}: Tanggal Lahir "${value}" tidak dikenali formatnya, dikosongkan.`);
          record[key] = parsed;
        }
        continue;
      }

      record[key] = value === '' ? null : value;
    }

    if (!record.full_name) {
      skippedCount++;
      errors.push(`Baris ${index + 2} dilewati: Nama Lengkap kosong.`);
      return;
    }

    if (!record.payment_status || !PAYMENT_STATUS_OPTIONS.includes(record.payment_status)) {
      record.payment_status = 'Lunas';
    }

    records.push({ ...record, pic_user_id: picUserId });
  });

  if (records.length === 0) {
    return { success: false, insertedCount: 0, skippedCount, errors };
  }

  const { error, count } = await supabase.from('Client').insert(records, { count: 'exact' });
  if (error) {
    errors.push(error.message);
    return { success: false, insertedCount: 0, skippedCount, errors };
  }

  revalidatePath('/sales/clients');
  revalidatePath('/sales');
  return { success: true, insertedCount: count ?? records.length, skippedCount, errors };
}

interface TemplateResult {
  success: boolean;
  base64?: string;
  filename?: string;
  error?: string;
}

export async function downloadClientTemplate(): Promise<TemplateResult> {
  const { authorized } = await getAuthorizedContext();
  if (!authorized) return { success: false, error: 'Tidak memiliki akses.' };

  const headers = CLIENT_FIELDS.map((f) => f.label);
  const exampleRow: Record<string, string> = {
    'Nama Lengkap': 'CONTOH - Hapus baris ini sebelum upload',
    'Nama Panggilan': 'Contoh',
    'Jenis Kelamin': GENDER_OPTIONS[0],
    'Tanggal Lahir': '01/01/1990',
    'Alamat Rumah': 'Jl. Contoh No. 1, Jakarta',
    'Nomor Telepon': '081200000000',
    'Nomor WhatsApp': '081200000000',
    'Alamat Email': 'contoh@email.com',
    'Alternatif Email': '',
    'Latar Belakang Pendidikan': 'S1 Psikologi',
    'Perusahaan': 'PT Contoh Sejahtera',
    'Peran / Jabatan': 'HR Manager',
    'Alamat Perusahaan': 'Jl. Contoh Perusahaan No. 1, Jakarta',
    'Status Pembayaran': PAYMENT_STATUS_OPTIONS[0],
    'Program Sertifikasi': 'LCPC Batch 74',
    'Program Training': '',
    'Nama yang Diinginkan dalam Sertifikat': 'Contoh Nama',
    'International Coaching Federation': '',
    'Ukuran T-Shirt': 'L',
    'Tulis 3 Hal Mengenai Anda (maks. 200 kata)': '',
    'Harapan Mengikuti Program': '',
    'Akun Media Sosial': '',
    'Mengetahui tentang Loop Institute of Coaching dari': '',
  };

  const base64 = buildExcelTemplateBase64(headers, exampleRow);
  return { success: true, base64, filename: 'Template_Data_Peserta.xlsx' };
}
