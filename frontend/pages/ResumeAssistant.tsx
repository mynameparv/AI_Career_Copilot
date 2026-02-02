
import React, { useState } from 'react';
import { analyzeResume, AnalysisResult } from '../services/resumeService';
import { useATSStorage, useLocalStorage } from '../hooks/useTemporaryStorage';

const ResumeAssistant: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Use persistent storage hooks
  const { currentFeedback, saveATSFeedback, clearCurrentFeedback } = useATSStorage();
  const [jobDescription, setJobDescription] = useLocalStorage<string>('copilot_job_description', '');

  // Convert current feedback to AnalysisResult format for display
  const analysis: AnalysisResult | null = currentFeedback ? {
    atsScore: currentFeedback.atsScore,
    strengths: currentFeedback.strengths,
    weaknesses: currentFeedback.weaknesses,
    suggestions: currentFeedback.suggestions,
    summary: currentFeedback.summary,
  } : null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setIsUploading(true);
      setError(null);

      try {
        const result = await analyzeResume(uploadedFile, jobDescription);
        // Save to persistent storage
        saveATSFeedback(uploadedFile.name, result, jobDescription);
      } catch (err) {
        console.error(err);
        setError('Failed to analyze resume. Please try again.');
        setFile(null);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
      <header className="text-center">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">AI Resume Assistant</h1>
        <p className="text-gray-500 mt-2 text-lg">Upload your resume to get instant feedback and professional improvements.</p>
      </header>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-bold">
          {error}
        </div>
      )}

      {!analysis && !isUploading && (
        <div className="bg-white p-6 rounded-3xl notion-shadow border border-gray-100">
          <label className="block mb-2">
            <span className="text-sm font-bold text-gray-700 uppercase tracking-widest">Job Description (Optional)</span>
            <p className="text-xs text-gray-500 mt-1 mb-3">Paste the job description to get tailored resume feedback</p>
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here for more targeted analysis..."
            className="w-full p-4 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={6}
          />
        </div>
      )}

      {!analysis && !isUploading && (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-16 flex flex-col items-center justify-center transition-all hover:border-blue-300 group cursor-pointer relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">
              📄
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Drag and drop your PDF here</h3>
            <p className="text-sm text-gray-400 mb-8">PDF only, max 5MB</p>
            <label className="px-8 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 cursor-pointer shadow-lg active:scale-95 transition-all">
              Choose File
              <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf" />
            </label>
          </div>
        </div>
      )}

      {isUploading && (
        <div className="bg-white p-12 rounded-3xl notion-shadow flex flex-col items-center justify-center space-y-6">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-2xl">🤖</div>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800">Analyzing your career path...</h3>
            <p className="text-sm text-gray-500 mt-1">Our AI is scanning for keywords, formatting, and impact.</p>
          </div>
        </div>
      )}

      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-3xl notion-shadow border-t-4 border-green-500">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-900">AI Report</h2>
              <div className={`px-4 py-2 rounded-xl font-bold text-lg ${analysis.atsScore >= 70 ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                {analysis.atsScore}% Score
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-6 font-medium italic">"{analysis.summary}"</p>

            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-green-500">✓</span> Strengths
                </h4>
                <ul className="space-y-2">
                  {analysis.strengths.map((item, i) => (
                    <li key={i} className="text-sm text-gray-600 flex gap-2">
                      <span className="text-xs mt-1">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-red-500">!</span> Areas for Improvement
                </h4>
                <ul className="space-y-2">
                  {analysis.weaknesses.map((item, i) => (
                    <li key={i} className="text-sm text-gray-600 flex gap-2">
                      <span className="text-xs mt-1">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <h4 className="font-bold text-gray-800 mb-4">Suggested Action Items:</h4>
              <ul className="space-y-3">
                {analysis.suggestions.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="text-blue-500 font-bold">→</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-900 p-8 rounded-3xl text-white notion-shadow shadow-blue-200/50">
              <h3 className="text-xl font-bold mb-2">Rewrite Service</h3>
              <p className="text-gray-400 text-sm mb-6">Let our AI rewrite your bullet points for maximum impact based on these findings.</p>
              <button className="w-full py-3 bg-white text-gray-900 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors">
                Start Rewriting
              </button>
            </div>

            <button
              onClick={() => { clearCurrentFeedback(); setFile(null); }}
              className="w-full py-3 text-gray-400 font-bold text-sm hover:text-gray-600 transition-colors"
            >
              Upload New Version
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAssistant;
