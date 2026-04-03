import { useState } from "react";
import UploadZone from "./components/UploadZone";
import QualityGate from "./components/QualityGate";
import ResultsCard from "./components/ResultsCard";
import DrillPlan from "./components/DrillPlan";
import ShoeRecommendation from "./components/ShoeRecommendation";

// States: "upload" | "quality_fail" | "results"
export default function App() {
  const [view, setView] = useState("upload");
  const [qualityData, setQualityData] = useState(null);
  const [results, setResults] = useState(null);

  function handleQualityFail(data) {
    setQualityData(data);
    setView("quality_fail");
  }

  function handleSuccess(data) {
    setResults(data);
    setView("results");
  }

  function handleReset() {
    setView("upload");
    setQualityData(null);
    setResults(null);
  }

  return (
    <div className="min-h-screen bg-bisque flex flex-col">
      {/* Header */}
      <header className="bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* NB Logo wordmark */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-nb-red rounded flex items-center justify-center">
                <span className="text-white font-black text-sm leading-none">NB</span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-white font-black text-xl tracking-tight">FormCheck</span>
                <span className="text-gray-400 text-xs tracking-widest uppercase">by New Balance</span>
              </div>
            </div>
          </div>

          {view === "results" && (
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-nb-red text-white text-sm font-medium rounded-lg hover:opacity-90 transition-colors"
            >
              Analyze Another
            </button>
          )}
        </div>
      </header>

      {/* Hero (upload view only) */}
      {view === "upload" && (
        <div className="bg-black text-white pb-12 pt-8">
          <div className="max-w-4xl mx-auto px-4 text-center flex flex-col items-center gap-3">
            <div className="inline-block px-3 py-1 bg-nb-red text-white text-xs font-bold uppercase tracking-widest rounded-full mb-1">
              AI-Powered Analysis
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
              Run Better.<br />
              <span className="text-nb-red">Right Now.</span>
            </h1>
            <p className="text-gray-300 text-base max-w-md leading-relaxed">
              Upload a side-profile video of your run. Our AI analyzes your form, builds a personalized drill plan, and finds the perfect New Balance shoe for you.
            </p>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-10">
        {view === "upload" && (
          <UploadZone onQualityFail={handleQualityFail} onSuccess={handleSuccess} />
        )}

        {view === "quality_fail" && (
          <QualityGate
            issues={qualityData?.issues}
            tips={qualityData?.tips}
            onReset={handleReset}
          />
        )}

        {view === "results" && results && (
          <div className="flex flex-col gap-10">
            <ResultsCard form={results.form} />
            <DrillPlan drills={results.drills} />
            <ShoeRecommendation shoe={results.shoe} />

            <div className="text-center">
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-nb-red text-white font-bold rounded-xl hover:opacity-90 transition-colors text-sm"
              >
                Analyze Another Video
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-black text-gray-500 text-center py-4 text-xs">
        <p>FormCheck &copy; {new Date().getFullYear()} &mdash; Sponsored by New Balance. AI analysis is for training guidance only.</p>
      </footer>
    </div>
  );
}
