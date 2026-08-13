// Status Proposal mengikuti tahapan alur RFP Corporate di SOP (/sales/playbook, section A).

export const PROPOSAL_STATUS_OPTIONS = ['Draft', 'Terkirim', 'Follow Up', 'Negosiasi', 'Deal', 'Batal'] as const;

export type ProposalStatus = typeof PROPOSAL_STATUS_OPTIONS[number];

const STATUS_BADGE_CLASSES: Record<ProposalStatus, string> = {
  Draft: 'bg-slate-100 text-slate-600',
  Terkirim: 'bg-blue-50 text-blue-700',
  'Follow Up': 'bg-amber-50 text-amber-700',
  Negosiasi: 'bg-violet-50 text-violet-700',
  Deal: 'bg-emerald-50 text-emerald-700',
  Batal: 'bg-rose-50 text-rose-700',
};

export function proposalStatusBadgeClass(status: string): string {
  return STATUS_BADGE_CLASSES[status as ProposalStatus] || STATUS_BADGE_CLASSES.Draft;
}

export function formatInvestAmount(value: number | string | null | undefined): string {
  const num = Number(value);
  if (!value || Number.isNaN(num)) return '-';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
}
