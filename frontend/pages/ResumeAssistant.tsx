
import React, { useState } from 'react';

const ResumeAssistant: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setIsUploading(true);
      // Simulate AI Scan
      setTimeout(() => {
        setIsUploading(false);
        setAnalysis("Overall Score: 84/100. Strengths: Clear use of action verbs, strong technical stack alignment. Areas for improvement: Quantitative impact in your recent role at X could be stronger. Your summary is a bit wordy; try focusing on outcome-based achievements.");
      }, 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
      <header className="text-center">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">AI Resume Assistant</h1>
        <p className="text-gray-500 mt-2 text-lg">Upload your resume to get instant feedback and professional improvements.</p>
      </header>

      {!analysis && !isUploading && (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-16 flex flex-col items-center justify-center transition-all hover:border-blue-300 group cursor-pointer relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">
              📄
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Drag and drop your PDF here</h3>
            <p className="text-sm text-gray-400 mb-8">PDF or Word, max 5MB</p>
            <label className="px-8 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 cursor-pointer shadow-lg active:scale-95 transition-all">
              Choose File
              <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.doc,.docx" />
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
            <p className="text-sm text-gray-500 mt-1">Our AI is scanning for keywords and impact statements.</p>
          </div>
        </div>
      )}

      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-3xl notion-shadow border-t-4 border-green-500">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-900">AI Report</h2>
              <div className="px-4 py-2 bg-green-50 text-green-700 rounded-xl font-bold text-lg">84%</div>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">{analysis}</p>
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h4 className="font-bold text-gray-800 mb-4">Suggested Action Items:</h4>
              <ul className="space-y-3">
                {['Add metrics to "Lead Developer" role', 'Include "Microservices" as a keyword', 'Shorten profile summary by 20%'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="text-green-500 font-bold">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-900 p-8 rounded-3xl text-white notion-shadow shadow-blue-200/50">
              <h3 className="text-xl font-bold mb-2">Rewrite Service</h3>
              <p className="text-gray-400 text-sm mb-6">Let our AI rewrite your bullet points for maximum impact.</p>
              <button className="w-full py-3 bg-white text-gray-900 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors">
                Start Rewriting
              </button>
            </div>
            <div className="bg-white p-6 rounded-3xl notion-shadow border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4">Role Matching</h3>
              <div className="space-y-4">
                {[
                  { name: 'Senior Frontend Engineer', match: '92%' },
                  { name: 'Technical Product Manager', match: '75%' },
                ].map((role, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 font-medium">{role.name}</span>
                    <span className="font-bold text-blue-600">{role.match}</span>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() => { setAnalysis(null); setFile(null); }}
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
