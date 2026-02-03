import React from 'react';
import { Link } from 'react-router-dom';
import { getProjects, Project } from '../services/projectService';
import { useATSStorage } from '../hooks/useTemporaryStorage';
import { getDashboardSuggestions } from '../services/geminiService';

const Dashboard: React.FC = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const userName = userInfo.name || 'User';

  const [projects, setProjects] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [suggestions, setSuggestions] = React.useState<any[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = React.useState(true);

  const { currentFeedback } = useATSStorage();

  React.useEffect(() => {
    const initDashboard = async () => {
      try {
        setLoading(true);
        const projectData = await getProjects();
        setProjects(projectData);

        // Fetch AI suggestions based on current state
        setSuggestionsLoading(true);
        const aiScore = currentFeedback ? currentFeedback.atsScore : 'N/A';
        const aiSuggestions = await getDashboardSuggestions(userName, projectData, aiScore);
        setSuggestions(aiSuggestions);
      } catch (error) {
        console.error("Dashboard init error:", error);
      } finally {
        setLoading(false);
        setSuggestionsLoading(false);
      }
    };
    initDashboard();
  }, [userName, currentFeedback]);

  const stats = [
    { label: 'Active Projects', value: projects.length.toString(), trend: '+1 this week', color: 'blue', icon: '🏗️' },
    { label: 'Applications', value: '12', trend: '3 pending', color: 'green', icon: '📬' },
    { label: 'Interviews', value: '2', trend: 'Next: Friday', color: 'purple', icon: '🤝' },
    {
      label: 'Resume Score',
      value: currentFeedback ? currentFeedback.atsScore.toString() : '—',
      trend: currentFeedback ? `Last scan: ${new Date(currentFeedback.analyzedAt).toLocaleDateString()}` : 'Ready to scan',
      color: 'orange',
      icon: '📄'
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Hello, {userName} 👋</h1>
          <p className="text-gray-500 mt-1 font-medium">Your career command center is ready.</p>
        </div>
        <div className="hidden md:block">
          <Link to="/projects" className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all active:scale-95 shadow-lg">
            + New Project
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2rem] notion-shadow relative overflow-hidden group hover:translate-y-[-4px] transition-all duration-300">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className={`w-12 h-12 bg-${stat.color}-50 rounded-2xl flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
            </div>

            <div className="relative z-10">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-3xl font-black text-gray-900 mt-1">{stat.value}</p>
              <p className="text-[10px] text-gray-400 mt-2 font-black uppercase tracking-widest bg-gray-50 inline-block px-2 py-1 rounded-lg">
                {stat.trend}
              </p>
            </div>

            <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-125`}></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl notion-shadow">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span>🏗️</span> Recent Projects
            </h2>
            <div className="space-y-4">
              {loading ? (
                <p className="text-sm text-gray-400">Loading projects...</p>
              ) : projects.length > 0 ? (
                projects.slice(0, 3).map((project, i) => (
                  <Link key={i} to={`/projects?id=${project._id}`} className="group block">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                        {project.title}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {project.status}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${project.progress || 0}%` }}
                      ></div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-gray-500">No active projects. Head to "Build Project" to start one!</p>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl notion-shadow">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span>📝</span> AI Suggestions
            </h2>
            <div className="space-y-3">
              {suggestionsLoading ? (
                <div className="space-y-3">
                  <div className="h-16 bg-gray-50 rounded-2xl animate-pulse"></div>
                  <div className="h-16 bg-gray-100 rounded-2xl animate-pulse"></div>
                </div>
              ) : suggestions.length > 0 ? (
                suggestions.map((s, i) => (
                  <div key={i} className={`p-5 rounded-2xl border-l-4 shadow-sm animate-in slide-in-from-right-4 duration-500 ${i % 2 === 0 ? 'bg-indigo-50 border-indigo-500' : 'bg-blue-50 border-blue-500'}`}>
                    <div className="flex items-start gap-3">
                      <span className="text-lg">{i % 2 === 0 ? '💡' : '🚀'}</span>
                      <div>
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${i % 2 === 0 ? 'text-indigo-600' : 'text-blue-600'}`}>{s.type}</p>
                        <p className="text-sm font-semibold text-gray-700 leading-relaxed">{s.text}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-gray-50 rounded-2xl text-sm text-gray-500 font-medium">
                  Connect more data for personalized suggestions!
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl notion-shadow">
            <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors flex items-center gap-3">
                <span className="bg-blue-100 p-2 rounded text-blue-600">✨</span>
                <div className="text-sm">
                  <p className="font-semibold text-gray-800">Generate Idea</p>
                  <p className="text-xs text-gray-500">Get AI project inspiration</p>
                </div>
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors flex items-center gap-3">
                <span className="bg-green-100 p-2 rounded text-green-600">📊</span>
                <div className="text-sm">
                  <p className="font-semibold text-gray-800">Job Tracker</p>
                  <p className="text-xs text-gray-500">Update application status</p>
                </div>
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors flex items-center gap-3">
                <span className="bg-purple-100 p-2 rounded text-purple-600">📑</span>
                <div className="text-sm">
                  <p className="font-semibold text-gray-800">Fix Resume</p>
                  <p className="text-xs text-gray-500">AI-powered scan & fix</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
