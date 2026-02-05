import asyncHandler from 'express-async-handler';
import Project from '../models/Project.js';
import User from '../models/User.js';

import { GoogleGenAI } from '@google/genai';

// @desc    Get all projects for the logged-in user
// @route   GET /api/projects
// @access  Private
const getProjects = asyncHandler(async (req, res) => {
    const projects = await Project.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json(projects);
});

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
const createProject = asyncHandler(async (req, res) => {
    // Frontend sends 'title' and 'progress', so we extract those
    const { title, projectType, description, status, roadmap, progress } = req.body;

    if (!title) {
        res.status(400);
        throw new Error('Project title is required');
    }

    const project = await Project.create({
        user: req.user._id,
        title,
        projectType: projectType || 'other',
        description,
        status: status || 'Planned',
        roadmap,
        progress: progress || 0,
        workflowState: {
            chatHistory: [],
            aiSteps: []
        }
    });

    if (project) {
        await User.findByIdAndUpdate(req.user._id, {
            $push: { projects: project._id }
        });
        res.status(201).json(project);
    } else {
        res.status(400);
        throw new Error('Invalid project data');
    }
});

// @desc    Update project progress and state
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (project) {
        if (project.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('User not authorized to update this project');
        }

        project.title = req.body.title || project.title;
        project.status = req.body.status || project.status;
        project.progress = req.body.progress !== undefined ? req.body.progress : project.progress;
        project.roadmap = req.body.roadmap || project.roadmap;

        if (req.body.workflowState) {
            project.workflowState = {
                ...project.workflowState,
                ...req.body.workflowState
            };
        }

        const updatedProject = await project.save();
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
    const project = await Project.findById(req.params.id);

    if (project) {
        if (project.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('User not authorized');
        }

        await project.deleteOne();
        await User.findByIdAndUpdate(req.user._id, {
            $pull: { projects: req.params.id }
        });

        res.json({ message: 'Project removed successfully' });
    } else {
        res.status(404);
        throw new Error('Project not found');
    }
});

// @desc    Generate AI Roadmap (Preview)
// @route   POST /api/projects/generate
// @access  Private
const generateProjectRoadmap = asyncHandler(async (req, res) => {
    const { topic } = req.body;

    if (!topic) {
        res.status(400);
        throw new Error('Topic is required for roadmap generation');
    }

    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Create a detailed, professional project roadmap for the topic: "${topic}".
    The roadmap should be structured for a developer portfolio.
    Return ONLY a JSON object with the following structure:
    {
      "title": "A catchy title for the project",
      "description": "A brief, compelling description",
      "phases": [
        {
          "name": "Phase Name (e.g., Planning, MVP)",
          "tasks": ["Task 1", "Task 2"],
          "duration": "Estimated time (e.g., 1 week)"
        }
      ]
    }
    Include at least 3 phases with 3-4 tasks each.`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const responseText = response.text();

        // Clean the response in case it contains markdown code blocks
        const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const roadmapData = JSON.parse(cleanedJson);

        // Format tasks to objects for the preview
        const formattedPhases = roadmapData.phases.map(phase => ({
            ...phase,
            tasks: phase.tasks.map(task => ({
                text: typeof task === 'string' ? task : task.text,
                completed: false
            }))
        }));

        const previewRoadmap = {
            ...roadmapData,
            phases: formattedPhases
        };

        res.status(200).json(previewRoadmap);
    } catch (error) {
        console.error('Roadmap Generation Error:', error);
        res.status(500);
        throw new Error('Failed to generate roadmap preview: ' + error.message);
    }
});

export {
    getProjects,
    createProject,
    updateProject,
    deleteProject,
    generateProjectRoadmap
};
