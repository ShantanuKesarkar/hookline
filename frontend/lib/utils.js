export function formatFollowers(n) {
  if (!n && n !== 0) return '0';
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}m`;
  if (n >= 1000)    return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function timeLeft(isoDate) {
  if (!isoDate) return null;
  const diff = new Date(isoDate) - new Date();
  if (diff <= 0) return 'ended';
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000)  / 60000);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function coverFromLyric(lyric) {
  return {
    bg:    lyric.cover?.bg    ?? lyric.cover_bg    ?? '#C6FF3D',
    ink:   lyric.cover?.ink   ?? lyric.cover_ink   ?? '#0E0E10',
    emoji: lyric.cover?.emoji ?? lyric.cover_emoji ?? '🎤',
    shape: lyric.cover?.shape ?? lyric.cover_shape ?? 'rect',
  };
}
