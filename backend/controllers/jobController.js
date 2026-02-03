import asyncHandler from 'express-async-handler';
import JobApplication from '../models/JobApplication.js';

// @desc    Get all applications for the logged-in user
// @route   GET /api/jobs
// @access  Private
const getApplications = asyncHandler(async (req, res) => {
    const applications = await JobApplication.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json(applications);
});

// @desc    Add a new job application
// @route   POST /api/jobs
// @access  Private
const addApplication = asyncHandler(async (req, res) => {
    const {
        companyName,
        role,
        appliedAt,
        interviewDate,
        status,
        packageOffer,
        description
    } = req.body;

    if (!companyName || !role) {
        res.status(400);
        throw new Error('Company name and role are required');
    }

    const application = await JobApplication.create({
        user: req.user._id,
        companyName,
        role,
        appliedAt: appliedAt || Date.now(),
        interviewDate,
        status: status || 'Applied',
        packageOffer,
        description
    });

    if (application) {
        res.status(201).json(application);
    } else {
        res.status(400);
        throw new Error('Invalid application data');
    }
});

// @desc    Update an application
// @route   PUT /api/jobs/:id
// @access  Private
const updateApplication = asyncHandler(async (req, res) => {
    const application = await JobApplication.findById(req.params.id);

    if (application) {
        if (application.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('User not authorized');
        }

        application.companyName = req.body.companyName || application.companyName;
        application.role = req.body.role || application.role;
        application.appliedAt = req.body.appliedAt || application.appliedAt;
        application.interviewDate = req.body.interviewDate || application.interviewDate;
        application.status = req.body.status || application.status;
        application.packageOffer = req.body.packageOffer || application.packageOffer;
        application.description = req.body.description || application.description;
        application.aiAdvice = req.body.aiAdvice || application.aiAdvice;

        const updatedApplication = await application.save();
        res.json(updatedApplication);
    } else {
        res.status(404);
        throw new Error('Application not found');
    }
});

// @desc    Delete an application
// @route   DELETE /api/jobs/:id
// @access  Private
const deleteApplication = asyncHandler(async (req, res) => {
    const application = await JobApplication.findById(req.params.id);

    if (application) {
        if (application.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('User not authorized');
        }

        await application.deleteOne();
        res.json({ message: 'Application removed' });
    } else {
        res.status(404);
        throw new Error('Application not found');
    }
});

export {
    getApplications,
    addApplication,
    updateApplication,
    deleteApplication
};
