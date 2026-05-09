import Link from 'next/link';
import { mockPurchasedLicenses } from '@/lib/mockData';

export default function BuyerDashboardPage() {
  const licenses = mockPurchasedLicenses;
  const totalSpent = licenses.reduce((sum, l) => sum + l.pricePaid, 0);

  return (
    <main className="min-h-screen bg-zinc-950 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">My Licenses</h1>
            <p className="text-zinc-500 text-sm mt-1">Your purchased lyric licenses</p>
          </div>
          <Link
            href="/browse"
            className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            Browse More Lyrics
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Licenses Purchased', value: licenses.length },
            { label: 'Total Spent', value: `$${totalSpent.toLocaleString()}` },
            { label: 'Exclusive Licenses', value: licenses.filter(l => l.type === 'Exclusive').length },
          ].map(stat => (
            <div key={stat.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center">
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-zinc-500 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Licenses */}
        <div className="space-y-3">
          {licenses.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
              <p className="text-zinc-400 mb-4">You haven't purchased any licenses yet.</p>
              <Link href="/browse" className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
                Browse Lyrics
              </Link>
            </div>
          ) : (
            licenses.map(license => (
              <div key={license.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 bg-violet-600/10 border border-violet-600/20 rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-violet-400 text-xs">🎵</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-white font-semibold text-sm truncate">{license.lyricTitle}</h3>
                    <p className="text-zinc-500 text-xs mt-0.5">by {license.writerName} · {license.genre}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-white font-semibold text-sm">${license.pricePaid}</p>
                    <p className="text-zinc-600 text-xs">{new Date(license.purchasedAt).toLocaleDateString()}</p>
                  </div>

                  <span className={`text-xs px-2.5 py-1 rounded-full border ${
                    license.type === 'Exclusive'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}>
                    {license.type}
                  </span>

                  <button className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs px-3 py-2 rounded-lg transition-colors">
                    Download
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Legal note */}
        <div className="mt-6 bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <p className="text-zinc-500 text-xs leading-relaxed">
            <span className="text-zinc-300 font-medium">License reminder:</span> All purchased lyrics require writer credit on commercial release. Non-exclusive licenses allow multiple buyers — exclusive licenses are yours alone. Royalty reporting is required for all commercial releases. See your license agreement for full terms.
          </p>
        </div>
      </div>
    </main>
  );
}
