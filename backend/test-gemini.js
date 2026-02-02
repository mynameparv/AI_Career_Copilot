
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error('❌ Error: GEMINI_API_KEY is not defined in .env file');
    process.exit(1);
}

console.log(`Checking Gemini API Key: ${API_KEY.substring(0, 4)}...${API_KEY.substring(API_KEY.length - 4)}`);

const genAI = new GoogleGenerativeAI(API_KEY);

async function testGemini() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = "Hello! Are you working correctly? Answer with a simple 'Yes, I am working!'";

        console.log('Sending request to Gemini...');
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log('✅ Success! Response from Gemini:');
        console.log('--------------------------------------------------');
        console.log(text);
        console.log('--------------------------------------------------');
    } catch (error) {
        console.error('❌ Failed to connect to Gemini API:');
        console.error(error);
    }
}

testGemini();
