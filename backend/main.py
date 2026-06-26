from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from openai import OpenAI
from dotenv import load_dotenv

from knowledge import KNOWLEDGE

import os

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

app = FastAPI(title="Codify AI Assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[Message]


@app.get("/")
def home():
    return {
        "name": "Codify AI Assistant",
        "status": "online"
    }


@app.post("/chat")
def chat(data: ChatRequest):

    messages = [
        {
            "role": "system",
            "content": KNOWLEDGE
        }
    ]

    for message in data.messages:
        messages.append({
            "role": message.role,
            "content": message.content
        })

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=messages,
        temperature=0.3
    )

    answer = response.choices[0].message.content

    return {
        "answer": answer
    }