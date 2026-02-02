# AI Career & Project Copilot

This project is a React + Node.js (MERN) application.

## Project Structure
- `frontend/`: React application (Vite)
- `backend/`: Node.js/Express API

## Run Locally

### Prerequisites
- Node.js
- MongoDB Atlas URI

### 1. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
   Server runs on http://localhost:5000

### 2. Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   App runs on http://localhost:5173

