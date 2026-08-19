import * as XLSX from 'xlsx';

// Bikin file .xlsx satu-baris-contoh dari daftar header + nilai contoh, dikembalikan
// sebagai base64 supaya bisa dikirim balik dari server action ke client component
// (yang lalu decode jadi Blob dan trigger download lewat <a download>).
export function buildExcelTemplateBase64(headers: string[], exampleRow: Record<string, string>): string {
  const worksheet = XLSX.utils.json_to_sheet([exampleRow], { header: headers });
  worksheet['!cols'] = headers.map((h) => ({ wch: Math.max(h.length, 22) }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');

  return XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
}
