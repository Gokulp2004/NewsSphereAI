# NewsSphere AI - Multi-Source News Digest Platform

## Project Overview
NewsSphere AI is a production-ready, full-stack platform that ingests news from multiple sources, summarizes it with AI, clusters related stories, analyzes sentiment, and delivers a modern dashboard for discovery and subscriptions.

## Features
- Multi-source ingestion (NewsAPI + GNews)
- AI summaries with deterministic fallback summarizer
- Clustering with TF-IDF cosine similarity
- Sentiment analysis (Positive, Neutral, Negative)
- Trending topics and keyword insights
- API key authentication and rate limiting
- Swagger/OpenAPI docs at `/api/docs`
- Responsive glassmorphism dashboard with dark/light mode
- Infinite scrolling and pagination
- Caching for digest and trending routes

## Tech Stack
- Frontend: React, Vite, Tailwind CSS, Framer Motion, Lucide
- Backend: Node.js, Express, Mongoose, node-cron
- Database: MongoDB
- AI: OpenAI (GPT) with fallback summarizer
- DevOps: Docker, docker-compose

## Project Structure
```
backend/
  src/
    config/
    controllers/
    routes/
    services/
    middleware/
    models/
    jobs/
    utils/
    docs/
    app.js
frontend/
  src/
    pages/
    components/
    services/
    hooks/
    context/
    layouts/
    App.jsx
```

## Setup Instructions
### 1) Backend
```
cd backend
npm install
cp .env.example .env
npm run dev
```

### 2) Frontend
```
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Environment Variables
Backend (backend/.env):
- `MONGO_URI`
- `NEWSAPI_KEY`
- `GNEWS_API_KEY`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `API_KEY`
- `CORS_ORIGIN`
- `CRON_SCHEDULE`
- `NEWS_TOPICS`
- `CLUSTER_THRESHOLD`
- `CACHE_TTL_SECONDS`

Frontend (frontend/.env):
- `VITE_API_BASE_URL`
- `VITE_API_KEY`

## API Usage Examples
All protected endpoints require `x-api-key` header.

```
GET /api/digest?page=1&limit=6
GET /api/topic/technology?page=1&limit=8
GET /api/article/:id
GET /api/trending
POST /api/subscribe
```

## Screenshots
Add UI screenshots here.

## Docker Deployment
```
cp .env.example .env
docker compose up --build
```

## Deployment Guide
- Frontend: deploy the `frontend` folder to Vercel.
- Backend: deploy the `backend` folder to Render or Railway.
- Database: provision MongoDB Atlas and set `MONGO_URI`.

## Future Improvements
- User accounts and personalized digests
- Event-driven ingestion with queue processing
- More advanced clustering with embeddings
- Multi-language summaries
