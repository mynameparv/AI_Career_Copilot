import asyncHandler from 'express-async-handler';
import Project from '../models/Project.js';
import User from '../models/User.js';

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

// @desc    Generate AI Roadmap and create Project
// @route   POST /api/projects/generate
// @access  Private
const generateProjectRoadmap = asyncHandler(async (req, res) => {
    const { topic } = req.body;

    if (!topic) {
        res.status(400);
        throw new Error('Topic is required for roadmap generation');
    }

    const roadmapData = {
        title: `AI Roadmap: ${topic}`,
        description: `Step-by-step guide for ${topic}`,
        phases: [
            { name: 'Research', tasks: [{ text: 'Market study', completed: false }], duration: '1 week' },
            { name: 'Implementation', tasks: [{ text: 'Coding', completed: false }], duration: '2 weeks' }
        ]
    };

    const project = await Project.create({
        user: req.user._id,
        title: roadmapData.title,
        projectType: 'roadmap',
        description: roadmapData.description,
        roadmap: roadmapData,
        status: 'Planned',
        progress: 0
    });

    await User.findByIdAndUpdate(req.user._id, {
        $push: { projects: project._id }
    });

    res.status(201).json(project);
});

export {
    getProjects,
    createProject,
    updateProject,
    deleteProject,
    generateProjectRoadmap
};
