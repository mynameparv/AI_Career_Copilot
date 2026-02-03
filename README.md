# 🚀 AI Career & Project Copilot

<div align="center">
  <img src="https://img.shields.io/badge/Status-Live-success?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/AI-Gemini_Pro-blue?style=for-the-badge&logo=google-gemini" alt="AI Model" />
  <img src="https://img.shields.io/badge/Stack-MERN-green?style=for-the-badge" alt="Stack" />
</div>

---

## 🌟 Overview
**AI Career & Project Copilot** is a premium, AI-driven platform designed to accelerate your professional growth. Whether you are building complex technical roadmaps, tracking job applications, or optimizing your resume, this copilot acts as your personal career coach.

## ✨ Key Features

### 📊 Dynamic Dashboard
* **Real-time Stats:** Track active projects, job applications, and interview invitations at a glance.
* **AI Personal Coach:** Get dynamic, context-aware career suggestions based on your current progress.
* **Resume Health:** View your latest ATS score and scanning history dynamically.

### 🏗️ Project Builder & Roadmaps
* **AI Roadmap Generation:** Generate step-by-step technical roadmaps for any topic using Gemini AI.
* **Progress Tracking:** Manage your learning journey with built-in progress bars and status updates.

### 📊 Smart Job Tracker
* **Application Pipeline:** Manage company names, roles, statuses, and package offers.
* **AI Interview Prep:** Get specialized interview topics and resume-based questions for *every* specific job you apply to.

### 📄 AI Resume Assistant
* **ATS Analyzer:** Upload resumes to get instant feedback on strengths, weaknesses, and improvement areas.
* **User Isolation:** All data (chats, resumes, and jobs) is strictly isolated and personalized for each account.

## 🛠️ Tech Stack

### Frontend
- ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
- ![TypeScript](https://img.shields.io/badge/typescript-%23007acc.svg?style=for-the-badge&logo=typescript&logoColor=white)
- ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
- ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

### Backend
- ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
- ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
- ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
- ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

### AI & Services
- ![Google Gemini](https://img.shields.io/badge/Google%20Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)
- ![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.x or higher)
- [MongoDB](https://www.mongodb.com/cloud/atlas) Account
- [Google Gemini API Key](https://aistudio.google.com/)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/ai-career-project-copilot.git
cd ai-career-project-copilot
```

### 2. Backend Configuration
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder and add:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   API_KEY=your_gemini_api_key
   ```
4. Start the backend:
   ```bash
   npm run dev
   ```

### 3. Frontend Configuration
1. Navigate to the `frontend` directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` folder:
   ```env
   VITE_API_KEY=your_gemini_api_key (optional, if calling Gemini from frontend)
   ```
4. Start the frontend:
   ```bash
   npm run dev
   ```

---

## 📂 Project Structure
```text
├── backend/
│   ├── controllers/      # API Logic
│   ├── models/           # Mongoose Schemas (User, Project, Job)
│   ├── routes/           # Express Routes
│   └── server.js         # Entry Point
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI
│   │   ├── pages/        # Dashboard, Tracker, AI Copilot, etc.
│   │   └── services/     # API/Gemini integrations
└── README.md
```

## 📜 License
This project is licensed under the MIT License.

---
<div align="center">
  Proudly built with ❤️ for Career Growth.
</div>
