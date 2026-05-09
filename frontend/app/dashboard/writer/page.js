import Link from 'next/link';
import { mockWriterStats, mockWriterListings } from '@/lib/mockData';

export default function WriterDashboardPage() {
  const stats = mockWriterStats;
  const listings = mockWriterListings;

  return (
    <main className="min-h-screen bg-zinc-950 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Writer Dashboard</h1>
            <p className="text-zinc-500 text-sm mt-1">Welcome back, Maya Rivers</p>
          </div>
          <Link
            href="/post"
            className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            + Post New Lyrics
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Earned', value: `$${stats.totalEarned.toLocaleString()}`, color: 'text-violet-400' },
            { label: 'Pending Royalties', value: `$${stats.pendingRoyalties}`, color: 'text-amber-400' },
            { label: 'Total Sales', value: stats.totalSales, color: 'text-white' },
            { label: 'Active Listings', value: stats.activeListings, color: 'text-white' },
          ].map(stat => (
            <div key={stat.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <p className="text-zinc-500 text-xs mb-1.5">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Listings table */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden mb-6">
          <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="text-white font-semibold">Your Listings</h2>
            <Link href="/browse" className="text-violet-400 hover:text-violet-300 text-xs transition-colors">View on marketplace →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left text-zinc-500 text-xs font-medium px-5 py-3">Title</th>
                  <th className="text-left text-zinc-500 text-xs font-medium px-5 py-3">Genre</th>
                  <th className="text-left text-zinc-500 text-xs font-medium px-5 py-3">Price</th>
                  <th className="text-left text-zinc-500 text-xs font-medium px-5 py-3">Sold</th>
                  <th className="text-left text-zinc-500 text-xs font-medium px-5 py-3">Rating</th>
                  <th className="text-left text-zinc-500 text-xs font-medium px-5 py-3">Status</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {listings.map(listing => (
                  <tr key={listing.id} className="border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/30 transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-white font-medium text-sm">{listing.title}</p>
                      <p className="text-zinc-600 text-xs mt-0.5">{listing.mood}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="bg-violet-600/10 text-violet-400 text-xs px-2 py-0.5 rounded-full border border-violet-600/20">
                        {listing.genre}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-white text-sm font-medium">${listing.price}</td>
                    <td className="px-5 py-4 text-zinc-300 text-sm">{listing.sold}</td>
                    <td className="px-5 py-4 text-sm">
                      {listing.rating
                        ? <span className="text-amber-400">★ {listing.rating}</span>
                        : <span className="text-zinc-600">—</span>
                      }
                    </td>
                    <td className="px-5 py-4">
                      <span className="bg-green-500/10 text-green-400 text-xs px-2 py-0.5 rounded-full border border-green-500/20">
                        {listing.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Link href={`/lyrics/${listing.id}`} className="text-zinc-500 hover:text-white text-xs transition-colors">
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Royalty notice */}
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <span className="text-amber-400 text-lg mt-0.5">💰</span>
            <div>
              <h3 className="text-amber-400 font-semibold text-sm mb-1">Pending Royalties: ${stats.pendingRoyalties}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                You have royalties pending from commercial releases. Royalty payouts are processed on the 1st of each month.
                Make sure your payment details are up to date in your account settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
