'use server'

import * as XLSX from 'xlsx';
import { revalidatePath } from 'next/cache';
import { getAuthorizedSalesContext } from '@/lib/serverAuth';
import { mapProspectExcelHeaderToKey, normalizeRing } from '@/lib/prospectFields';

const PROSPECT_TEXT_FIELD_KEYS = [
  'full_name', 'gender', 'company', 'job_title', 'whatsapp', 'email', 'source', 'ring',
  'interested_program', 'domicile', 'industry_sector',
];

function extractProspectData(formData: FormData) {
  const data: Record<string, string | number | null> = {};
  for (const key of PROSPECT_TEXT_FIELD_KEYS) {
    const raw = formData.get(key);
    const value = typeof raw === 'string' ? raw.trim() : '';
    data[key] = value === '' ? null : value;
  }
  data.ring = normalizeRing((data.ring as string) || '').ring;

  const companyIdRaw = (formData.get('company_id') as string || '').trim();
  data.company_id = companyIdRaw === '' ? null : Number(companyIdRaw);

  const yearRaw = (formData.get('year') as string || '').trim();
  data.year = yearRaw === '' ? null : Number(yearRaw);

  const ageRaw = (formData.get('age') as string || '').trim();
  data.age = ageRaw === '' ? null : Number(ageRaw);

  return data;
}

export async function createProspect(formData: FormData) {
  const { supabase, authorized, picUserId } = await getAuthorizedSalesContext();
  if (!authorized) return { success: false, error: 'Tidak memiliki akses.' };

  const data = extractProspectData(formData);
  if (!data.full_name) return { success: false, error: 'Nama Lengkap wajib diisi.' };

  const { error } = await supabase.from('Prospect').insert({ ...data, pic_user_id: picUserId });
  if (error) return { success: false, error: error.message };

  revalidatePath('/sales/prospects');
  return { success: true };
}

export async function updateProspect(id: number, formData: FormData) {
  const { supabase, authorized } = await getAuthorizedSalesContext();
  if (!authorized) return { success: false, error: 'Tidak memiliki akses.' };

  const data = extractProspectData(formData);
  if (!data.full_name) return { success: false, error: 'Nama Lengkap wajib diisi.' };

  const { error } = await supabase.from('Prospect').update(data).eq('id', id);
  if (error) return { success: false, error: error.message };

  revalidatePath('/sales/prospects');
  revalidatePath(`/sales/prospects/${id}`);
  return { success: true };
}

export async function deleteProspect(id: number) {
  const { supabase, authorized } = await getAuthorizedSalesContext();
  if (!authorized) return { success: false, error: 'Tidak memiliki akses.' };

  const { error } = await supabase.from('Prospect').delete().eq('id', id);
  if (error) return { success: false, error: error.message };

  revalidatePath('/sales/prospects');
  return { success: true };
}

interface ImportResult {
  success: boolean;
  insertedCount: number;
  skippedCount: number;
  errors: string[];
}

// Baca file Excel & susun record Prospect siap-insert (belum di-insert). Dipakai bersama
// oleh importProspectsFromExcel (halaman Data Peserta) dan importProspectsForProgram
// (upload peserta langsung dari halaman detail Program Komunitas).
async function parseProspectExcelFile(file: File): Promise<{ records: Record<string, string | number | null>[]; skippedCount: number; errors: string[] }> {
  const errors: string[] = [];
  let rows: Record<string, unknown>[];
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    rows = XLSX.utils.sheet_to_json(sheet, { raw: false, defval: '' });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { records: [], skippedCount: 0, errors: [`Gagal membaca file: ${message}`] };
  }

  if (rows.length === 0) {
    return { records: [], skippedCount: 0, errors: ['File tidak berisi data.'] };
  }

  const excelHeaders = Object.keys(rows[0]);
  const headerToKey = new Map<string, string>();
  for (const header of excelHeaders) {
    const key = mapProspectExcelHeaderToKey(header);
    if (key) headerToKey.set(header, key);
    else errors.push(`Kolom "${header}" tidak dikenali dan diabaikan.`);
  }

  const records: Record<string, string | number | null>[] = [];
  let skippedCount = 0;

  rows.forEach((row, index) => {
    const record: Record<string, string | number | null> = {};
    for (const [header, key] of headerToKey) {
      const raw = row[header];
      const value = typeof raw === 'string' ? raw.trim() : String(raw ?? '').trim();

      if (key === 'year' || key === 'age') {
        record[key] = value === '' ? null : Number(value);
        continue;
      }

      record[key] = value === '' ? null : value;
    }

    if (!record.full_name) {
      skippedCount++;
      errors.push(`Baris ${index + 2} dilewati: Nama Lengkap kosong.`);
      return;
    }

    const { ring, recognized } = normalizeRing((record.ring as string) || '');
    if (!recognized) errors.push(`Baris ${index + 2}: Kategori-Ring "${record.ring}" tidak dikenali, diset ke Ring 3 - Cold Prospek.`);
    record.ring = ring;

    records.push(record);
  });

  return { records, skippedCount, errors };
}

export async function importProspectsFromExcel(formData: FormData): Promise<ImportResult> {
  const { supabase, authorized, picUserId } = await getAuthorizedSalesContext();
  if (!authorized) {
    return { success: false, insertedCount: 0, skippedCount: 0, errors: ['Tidak memiliki akses.'] };
  }

  const file = formData.get('file') as File | null;
  if (!file || file.size === 0) {
    return { success: false, insertedCount: 0, skippedCount: 0, errors: ['File tidak ditemukan.'] };
  }

  const { records, skippedCount, errors } = await parseProspectExcelFile(file);
  if (records.length === 0) {
    return { success: false, insertedCount: 0, skippedCount, errors };
  }

  const { error, count } = await supabase
    .from('Prospect')
    .insert(records.map((r) => ({ ...r, pic_user_id: picUserId })), { count: 'exact' });
  if (error) {
    errors.push(error.message);
    return { success: false, insertedCount: 0, skippedCount, errors };
  }

  revalidatePath('/sales/prospects');
  return { success: true, insertedCount: count ?? records.length, skippedCount, errors };
}

// Upload Excel peserta langsung dari halaman detail Program Komunitas: sama seperti
// importProspectsFromExcel, tapi tiap peserta yang berhasil dibuat otomatis dikaitkan
// ke program ini lewat tabel junction ProspectCommunityProgram.
export async function importProspectsForProgram(programId: number, formData: FormData): Promise<ImportResult> {
  const { supabase, authorized, picUserId } = await getAuthorizedSalesContext();
  if (!authorized) {
    return { success: false, insertedCount: 0, skippedCount: 0, errors: ['Tidak memiliki akses.'] };
  }

  const file = formData.get('file') as File | null;
  if (!file || file.size === 0) {
    return { success: false, insertedCount: 0, skippedCount: 0, errors: ['File tidak ditemukan.'] };
  }

  const { records, skippedCount, errors } = await parseProspectExcelFile(file);
  if (records.length === 0) {
    return { success: false, insertedCount: 0, skippedCount, errors };
  }

  const { data: inserted, error } = await supabase
    .from('Prospect')
    .insert(records.map((r) => ({ ...r, pic_user_id: picUserId })))
    .select('id');
  if (error) {
    errors.push(error.message);
    return { success: false, insertedCount: 0, skippedCount, errors };
  }

  const links = (inserted || []).map((p) => ({ prospect_id: p.id, community_program_id: programId }));
  if (links.length > 0) {
    const { error: linkError } = await supabase.from('ProspectCommunityProgram').insert(links);
    if (linkError) errors.push(`Peserta berhasil ditambahkan tapi gagal dikaitkan ke program: ${linkError.message}`);
  }

  revalidatePath('/sales/prospects');
  revalidatePath(`/sales/community-programs/${programId}`);
  return { success: true, insertedCount: inserted?.length ?? records.length, skippedCount, errors };
}
