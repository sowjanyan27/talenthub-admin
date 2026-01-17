import { useState, useEffect } from 'react';
import { Search, Plus, MapPin, DollarSign, Users, Eye, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import PostJobModal from '../components/PostJobModal';
import JobDetails from '../components/JobDetails';
import UploadResumeModal from '../components/UploadResumeModal';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  description: string | null;
  min_salary: number | null;
  max_salary: number | null;
  status: string;
  created_at: string;
}

interface JobWithApplications extends Job {
  applicant_count: number;
}

export default function Jobs() {
  const [jobs, setJobs] = useState<JobWithApplications[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobWithApplications[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadJobId, setUploadJobId] = useState<string | null>(null);
  const [uploadJobTitle, setUploadJobTitle] = useState<string | null>(null);


  useEffect(() => {
    if (user) {
      loadJobs();
    }
  }, [user]);

  useEffect(() => {
    filterJobs();
  }, [searchQuery, statusFilter, jobs]);

  const loadJobs = async () => {
    try {
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (jobsError) throw jobsError;

      const jobsWithCounts = await Promise.all(
        (jobsData || []).map(async (job) => {
          const { count } = await supabase
            .from('applications')
            .select('*', { count: 'exact', head: true })
            .eq('job_id', job.id);

          return { ...job, applicant_count: count || 0 };
        })
      );

      setJobs(jobsWithCounts);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = jobs;

    if (searchQuery) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((job) => job.status === statusFilter);
    }

    setFilteredJobs(filtered);
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      const { error } = await supabase.from('jobs').delete().eq('id', jobId);
      if (error) throw error;
      loadJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  if (selectedJob) {
    return <JobDetails jobId={selectedJob} onBack={() => setSelectedJob(null)} />;
  }

  return (
    <div className="flex-1 bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Job Postings</h1>
            <p className="text-gray-600">Create and manage job openings</p>
          </div>
          <button
            onClick={() => setShowPostModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Post New Job
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading jobs...</div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500">No jobs found</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start">
                    <div className="bg-blue-100 rounded-lg p-3 mr-4">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {job.title}
                      </h3>
                      <p className="text-gray-600">{job.department}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${job.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : job.status === 'draft'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                  >
                    {job.status}
                  </span>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-2">
                  {job.description || 'No description provided'}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 mr-2" />
                    {job.location}
                  </div>
                  {job.min_salary && job.max_salary && (
                    <div className="flex items-center text-gray-600 text-sm">
                      <DollarSign className="w-4 h-4 mr-2" />
                      ${job.min_salary.toLocaleString()} - ${job.max_salary.toLocaleString()}
                    </div>
                  )}
                  <div className="flex items-center text-gray-600 text-sm">
                    <Users className="w-4 h-4 mr-2" />
                    {job.applicant_count} applicants
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedJob(job.id)}
                    className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </button>

                  {/* <button
                    onClick={() => {
                      setUploadJobId(job.id);
                      setUploadJobTitle(job.title);
                      setShowUploadModal(true);
                    }}
                    className="flex items-center justify-center px-4 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Upload Resume
                  </button> */}

                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {showPostModal && (
        <PostJobModal
          onClose={() => setShowPostModal(false)}
          onSuccess={() => {
            setShowPostModal(false);
            loadJobs();
          }}
        />
      )}

      {showUploadModal && uploadJobId && (
  <UploadResumeModal
    jobId={uploadJobId}
    jobTitle={uploadJobTitle!}
    onClose={() => {
      setShowUploadModal(false);
      setUploadJobId(null);
      setUploadJobTitle(null);
    }}
    onSuccess={() => {
      setShowUploadModal(false);
      setUploadJobId(null);
      setUploadJobTitle(null);
      loadJobs();
    }}
  />
)}


    </div>
  );
}
