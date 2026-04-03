import os
import uuid
import ffmpeg

FRAMES_DIR = "/tmp/formcheck_frames"
MAX_FRAMES = 20


def extract_frames(video_path: str) -> list[str]:
    session_id = str(uuid.uuid4())
    output_dir = os.path.join(FRAMES_DIR, session_id)
    os.makedirs(output_dir, exist_ok=True)

    output_pattern = os.path.join(output_dir, "frame_%04d.jpg")

    (
        ffmpeg
        .input(video_path)
        .filter("fps", fps=2)  # 1 frame every 0.5 seconds = 2 fps
        .output(output_pattern, vframes=MAX_FRAMES, format="image2", vcodec="mjpeg")
        .overwrite_output()
        .run(quiet=True)
    )

    frames = sorted([
        os.path.join(output_dir, f)
        for f in os.listdir(output_dir)
        if f.endswith(".jpg")
    ])

    return frames[:MAX_FRAMES]
