import os
from groq import Groq
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware

class ChatRequest(BaseModel):
    question: str

load_dotenv()
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
my_api_key = os.getenv("GROQ_API_KEY")
if not my_api_key:
    raise ValueError("API error")
client = Groq(api_key = my_api_key)
model = "openai/gpt-oss-120b"

with open("profile.txt", "r") as file:
    profile = file.read()

system_prompt = f"""
You are Binit Rajput's AI Portfolio Assistant.

Answer HR and recruiter questions about Binit's:
- Education
- Technical skills
- Projects
- Achievements
- Experience
- Professional profile

Here is Binit's profile:

{profile}

Rules:
- Answer only the question asked by the recruiter.
- Do not give a complete profile or project overview unless explicitly asked.
- Keep simple factual answers concise but no fragmentation in grammer, usually 1-3 sentences.
- For project-related questions, explain only the relevant project.
- If the recruiter asks a broad question, then provide a structured answer.
- Do not add unnecessary introductions or summaries.
- Be professional and conversational.
"""
@app.get("/")
def home():
    return {"message": "AI portforlio root route is working"}
@app.post("/chat")
def chat(request: ChatRequest):
    messages = [
        {
            "role": "system",
            "content": system_prompt
        },
        {
            "role": "user", 
            "content": request.question
        }
    ]
    def generate_response():
        response = client.chat.completions.create(
            model= model,
            messages=messages,
            temperature=0,
            stream = True
        )
        for chunk in response:
            data = chunk.choices[0].delta.content
            if data: 
                yield data
    return StreamingResponse(generate_response(), media_type = "text/plain")