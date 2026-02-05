const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai`;

const getAuthHeaders = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userInfo.token}`,
  };
};

export const getGeminiResponse = async (prompt: string, systemInstruction?: string) => {
  const response = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ prompt, systemInstruction }),
  });

  if (!response.ok) {
    throw new Error('AI analysis failed');
  }

  const data = await response.json();
  return data.response;
};

export const getDashboardSuggestions = async (userName: string, projects: any[], resumeScore: number | string) => {
  const projectList = projects.map(p => `${p.title} (${p.progress}% done)`).join(', ');

  const prompt = `Give me 2 very short, actionable career suggestions for ${userName}.
  Current Projects: ${projectList || 'No projects yet'}.
  Resume Score: ${resumeScore}.
  
  Format your response as a JSON array of objects with "type" (either "Strategy" or "Action") and "text".
  Keep the text under 15 words.`;

  try {
    const aiResponse = await getGeminiResponse(prompt, "Return ONLY a JSON array of suggestions.");
    // The backend returns a string, so we need to parse it if it's JSON
    const cleanedJson = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedJson);
  } catch (e) {
    console.warn("Suggestion parsing failed, using fallbacks.", e);
    return [
      { type: 'Strategy', text: 'Start a new technical project to boost your portfolio.' },
      { type: 'Action', text: 'Upload your resume for a personalized AI scan.' }
    ];
  }
};
