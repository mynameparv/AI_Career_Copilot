import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { generateProjectRoadmap, getGeminiResponse } from '../services/geminiService';
import { getProjects, createProject, updateProject, Project } from '../services/projectService';

interface RoadmapPhase {
  name: string;
  tasks: any[];
  duration: string;
}

interface Roadmap {
  title: string;
  description: string;
  phases: RoadmapPhase[];
}

const Projects: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('id');

  const [topic, setTopic] = useState('');
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [myProjects, setMyProjects] = useState<Project[]>([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiFeedback, setAiFeedback] = useState('');

  // Fetch projects list and check for selected project
  useEffect(() => {
    const init = async () => {
      try {
        const list = await getProjects();
        setMyProjects(list);

        if (projectId) {
          const selected = list.find(p => p._id === projectId);
          if (selected) {
            setCurrentProject(selected);
            setRoadmap(selected.roadmap);
          }
        }
      } catch (err) {
        console.error("Init error:", err);
      }
    };
    init();
  }, [projectId]);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    setSaved(false);
    setCurrentProject(null);
    setAiFeedback('');
    try {
      const result = await generateProjectRoadmap(topic);
      setRoadmap(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!roadmap) return;
    setSaving(true);
    try {
      // Format tasks to include completion status if they are just strings
      const formattedPhases = roadmap.phases.map(phase => ({
        ...phase,
        tasks: phase.tasks.map(task =>
          typeof task === 'string' ? { text: task, completed: false } : task
        )
      }));

      const newProject = await createProject({
        title: roadmap.title,
        description: roadmap.description,
        status: 'In Progress',
        roadmap: { ...roadmap, phases: formattedPhases },
        progress: 0
      });

      setCurrentProject(newProject);
      setSaved(true);
      alert('Project saved successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const toggleTask = async (phaseIdx: number, taskIdx: number) => {
    if (!currentProject || !roadmap) return;

    const updatedPhases = JSON.parse(JSON.stringify(roadmap.phases)); // deep copy
    const task = updatedPhases[phaseIdx].tasks[taskIdx];
    task.completed = !task.completed;

    // Calculate overall progress
    let totalTasks = 0;
    let completedTasks = 0;
    updatedPhases.forEach((p: any) => {
      p.tasks.forEach((t: any) => {
        totalTasks++;
        if (t.completed) completedTasks++;
      });
    });

    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    try {
      const updated = await updateProject(currentProject._id!, {
        roadmap: { ...roadmap, phases: updatedPhases },
        progress,
        status: progress === 100 ? 'Completed' : 'In Progress'
      });
      setCurrentProject(updated);
      setRoadmap(updated.roadmap);
    } catch (err) {
      console.error("failed to update task", err);
    }
  };

  const handleAnalyze = async () => {
    if (!currentProject || !roadmap) return;
    setAnalyzing(true);
    try {
      const prompt = `I am working on the project "${currentProject.title}". 
      Description: ${currentProject.description}.
      My current progress is ${currentProject.progress}%.
      Here is my roadmap: ${JSON.stringify(roadmap)}.
      
      Can you analyze my current status and give me:
      1. One small next step I should take right now.
      2. A tip to make this project stand out in a resume.
      3. A potential technical challenge I might face next.`;

      const feedback = await getGeminiResponse(prompt);
      setAiFeedback(feedback || 'Analysis complete.');
    } catch (err) {
      console.error(err);
      setAiFeedback('Analysis failed.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {currentProject ? currentProject.title : 'AI Project Builder'}
          </h1>
          <p className="text-gray-500 mt-1">
            {currentProject ? 'Track your progress and get AI advice' : 'Convert your ideas into actionable step-by-step roadmaps.'}
          </p>
        </div>
        {currentProject && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global Progress</p>
              <p className="text-lg font-black text-blue-600">{currentProject.progress}%</p>
            </div>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full transition-all duration-700" style={{ width: `${currentProject.progress}%` }}></div>
            </div>
          </div>
        )}
      </header>

      {!currentProject && (
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
      )}

      {roadmap && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4 duration-700">
          <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white p-6 rounded-2xl notion-shadow border-t-4 border-blue-500">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{roadmap.title}</h2>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{roadmap.description}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-full uppercase tracking-tighter">
                    {currentProject ? 'Active Project' : 'AI Generated'}
                  </span>
                  <span className="text-[10px] font-bold bg-gray-100 text-gray-700 px-2 py-1 rounded-full uppercase tracking-tighter">
                    {roadmap.phases.length} Phases
                  </span>
                </div>
              </div>

              {!currentProject ? (
                <button
                  onClick={handleSave}
                  disabled={saving || saved}
                  className={`w-full py-3 rounded-xl text-sm font-bold transition-all shadow-lg ${saved ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save to My Projects'}
                </button>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="w-full py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    {analyzing ? 'Analyzing...' : '🔍 AI Status Review'}
                  </button>

                  <button
                    onClick={() => { setCurrentProject(null); setRoadmap(null); }}
                    className="w-full py-2 text-gray-400 hover:text-gray-600 text-xs font-semibold"
                  >
                    Close Project
                  </button>

                  {aiFeedback && (
                    <div className="bg-white p-4 rounded-xl notion-shadow border-l-4 border-indigo-500 animate-in fade-in duration-500 max-h-96 overflow-y-auto">
                      <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-2">AI Analysis</p>
                      <div className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                        {aiFeedback}
                      </div>
                    </div>
                  )}
                </div>
              )}
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
                  {phase.tasks.map((task, tidx) => {
                    const isCompleted = typeof task === 'object' ? task.completed : false;
                    const taskText = typeof task === 'object' ? task.text : task;

                    return (
                      <li
                        key={tidx}
                        className={`flex items-start gap-3 group/item cursor-pointer ${isCompleted ? 'opacity-60' : ''}`}
                        onClick={() => currentProject && toggleTask(idx, tidx)}
                      >
                        <div className={`mt-1 w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center flex-shrink-0 ${isCompleted ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover/item:border-blue-500'}`}>
                          {isCompleted && (
                            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                          )}
                        </div>
                        <span className={`text-sm transition-colors ${isCompleted ? 'line-through text-gray-500' : 'text-gray-600 group-hover/item:text-gray-900'}`}>
                          {taskText}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {!roadmap && !loading && (
        <div className="space-y-12">
          <div className="py-12 flex flex-col items-center justify-center text-center opacity-50">
            <div className="text-6xl mb-4">💡</div>
            <h3 className="text-lg font-bold text-gray-800">Ready to build something?</h3>
            <p className="text-sm text-gray-500 max-w-xs mx-auto">Enter a project idea above to get a professional technical roadmap from our AI.</p>
          </div>

          {myProjects.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800">My Saved Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myProjects.map(p => (
                  <button
                    key={p._id}
                    onClick={() => {
                      setCurrentProject(p);
                      setRoadmap(p.roadmap);
                    }}
                    className="bg-white p-5 rounded-xl notion-shadow text-left hover:ring-2 hover:ring-blue-500 transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900">{p.title}</h3>
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">{p.progress}%</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">{p.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Projects;
