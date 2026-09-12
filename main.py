import os
from groq import Groq
from pathlib import Path
from dotenv import load_dotenv
load_dotenv()

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

HR_question = input("HR: ")
def get_response ():
    messages = [
        {
            "role": "system",
            "content": system_prompt
        },
        {
            "role": "user",
            "content": HR_question
        }
    ]
    response = client.chat.completions.create(model = model, messages = messages, temperature = 0, stream = True)
    return response

AI_answer = get_response()
for chunk in AI_answer:
    data = chunk.choices[0].delta.content
    if data: 
        print(data, end="", flush= True)
