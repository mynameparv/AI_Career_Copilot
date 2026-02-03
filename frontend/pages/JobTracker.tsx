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
    if (window.confirm('Are you sure?')) {
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
      Keep it short and impactful.`;

      const advice = await getGeminiResponse(prompt);
      await updateApplication(app._id!, { aiAdvice: advice });
      fetchApps();
    } catch (err) {
      console.error(err);
    } finally {
      setPreppingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Selected': return 'bg-green-100 text-green-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      case 'Interviewing': return 'bg-purple-100 text-purple-700';
      case 'Offer Received': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Job Application Tracker</h1>
          <p className="text-gray-500 font-medium mt-1">Keep track of your opportunities and get AI interview prep.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl active:scale-95 flex items-center gap-2"
        >
          <span>➕</span> Add Application
        </button>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: applications.length, color: 'gray' },
          { label: 'Interviews', value: applications.filter(a => a.status === 'Interviewing').length, color: 'purple' },
          { label: 'Selected', value: applications.filter(a => a.status === 'Selected').length, color: 'green' },
          { label: 'Offers', value: applications.filter(a => a.status === 'Offer Received').length, color: 'blue' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-3xl notion-shadow border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400">Loading your applications...</div>
      ) : applications.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center bg-white rounded-3xl notion-shadow border-2 border-dashed border-gray-100">
          <div className="text-6xl mb-4">📂</div>
          <h3 className="text-xl font-bold text-gray-800">Your tracker is empty</h3>
          <p className="text-gray-500 max-w-xs mx-auto mt-2">Start adding job applications to track your progress and get AI advice.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-medium">
          {applications.map((app) => (
            <div key={app._id} className="bg-white p-6 rounded-[2rem] notion-shadow border border-gray-100 group hover:border-blue-200 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>

              <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                  <h3 className="text-xl font-black text-gray-900 leading-none">{app.companyName}</h3>
                  <p className="text-sm text-blue-600 font-bold mt-2">{app.role}</p>
                </div>
                <select
                  value={app.status}
                  onChange={(e) => handleStatusChange(app._id!, e.target.value)}
                  className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border-none cursor-pointer focus:ring-0 ${getStatusColor(app.status)}`}
                >
                  {['Applied', 'Interviewing', 'Selected', 'Rejected', 'Offer Received', 'Withdrawn'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                <div className="bg-gray-50 p-3 rounded-2xl">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Applied On</p>
                  <p className="text-xs font-bold text-gray-700 mt-0.5">{new Date(app.appliedAt).toLocaleDateString()}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-2xl">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Package</p>
                  <p className="text-xs font-bold text-gray-700 mt-0.5">{app.packageOffer || 'Not disclosed'}</p>
                </div>
              </div>

              {app.aiAdvice && (
                <div className="bg-indigo-50 p-5 rounded-2xl mb-6 relative z-10 animate-in slide-in-from-top-2 border-l-4 border-indigo-500">
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <span>🤖</span> AI Interview Prep
                  </p>
                  <div className="text-xs text-indigo-900 whitespace-pre-wrap leading-relaxed">
                    {app.aiAdvice}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-gray-100 relative z-10">
                <button
                  onClick={() => handleAIPrep(app)}
                  disabled={preppingId === app._id}
                  className="text-xs font-black text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest flex items-center gap-1.5"
                >
                  {preppingId === app._id ? 'Generating...' : '🔍 Get AI Prep Advice'}
                </button>
                <button
                  onClick={() => handleDelete(app._id!)}
                  className="text-xs font-black text-red-400 hover:text-red-600 transition-colors uppercase tracking-widest"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Application Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 notion-shadow relative animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 font-bold"
            >
              ✕
            </button>
            <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">New Application</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Company Name</label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="E.g., Google"
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Role Title</label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="E.g., Frontend Engineer"
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Applied Date</label>
                  <input
                    type="date"
                    value={formData.appliedAt}
                    onChange={(e) => setFormData({ ...formData, appliedAt: e.target.value })}
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Package Offer</label>
                  <input
                    type="text"
                    value={formData.packageOffer}
                    onChange={(e) => setFormData({ ...formData, packageOffer: e.target.value })}
                    placeholder="E.g., 12 LPA"
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-blue-500"
                >
                  {['Applied', 'Interviewing', 'Selected', 'Rejected', 'Offer Received', 'Withdrawn'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-4 mt-4 bg-black text-white rounded-[1.5rem] font-bold text-sm hover:bg-gray-800 transition-all shadow-xl active:scale-95"
              >
                Track Application
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobTracker;
