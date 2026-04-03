# FormCheck by New Balance

AI-powered running form analyzer. Upload a video, get biomechanics feedback, a personalized drill plan, and a New Balance shoe recommendation.

---

## Prerequisites

### 1. Install ffmpeg

**macOS (Homebrew):**
```bash
brew install ffmpeg
```

**Windows:**
1. Download the latest build from https://ffmpeg.org/download.html (select "Windows builds by BtbN" or similar)
2. Extract the zip to a folder like `C:\ffmpeg`
3. Add `C:\ffmpeg\bin` to your system PATH:
   - Open Start → search "Environment Variables"
   - Under "System variables", find `Path`, click Edit
   - Click New → paste `C:\ffmpeg\bin`
   - Click OK to save, then restart your terminal
4. Verify: `ffmpeg -version`

---

### 2. Set the GEMINI_API_KEY environment variable

Get your key at https://aistudio.google.com/app/apikey

**macOS / Linux:**
```bash
export GEMINI_API_KEY="your_api_key_here"
```
To make it permanent, add that line to your `~/.zshrc` or `~/.bashrc`, then run `source ~/.zshrc`.

**Windows (Command Prompt):**
```cmd
set GEMINI_API_KEY=your_api_key_here
```

**Windows (PowerShell):**
```powershell
$env:GEMINI_API_KEY="your_api_key_here"
```
To make it permanent on Windows, add it via System Properties → Environment Variables.

---

## Running the Backend

```bash
cd formcheck/backend

# Create and activate a virtual environment (recommended)
python -m venv venv
source venv/bin/activate        # macOS/Linux
# venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload --port 8000
```

The API will be available at http://localhost:8000

---

## Running the Frontend

```bash
cd formcheck/frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open http://localhost:5173 in your browser.

---

## How to Use

1. Film yourself running from a **side profile** with good lighting — full body visible
2. Upload the video in the app
3. Select your terrain and goal from the dropdowns
4. Click **Analyze My Form**
5. Review your form breakdown, drill plan, and shoe recommendation

---

## Project Structure

```
formcheck/
├── backend/
│   ├── main.py                    # FastAPI app entry point
│   ├── requirements.txt
│   ├── routes/
│   │   ├── upload.py              # POST /upload
│   │   └── analyze.py             # POST /analyze
│   └── services/
│       ├── frame_extractor.py     # ffmpeg frame extraction
│       ├── quality_checker.py     # Gemini video quality validation
│       ├── form_analyzer.py       # Gemini biomechanics analysis
│       ├── drill_generator.py     # Gemini drill plan generation
│       └── shoe_recommender.py    # Gemini New Balance shoe recommendation
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        └── components/
            ├── UploadZone.jsx       # Video upload + terrain/goal selectors
            ├── QualityGate.jsx      # Quality fail screen with tips
            ├── ResultsCard.jsx      # 7-aspect form analysis grid
            ├── DrillPlan.jsx        # Personalized drill cards
            └── ShoeRecommendation.jsx  # NB shoe card with Shop Now link
```
