
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <span>🚀</span> CareerPilot
        </div>
        <div className="flex gap-8 items-center">
          <Link to="/login" className="text-sm font-bold text-gray-500 hover:text-gray-900">Login</Link>
          <Link to="/register" className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 shadow-md">Get Started</Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-widest">
              ✨ New: Gemini 2.5 Powered
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight">
              Your AI-Powered <br />
              <span className="text-blue-600">Career Growth</span> <br />
              Engine.
            </h1>
            <p className="text-xl text-gray-500 max-w-lg leading-relaxed">
              Build professional project roadmaps, track job applications, and optimize your resume with an AI that knows your career goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/dashboard" className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 shadow-2xl transition-all hover:-translate-y-1">
                Launch My Dashboard
              </Link>
              <button className="px-10 py-4 border-2 border-gray-100 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition-all">
                How it works
              </button>
            </div>
            <div className="flex items-center gap-6 pt-10 border-t border-gray-100">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map(i => (
                  <img key={i} src={`https://picsum.photos/seed/${i}/40/40`} className="w-10 h-10 rounded-full border-2 border-white" alt="user" />
                ))}
              </div>
              <p className="text-sm text-gray-400 font-medium">Joined by <span className="text-gray-900 font-bold">1,200+</span> ambitious developers</p>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-gray-50 rounded-[40px] p-8 notion-shadow rotate-2 hover:rotate-0 transition-transform duration-700">
              <div className="bg-white rounded-[24px] overflow-hidden shadow-2xl border border-gray-100">
                <div className="h-10 bg-gray-100 px-4 flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                </div>
                <img src="https://picsum.photos/seed/dashboard/800/600" className="w-full" alt="Dashboard Preview" />
              </div>
            </div>
            <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl notion-shadow animate-bounce">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-xl">🚀</div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">AI Match Found</p>
                  <p className="text-sm font-bold text-gray-900">Stripe: 94% Match</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="bg-gray-50 py-24 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Everything you need to advance</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'Project Roadmaps', desc: 'Detailed technical steps for any stack.', icon: '🏗️' },
              { title: 'Job Application CRM', desc: 'Manage your pipeline like a professional.', icon: '🎯' },
              { title: 'Resume Insights', desc: 'AI keyword scanning and scoring.', icon: '📄' },
            ].map((feature, i) => (
              <div key={i} className="bg-white p-10 rounded-3xl notion-shadow hover:-translate-y-2 transition-transform">
                <div className="text-4xl mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
