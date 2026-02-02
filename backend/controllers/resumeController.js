
import asyncHandler from 'express-async-handler';
import { PDFParse } from 'pdf-parse';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Analyze resume with AI
// @route   POST /api/resume/analyze
// @access  Private (or Public if we want)
const analyzeResume = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error('Please upload a PDF file');
    }

    const jobDescription = req.body.jobDescription || '';

    // 1. Extract Text from PDF using PDFParse class
    let resumeText = '';
    let parser;
    try {
        parser = new PDFParse({ data: req.file.buffer });
        const result = await parser.getText();
        resumeText = result.text;
        await parser.destroy();
    } catch (error) {
        console.error('PDF Parse Error:', error);
        if (parser) await parser.destroy();
        res.status(500);
        throw new Error('Failed to parse PDF file');
    }

    // 2. Prepare AI Prompt
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    You are an expert AI Resume Analyzer and ATS (Applicant Tracking System) specialist.
    
    Task: Analyze the following resume text ${jobDescription ? 'against the provided Job Description' : 'for general best practices'}.
    
    Resume Text:
    "${resumeText.substring(0, 10000)}" 
    ${/* Truncate to avoid token limits if necessary, though 1.5 flash has huge context */ ''}

    ${jobDescription ? `Job Description:\n"${jobDescription}"` : ''}

    Analyze the resume for:
    1. ATS Score (0-100): Estimate how well this resume scans and matches parameters.
    2. Strengths: What is done well (keywords, formatting, metrics).
    3. Weaknesses/Gaps: What is missing or poor.
    4. Suggestions: Concrete improvements.
    5. Summary of the candidate's profile.

    Output format: STRICT JSON. Do not use markdown code blocks.
    {
        "atsScore": number,
        "strengths": ["string", "string"],
        "weaknesses": ["string", "string"],
        "suggestions": ["string", "string"],
        "summary": "string"
    }
    `;

    // 3. Call AI
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Clean markdown code blocks if AI adds them
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const analysisData = JSON.parse(text);

        res.json({
            success: true,
            data: analysisData
        });

    } catch (error) {
        console.error('AI Analysis Error:', error);
        res.status(503);
        throw new Error('AI Service failed to analyze resume');
    }
});

export { analyzeResume };
