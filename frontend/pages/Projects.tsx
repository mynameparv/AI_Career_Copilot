
import React, { useState } from 'react';
import { generateProjectRoadmap } from '../services/geminiService';

interface Roadmap {
  title: string;
  description: string;
  phases: {
    name: string;
    tasks: string[];
    duration: string;
  }[];
}

const Projects: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const result = await generateProjectRoadmap(topic);
      setRoadmap(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Project Builder</h1>
          <p className="text-gray-500 mt-1">Convert your ideas into actionable step-by-step roadmaps.</p>
        </div>
      </header>

      <div className="bg-white p-6 rounded-2xl notion-shadow">
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="E.g., Full-stack E-commerce site with Next.js or a Python Data Scraper"
            className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-8 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 disabled:opacity-50 transition-all shadow-md active:scale-95"
          >
            {loading ? 'Thinking...' : 'Generate Roadmap'}
          </button>
        </div>
      </div>

      {roadmap && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4 duration-700">
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white p-6 rounded-2xl notion-shadow border-t-4 border-blue-500">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{roadmap.title}</h2>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{roadmap.description}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-full uppercase tracking-tighter">AI Generated</span>
                  <span className="text-[10px] font-bold bg-gray-100 text-gray-700 px-2 py-1 rounded-full uppercase tracking-tighter">{roadmap.phases.length} Phases</span>
                </div>
              </div>
              <button className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg">
                Save to My Projects
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            {roadmap.phases.map((phase, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl notion-shadow group hover:border-blue-200 border border-transparent transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1 block">Phase {idx + 1}</span>
                    <h3 className="text-lg font-bold text-gray-900">{phase.name}</h3>
                  </div>
                  <span className="text-xs font-medium text-gray-400 flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full">
                    ⏱️ {phase.duration}
                  </span>
                </div>
                <ul className="space-y-3">
                  {phase.tasks.map((task, tidx) => (
                    <li key={tidx} className="flex items-start gap-3 group/item">
                      <div className="mt-1 w-4 h-4 rounded border-2 border-gray-300 group-hover/item:border-blue-500 transition-colors cursor-pointer flex-shrink-0"></div>
                      <span className="text-sm text-gray-600 group-hover/item:text-gray-900 transition-colors">{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {!roadmap && !loading && (
        <div className="py-20 flex flex-col items-center justify-center text-center opacity-50">
          <div className="text-6xl mb-4">💡</div>
          <h3 className="text-lg font-bold text-gray-800">Ready to build something?</h3>
          <p className="text-sm text-gray-500 max-w-xs mx-auto">Enter a project idea above to get a professional technical roadmap from our AI.</p>
        </div>
      )}
    </div>
  );
};

export default Projects;
