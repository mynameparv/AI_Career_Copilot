# AI Career & Project Copilot Backend

This is the backend for the AI Career & Project Copilot application. It is built with Node.js, Express, MongoDB, and Redis.

## Features
- **Authentication**: JWT-based auth (Register/Login).
- **Job Tracker**: CRUD operations for job applications.
- **Project Planner**: CRUD for projects with AI-generated roadmaps.
- **AI Integration**: Integration with Google Gemini for roadmap generation and chat.
- **Caching**: Redis used for potentially caching AI responses (configured but not fully utilized in V1 to keep it simple).

## Prerequisites
- Node.js
- Docker & Docker Compose (Recommended)
- MongoDB (if running locally without Docker)
- Redis (if running locally without Docker)

## Getting Started

### Using Docker (Recommended)
1. **Env Vars**: Create a `.env` file in the `backend` directory (see `.env.example` or use the provided `.env`). You MUST add your `GEMINI_API_KEY`.
2. **Build & Run**:
   ```bash
   docker-compose up --build
   ```
   The backend will be available at `http://localhost:5000`.

### Running Locally
1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Start MongoDB and Redis services locally.
3. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints
- `POST /api/auth/register` - Create user
- `POST /api/auth/login` - Login
- `GET /api/jobs` - Get user jobs
- `POST /api/jobs` - Create job
- `POST /api/projects/generate` - Generate AI Project Roadmap
