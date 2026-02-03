import mongoose from 'mongoose';

const projectSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        title: {
            type: String,
            required: true,
        },
        projectType: {
            type: String,
            required: true,
            enum: ['chatbot', 'ATS resume checker', 'roadmap', 'other'],
            default: 'other',
        },
        status: {
            type: String,
            required: true,
            enum: ['Planned', 'In Progress', 'Completed', 'On Hold'],
            default: 'Planned',
        },
        progress: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
            max: 100,
        },
        workflowState: {
            chatHistory: [
                {
                    role: { type: String, enum: ['user', 'assistant'] },
                    content: String,
                    timestamp: { type: Date, default: Date.now }
                }
            ],
            atsFeedback: {
                score: Number,
                suggestions: [String],
                lastAnalyzed: Date
            },
            aiSteps: [
                {
                    title: String,
                    description: String,
                    isCompleted: { type: Boolean, default: false }
                }
            ]
        },
        roadmap: {
            type: Object, // Stores the detailed AI roadmap JSON
        }
    },
    {
        timestamps: true,
    }
);

const Project = mongoose.model('Project', projectSchema);

export default Project;
