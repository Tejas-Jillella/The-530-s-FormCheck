export default function QualityGate({ issues, tips, onReset }) {
  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-bisque border-2 border-nb-red rounded-2xl p-6 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-nb-red rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Video Quality Check Failed</h2>
            <p className="text-sm text-gray-600">Your video didn't meet the requirements for analysis.</p>
          </div>
        </div>

        {/* Issues */}
        {issues && issues.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-nb-red uppercase tracking-wide mb-2">Issues Found</h3>
            <ul className="flex flex-col gap-2">
              {issues.map((issue, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-800">
                  <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-nb-red text-white flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tips */}
        {tips && tips.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Tips for Reshooting</h3>
            <ul className="flex flex-col gap-1.5">
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-nb-red mt-0.5">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Try Again */}
        <button
          onClick={onReset}
          className="mt-2 w-full py-3 bg-nb-red text-white font-bold rounded-xl hover:opacity-90 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
