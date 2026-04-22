export const uid = (prefix = 'id') => `${prefix}_${Math.random().toString(36).slice(2, 8)}_${Date.now().toString(36)}`;

export function todayLabel() {
  return new Date().toLocaleString('tr-TR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export const minsBetween = (start, end) => Math.max(1, Math.round((new Date(end) - new Date(start)) / 60000));

export const toTrDate = (iso) => new Date(iso).toLocaleString('tr-TR');

export function csvFromRows(headers, rows) {
  const esc = (v) => `"${String(v ?? '').replaceAll('"', '""')}"`;
  return [headers.map(esc).join(','), ...rows.map((row) => row.map(esc).join(','))].join('\n');
}
