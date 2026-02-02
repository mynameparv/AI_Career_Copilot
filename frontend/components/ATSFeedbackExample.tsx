// ============================================
// Example Usage: ATS Feedback Component
// ============================================

import React from 'react';
import { useATSStorage, clearAllTemporaryData } from '../hooks/useTemporaryStorage';

const ATSFeedbackExample: React.FC = () => {
    const {
        currentFeedback,
        feedbackHistory,
        saveATSFeedback,
        clearCurrentFeedback,
        clearAllATSData,
    } = useATSStorage();

    // Example: Save mock ATS feedback (call this after real API response)
    const handleMockAnalysis = () => {
        saveATSFeedback(
            'my_resume.pdf',
            {
                atsScore: 85,
                strengths: ['Strong keywords', 'Good formatting'],
                weaknesses: ['Missing metrics', 'Long summary'],
                suggestions: ['Add more numbers', 'Shorten intro'],
                summary: 'Experienced developer with 5 years...',
            },
            'Senior Frontend Developer at Google...'
        );
    };

    return (
        <div>
            {/* Current Feedback */}
            {currentFeedback ? (
                <div>
                    <h2>ATS Score: {currentFeedback.atsScore}%</h2>
                    <p>{currentFeedback.summary}</p>

                    <h3>Strengths:</h3>
                    <ul>
                        {currentFeedback.strengths.map((s, i) => (
                            <li key={i}>{s}</li>
                        ))}
                    </ul>

                    <h3>Suggestions:</h3>
                    <ul>
                        {currentFeedback.suggestions.map((s, i) => (
                            <li key={i}>{s}</li>
                        ))}
                    </ul>

                    <button onClick={clearCurrentFeedback}>Dismiss</button>
                </div>
            ) : (
                <button onClick={handleMockAnalysis}>Run Mock Analysis</button>
            )}

            {/* History */}
            <div>
                <h3>Previous Analyses ({feedbackHistory.length})</h3>
                {feedbackHistory.map((fb) => (
                    <div key={fb.id}>
                        {fb.fileName} - Score: {fb.atsScore}%
                    </div>
                ))}
            </div>

            {/* Clear all data */}
            <button onClick={clearAllATSData}>Clear ATS History</button>
            <button onClick={clearAllTemporaryData}>Clear ALL Data</button>
        </div>
    );
};

export default ATSFeedbackExample;
