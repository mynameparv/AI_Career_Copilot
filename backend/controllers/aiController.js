
import asyncHandler from 'express-async-handler';
import { GoogleGenAI } from '@google/genai';

const genAI = process.env.GEMINI_API_KEY
    ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
    : null;

// @desc    Get AI Response (Chat)
// @route   POST /api/ai/chat
// @access  Public (or Private depending on needs, stick to Private if passing sensitive context)
const getAIChatResponse = asyncHandler(async (req, res) => {
    const { prompt, systemInstruction } = req.body;

    if (!genAI) {
        res.status(500);
        throw new Error('Gemini API Key not configured');
    }

    try {
        // const model = genAI.getGenerativeModel({
        //     model: "gemini-1.5-flash",
        //     systemInstruction: systemInstruction
        // });
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });


        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ response: text });
    } catch (error) {
        console.error('AI Chat Error:', error);
        res.status(500);
        throw new Error('AI request failed');
    }
});

export { getAIChatResponse };