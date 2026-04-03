import os
import uuid

from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse

from services.frame_extractor import extract_frames
from services.quality_checker import check_quality

router = APIRouter()

UPLOADS_DIR = "/tmp/formcheck_uploads"

# In-memory session store: session_id -> list of frame paths
sessions: dict[str, list[str]] = {}


@router.post("/upload")
async def upload_video(file: UploadFile = File(...)):
    os.makedirs(UPLOADS_DIR, exist_ok=True)

    ext = os.path.splitext(file.filename or "video.mp4")[1] or ".mp4"
    session_id = str(uuid.uuid4())
    video_path = os.path.join(UPLOADS_DIR, f"{session_id}{ext}")

    contents = await file.read()
    with open(video_path, "wb") as f:
        f.write(contents)

    try:
        frame_paths = extract_frames(video_path)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Frame extraction failed: {str(e)}")

    if not frame_paths:
        raise HTTPException(status_code=422, detail="No frames could be extracted from the video.")

    try:
        quality = check_quality(frame_paths)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Quality check failed: {str(e)}")

    if not quality.get("passed", False):
        return JSONResponse(
            status_code=400,
            content={
                "quality_failed": True,
                "issues": quality.get("issues", []),
                "tips": quality.get("tips", []),
            },
        )

    sessions[session_id] = frame_paths

    return {
        "session_id": session_id,
        "frame_count": len(frame_paths),
        "quality": quality,
    }
