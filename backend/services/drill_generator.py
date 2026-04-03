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

MAINTENANCE_PROMPT = """You are an expert running coach.
This runner has excellent form across all evaluated aspects — congratulations!

Generate exactly 2 maintenance drills to help them stay consistent and continue improving.
Each drill should have a name, a duration or rep count, and clear step-by-step instructions.

Respond ONLY in this JSON format:
[
  {
    "issue": "maintenance",
    "drills": [
      {
        "name": "Drill name",
        "duration": "3 sets of 30 seconds",
        "instructions": ["step 1", "step 2", "step 3"]
      }
    ]
  }
]"""


def generate_drills(form_results: dict) -> list:
    model = genai.GenerativeModel("gemini-2.5-flash")

    issues = [
        (key, data)
        for key, data in form_results.items()
        if isinstance(data, dict) and data.get("status") == "needs_work"
    ]

    if not issues:
        response = model.generate_content(MAINTENANCE_PROMPT)
        raw = response.text.strip()
        raw = re.sub(r"^```(?:json)?\s*", "", raw)
        raw = re.sub(r"\s*```$", "", raw)
        return json.loads(raw)

    issues_text = "\n".join(
        f"- {LABEL_MAP.get(key, key)}: {data['explanation']}"
        for key, data in issues
    )

    prompt = f"""You are an expert running coach.
This runner has the following form issues:
{issues_text}

For each issue, generate exactly 2 drills to fix it.
Each drill should have a name, a duration or rep count, and clear step-by-step instructions.

Respond ONLY in this JSON format:
[
  {{
    "issue": "arm_swing",
    "drills": [
      {{
        "name": "Drill name",
        "duration": "3 sets of 30 seconds",
        "instructions": ["step 1", "step 2", "step 3"]
      }}
    ]
  }}
]"""

    response = model.generate_content(prompt)
    raw = response.text.strip()
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)
    return json.loads(raw)
