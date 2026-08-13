// Skema field calon client (Prospect) — lead pra-registrasi yang masih dikejar tim sales,
// dibedakan dari Client (peserta yang sudah terdaftar di Program).

export const RING_OPTIONS = ['Ring 1 - Hot Prospek', 'Ring 2 - Warm Prospek', 'Ring 3 - Cold Prospek'] as const;

export type Ring = typeof RING_OPTIONS[number];

export interface ProspectRecord {
  id: number;
  full_name: string;
  gender: string | null;
  company: string | null;
  company_id: number | null;
  job_title: string | null;
  whatsapp: string | null;
  email: string | null;
  source: string | null;
  ring: string;
  interested_program: string | null;
  year: number | null;
  age: number | null;
  domicile: string | null;
  industry_sector: string | null;
  pic_user_id: number | null;
  created_at: string;
  updated_at: string;
}

const RING_BADGE_CLASSES: Record<Ring, string> = {
  'Ring 1 - Hot Prospek': 'bg-rose-50 text-rose-700',
  'Ring 2 - Warm Prospek': 'bg-amber-50 text-amber-700',
  'Ring 3 - Cold Prospek': 'bg-slate-100 text-slate-600',
};

export function ringBadgeClass(ring: string): string {
  return RING_BADGE_CLASSES[ring as Ring] || RING_BADGE_CLASSES['Ring 3 - Cold Prospek'];
}

// Menerima input bebas dari Excel (mis. "Ring 1", "hot", "1", "Warm") dan memetakan
// ke salah satu RING_OPTIONS. Default ke Ring 3 kalau tidak dikenali (sama seperti
// payment_status default ke 'Lunas' di lib/clientFields.ts).
export function normalizeRing(raw: string): { ring: string; recognized: boolean } {
  const normalized = raw.trim().toLowerCase();
  if (!normalized) return { ring: RING_OPTIONS[2], recognized: true };

  if (normalized.includes('1') || normalized.includes('hot')) return { ring: RING_OPTIONS[0], recognized: true };
  if (normalized.includes('2') || normalized.includes('warm')) return { ring: RING_OPTIONS[1], recognized: true };
  if (normalized.includes('3') || normalized.includes('cold')) return { ring: RING_OPTIONS[2], recognized: true };

  return { ring: RING_OPTIONS[2], recognized: false };
}

// Header Excel (dinormalisasi: lowercase, trim, tanpa tanda baca akhir) -> field key.
const EXCEL_HEADER_MAP: Record<string, string> = {
  'nama lengkap': 'full_name',
  'jenis kelamin': 'gender',
  'perusahaan/organisasi': 'company',
  'perusahaan / organisasi': 'company',
  'jabatan': 'job_title',
  'whatsapp': 'whatsapp',
  'email': 'email',
  'sumber informasi': 'source',
  'kategori-ring': 'ring',
  'kategori ring': 'ring',
  'kategori prospek': 'ring',
  'tertarik program apa': 'interested_program',
  'program yang ditawarkan': 'interested_program',
  'tahun': 'year',
  'usia': 'age',
  'domisili': 'domicile',
  'sektor industri': 'industry_sector',
};

function normalizeHeader(header: string): string {
  return header
    .toLowerCase()
    .trim()
    .replace(/[:.]+$/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function mapProspectExcelHeaderToKey(header: string): string | null {
  return EXCEL_HEADER_MAP[normalizeHeader(header)] || null;
}
