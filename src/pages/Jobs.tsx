// import { useState, useEffect } from 'react';
// import { Search, Plus, MapPin, DollarSign, Users, Eye, Trash2 } from 'lucide-react';
// import { supabase } from '../lib/supabase';
// import { useAuth } from '../contexts/AuthContext';
// import PostJobModal from '../components/PostJobModal';
// import JobDetails from '../components/JobDetails';
// import UploadResumeModal from '../components/UploadResumeModal';

// interface Job {
//   id: string;
//   title: string;
//   department: string;
//   location: string;
//   description: string | null;
//   min_salary: number | null;
//   max_salary: number | null;
//   status: string;
//   created_at: string;
// }

// interface JobWithApplications extends Job {
//   applicant_count: number;
// }

// export default function Jobs() {
//   const [jobs, setJobs] = useState<JobWithApplications[]>([]);
//   const [filteredJobs, setFilteredJobs] = useState<JobWithApplications[]>([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [showPostModal, setShowPostModal] = useState(false);
//   const [selectedJob, setSelectedJob] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const { user } = useAuth();
//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const [uploadJobId, setUploadJobId] = useState<string | null>(null);
//   const [uploadJobTitle, setUploadJobTitle] = useState<string | null>(null);


//   useEffect(() => {
//     if (user) {
//       loadJobs();
//     }
//   }, [user]);

//   useEffect(() => {
//     filterJobs();
//   }, [searchQuery, statusFilter, jobs]);

//   const loadJobs = async () => {
//     try {
//       const { data: jobsData, error: jobsError } = await supabase
//         .from('jobs')
//         .select('*')
//         .order('created_at', { ascending: false });

//       if (jobsError) throw jobsError;

//       const jobsWithCounts = await Promise.all(
//         (jobsData || []).map(async (job) => {
//           const { count } = await supabase
//             .from('applications')
//             .select('*', { count: 'exact', head: true })
//             .eq('job_id', job.id);

//           return { ...job, applicant_count: count || 0 };
//         })
//       );

//       setJobs(jobsWithCounts);
//     } catch (error) {
//       console.error('Error loading jobs:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filterJobs = () => {
//     let filtered = jobs;

//     if (searchQuery) {
//       filtered = filtered.filter(
//         (job) =>
//           job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           job.department.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     if (statusFilter !== 'all') {
//       filtered = filtered.filter((job) => job.status === statusFilter);
//     }

//     setFilteredJobs(filtered);
//   };

//   const handleDeleteJob = async (jobId: string) => {
//     if (!confirm('Are you sure you want to delete this job?')) return;

//     try {
//       const { error } = await supabase.from('jobs').delete().eq('id', jobId);
//       if (error) throw error;
//       loadJobs();
//     } catch (error) {
//       console.error('Error deleting job:', error);
//     }
//   };

//   if (selectedJob) {
//     return <JobDetails jobId={selectedJob} onBack={() => setSelectedJob(null)} />;
//   }

//   return (
//     <div className="flex-1 bg-gray-50">
//       <div className="max-w-7xl mx-auto p-8">
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-4xl font-bold text-gray-900 mb-2">Job Postings</h1>
//             <p className="text-gray-600">Create and manage job openings</p>
//           </div>
//           <button
//             onClick={() => setShowPostModal(true)}
//             className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
//           >
//             <Plus className="w-5 h-5 mr-2" />
//             Post New Job
//           </button>
//         </div>

//         <div className="flex gap-4 mb-6">
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//             <input
//               type="text"
//               placeholder="Search jobs..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>
//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           >
//             <option value="all">All Status</option>
//             <option value="draft">Draft</option>
//             <option value="active">Active</option>
//             <option value="closed">Closed</option>
//           </select>
//         </div>

//         {loading ? (
//           <div className="text-center py-12">
//             <div className="text-gray-500">Loading jobs...</div>
//           </div>
//         ) : filteredJobs.length === 0 ? (
//           <div className="text-center py-12">
//             <div className="text-gray-500">No jobs found</div>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {filteredJobs.map((job) => (
//               <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                 <div className="flex items-start justify-between mb-4">
//                   <div className="flex items-start">
//                     <div className="bg-blue-100 rounded-lg p-3 mr-4">
//                       <Users className="w-6 h-6 text-blue-600" />
//                     </div>
//                     <div>
//                       <h3 className="text-xl font-semibold text-gray-900 mb-1">
//                         {job.title}
//                       </h3>
//                       <p className="text-gray-600">{job.department}</p>
//                     </div>
//                   </div>
//                   <span
//                     className={`px-3 py-1 rounded-full text-xs font-medium ${job.status === 'active'
//                         ? 'bg-green-100 text-green-700'
//                         : job.status === 'draft'
//                           ? 'bg-gray-100 text-gray-700'
//                           : 'bg-red-100 text-red-700'
//                       }`}
//                   >
//                     {job.status}
//                   </span>
//                 </div>

//                 <p className="text-gray-700 mb-4 line-clamp-2">
//                   {job.description || 'No description provided'}
//                 </p>

//                 <div className="space-y-2 mb-4">
//                   <div className="flex items-center text-gray-600 text-sm">
//                     <MapPin className="w-4 h-4 mr-2" />
//                     {job.location}
//                   </div>
//                   {job.min_salary && job.max_salary && (
//                     <div className="flex items-center text-gray-600 text-sm">
//                       <DollarSign className="w-4 h-4 mr-2" />
//                       ${job.min_salary.toLocaleString()} - ${job.max_salary.toLocaleString()}
//                     </div>
//                   )}
//                   <div className="flex items-center text-gray-600 text-sm">
//                     <Users className="w-4 h-4 mr-2" />
//                     {job.applicant_count} applicants
//                   </div>
//                 </div>

//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => setSelectedJob(job.id)}
//                     className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//                   >
//                     <Eye className="w-4 h-4 mr-2" />
//                     View Details
//                   </button>

//                   {/* <button
//                     onClick={() => {
//                       setUploadJobId(job.id);
//                       setUploadJobTitle(job.title);
//                       setShowUploadModal(true);
//                     }}
//                     className="flex items-center justify-center px-4 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
//                   >
//                     Upload Resume
//                   </button> */}

//                   <button
//                     onClick={() => handleDeleteJob(job.id)}
//                     className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </button>
//                 </div>

//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {showPostModal && (
//         <PostJobModal
//           onClose={() => setShowPostModal(false)}
//           onSuccess={() => {
//             setShowPostModal(false);
//             loadJobs();
//           }}
//         />
//       )}

//       {showUploadModal && uploadJobId && (
//   <UploadResumeModal
//     jobId={uploadJobId}
//     jobTitle={uploadJobTitle!}
//     onClose={() => {
//       setShowUploadModal(false);
//       setUploadJobId(null);
//       setUploadJobTitle(null);
//     }}
//     onSuccess={() => {
//       setShowUploadModal(false);
//       setUploadJobId(null);
//       setUploadJobTitle(null);
//       loadJobs();
//     }}
//   />
// )}


//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { Search, Plus, MapPin, DollarSign, Users, Eye, Trash2 } from 'lucide-react';

import PostJobModal from '../components/PostJobModal';
import JobDetails from '../components/JobDetails';

import { mockJobs, mockApplications } from '../mock/mockData';
import { motion, AnimatePresence } from "framer-motion";

/* ================= TYPES ================= */

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  description: string | null;
  status: string;
  created_at: string;
    min_salary?: number | null;
  max_salary?: number | null;
}

interface JobWithApplications extends Job {
  applicant_count: number;
}

/* ================= COMPONENT ================= */

export default function Jobs() {
  const [jobs, setJobs] = useState<JobWithApplications[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobWithApplications[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD MOCK DATA ================= */

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [searchQuery, statusFilter, jobs]);

  const loadJobs = () => {
    const jobsWithCounts: JobWithApplications[] = mockJobs.map(job => {
      const applicantCount = mockApplications.filter(
        app => app.jobId === job.id
      ).length;

      return {
        ...job,
        applicant_count: applicantCount,
      };
    });

    setJobs(jobsWithCounts);
    setLoading(false);
  };

  useEffect(() => {
    if (showPostModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showPostModal]);

  /* ================= FILTER ================= */

  const filterJobs = () => {
    let filtered = [...jobs];

    if (searchQuery) {
      filtered = filtered.filter(
        job =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(job => job.status === statusFilter);
    }

    setFilteredJobs(filtered);
  };

  /* ================= DELETE (LOCAL) ================= */

  const handleDeleteJob = (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    setJobs(prev => prev.filter(job => job.id !== jobId));
  };

  /* ================= DETAILS ================= */

  if (selectedJob) {
    return <JobDetails jobId={selectedJob} onBack={() => setSelectedJob(null)} />;
  }

  /* ================= UI ================= */

  return (
    <div className="ml-64 min-h-screen flex-1 bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Job Postings</h1>
            <p className="text-gray-600">Create and manage job openings</p>
          </div>
          <button
            onClick={() => setShowPostModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[linear-gradient(to_right,#3B82F6,#2563EB)]
             text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200
              font-semibold"
          >
            <Plus className="w-5 h-5" />
            Post New Job
          </button>
        </div>

        {/* SEARCH */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search jobs..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none shadow-sm"
            />
          </div>

          <div className="relative inline-block">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full px-6 py-3 pr-10 bg-white border border-gray-200 rounded-xl 
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                        transition-all duration-200 outline-none shadow-sm font-medium text-gray-700
                        appearance-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* LIST */}
        {loading ? (
          <div className="text-center py-12">Loading jobs...</div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12">No jobs found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredJobs.map(job => (
              <div key={job.id} className="bg-white rounded-2xl border border-gray-200 hover:border-[#2766ec] p-6 
              hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1 group">

                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
                    <p className="text-sm text-gray-500 font-medium">{job.department}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    job.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {job.status}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {job.description || 'No description'}
                </p>

                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>

                  {job.min_salary && job.max_salary && (
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4" />
                     <span>₹{job.min_salary} - ₹{job.max_salary}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    <span>{job.applicant_count} applicants</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedJob(job.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5
                    bg-[linear-gradient(to_right,#F9FAFB,#F3F4F6)]
                    text-gray-700 rounded-xl text-[0.90rem]
                    hover:bg-[linear-gradient(to_right,#3B82F6,#2563EB)] hover:text-white
                    transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                  >
                    <Eye size={19} />
                    View Details
                  </button>

                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="px-4 py-2.5 bg-[linear-gradient(to_right,#F9FAFB,#F3F4F6)] text-gray-500 rounded-xl 
                    hover:bg-[linear-gradient(to_right,#EF4444,#DC2626)] hover:text-white transition-all 
                    duration-200 shadow-sm hover:shadow-md"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
      
      <AnimatePresence mode="wait">
      {showPostModal && (
        <PostJobModal
          onClose={() => setShowPostModal(false)}
          onSuccess={() => setShowPostModal(false)}
        />
      )}
      </AnimatePresence>
    </div>
  );
}
