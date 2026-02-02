
import asyncHandler from 'express-async-handler';
import Project from '../models/Project.js';
import { GoogleGenAI } from '@google/genai';

// Initialize Gemini
// Note: In production, ensure process.env.GEMINI_API_KEY is set
const genAI = process.env.GEMINI_API_KEY
    ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
    : null;

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = asyncHandler(async (req, res) => {
    const projects = await Project.find({ user: req.user._id });
    res.json(projects);
});

// @desc    Create a project (Manual)
// @route   POST /api/projects
// @access  Private
const createProject = asyncHandler(async (req, res) => {
    const { title, description, status } = req.body;

    const createdProject = Project.create({
        user: req.user._id,
        title,
        description,
        status,
    });

    res.status(201).json(createdProject);
});

// @desc    Generate AI Roadmap and create Project
// @route   POST /api/projects/generate
// @access  Private
const generateProjectRoadmap = asyncHandler(async (req, res) => {
    const { topic } = req.body;

    if (!genAI) {
        res.status(500);
        throw new Error('Gemini API Key not configured');
    }

    // Use the gemini-1.5-flash model as it is a common stable model, or check valid ones
    // We'll use a model name that is generally available or user specified
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Create a detailed project roadmap for: ${topic}. 
  Return ONLY valid JSON with the following structure:
  {
    "title": "Project Title",
    "description": "Short description",
    "phases": [
      {
        "name": "Phase Name",
        "tasks": ["Task 1", "Task 2"],
        "duration": "Estimated Duration"
      }
    ]
  }`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Clean up markdown code blocks if present to parse JSON
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const roadmapData = JSON.parse(text);

        const createdProject = Project.create({
            user: req.user._id,
            title: roadmapData.title || topic,
            description: roadmapData.description,
            roadmap: roadmapData,
            status: 'Planned'
        });

        res.status(201).json(createdProject);

    } catch (error) {
        console.error('AI Generation Error:', error);
        res.status(500);
        throw new Error('Failed to generate roadmap');
    }
});

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = asyncHandler(async (req, res) => {
    const project = Project.findById(req.params.id);

    if (project) {
        if (project.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('User not authorized');
        }

        const updatedProject = Project.findByIdAndUpdate(req.params.id, {
            title: req.body.title || project.title,
            description: req.body.description || project.description,
            status: req.body.status || project.status,
            roadmap: req.body.roadmap || project.roadmap,
        });

        res.json(updatedProject);
    } else {
        res.status(404);
        throw new Error('Project not found');
    }
});

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = asyncHandler(async (req, res) => {
    const project = Project.findById(req.params.id);

    if (project) {
        if (project.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('User not authorized');
        }

        Project.findByIdAndDelete(req.params.id);
        res.json({ message: 'Project removed' });
    } else {
        res.status(404);
        throw new Error('Project not found');
    }
});

export { getProjects, createProject, generateProjectRoadmap, updateProject, deleteProject };
