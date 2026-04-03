import base64
import json
import os
import re

import google.generativeai as genai

genai.configure(api_key=os.environ.get("GEMINI_API_KEY", ""))

QUALITY_PROMPT = """You are a video quality validator for a running form analysis app.
Look at these frames from a running video and evaluate:
1. Is the runner fully visible in the frame (not cropped)?
2. Is the camera angle a side profile (not front-facing or behind)?
3. Is the lighting adequate (not too dark or blown out)?
4. Is there excessive motion blur making the runner hard to see?

Respond ONLY in this JSON format:
{
  "passed": true or false,
  "issues": ["issue 1", "issue 2"],
  "tips": ["tip 1", "tip 2"]
}

If all 4 checks pass, passed should be true and issues should be empty.
If any check fails, passed should be false and list the specific issues with actionable tips to reshoot."""


def _encode_image(path: str) -> str:
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


def check_quality(frame_paths: list[str]) -> dict:
    model = genai.GenerativeModel("gemini-2.5-flash")

    sample = frame_paths[:3]
    parts = []
    for path in sample:
        parts.append({
            "inline_data": {
                "mime_type": "image/jpeg",
                "data": _encode_image(path),
            }
        })
    parts.append(QUALITY_PROMPT)

    response = model.generate_content(parts)
    raw = response.text.strip()

    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)

    return json.loads(raw)
