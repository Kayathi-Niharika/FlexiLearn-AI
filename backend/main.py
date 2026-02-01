from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import save_session, get_history, get_full_history, get_session_by_id
from video_generator import create_explainer_video

app = FastAPI()

# =====================
# STATIC FILES (VIDEOS)
# =====================

app.mount(
    "/generated_videos",
    StaticFiles(directory="generated_videos"),
    name="generated_videos"
)

# =====================
# CORS
# =====================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# =====================
# MODELS
# =====================

class RequestData(BaseModel):
    topic: str
    interest: str

class ExploreRequest(BaseModel):
    topic: str
    question: str

# =====================
# HEALTH CHECK
# =====================

@app.get("/")
def root():
    return {"status": "FlexiLearn AI backend running"}

# =====================
# EXPLANATION API (RULE-BASED, INTEREST-AWARE)
# =====================

@app.post("/explain")
def explain(data: RequestData):
    topic = data.topic.strip()
    interest = data.interest.strip().lower()

    if not topic or not interest:
        return {"explanation": "Please provide both topic and interest."}

    if interest == "cricket":
        explanation = f"""
{topic} can be clearly understood using cricket.

When a bowler delivers the ball, it moves fast initially.
After hitting the pitch, the ball slows down, spins, or changes direction.

This happens due to {topic}.

Dry pitches increase the effect of {topic}, helping spin bowlers.
Wet pitches reduce it, causing the ball to slide smoothly.

That’s why pitch conditions matter so much in cricket.
"""

    elif interest == "football":
        explanation = f"""
In football, players run, stop, and change direction frequently.

The ball slows down when rolling on grass because of {topic}.
This helps players control passes and maintain balance.

Without {topic}, football would become slippery and uncontrollable.
"""

    elif interest == "gaming":
        explanation = f"""
In gaming, realistic movement depends on {topic}.

When characters stop or slide naturally, it is because the game engine applies {topic}.
Without it, characters would move unrealistically.
"""

    elif interest == "technology":
        explanation = f"""
In technology, {topic} affects machine efficiency.

Engineers try to reduce unwanted {topic} to prevent heat loss and damage.
This improves performance and durability.
"""

    else:
        explanation = f"""
{topic} explains how resistance affects motion.

By relating {topic} to everyday experiences,
learning becomes easier and more relatable.
"""

    save_session(topic, interest, explanation)
    return {"explanation": explanation}

# =====================
# QUIZ API (5 QUESTIONS)
# =====================

@app.post("/quiz")
def generate_quiz(data: RequestData):
    topic = data.topic

    return [
        {
            "question": f"What best describes {topic}?",
            "options": ["An object", "A concept", "A place", "A tool"],
            "correct": 1,
            "explanation": f"{topic} is a concept."
        },
        {
            "question": f"Why is {topic} important?",
            "options": ["Marks", "Understanding", "Fun", "Luck"],
            "correct": 1,
            "explanation": f"It builds foundational understanding."
        },
        {
            "question": f"Where is {topic} applied?",
            "options": ["Books only", "Real life", "Labs only", "Nowhere"],
            "correct": 1,
            "explanation": f"It appears in daily life."
        },
        {
            "question": f"What happens if {topic} is misunderstood?",
            "options": ["Nothing", "Learning gaps", "Success", "Mastery"],
            "correct": 1,
            "explanation": f"It creates learning gaps."
        },
        {
            "question": f"Best way to learn {topic}?",
            "options": ["Ignore", "Memorize", "Relate examples", "Skip"],
            "correct": 2,
            "explanation": f"Examples help understanding."
        }
    ]

# =====================
# FOLLOW-UP / DOUBT API
# =====================

@app.post("/explore")
def explore(data: ExploreRequest):
    answer = f"""
You asked: "{data.question}"

To understand {data.topic}, break it into simple ideas,
connect it with real life, and revise examples.

If you want, try the quiz to reinforce learning.
"""

    return {"answer": answer}

# =====================
# HISTORY APIs
# =====================

@app.get("/history")
def history():
    return get_history()

@app.get("/history/full")
def full_history():
    return get_full_history()

@app.get("/history/{session_id}")
def history_by_id(session_id: int):
    session = get_session_by_id(session_id)
    return session or {"error": "Session not found"}

# =====================
# VIDEO GENERATION API
# =====================

@app.post("/generate-video")
def generate_video(data: dict):
    explanation = data.get("explanation", "")
    if not explanation:
        return {"error": "No explanation provided"}

    video_path = create_explainer_video(explanation)
    return {"video_url": video_path}
