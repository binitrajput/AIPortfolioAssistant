import os
from groq import Groq
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI
from pydantic import BaseModel

class ChatRequest(BaseModel):
    question: str

load_dotenv()
app = FastAPI()

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
- Use only the information provided in the profile.
- Do not invent or assume information.
- If the answer is not available in the profile, say so.
- Keep responses accurate, professional, and recruiter-friendly.
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
    response = client.chat.completions.create(model= model, messages=messages, temperature=0)
    answer  = response.choices[0].message.content
    return {"AI: ": answer}