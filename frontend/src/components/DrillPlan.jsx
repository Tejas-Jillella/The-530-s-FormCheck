const LABEL_MAP = {
  forward_lean: "Forward Lean",
  arm_swing: "Arm Swing",
  foot_strike: "Foot Strike",
  cadence: "Cadence",
  knee_drive: "Knee Drive",
  posture: "Posture",
  overstriding: "Overstriding",
  maintenance: "Maintenance",
};

function DrillCard({ drill, index }) {
  return (
    <div className="bg-bisque/50 border border-gray-200 rounded-xl p-4 flex flex-col gap-3 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-bold text-gray-900 text-sm">{drill.name}</h4>
        <span className="flex-shrink-0 px-2.5 py-1 bg-nb-red text-white text-xs rounded-full font-medium">
          {drill.duration}
        </span>
      </div>
      <ol className="flex flex-col gap-1.5">
        {(drill.instructions || []).map((step, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-nb-red text-white flex items-center justify-center text-xs font-bold mt-0.5">
              {i + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function DrillPlan({ drills }) {
  if (!drills || drills.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-black text-gray-900">Your Drill Plan</h2>

      <div className="flex flex-col gap-6">
        {drills.map((group, gi) => {
          const label = LABEL_MAP[group.issue] || group.issue;
          const isMaintenance = group.issue === "maintenance";

          return (
            <div key={gi} className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className={`w-1 h-6 rounded-full ${isMaintenance ? "bg-green-500" : "bg-nb-red"}`} />
                <h3 className="text-base font-bold text-gray-800">
                  {isMaintenance ? "Maintenance Drills" : `Fix: ${label}`}
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(group.drills || []).map((drill, di) => (
                  <DrillCard key={di} drill={drill} index={di} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
