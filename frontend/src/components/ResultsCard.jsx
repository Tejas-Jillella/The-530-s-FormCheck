const ASPECT_LABELS = {
  forward_lean: "Forward Lean",
  arm_swing: "Arm Swing",
  foot_strike: "Foot Strike",
  cadence: "Cadence",
  knee_drive: "Knee Drive",
  posture: "Posture",
  overstriding: "Overstriding",
};

const STATUS_STYLES = {
  good: {
    badge: "bg-green-100 text-green-800 border border-green-200",
    dot: "bg-green-500",
    card: "border-green-100",
    label: "Good",
  },
  needs_work: {
    badge: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    dot: "bg-yellow-400",
    card: "border-yellow-100",
    label: "Needs Work",
  },
  unclear: {
    badge: "bg-gray-100 text-gray-600 border border-gray-200",
    dot: "bg-gray-400",
    card: "border-gray-100",
    label: "Unclear",
  },
};

function AspectCard({ aspectKey, data }) {
  const label = ASPECT_LABELS[aspectKey] || aspectKey;
  const status = data?.status || "unclear";
  const styles = STATUS_STYLES[status] || STATUS_STYLES.unclear;
  const extra = aspectKey === "foot_strike" && data?.type ? ` · ${data.type}` : "";

  return (
    <div className={`bg-bisque/50 rounded-xl border-2 ${styles.card} p-4 flex flex-col gap-2 shadow-sm`}>
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900 text-sm">{label}{extra}</h3>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles.badge}`}>
          {styles.label}
        </span>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{data?.explanation || "No data available."}</p>
    </div>
  );
}

export default function ResultsCard({ form }) {
  const aspects = Object.keys(ASPECT_LABELS);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-black text-gray-900">Form Analysis</h2>
        <div className="flex gap-3 text-xs">
          {Object.entries(STATUS_STYLES).map(([key, s]) => (
            <span key={key} className="flex items-center gap-1.5 text-gray-500">
              <span className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
              {s.label}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {aspects.map((key) => (
          <AspectCard key={key} aspectKey={key} data={form[key]} />
        ))}
      </div>
    </div>
  );
}
