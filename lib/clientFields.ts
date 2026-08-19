// Skema field data peserta (Client) yang dipakai bersama oleh form (ClientForm),
// tabel (ClientTable), dan mapping header saat import Excel.

export type ClientFieldType = 'text' | 'email' | 'tel' | 'date' | 'textarea' | 'select';

export type ClientFieldSection = 'Data Pribadi' | 'Data Perusahaan' | 'Program & Sertifikasi' | 'Lainnya';

export interface ClientFieldDef {
  key: string;
  label: string;
  type: ClientFieldType;
  section: ClientFieldSection;
  options?: string[];
  required?: boolean;
}

export const PAYMENT_STATUS_OPTIONS = ['Lunas', 'Pembayaran Bertahap'];
export const GENDER_OPTIONS = ['Laki-laki', 'Perempuan'];

export const CLIENT_FIELDS: ClientFieldDef[] = [
  { key: 'full_name', label: 'Nama Lengkap', type: 'text', section: 'Data Pribadi', required: true },
  { key: 'nickname', label: 'Nama Panggilan', type: 'text', section: 'Data Pribadi' },
  { key: 'gender', label: 'Jenis Kelamin', type: 'select', section: 'Data Pribadi', options: GENDER_OPTIONS },
  { key: 'date_of_birth', label: 'Tanggal Lahir', type: 'date', section: 'Data Pribadi' },
  { key: 'home_address', label: 'Alamat Rumah', type: 'textarea', section: 'Data Pribadi' },
  { key: 'phone', label: 'Nomor Telepon', type: 'tel', section: 'Data Pribadi' },
  { key: 'whatsapp', label: 'Nomor WhatsApp', type: 'tel', section: 'Data Pribadi' },
  { key: 'email', label: 'Alamat Email', type: 'email', section: 'Data Pribadi' },
  { key: 'alt_email', label: 'Alternatif Email', type: 'email', section: 'Data Pribadi' },
  { key: 'education_background', label: 'Latar Belakang Pendidikan', type: 'text', section: 'Data Pribadi' },

  { key: 'company', label: 'Perusahaan', type: 'text', section: 'Data Perusahaan' },
  { key: 'job_title', label: 'Peran / Jabatan', type: 'text', section: 'Data Perusahaan' },
  { key: 'company_address', label: 'Alamat Perusahaan', type: 'textarea', section: 'Data Perusahaan' },

  { key: 'payment_status', label: 'Status Pembayaran', type: 'select', section: 'Program & Sertifikasi', options: PAYMENT_STATUS_OPTIONS, required: true },
  { key: 'certification_program', label: 'Program Sertifikasi', type: 'text', section: 'Program & Sertifikasi' },
  { key: 'training_program', label: 'Program Training', type: 'text', section: 'Program & Sertifikasi' },
  { key: 'certificate_name', label: 'Nama yang Diinginkan dalam Sertifikat', type: 'text', section: 'Program & Sertifikasi' },
  { key: 'icf_info', label: 'International Coaching Federation', type: 'text', section: 'Program & Sertifikasi' },

  { key: 'tshirt_size', label: 'Ukuran T-Shirt', type: 'text', section: 'Lainnya' },
  { key: 'about_me', label: 'Tulis 3 Hal Mengenai Anda (maks. 200 kata)', type: 'textarea', section: 'Lainnya' },
  { key: 'expectations', label: 'Harapan Mengikuti Program', type: 'textarea', section: 'Lainnya' },
  { key: 'social_media', label: 'Akun Media Sosial', type: 'text', section: 'Lainnya' },
  { key: 'referral_source', label: 'Mengetahui tentang Loop Institute of Coaching dari', type: 'textarea', section: 'Lainnya' },
];

export interface ClientRecord {
  id: number;
  full_name: string;
  payment_status: string;
  nickname: string | null;
  gender: string | null;
  date_of_birth: string | null;
  home_address: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  alt_email: string | null;
  education_background: string | null;
  company: string | null;
  company_id: number | null;
  job_title: string | null;
  company_address: string | null;
  certification_program: string | null;
  training_program: string | null;
  certificate_name: string | null;
  icf_info: string | null;
  tshirt_size: string | null;
  about_me: string | null;
  expectations: string | null;
  social_media: string | null;
  referral_source: string | null;
  pic_user_id: number | null;
  created_at: string;
  updated_at: string;
  // Index signature: permet akses dinamis lewat field.key saat looping CLIENT_FIELDS.
  [key: string]: string | number | null | undefined;
}

export const CLIENT_FIELD_SECTIONS: ClientFieldSection[] = [
  'Data Pribadi',
  'Data Perusahaan',
  'Program & Sertifikasi',
  'Lainnya',
];

// Header Excel (dinormalisasi: lowercase, trim, tanpa tanda baca akhir) -> field key.
const EXCEL_HEADER_MAP: Record<string, string> = {
  'nama lengkap': 'full_name',
  'status pembayaran': 'payment_status',
  'alamat rumah': 'home_address',
  'nomor telepon': 'phone',
  'nomor whatsapp': 'whatsapp',
  'alamat email': 'email',
  'alternatif email': 'alt_email',
  'tanggal lahir': 'date_of_birth',
  'jenis kelamin': 'gender',
  'perusahaan': 'company',
  'peran jabatan': 'job_title',
  'peran / jabatan': 'job_title',
  'alamat perusahaan': 'company_address',
  'latar belakang pendidikan': 'education_background',
  'program sertifikasi': 'certification_program',
  'program training': 'training_program',
  'nama yang diinginkan dalam sertifikat': 'certificate_name',
  'nama panggilan': 'nickname',
  'ukuran t-shirt': 'tshirt_size',
  'harapan mengikuti program': 'expectations',
  'akun media sosial yang anda miliki': 'social_media',
  'mengetahui tentang loop institute of coaching': 'referral_source',
  'international coaching federation': 'icf_info',
};

// Beberapa header di Excel lebih panjang/bervariasi (mis. ada instruksi tambahan) —
// dicocokkan lewat substring setelah exact match gagal.
const EXCEL_HEADER_FALLBACKS: [substring: string, key: string][] = [
  ['tulis 3 hal mengenai anda', 'about_me'],
  ['akun media sosial', 'social_media'],
  ['mengetahui tentang loop institute of coaching', 'referral_source'],
];

function normalizeHeader(header: string): string {
  return header
    .toLowerCase()
    .trim()
    .replace(/[:.]+$/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function mapExcelHeaderToKey(header: string): string | null {
  const normalized = normalizeHeader(header);
  if (EXCEL_HEADER_MAP[normalized]) return EXCEL_HEADER_MAP[normalized];

  for (const [substring, key] of EXCEL_HEADER_FALLBACKS) {
    if (normalized.includes(substring)) return key;
  }

  return null;
}
