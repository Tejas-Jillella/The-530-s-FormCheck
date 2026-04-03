from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.form_analyzer import analyze_form
from services.drill_generator import generate_drills
from services.shoe_recommender import recommend_shoe
from routes.upload import sessions

router = APIRouter()


class AnalyzeRequest(BaseModel):
    session_id: str
    terrain: str
    goal: str


@router.post("/analyze")
async def analyze(body: AnalyzeRequest):
    frame_paths = sessions.get(body.session_id)
    if not frame_paths:
        raise HTTPException(status_code=404, detail="Session not found. Please upload a video first.")

    try:
        form = analyze_form(frame_paths)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Form analysis failed: {str(e)}")

    try:
        drills = generate_drills(form)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Drill generation failed: {str(e)}")

    try:
        shoe = recommend_shoe(form, body.terrain, body.goal)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Shoe recommendation failed: {str(e)}")

    return {
        "form": form,
        "drills": drills,
        "shoe": shoe,
    }
