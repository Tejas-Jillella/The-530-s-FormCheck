import { useState, useRef } from "react";
import axios from "axios";

const TERRAIN_OPTIONS = ["Road", "Trail", "Track", "Treadmill"];
const GOAL_OPTIONS = ["5K", "10K", "Half Marathon", "Marathon", "General Fitness"];

export default function UploadZone({ onQualityFail, onSuccess }) {
  const [videoFile, setVideoFile] = useState(null);
  const [videoURL, setVideoURL] = useState(null);
  const [terrain, setTerrain] = useState("Road");
  const [goal, setGoal] = useState("General Fitness");
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  function handleFile(file) {
    if (!file) return;
    setVideoFile(file);
    setVideoURL(URL.createObjectURL(file));
    setError(null);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("video/")) {
      handleFile(file);
    } else {
      setError("Please drop a valid video file.");
    }
  }

  async function handleAnalyze() {
    if (!videoFile) {
      setError("Please select a video file first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: Upload
      const formData = new FormData();
      formData.append("file", videoFile);

      let uploadRes;
      try {
        uploadRes = await axios.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } catch (err) {
        if (err.response?.status === 400 && err.response.data?.quality_failed) {
          onQualityFail(err.response.data);
          return;
        }
        throw err;
      }

      const { session_id } = uploadRes.data;

      // Step 2: Analyze
      const analyzeRes = await axios.post("/analyze", {
        session_id,
        terrain,
        goal,
      });

      onSuccess(analyzeRes.data);
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || "Something went wrong.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
      {/* Drop zone */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors
          ${dragOver ? "border-nb-red bg-bisque/60" : "border-gray-300 hover:border-nb-red hover:bg-bisque/40"}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !videoFile && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />

        {videoURL ? (
          <div className="flex flex-col items-center gap-3">
            <video
              src={videoURL}
              controls
              className="max-h-64 rounded-xl shadow-md w-full object-contain"
            />
            <button
              className="text-sm text-gray-500 underline hover:text-nb-red"
              onClick={(e) => { e.stopPropagation(); setVideoFile(null); setVideoURL(null); }}
            >
              Remove video
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-gray-500">
            <svg className="w-14 h-14 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
            </svg>
            <p className="text-lg font-medium text-gray-700">Drop your running video here</p>
            <p className="text-sm">or</p>
            <button
              className="px-4 py-2 bg-nb-red text-white rounded-lg text-sm font-medium hover:opacity-90 transition-colors"
              onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
            >
              Browse File
            </button>
            <p className="text-xs text-gray-400 mt-1">MP4, MOV, AVI supported</p>
          </div>
        )}
      </div>

      {/* Dropdowns */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Terrain</label>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-nb-red"
            value={terrain}
            onChange={(e) => setTerrain(e.target.value)}
          >
            {TERRAIN_OPTIONS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Goal</label>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-nb-red"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          >
            {GOAL_OPTIONS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <p className="text-nb-red text-sm font-medium bg-red-50 border border-red-200 rounded-lg px-4 py-2">
          {error}
        </p>
      )}

      {/* Analyze button */}
      <button
        className="w-full py-4 bg-nb-red text-white text-lg font-bold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        onClick={handleAnalyze}
        disabled={loading || !videoFile}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Analyzing your form...
          </>
        ) : (
          "Analyze My Form"
        )}
      </button>
    </div>
  );
}
