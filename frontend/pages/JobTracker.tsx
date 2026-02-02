
import React, { useState } from 'react';

type Status = 'Wishlist' | 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';

interface Job {
  id: string;
  company: string;
  role: string;
  status: Status;
  date: string;
}

const JobTracker: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([
    { id: '1', company: 'Google', role: 'Senior Frontend Engineer', status: 'Applied', date: 'Oct 24, 2023' },
    { id: '2', company: 'Meta', role: 'Staff Product Designer', status: 'Interviewing', date: 'Oct 25, 2023' },
    { id: '3', company: 'Stripe', role: 'Engineering Manager', status: 'Wishlist', date: 'Oct 26, 2023' },
    { id: '4', company: 'Netflix', role: 'Full Stack Developer', status: 'Rejected', date: 'Oct 20, 2023' },
  ]);

  const columns: Status[] = ['Wishlist', 'Applied', 'Interviewing', 'Offer', 'Rejected'];

  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'Wishlist': return 'bg-gray-100 text-gray-600';
      case 'Applied': return 'bg-blue-100 text-blue-700';
      case 'Interviewing': return 'bg-purple-100 text-purple-700';
      case 'Offer': return 'bg-green-100 text-green-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 overflow-x-auto pb-10">
      <header className="flex justify-between items-end min-w-max md:min-w-0 px-4 md:px-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
          <p className="text-gray-500 mt-1">Keep track of your career progress across companies.</p>
        </div>
        <button className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 shadow-md">
          Add Application
        </button>
      </header>

      <div className="flex gap-4 min-w-max pb-4 px-4 md:px-0">
        {columns.map((col) => (
          <div key={col} className="w-72 flex-shrink-0">
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${col === 'Offer' ? 'bg-green-500' : col === 'Interviewing' ? 'bg-purple-500' : 'bg-gray-300'}`}></span>
                <h3 className="text-sm font-bold text-gray-600 uppercase tracking-widest">{col}</h3>
              </div>
              <span className="text-xs font-medium text-gray-400">{jobs.filter(j => j.status === col).length}</span>
            </div>
            
            <div className="space-y-3 min-h-[500px] bg-gray-50/50 p-2 rounded-xl">
              {jobs.filter(j => j.status === col).map((job) => (
                <div key={job.id} className="bg-white p-4 rounded-xl notion-shadow border border-transparent hover:border-blue-200 cursor-pointer group transition-all transform active:scale-95">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter mb-1">{job.company}</p>
                  <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{job.role}</h4>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-medium">Added {job.date}</span>
                    <button className="text-gray-300 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                    </button>
                  </div>
                </div>
              ))}
              <button className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-xs font-bold hover:bg-white hover:border-gray-300 transition-all">
                + New
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobTracker;
