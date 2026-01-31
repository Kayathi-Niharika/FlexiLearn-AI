from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from database import save_session, get_history

app = FastAPI()

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

class RequestData(BaseModel):
    topic: str
    interest: str

@app.post("/explain")
def explain(data: RequestData):
    explanation = f"{data.topic} can be understood using {data.interest} as an example."
    save_session(data.topic, data.interest, explanation)
    return {"explanation": explanation}

@app.get("/history")
def history():
    return get_history()
