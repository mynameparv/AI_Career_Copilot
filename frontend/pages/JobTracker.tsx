import React, { useState, useEffect } from 'react';
import {
  getApplications,
  addApplication,
  updateApplication,
  deleteApplication,
  JobApplication
} from '../services/jobService';
import { getGeminiResponse } from '../services/geminiService';

const JobTracker: React.FC = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [preppingId, setPreppingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<JobApplication>>({
    companyName: '',
    role: '',
    status: 'Applied',
    appliedAt: new Date().toISOString().split('T')[0],
    packageOffer: '',
    description: ''
  });

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      const data = await getApplications();
      setApplications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addApplication(formData as JobApplication);
      setShowModal(false);
      setFormData({ companyName: '', role: '', status: 'Applied', appliedAt: new Date().toISOString().split('T')[0], packageOffer: '', description: '' });
      fetchApps();
    } catch (err) {
      alert('Failed to add application');
    }
  };

  const handleStatusChange = async (id: string, newStatus: any) => {
    try {
      await updateApplication(id, { status: newStatus });
      fetchApps();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this application?')) {
      try {
        await deleteApplication(id);
        fetchApps();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAIPrep = async (app: JobApplication) => {
    setPreppingId(app._id!);
    try {
      const prompt = `I applied for the role of "${app.role}" at "${app.companyName}". 
      Status: ${app.status}. 
      Can you give me:
      1. Top 3 interview topics for this role.
      2. One specific question they might ask about my resume for this.
      3. A tip to follow up on this application.
      Keep it short, professional and high impact.`;

      const advice = await getGeminiResponse(prompt);
      await updateApplication(app._id!, { aiAdvice: advice });
      fetchApps();
    } catch (err) {
      console.error(err);
    } finally {
      setPreppingId(null);
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Selected': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Rejected': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'Interviewing': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'Offer Received': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Applied': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">Live Tracker</span>
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter">My Cloud Applications</h1>
          <p className="text-gray-500 font-medium mt-2 text-lg">Manage your career pipeline with precision and AI-powered insights.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="group relative px-8 py-4 bg-gray-900 text-white rounded-[2rem] font-black hover:bg-gray-800 transition-all shadow-2xl hover:shadow-gray-900/20 active:scale-95 flex items-center gap-3 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <span className="text-xl">✨</span>
          <span className="relative z-10">Add Opportunity</span>
        </button>
      </header>

      {/* Stats Summary Widget */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Apps', value: applications.length, icon: '📂', color: 'blue' },
          { label: 'Interviews', value: applications.filter(a => a.status === 'Interviewing').length, icon: '🤝', color: 'indigo' },
          { label: 'Success', value: applications.filter(a => a.status === 'Selected').length, icon: '🏆', color: 'emerald' },
          { label: 'Pending', value: applications.filter(a => a.status === 'Applied').length, icon: '⏳', color: 'amber' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-7 rounded-[2.5rem] notion-shadow border border-gray-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
              <div className="text-2xl mb-3">{stat.icon}</div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.label}</p>
              <p className="text-4xl font-black text-gray-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-gray-100 border-t-gray-900 rounded-full animate-spin"></div>
          <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Sychronizing data...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="py-32 flex flex-col items-center justify-center text-center bg-white rounded-[4rem] notion-shadow border border-gray-50 border-dashed m-4">
          <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-5xl mb-8 shadow-inner">🔍</div>
          <h3 className="text-3xl font-black text-gray-900 tracking-tight">Your Pipeline is Clear</h3>
          <p className="text-gray-400 max-w-sm mx-auto mt-4 font-medium leading-relaxed">It's time to find your next big challenge. Click the button above to track your first application.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {applications.map((app, idx) => (
            <div
              key={app._id}
              style={{ animationDelay: `${idx * 100}ms` }}
              className="bg-white p-8 rounded-[3.5rem] notion-shadow border border-transparent hover:border-gray-200 transition-all group relative animate-in fade-in slide-in-from-bottom-4"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="flex gap-5 items-start">
                  <div className="w-16 h-16 bg-gray-50 rounded-[1.5rem] flex items-center justify-center text-3xl shadow-inner group-hover:scale-105 transition-transform duration-500">
                    {app.companyName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 leading-tight">{app.companyName}</h3>
                    <p className="text-blue-600 font-black text-sm uppercase tracking-widest mt-1">{app.role}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app._id!, e.target.value)}
                    className={`text-[10px] font-black uppercase tracking-[0.1em] px-4 py-2 rounded-2xl border-2 transition-all cursor-pointer focus:ring-0 ${getStatusStyles(app.status)}`}
                  >
                    {['Applied', 'Interviewing', 'Selected', 'Rejected', 'Offer Received', 'Withdrawn'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest px-2">Click to update status</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50/50 p-4 rounded-3xl border border-gray-100/50">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Applied</p>
                  <p className="text-xs font-black text-gray-700">{new Date(app.appliedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div className="bg-gray-50/50 p-4 rounded-3xl border border-gray-100/50">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Package</p>
                  <p className="text-xs font-black text-emerald-600">{app.packageOffer || 'TBD'}</p>
                </div>
                <div className="bg-gray-50/50 p-4 rounded-3xl border border-gray-100/50">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Interview</p>
                  <p className="text-xs font-black text-indigo-600">{app.interviewDate ? new Date(app.interviewDate).toLocaleDateString() : 'Pending'}</p>
                </div>
              </div>

              {app.aiAdvice && (
                <div className="bg-slate-900 p-7 rounded-[2.5rem] mb-8 relative animate-in zoom-in-95 duration-500 overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -mr-12 -mt-12"></div>
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                    AI Interview Strategy
                  </p>
                  <div className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed font-medium">
                    {app.aiAdvice}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-6 border-t border-gray-50">
                <button
                  onClick={() => handleAIPrep(app)}
                  disabled={preppingId === app._id}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg hover:shadow-indigo-200 active:scale-95 flex items-center gap-2"
                >
                  {preppingId === app._id ? (
                    <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Generating...</>
                  ) : '⚡ Get AI Prep'}
                </button>
                <button
                  onClick={() => handleDelete(app._id!)}
                  className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                  title="Remove application"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modern Modal Design */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-500">
          <div className="bg-white w-full max-w-xl rounded-[4rem] p-12 notion-shadow relative animate-in zoom-in-95 duration-500 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-10 right-10 w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full text-gray-400 hover:text-gray-900 transition-colors font-bold"
            >
              ✕
            </button>
            <div className="mb-10">
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">New Opportunity</h2>
              <p className="text-gray-400 font-medium mt-2">Every iconic career starts with a single entry.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Company Name</label>
                    <input
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="e.g. Stripe"
                      className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-gray-900 rounded-[1.5rem] text-sm font-black focus:ring-0 transition-all placeholder:text-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Role / Title</label>
                    <input
                      type="text"
                      required
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="e.g. Senior Frontend"
                      className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-gray-900 rounded-[1.5rem] text-sm font-black focus:ring-0 transition-all placeholder:text-gray-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Application Date</label>
                    <input
                      type="date"
                      value={formData.appliedAt}
                      onChange={(e) => setFormData({ ...formData, appliedAt: e.target.value })}
                      className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-gray-900 rounded-[1.5rem] text-sm font-black focus:ring-0 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Annual Package</label>
                    <input
                      type="text"
                      value={formData.packageOffer}
                      onChange={(e) => setFormData({ ...formData, packageOffer: e.target.value })}
                      placeholder="e.g. 15 LPA"
                      className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-gray-900 rounded-[1.5rem] text-sm font-black focus:ring-0 transition-all placeholder:text-gray-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Current Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-gray-900 rounded-[1.5rem] text-sm font-black focus:ring-0 transition-all appearance-none"
                  >
                    {['Applied', 'Interviewing', 'Selected', 'Rejected', 'Offer Received', 'Withdrawn'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-5 bg-gray-900 text-white rounded-[2rem] font-black text-sm hover:bg-gray-800 transition-all shadow-2xl hover:shadow-gray-900/40 active:scale-95 mt-4"
              >
                Track Opportunity
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobTracker;
