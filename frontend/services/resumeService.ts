
const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/resume`;

export interface AnalysisResult {
    atsScore: number;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    summary: string;
}

export const analyzeResume = async (file: File, jobDescription?: string): Promise<AnalysisResult> => {
    const formData = new FormData();
    formData.append('file', file);
    if (jobDescription) {
        formData.append('jobDescription', jobDescription);
    }

    const response = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to analyze resume');
    }

    const result = await response.json();
    return result.data;
};
