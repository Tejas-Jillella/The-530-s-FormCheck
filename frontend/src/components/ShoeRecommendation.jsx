export default function ShoeRecommendation({ shoe }) {
  if (!shoe) return null;

  const shopUrl = `https://www.newbalance.com/search?q=${encodeURIComponent(shoe.model)}`;

  return (
    <div className="bg-black text-white rounded-2xl p-6 flex flex-col gap-5 shadow-xl">
      {/* Label */}
      <div className="flex items-center gap-2">
        <span className="px-3 py-1 bg-nb-red text-white text-xs font-bold rounded-full uppercase tracking-widest">
          Recommended for You
        </span>
        <span className="text-gray-400 text-xs">Powered by New Balance</span>
      </div>

      {/* Model + tagline */}
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-black tracking-tight">{shoe.model}</h2>
        {shoe.tagline && (
          <p className="text-gray-300 italic text-base">{shoe.tagline}</p>
        )}
      </div>

      {/* Reason */}
      {shoe.reason && (
        <p className="text-gray-200 text-sm leading-relaxed border-l-4 border-nb-red pl-4">
          {shoe.reason}
        </p>
      )}

      {/* Feature chips */}
      {shoe.features && shoe.features.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {shoe.features.map((feat, i) => (
            <span
              key={i}
              className="px-3 py-1.5 bg-white/10 text-white text-xs font-medium rounded-full border border-white/20"
            >
              {feat}
            </span>
          ))}
        </div>
      )}

      {/* Shop Now */}
      <a
        href={shopUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 mt-2 w-full sm:w-auto px-8 py-3 bg-nb-red text-white font-bold rounded-xl hover:bg-red-700 transition-colors text-sm"
      >
        Shop Now
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </a>
    </div>
  );
}
