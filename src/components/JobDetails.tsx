import { useState, useEffect } from 'react';
import { ArrowLeft, Users, FileText, Calendar, TrendingUp, Plus, Eye, Mail, Phone, Briefcase, GraduationCap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import AddCandidateModal from './AddCandidateModal';
import UploadResumeModal from './UploadResumeModal';
import CandidateDetailsModal from './CandidateDetailsModal';
import { mockApplications, mockJob } from '../mock/mockData';
import CandidatePage from './CandidatePage';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  status: string;
  description?: string;
  experience_required?: number;
  created_at?: string;
}


interface Candidate {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  skills: string[] | null;
  years_of_experience: number;
  education: string | null;
}

interface Application {
  id: string;
  status: string;
  match_score: number;
  applied_at: string;
  candidate: Candidate;
}

interface JobDetailsProps {
  jobId: string;
  onBack: () => void;
}

export default function JobDetails({ jobId, onBack }: JobDetailsProps) {
  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [activeTab, setActiveTab] = useState<'candidates' | 'details' | 'screening'>('candidates');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [view, setView] = useState<'job' | 'candidate'>('job');
// const [selectedApplication, setSelectedApplication] = useState<any>(null);


  // useEffect(() => {
  //   loadJobDetails();
  // }, [jobId]);
useEffect(() => {
  setJob(mockJob);
  setApplications(mockApplications);
  setLoading(false);
}, []);

  const loadJobDetails = async () => {
    try {
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (jobError) throw jobError;
      setJob(jobData);

      const { data: applicationsData, error: applicationsError } = await supabase
        .from('applications')
        .select(`
          *,
          candidate:candidates(*)
        `)
        .eq('job_id', jobId)
        .order('applied_at', { ascending: false });

      if (applicationsError) throw applicationsError;
      setApplications(applicationsData as unknown as Application[]);
    } catch (error) {
      console.error('Error loading job details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', applicationId);

      if (error) throw error;
      loadJobDetails();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'screening':
        return 'bg-orange-100 text-orange-700';
      case 'interview':
        return 'bg-green-100 text-green-700';
      case 'qualified':
        return 'bg-blue-100 text-blue-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const stats = {
    total: applications.length,
    screening: applications.filter((app) => app.status === 'screening').length,
    interview: applications.filter((app) => app.status === 'interview').length,
    qualified: applications.filter((app) => app.match_score >= 80).length,
  };

  if (loading) {
    return (
      <div className="flex-1 bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex-1 bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Job not found</div>
      </div>
    );
  }
  const dateWiseStats = applications.reduce<Record<string, number>>((acc, app) => {
    const date = new Date(app.applied_at).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const statusWiseStats = applications.reduce<Record<string, number>>((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});
  const getDateWiseByStatus = (status: string) => {
    return applications
      .filter(app => app.status === status)
      .reduce<Record<string, number>>((acc, app) => {
        const date = new Date(app.applied_at).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});
  };
if (view === 'candidate' && selectedApplication) {
  return (
    <CandidatePage
      application={selectedApplication}
      onBack={() => {
        setView('job');
        setSelectedApplication(null);
      }}
    />
  );
}

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <p className="text-gray-600">
                {job.department} • {job.location}
              </p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${job.status === 'active'
                ? 'bg-green-100 text-green-700'
                : job.status === 'draft'
                  ? 'bg-gray-100 text-gray-700'
                  : 'bg-red-100 text-red-700'
                }`}
            >
              {job.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="relative group bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Candidates</h3>
              <Users className="w-5 h-5 text-gray-400" />
            </div>

            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>

            {/* Hover Tooltip */}
            <div className="absolute left-0 top-full mt-3 w-80 bg-white border border-gray-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <div className="p-4 space-y-4 text-sm">

                {/* Date-wise */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Date-wise Applications</h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {Object.entries(dateWiseStats).map(([date, count]) => (
                      <div key={date} className="flex justify-between text-gray-700">
                        <span>{date}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <hr />

                {/* Status-wise */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Status-wise Breakdown</h4>
                  <div className="space-y-1">
                    {Object.entries(statusWiseStats).map(([status, count]) => (
                      <div key={status} className="flex justify-between">
                        <span className="capitalize text-gray-700">{status}</span>
                        <span className="font-medium text-gray-900">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>


          <div className="relative group bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Screening</h3>
              <FileText className="w-5 h-5 text-gray-400" />
            </div>

            <div className="text-3xl font-bold text-gray-900">{stats.screening}</div>

            {/* Hover Tooltip */}
            <div className="absolute left-0 top-full mt-3 w-72 bg-white border border-gray-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <div className="p-4 text-sm space-y-3">

                <h4 className="font-semibold text-gray-900">
                  Screening – Date wise
                </h4>

                {Object.entries(getDateWiseByStatus('screening')).length === 0 ? (
                  <p className="text-gray-500">No candidates</p>
                ) : (
                  Object.entries(getDateWiseByStatus('screening')).map(([date, count]) => (
                    <div key={date} className="flex justify-between text-gray-700">
                      <span>{date}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>


          <div className="relative group bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">In Interview</h3>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>

            <div className="text-3xl font-bold text-gray-900">{stats.interview}</div>

            {/* Hover Tooltip */}
            <div className="absolute left-0 top-full mt-3 w-72 bg-white border border-gray-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <div className="p-4 text-sm space-y-3">

                <h4 className="font-semibold text-gray-900">
                  Interview – Date wise
                </h4>

                {Object.entries(getDateWiseByStatus('interview')).length === 0 ? (
                  <p className="text-gray-500">No candidates</p>
                ) : (
                  Object.entries(getDateWiseByStatus('interview')).map(([date, count]) => (
                    <div key={date} className="flex justify-between text-gray-700">
                      <span>{date}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>


          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Qualified (80%+)</h3>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.qualified}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab('candidates')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'candidates'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                  Candidates ({stats.total})
                </button>
                <button
                  onClick={() => setActiveTab('details')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'details'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                  Job Details
                </button>
                <button
                  onClick={() => setActiveTab('screening')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'screening'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                  Screening Rules
                </button>
              </div>
              {activeTab === 'candidates' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center text-sm"
                  >
                    Upload Resume
                  </button>

                  <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center text-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Candidate
                  </button>
                </div>
              )}

            </div>
          </div>

          {activeTab === 'candidates' && (
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-6">
                Manage candidates who have applied or been added to this position
              </p>

              {applications.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500">No candidates yet</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {applications.map((application) => (
                    <div
                      key={application.id}
                      className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {application.candidate.full_name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Applied {new Date(application.applied_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            application.status
                          )}`}
                        >
                          {application.status}
                        </span>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">Match Score</span>
                          <span className="text-sm font-semibold text-gray-900">
                            {application.match_score}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${application.match_score}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="w-4 h-4 mr-2" />
                          {application.candidate.email}
                        </div>
                        {application.candidate.phone && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="w-4 h-4 mr-2" />
                            {application.candidate.phone}
                          </div>
                        )}
                        <div className="flex items-center text-sm text-gray-600">
                          <Briefcase className="w-4 h-4 mr-2" />
                          {application.candidate.years_of_experience} years experience
                        </div>
                        {application.candidate.education && (
                          <div className="flex items-center text-sm text-gray-600">
                            <GraduationCap className="w-4 h-4 mr-2" />
                            {application.candidate.education}
                          </div>
                        )}
                      </div>

                      {application.candidate.skills && application.candidate.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {application.candidate.skills.slice(0, 3).map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                          {application.candidate.skills.length > 3 && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                              +{application.candidate.skills.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <select
                          value={application.status}
                          onChange={(e) => handleStatusChange(application.id, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="screening">Screening</option>
                          <option value="interview">Interview</option>
                          <option value="qualified">Qualified</option>
                          <option value="rejected">Rejected</option>
                        </select>
                        {/* <button
                          onClick={() => setSelectedApplication(application)}
                        >
                          <Eye className="w-4 h-4" />
                        </button> */}
                        <button
  onClick={() => {
    setSelectedApplication(application);
    setView('candidate');
  }}
>
  <Eye className="w-4 h-4" />
</button>

                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === 'details' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Job Overview */}
                <div className="bg-gray-50 border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Job Overview
                  </h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Job Title</span>
                      <span className="font-medium text-gray-900">{job.title}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Department</span>
                      <span className="font-medium text-gray-900">{job.department}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Location</span>
                      <span className="font-medium text-gray-900">{job.location}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Status</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${job.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                          }`}
                      >
                        {job.status}
                      </span>
                    </div>

                    {job.experience_required !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Experience Required</span>
                        <span className="font-medium text-gray-900">
                          {job.experience_required} years
                        </span>
                      </div>
                    )}

                    {job.created_at && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Created On</span>
                        <span className="font-medium text-gray-900">
                          {new Date(job.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Job Description */}
                <div className="bg-gray-50 border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Job Description
                  </h3>

                  {job.description ? (
                    <p className="text-sm text-gray-700 whitespace-pre-line">
                      {job.description}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">No description available</p>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {showAddModal && (
        <AddCandidateModal
          jobId={jobId}
          jobTitle={job.title}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            loadJobDetails();
          }}
        />
      )}

      {showUploadModal && (
        <UploadResumeModal
          jobId={jobId}
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => {
            setShowUploadModal(false);
            loadJobDetails();
          }}
        />
      )}

      {/* {selectedApplication && (
        <CandidateDetailsModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
        />
      )} */}




    </div>
  );
}
