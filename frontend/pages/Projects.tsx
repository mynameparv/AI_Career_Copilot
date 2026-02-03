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
      // Ensure tasks are objects with completion status
      const formatted = {
        ...result,
        phases: result.phases.map((p: any) => ({
          ...p,
          tasks: p.tasks.map((t: any) =>
            typeof t === 'string' ? { text: t, completed: false } : t
          )
        }))
      };
      setRoadmap(formatted);
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
      // Calculate initial progress based on current checkmarks
      let total = 0;
      let done = 0;
      roadmap.phases.forEach(p => p.tasks.forEach(t => {
        total++; if (t.completed) done++;
      }));
      const progress = total > 0 ? Math.round((done / total) * 100) : 0;

      const newProject = await createProject({
        title: roadmap.title,
        description: roadmap.description,
        status: progress === 100 ? 'Completed' : 'In Progress',
        roadmap: roadmap,
        progress: progress
      });

      setCurrentProject(newProject);
      setSaved(true);
      // Update local list
      setMyProjects([newProject, ...myProjects]);
    } catch (error) {
      console.error(error);
      alert('Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const toggleTask = async (phaseIdx: number, taskIdx: number) => {
    if (!roadmap) return;

    const updatedPhases = JSON.parse(JSON.stringify(roadmap.phases));
    const task = updatedPhases[phaseIdx].tasks[taskIdx];
    task.completed = !task.completed;

    const newRoadmap = { ...roadmap, phases: updatedPhases };
    setRoadmap(newRoadmap);

    if (currentProject) {
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
          roadmap: newRoadmap,
          progress,
          status: progress === 100 ? 'Completed' : 'In Progress'
        });
        setCurrentProject(updated);
      } catch (err) {
        console.error("failed to update task", err);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!roadmap) return;
    setAnalyzing(true);
    try {
      // Use current roadmap state for analysis even if not saved yet
      const prompt = `I am working on a project titled "${roadmap.title}". 
      Description: ${roadmap.description}.
      
      Here is my current roadmap progress: ${JSON.stringify(roadmap.phases)}.
      
      Please analyze my status and provide:
      1. One immediate "quick win" task.
      2. A resume-boosting tip for this specific stack.
      3. A potential bug or challenge to watch out for.`;

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
    <div className="max-w-6xl mx-auto space-y-6 pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            {currentProject ? currentProject.title : 'AI Project Builder'}
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            {currentProject ? 'Your interactive personal roadmap' : 'Turn any idea into a professional technical plan.'}
          </p>
        </div>
        {(currentProject || roadmap) && (
          <div className="flex items-center gap-4 bg-white p-3 rounded-2xl notion-shadow border border-gray-100">
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Progress</p>
              <p className="text-xl font-black text-blue-600">
                {(() => {
                  let total = 0, done = 0;
                  roadmap?.phases.forEach(p => p.tasks.forEach(t => { total++; if (t.completed) done++; }));
                  return total > 0 ? Math.round((done / total) * 100) : 0;
                })()}%
              </p>
            </div>
            <div className="w-24 bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-1000"
                style={{
                  width: `${(() => {
                    let total = 0, done = 0;
                    roadmap?.phases.forEach(p => p.tasks.forEach(t => { total++; if (t.completed) done++; }));
                    return total > 0 ? Math.round((done / total) * 100) : 0;
                  })()}%`
                }}
              ></div>
            </div>
          </div>
        )}
      </header>

      {!currentProject && (
        <div className="bg-white p-6 rounded-3xl notion-shadow border border-gray-100 transition-all focus-within:ring-2 focus-within:ring-blue-500/20">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What project are you dreaming of building?"
              className="flex-1 p-4 bg-gray-50 border-none rounded-2xl text-sm font-medium focus:ring-0"
            />
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="px-8 py-4 bg-gray-900 text-white rounded-2xl text-sm font-bold hover:bg-gray-800 disabled:opacity-50 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Thinking...</>
              ) : '✨ Generate Roadmap'}
            </button>
          </div>
        </div>
      )}

      {roadmap && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              <div className="bg-white p-6 rounded-3xl notion-shadow border border-gray-100 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
                <h2 className="text-xl font-black text-gray-900 mb-2 relative">{roadmap.title}</h2>
                <p className="text-sm text-gray-500 leading-relaxed mb-6 font-medium relative">{roadmap.description}</p>
                <div className="flex flex-wrap gap-2 relative">
                  <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl uppercase tracking-widest border border-blue-100">
                    {currentProject ? 'Active' : 'Draft'}
                  </span>
                  <span className="text-[10px] font-black bg-gray-50 text-gray-500 px-3 py-1.5 rounded-xl uppercase tracking-widest border border-gray-100">
                    {roadmap.phases.length} Phases
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {!currentProject && (
                  <button
                    onClick={handleSave}
                    disabled={saving || saved}
                    className={`w-full py-4 rounded-2xl text-sm font-black transition-all shadow-xl ${saved ? 'bg-green-600 text-white shadow-green-200' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'}`}
                  >
                    {saving ? 'Saving...' : saved ? '✓ Project Saved' : '💾 Save to Dashboard'}
                  </button>
                )}

                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-sm font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2"
                >
                  {analyzing ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : '🔍 AI Status Review'}
                </button>

                {aiFeedback && (
                  <div className="bg-white p-5 rounded-3xl notion-shadow border-l-4 border-indigo-500 animate-in slide-in-from-left-4 duration-500 max-h-96 overflow-y-auto custom-scrollbar">
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-3">AI Coach says:</p>
                    <div className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed font-medium">
                      {aiFeedback}
                    </div>
                  </div>
                )}

                {currentProject && (
                  <button
                    onClick={() => { window.location.href = '#/projects'; window.location.reload(); }}
                    className="w-full py-2 text-gray-400 hover:text-gray-600 text-[10px] font-black uppercase tracking-widest transition-colors"
                  >
                    ← Back to Project List
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            {roadmap.phases.map((phase, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl notion-shadow border border-transparent hover:border-blue-100 transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1 block">Phase {idx + 1}</span>
                    <h3 className="text-xl font-black text-gray-900">{phase.name}</h3>
                  </div>
                  <span className="text-[10px] font-black text-gray-400 flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 uppercase tracking-widest">
                    ⏱️ {phase.duration}
                  </span>
                </div>
                <ul className="space-y-4">
                  {phase.tasks.map((task, tidx) => {
                    const isCompleted = task.completed;
                    return (
                      <li
                        key={tidx}
                        className={`flex items-start gap-4 group/item cursor-pointer transition-all ${isCompleted ? 'opacity-50' : ''}`}
                        onClick={() => toggleTask(idx, tidx)}
                      >
                        <div className={`mt-0.5 w-6 h-6 rounded-xl border-2 transition-all flex items-center justify-center flex-shrink-0 ${isCompleted ? 'bg-blue-600 border-blue-600 scale-110 shadow-lg shadow-blue-200' : 'border-gray-200 group-hover/item:border-blue-400 bg-gray-50'}`}>
                          {isCompleted && (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                          )}
                        </div>
                        <span className={`text-sm font-semibold transition-all leading-tight ${isCompleted ? 'line-through text-gray-400' : 'text-gray-700 group-hover/item:text-gray-900 group-hover/item:translate-x-1'}`}>
                          {task.text}
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
        <div className="space-y-12 py-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-inner animate-bounce duration-[2000] sticky top-0">🚀</div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Ready to build something iconic?</h3>
            <p className="text-gray-500 font-medium max-w-sm mx-auto mt-2">Describe your project above. Our AI will craft a custom roadmap while you sit back and relax.</p>
          </div>

          {myProjects.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-black text-gray-900 tracking-tight px-2 flex items-center gap-2">
                <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                Your Building History
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-medium">
                {myProjects.map(p => (
                  <button
                    key={p._id}
                    onClick={() => {
                      setCurrentProject(p);
                      setRoadmap(p.roadmap);
                      setAiFeedback('');
                    }}
                    className="group bg-white p-6 rounded-[2rem] notion-shadow text-left border border-gray-100 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
                    <div className="flex justify-between items-start mb-4 relative">
                      <h3 className="font-black text-gray-900 leading-tight pr-8">{p.title}</h3>
                      <span className="text-[10px] font-black bg-blue-600 text-white px-2 py-1 rounded-lg">{p.progress}%</span>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2 mb-4 leading-relaxed">{p.description}</p>
                    <div className="w-full bg-gray-50 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full transition-all duration-1000" style={{ width: `${p.progress}%` }}></div>
                    </div>
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
