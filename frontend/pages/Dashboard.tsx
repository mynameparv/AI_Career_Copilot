
import React from 'react';

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Active Projects', value: '4', trend: '+1 this week', color: 'blue' },
    { label: 'Applications Sent', value: '12', trend: '3 pending', color: 'green' },
    { label: 'Upcoming Interviews', value: '2', trend: 'Next: Friday', color: 'purple' },
    { label: 'Resume Score', value: '88', trend: 'Top 10%', color: 'orange' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Good morning, John 👋</h1>
        <p className="text-gray-500 mt-1">Here's what's happening with your career today.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl notion-shadow">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-2 font-medium">{stat.trend}</p>
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
              {[
                { name: 'AI Portfolio Builder', status: 'In Progress', progress: 65 },
                { name: 'Distributed Cache System', status: 'Planning', progress: 10 },
              ].map((project, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">{project.name}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{project.status}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl notion-shadow">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span>📝</span> AI Suggestions
            </h2>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
                💡 <strong>Strategy:</strong> Your project "AI Portfolio Builder" aligns well with Senior Frontend roles. Consider adding a unit testing phase.
              </div>
              <div className="p-3 bg-green-50 border border-green-100 rounded-lg text-sm text-green-800">
                🚀 <strong>Job Alert:</strong> A new React Architect role was posted at Stripe. Your profile is a 92% match.
              </div>
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
