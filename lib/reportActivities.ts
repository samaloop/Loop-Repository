// Katalog aktivitas Weekly Relationship Report per jenis laporan.
// Konfigurasi tetap (jarang berubah) — sama seperti pendekatan CLIENT_FIELDS di lib/clientFields.ts.

export type Pillar = 'BUILD' | 'MAINTAIN' | 'GROW';
export type TargetType = 'count' | 'percentage';
export type ReportType = 'corporate_account' | 'individual_learning' | 'community_support';

export interface ActivityDef {
  pillar: Pillar;
  activity: string;
  target: number;
  targetType: TargetType;
}

export interface ActivityEntry extends ActivityDef {
  actual: number;
}

export const PILLARS: Pillar[] = ['BUILD', 'MAINTAIN', 'GROW'];

export const REPORT_TYPES: { key: ReportType; label: string }[] = [
  { key: 'corporate_account', label: 'Sales Manager (Corporate Account)' },
  { key: 'individual_learning', label: 'Senior Sales (Individual Learning)' },
  { key: 'community_support', label: 'Sales & Community Support' },
];

export function reportTypeLabel(type: string): string {
  return REPORT_TYPES.find((r) => r.key === type)?.label || type;
}

export const ACTIVITY_CATALOG: Record<ReportType, ActivityDef[]> = {
  corporate_account: [
    { pillar: 'BUILD', activity: 'Discovery Meeting Corporate', target: 2, targetType: 'count' },
    { pillar: 'BUILD', activity: 'Corporate Visit / Networking', target: 2, targetType: 'count' },
    { pillar: 'BUILD', activity: 'Partnership Discussion', target: 1, targetType: 'count' },
    { pillar: 'MAINTAIN', activity: 'Existing Client Follow Up', target: 5, targetType: 'count' },
    { pillar: 'MAINTAIN', activity: 'Executive Check-in', target: 2, targetType: 'count' },
    { pillar: 'MAINTAIN', activity: 'Proposal Follow Up', target: 5, targetType: 'count' },
    { pillar: 'GROW', activity: 'Proposal Baru', target: 2, targetType: 'count' },
    { pillar: 'GROW', activity: 'Proposal Presentation', target: 2, targetType: 'count' },
    { pillar: 'GROW', activity: 'Negotiation', target: 2, targetType: 'count' },
    { pillar: 'GROW', activity: 'Closing / Repeat Business', target: 1, targetType: 'count' },
  ],
  individual_learning: [
    { pillar: 'BUILD', activity: 'Discovery Call Individual', target: 10, targetType: 'count' },
    { pillar: 'BUILD', activity: 'New Individual Prospect', target: 15, targetType: 'count' },
    { pillar: 'BUILD', activity: 'Networking / Alumni Outreach', target: 5, targetType: 'count' },
    { pillar: 'MAINTAIN', activity: 'Follow Up Individual', target: 20, targetType: 'count' },
    { pillar: 'MAINTAIN', activity: 'Alumni Follow Up', target: 10, targetType: 'count' },
    { pillar: 'MAINTAIN', activity: 'Webinar Invitation', target: 20, targetType: 'count' },
    { pillar: 'GROW', activity: 'Registrasi Public Training', target: 5, targetType: 'count' },
    { pillar: 'GROW', activity: 'Upgrade Program', target: 2, targetType: 'count' },
    { pillar: 'GROW', activity: 'Referral', target: 3, targetType: 'count' },
    { pillar: 'GROW', activity: 'Repeat Participant', target: 2, targetType: 'count' },
  ],
  community_support: [
    { pillar: 'BUILD', activity: 'Komunitas/Organisasi Baru', target: 3, targetType: 'count' },
    { pillar: 'BUILD', activity: 'Penawaran Webinar / Edukasi', target: 3, targetType: 'count' },
    { pillar: 'BUILD', activity: 'Database Baru', target: 25, targetType: 'count' },
    { pillar: 'MAINTAIN', activity: 'Follow Up Inquiry', target: 20, targetType: 'count' },
    { pillar: 'MAINTAIN', activity: 'Follow Up Komunitas', target: 10, targetType: 'count' },
    { pillar: 'MAINTAIN', activity: 'CRM Update', target: 100, targetType: 'percentage' },
    { pillar: 'GROW', activity: 'Registrasi dari Komunitas', target: 3, targetType: 'count' },
    { pillar: 'GROW', activity: 'Corporate Lead dari Komunitas', target: 1, targetType: 'count' },
    { pillar: 'GROW', activity: 'Referral', target: 3, targetType: 'count' },
    { pillar: 'GROW', activity: 'Community Partnership', target: 1, targetType: 'count' },
  ],
};

// Dipakai untuk nama field form (actual__<pillar>__<slug>) — harus konsisten antara
// WeeklyReportForm.tsx (client) dan submitWeeklyReport (server action).
export function activitySlug(activity: string): string {
  return activity.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function computeStatus(target: number, actual: number): 'Tercapai' | 'Belum Tercapai' {
  return actual >= target ? 'Tercapai' : 'Belum Tercapai';
}

export function formatTargetValue(value: number, targetType: TargetType): string {
  return targetType === 'percentage' ? `${value}%` : String(value);
}

// Terima tanggal apa saja dalam minggu itu (format ISO yyyy-mm-dd) dan kembalikan hari Senin minggu tersebut.
export function getMonday(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  const day = date.getDay(); // 0 = Minggu, 1 = Senin, ...
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return date.toISOString().slice(0, 10);
}

export const TEAM_REVIEW_QUESTIONS: { key: string; label: string }[] = [
  { key: 'potential_new_relationship', label: 'Relationship baru yang paling potensial minggu ini' },
  { key: 'existing_client_attention', label: 'Existing client yang perlu perhatian' },
  { key: 'repeat_business_opportunity', label: 'Peluang repeat business' },
  { key: 'referral_opportunity', label: 'Peluang referral' },
  { key: 'team_support_needed', label: 'Dukungan yang dibutuhkan dari tim' },
];
