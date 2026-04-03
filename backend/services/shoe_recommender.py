import json
import os
import re

import google.generativeai as genai

genai.configure(api_key=os.environ.get("GEMINI_API_KEY", ""))

LABEL_MAP = {
    "forward_lean": "Forward Lean",
    "arm_swing": "Arm Swing",
    "foot_strike": "Foot Strike",
    "cadence": "Cadence",
    "knee_drive": "Knee Drive",
    "posture": "Posture",
    "overstriding": "Overstriding",
}


def recommend_shoe(form_results: dict, terrain: str, goal: str) -> dict:
    model = genai.GenerativeModel("gemini-2.5-flash")

    foot_strike_data = form_results.get("foot_strike", {})
    foot_strike_type = foot_strike_data.get("type", "unknown")

    needs_work = [
        LABEL_MAP.get(key, key)
        for key, data in form_results.items()
        if isinstance(data, dict) and data.get("status") == "needs_work"
    ]
    issues_text = ", ".join(needs_work) if needs_work else "None identified"

    prompt = f"""You are a New Balance footwear specialist.
Based on this runner's profile:
- Foot strike: {foot_strike_type}
- Form issues: {issues_text}
- Terrain: {terrain}
- Goal: {goal}

Recommend the single best New Balance shoe for this runner from their current lineup.
Give the exact model name, explain why it suits this runner specifically, and list 3 key features.

Respond ONLY in this JSON format:
{{
  "model": "New Balance 1080v13",
  "tagline": "one sentence pitch",
  "reason": "2-3 sentences why this suits this specific runner",
  "features": ["feature 1", "feature 2", "feature 3"]
}}"""

    response = model.generate_content(prompt)
    raw = response.text.strip()
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)
    return json.loads(raw)
