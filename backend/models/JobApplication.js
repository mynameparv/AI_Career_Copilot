import mongoose from 'mongoose';

const jobApplicationSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        companyName: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
        },
        appliedAt: {
            type: Date,
            default: Date.now,
        },
        interviewDate: {
            type: Date,
        },
        status: {
            type: String,
            required: true,
            enum: ['Applied', 'Interviewing', 'Selected', 'Rejected', 'Offer Received', 'Withdrawn'],
            default: 'Applied',
        },
        packageOffer: {
            type: String, // Storing as string to handle different currencies/formats like "12 LPA" or "$120k"
        },
        description: {
            type: String,
        },
        aiAdvice: {
            type: String, // Dynamic AI advice for this specific application
        }
    },
    {
        timestamps: true,
    }
);

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

export default JobApplication;
