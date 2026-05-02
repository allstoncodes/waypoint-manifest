"""Run once pre-venue to generate the manifestation video via Fal I2V."""
import asyncio
import os
import sys
import fal_client
from pathlib import Path
import httpx

FAL_KEY = os.environ.get("FAL_KEY") or os.environ.get("FAL_API_KEY")
if not FAL_KEY:
    print("ERROR: set FAL_KEY env var")
    print("  export FAL_KEY=$(grep FAL_KEY ~/projects/perplexity-trip-planner/.env | cut -d= -f2)")
    sys.exit(1)

photo_path = Path("assets/opera_house_photo.jpg")
if not photo_path.exists():
    print(f"ERROR: photo not found at {photo_path}")
    sys.exit(1)

PROMPT = (
    "Cinematic arrival scene. A traveler stands at the edge of the waterfront, "
    "gazing at the illuminated Sydney Opera House at dusk. A ferry glides past. "
    "Slow push-in camera move. Warm golden light. Dreamlike, euphoric atmosphere. "
    "High-quality travel film aesthetic."
)


async def main():
    print("Uploading photo to Fal...")
    image_url = await asyncio.to_thread(fal_client.upload_file, str(photo_path))
    print(f"Uploaded: {image_url}")

    # Try HAILUO first (fast), fall back to SEEDANCE
    video_url = None
    for model_id, args in [
        (
            "fal-ai/minimax/hailuo-2.3-fast/pro/image-to-video",
            {"image_url": image_url, "prompt": PROMPT},
        ),
        (
            "bytedance/seedance-2.0/image-to-video",
            {"image_url": image_url, "prompt": PROMPT, "resolution": "720p", "duration": "5", "generate_audio": False},
        ),
    ]:
        print(f"\nSubmitting to {model_id}...")
        try:
            result = await fal_client.run_async(model_id, arguments=args)
            video_url = result["video"]["url"]
            print(f"✅ Got video URL from {model_id}")
            break
        except Exception as e:
            print(f"  Failed ({e}), trying next model...")

    if not video_url:
        print("ERROR: all models failed"); sys.exit(1)

    print(f"\nVideo URL: {video_url}")
    Path("assets/video_url.txt").write_text(video_url)

    local_path = Path("assets/manifestation.mp4")
    print(f"Downloading to {local_path}...")
    async with httpx.AsyncClient(timeout=300) as http:
        r = await http.get(video_url, follow_redirects=True)
        r.raise_for_status()
        local_path.write_bytes(r.content)

    print(f"✅ Saved: {local_path}  ({local_path.stat().st_size / 1_000_000:.1f} MB)")
    print("\nDone! Run: open assets/manifestation.mp4")


asyncio.run(main())
