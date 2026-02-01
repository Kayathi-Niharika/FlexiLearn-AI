from gtts import gTTS
from moviepy.audio.io.AudioFileClip import AudioFileClip
from moviepy.video.VideoClip import ImageClip
from PIL import Image, ImageDraw, ImageFont
import os
import uuid

OUTPUT_DIR = "generated_videos"
os.makedirs(OUTPUT_DIR, exist_ok=True)


def create_explainer_video(text: str):
    video_id = str(uuid.uuid4())
    audio_path = f"{OUTPUT_DIR}/{video_id}.mp3"
    image_path = f"{OUTPUT_DIR}/{video_id}.png"
    video_path = f"{OUTPUT_DIR}/{video_id}.mp4"

    # 🔊 Text → Voice
    tts = gTTS(text=text, lang="en")
    tts.save(audio_path)

    # 🖼 Create image frame
    img = Image.new("RGB", (1280, 720), color=(106, 13, 173))
    draw = ImageDraw.Draw(img)

    try:
        font = ImageFont.truetype("arial.ttf", 40)
    except:
        font = ImageFont.load_default()

    wrapped_text = text[:500] + "..." if len(text) > 500 else text
    draw.multiline_text((80, 200), wrapped_text, fill="white", font=font, spacing=10)

    img.save(image_path)

    # 🎥 Create video
    audio = AudioFileClip(audio_path)
    image_clip = ImageClip(image_path).set_duration(audio.duration)
    video = image_clip.set_audio(audio)

    video.write_videofile(video_path, fps=24, codec="libx264")

    return video_path
