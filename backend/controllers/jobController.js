
import asyncHandler from 'express-async-handler';
import Job from '../models/Job.js';

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Private
const getJobs = asyncHandler(async (req, res) => {
    const jobs = await Job.find({ user: req.user._id });
    res.json(jobs);
});

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private
const createJob = asyncHandler(async (req, res) => {
    const { company, role, status, notes } = req.body;

    const createdJob = Job.create({
        user: req.user._id,
        company,
        role,
        status,
        notes,
    });

    res.status(201).json(createdJob);
});

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private
const updateJob = asyncHandler(async (req, res) => {
    const job = Job.findById(req.params.id);

    if (job) {
        if (job.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('User not authorized');
        }

        const updatedJob = Job.findByIdAndUpdate(req.params.id, {
            company: req.body.company || job.company,
            role: req.body.role || job.role,
            status: req.body.status || job.status,
            notes: req.body.notes !== undefined ? req.body.notes : job.notes,
        });

        res.json(updatedJob);
    } else {
        res.status(404);
        throw new Error('Job not found');
    }
});

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private
const deleteJob = asyncHandler(async (req, res) => {
    const job = Job.findById(req.params.id);

    if (job) {
        if (job.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('User not authorized');
        }

        Job.findByIdAndDelete(req.params.id);
        res.json({ message: 'Job removed' });
    } else {
        res.status(404);
        throw new Error('Job not found');
    }
});

export { getJobs, createJob, updateJob, deleteJob };
