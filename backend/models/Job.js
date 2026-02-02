
import mongoose from 'mongoose';

const jobSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        company: {
            type: String,
            required: [true, 'Please add a company name'],
        },
        role: {
            type: String,
            required: [true, 'Please add a role/title'],
        },
        status: {
            type: String,
            enum: ['Wishlist', 'Applied', 'Interviewing', 'Offer', 'Rejected'],
            default: 'Applied',
        },
        description: {
            type: String, // Optional job description for AI analysis
            required: false,
        },
        dateApplied: {
            type: Date,
            default: Date.now,
        },
        notes: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true,
    }
);

const Job = mongoose.model('Job', jobSchema);

export default Job;
