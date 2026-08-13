// Excel/Google Forms biasanya menyimpan tanggal sebagai teks "DD/MM/YYYY" (format Indonesia),
// sedangkan Postgres default menafsirkan "14/03/1990" sebagai MM/DD/YYYY dan menolaknya
// (bulan 14 tidak valid). Normalisasi ke ISO yyyy-mm-dd sebelum insert.
export function parseDateValue(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;

  const dmyMatch = trimmed.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (dmyMatch) {
    const [, d, m, y] = dmyMatch;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }

  return null;
}
