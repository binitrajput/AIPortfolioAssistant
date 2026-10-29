# Binit Rajput — Portfolio

A responsive developer portfolio built with React and Vite, with a FastAPI-powered AI assistant that answers questions about my work.

## Project previews

### AI Portfolio Assistant

![AI Portfolio Assistant preview](frontend/src/assets/projects/AI%20Portfolio%20Assistant%20Hero%20Mockup.png)

### More projects

| YuktaVihar | Vision Bridge |
| --- | --- |
| ![YuktaVihar preview](<frontend/src/assets/projects/YuktaVihar Vacation Rental Showcase (1).png>) | ![Vision Bridge preview](frontend/src/assets/projects/Vision Bridge.png) |

| Autonomous Finance Clerk |
| --- |
| ![Autonomous Finance Clerk preview](<frontend/src/assets/projects/Autonomous Finance Clerk Dashboard.png>) |

## Features

- Responsive portfolio with project, about, skills, and contact sections.
- Light and dark themes, with the selection saved in the browser.
- A draggable, looping project carousel with touch support and momentum.
- Project cards with screenshots, technology tags, and links to the Finance Clerk repository and live demo.
- An AI chat modal with streamed answers and formatted emphasis.
- FastAPI backend that streams responses generated from the profile in `profile.txt`.

## Projects

- **YuktaVihar** — Full-stack vacation rental marketplace using Node.js, Express, MongoDB, Cloudinary, and Passport.js.
- **Vision Bridge** — Real-time video conferencing platform using React, WebRTC, Socket.io, Node.js, and MongoDB.
- **AI Portfolio Assistant** — Recruiter-focused portfolio chatbot built with React, FastAPI, and Groq-hosted LLMs.
- **Autonomous Finance Clerk** — Invoice processing agent built with Python, Streamlit, LiteLLM, SQLite, and Groq tool calling. [GitHub](https://github.com/binitrajput/autonomous-finance-clerk) · [Live demo](https://autonomous-finance-clerk.streamlit.app/).

## Requirements

- Python 3.12 or newer
- Node.js and npm
- A Groq API key

## Run locally

1. Create a `.env` file in the repository root and add your API key:

   ```env
   GROQ_API_KEY=your_groq_api_key
   ```

   For local development, the API allows `http://localhost:5173` by default. Set `CORS_ORIGINS` to a comma-separated list of frontend origins when deploying.

2. Install Python dependencies and start the API from the repository root:

   ```bash
   uv sync
   uv run uvicorn ai_portfolio.main:app --reload
   ```

   The API runs at `http://127.0.0.1:8000`.

3. In another terminal, install and start the frontend:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   Open the Vite address shown in the terminal, usually `http://localhost:5173`.

The frontend defaults to the local API URL above. To use a different backend, set `VITE_API_URL` in `frontend/.env.local`.

## Build the frontend

```bash
cd frontend
npm run build
```

## Repository layout

```text
.
├── main.py                         # Compatibility ASGI entry point
├── profile.txt                     # Assistant profile context
├── src/ai_portfolio/main.py        # FastAPI application
├── frontend/                       # React and Vite portfolio
│   └── src/assets/projects/        # Project preview images
├── pyproject.toml                  # Python dependencies
└── uv.lock
```
