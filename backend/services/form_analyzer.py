import base64
import json
import os
import re

import google.generativeai as genai

genai.configure(api_key=os.environ.get("GEMINI_API_KEY", ""))

FORM_PROMPT = """You are an expert running coach and biomechanics specialist.
Analyze these frames from a runner's video and evaluate the following aspects of their running form.
For each aspect give a status of "good", "needs_work", or "unclear" and a 1-2 sentence explanation.

Aspects to evaluate:
1. forward_lean - Is the runner leaning slightly forward from the ankles (not the waist)?
2. arm_swing - Are the arms swinging forward and back (not crossing the body), bent at roughly 90 degrees?
3. foot_strike - Where is the foot landing relative to the body? (heel strike, midfoot strike, or forefoot strike)
4. cadence - Does the runner appear to have a quick, light turnover or slow heavy steps?
5. knee_drive - Is there adequate knee lift on each stride?
6. posture - Is the head up, shoulders relaxed, core engaged?
7. overstriding - Is the foot landing far in front of the body's center of mass?

Respond ONLY in this JSON format:
{
  "forward_lean": {"status": "good", "explanation": "..."},
  "arm_swing": {"status": "needs_work", "explanation": "..."},
  "foot_strike": {"status": "good", "explanation": "...", "type": "midfoot"},
  "cadence": {"status": "needs_work", "explanation": "..."},
  "knee_drive": {"status": "good", "explanation": "..."},
  "posture": {"status": "good", "explanation": "..."},
  "overstriding": {"status": "needs_work", "explanation": "..."}
}"""


def _encode_image(path: str) -> str:
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


def analyze_form(frame_paths: list[str]) -> dict:
    model = genai.GenerativeModel("gemini-2.5-flash")

    # Every 3rd frame to reduce redundancy
    sample = frame_paths[::3]

    parts = []
    for path in sample:
        parts.append({
            "inline_data": {
                "mime_type": "image/jpeg",
                "data": _encode_image(path),
            }
        })
    parts.append(FORM_PROMPT)

    response = model.generate_content(parts)
    raw = response.text.strip()

    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)

    return json.loads(raw)
