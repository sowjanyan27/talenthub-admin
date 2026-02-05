import { useState, useEffect } from 'react';
import { ArrowLeft, Users, FileText, Calendar, TrendingUp, Plus, Eye, Mail, Phone, Briefcase, GraduationCap, Download, Upload, Check, X } from 'lucide-react';
// import { supabase } from '../lib/supabase';
import AddCandidateModal from './AddCandidateModal';
import UploadResumeModal, { type Profile, type ResumeProcess } from './UploadResumeModal';
import CandidatePage from './CandidatePage';
import { exportCandidatesExcel } from '../utils/exportExcel';
import {
  CheckCircle,
  Clock,
  XCircle,
  Circle
} from 'lucide-react';
import { mockTimeline } from '../mock/mockTimeline';
import { useJobContext, type Application } from '../contexts/JobContext';

interface JobDetailsProps {
  jobId: string;
  onBack: () => void;
}
export const TIMELINE_STEPS = [
  { stage: 'profile_uploaded', label: 'Profile' },
  { stage: 'matching_completed', label: 'JD Match' },
  { stage: 'email_sent', label: 'Email' },
  { stage: 'bot_call_completed', label: 'Bot Call' },
  { stage: 'conference_scheduled', label: 'Interview' },
];
const getStageStatus = (timeline: any[], stage: string) => {
  const event = timeline?.find((t: any) => t.stage === stage);

  if (!event) return 'not_started';

  if (event.status === 'completed') return 'completed';

  if (event.status === 'pending') return 'pending';

  if (event.stage === 'rejected' || event.stage === 'bot_call_failed')
    return 'failed';

  return 'completed';
};
const StageIcon = ({ status }: { status: string }) => {
  const baseStyle =
    "w-5 h-5 rounded-full flex items-center justify-center shadow-md text-white";
  switch (status) {
    case 'completed':
      return (
        <div
          className={`${baseStyle} bg-[linear-gradient(to_bottom_right,#4ADE80,#10B981)]`}
        >
          <Check size={14} />
        </div>
      );
    case 'pending':
      return (
        <div
          className={`${baseStyle} bg-[linear-gradient(to_bottom_right,#FBBF24,#F97316)]`}
        >
          <Clock size={14} />
        </div>
      );
    case 'failed':
      return (
        <div
          className={`${baseStyle} bg-[linear-gradient(to_bottom_right,#FB7185,#EF4444)]`}
        >
          <X size={14} />
        </div>
      );
    default:
      return (
        <div
          className={`${baseStyle} bg-[linear-gradient(to_bottom_right,#E5E7EB,#D1D5DB)]`}
        >
          {/* <Circle size={14} /> */}
        </div>
      );
  }
};


export default function JobDetails({ jobId, onBack }: JobDetailsProps) {
  const { jobs, applications: allApplications, addApplication, updateApplicationStatus } = useJobContext();

  const job = jobs.find(j => j.id === jobId) || null;
  const applications = allApplications.filter(app => app.jobId === jobId);

  const [activeTab, setActiveTab] = useState<'candidates' | 'details' | 'screening'>('candidates');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [view, setView] = useState<'job' | 'candidate'>('job');
  const [resumeQueue, setResumeQueue] = useState<ResumeProcess[]>([])


  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    updateApplicationStatus(applicationId, newStatus);
  };

  const handleExtractedProfiles = (profiles: Profile[]) => {
    console.log("Extracted profiles received:", profiles);
    profiles.forEach(p => {
      const newApp: Application = {
        id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        jobId: jobId,
        status: 'screening',
        match_score: p.match_score ? parseInt(p.match_score) : 0,
        applied_at: new Date().toISOString(),
        candidate: {
          id: `cand-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          full_name: p.name || p.file_name,
          email: p.email || "",
          phone: p.phone_number || null,
          years_of_experience: p.total_experience ? parseInt(p.total_experience) : 0,
          education: p.education || null,
          skills: p.skills ? (Array.isArray(p.skills) ? p.skills : (p.skills as string).split(',')) : null,
          gap_summary: p.gap_summary,
          matched_skills: p.matched_skills,
          missing_skills: p.missing_skills
        }
      };
      addApplication(newApp);
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'screening':
        return 'bg-[linear-gradient(to_right,#FB923C,#EA580C)] text-white';
      case 'interview':
        return 'bg-[linear-gradient(to_right,#4ADE80,#10B981)] text-white';
      case 'qualified':
        return 'bg-[linear-gradient(to_right,#60A5FA,#4F46E5)] text-white';
      case 'rejected':
        return 'bg-[linear-gradient(to_right,#F87171,#E11D48)] text-white';
      default:
        return 'bg-[linear-gradient(to_right,#9CA3AF,#4B5563)] text-white';
    }
  };

  const stats = {
    total: applications.length,
    screening: applications.filter((app) => app.status === 'screening').length,
    interview: applications.filter((app) => app.status === 'interview').length,
    qualified: applications.filter((app) => app.match_score >= 80).length,
  };

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
    <div className="ml-64 min-h-screen flex-1 bg-gray-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          <button
            onClick={() => exportCandidatesExcel(applications)}
            className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm border border-white/40 
             rounded-xl hover:shadow-lg transition-all duration-200 text-gray-700 font-medium"
          >
            <Download className="w-4 h-4" />
            Download Excel
          </button>
        </div>
        <div className="mb-6">

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <p className="text-gray-600">
                {job.department} • {job.location}
              </p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm text-white font-semibold ${job.status === 'active'
                ? 'bg-[linear-gradient(to_right,#4ADE80,#10B981)]'
                : job.status === 'draft'
                  ? 'bg-[linear-gradient(to_right,#CBD5E1,#94A3B8)]'
                  : 'bg-[linear-gradient(to_right,#FCA5A5,#EF4444)]'
                }`}
            >
              {job.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="relative z-10">
            <div className="relative group bg-white/70 backdrop-blur-xl rounded-lg py-5 px-4 border border-white/40 shadow-md">
              <div className="absolute top-0 left-0 w-full h-1 bg-[linear-gradient(to_bottom_right,#60A5FA,#3B82F6)] rounded-t-lg"></div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm text-gray-600 font-medium">Total Candidates</h3>
                <div className='w-12 h-12 bg-[linear-gradient(to_bottom_right,#60A5FA,#3B82F6)] rounded-full 
                flex items-center justify-center text-white shadow-lg'>
                  <Users className="w-5 h-5 text-white" />
                </div>
              </div>

              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.total}</div>

              {/* Hover Tooltip */}
              <div className="absolute left-0 top-full mt-3 w-72 bg-white border border-gray-200 rounded-xl shadow-xl 
                      opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                      transition-all z-[9999]">
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
          </div>

          <div className="relative z-10">
            <div className="relative group bg-white/70 backdrop-blur-xl rounded-lg py-5 px-4 border border-white/40 shadow-md">
              <div className="absolute top-0 left-0 w-full h-1 bg-[linear-gradient(to_bottom_right,#C084FC,#A855F7)]  rounded-t-lg"></div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm text-gray-600 font-medium">Screening</h3>
                <div className='w-12 h-12 bg-[linear-gradient(to_bottom_right,#C084FC,#A855F7)] rounded-full 
                flex items-center justify-center text-white shadow-lg'>
                  <FileText className="w-5 h-5 text-white" />
                </div>
              </div>

              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.screening}</div>

              {/* Hover Tooltip */}
              <div className="absolute left-0 top-full mt-3 w-72 bg-white border border-gray-200 rounded-xl shadow-xl 
                      opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                      transition-all z-[9999]">
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
          </div>

          <div className="relative z-10">
            <div className="relative group bg-white/70 backdrop-blur-xl rounded-lg py-5 px-4 border border-white/40 shadow-md">
              <div className="absolute top-0 left-0 w-full h-1 bg-[linear-gradient(to_bottom_right,#818CF8,#6366F1)] rounded-t-lg"></div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-medium text-gray-600">In Interview</h3>
                <div className='w-12 h-12 bg-[linear-gradient(to_bottom_right,#818CF8,#6366F1)] rounded-full 
                flex items-center justify-center text-white shadow-lg'>
                  <Calendar className="w-5 h-5 text-white" />
                </div>
              </div>

              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.interview}</div>

              {/* Hover Tooltip */}
              <div className="absolute left-0 top-full mt-3 w-72 bg-white border border-gray-200 rounded-xl shadow-xl 
                  opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                  transition-all z-[9999]">
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
          </div>


          <div className="relative group bg-white/70 backdrop-blur-xl rounded-lg py-5 px-4 border border-white/40 shadow-md">
            <div className="absolute top-0 left-0 w-full h-1 bg-[linear-gradient(to_bottom_right,#22D3EE,#06B6D4)] rounded-t-lg"></div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-medium text-gray-600">Qualified (80%+)</h3>
              <div className='w-12 h-12 bg-[linear-gradient(to_bottom_right,#22D3EE,#06B6D4)] rounded-full 
              flex items-center justify-center text-white shadow-lg'>
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.qualified}</div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab('candidates')}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${activeTab === 'candidates'
                    ? 'bg-[linear-gradient(to_right,#3B82F6,#2563EB)] text-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  Candidates ({stats.total})
                </button>
                <button
                  onClick={() => setActiveTab('details')}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${activeTab === 'details'
                    ? 'bg-[linear-gradient(to_right,#3B82F6,#2563EB)] text-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  Job Details
                </button>
                <button
                  onClick={() => setActiveTab('screening')}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${activeTab === 'screening'
                    ? 'bg-[linear-gradient(to_right,#3B82F6,#2563EB)] text-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
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
                    <Upload className="mr-2" size={18} />
                    Upload Resume
                  </button>

                  <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-[linear-gradient(to_right,#3B82F6,#2563EB)] text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center text-sm"
                  >
                    <Plus className="mr-2" size={18} />
                    Add Candidate
                  </button>
                </div>
              )}

            </div>
          </div>


          {activeTab === 'candidates' && (
            <div className="p-5">
              <p className="text-sm text-gray-600 mb-5">
                Manage candidates who have applied or been added to this position
              </p>
              {/* ================= LIVE RESUME PROCESSING ================= */}
              {resumeQueue.length > 0 && (
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-blue-800 mb-3">
                    Resume Processing Status
                  </h3>

                  <div className="space-y-3">
                    {resumeQueue.map((item, index) => (
                      <div key={index} className="bg-white rounded-lg border p-3 shadow-sm">

                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-800">
                            {item.file}
                          </span>

                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${item.status === "uploading"
                              ? "bg-blue-100 text-blue-700"
                              : item.status === "processing"
                                ? "bg-yellow-100 text-yellow-700"
                                : item.status === "completed"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                          >
                            {item.status}
                          </span>
                        </div>

                        {item.candidate_id && (
                          <p className="text-xs text-gray-500">
                            Candidate ID: {item.candidate_id}
                          </p>
                        )}

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 h-2 rounded mt-2 overflow-hidden">
                          <div
                            className={`h-2 transition-all duration-500 ${item.status === "completed"
                              ? "bg-green-500 w-full"
                              : item.status === "processing"
                                ? "bg-yellow-500 w-2/3"
                                : item.status === "uploading"
                                  ? "bg-blue-500 w-1/3"
                                  : "bg-red-500 w-full"
                              }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {applications.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500">No candidates yet</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {applications.map((application) => (
                    <div
                      key={application.id}
                      className="relative group border border-gray-200 rounded-xl 
                       bg-white hover:shadow-md transition-shadow"
                    >
                      <div className={`w-full h-2 rounded-t-lg ${getStatusColor(application.status)}`} />
                      <div className='p-6'>
                        {/* ================= HEADER ================= */}
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                              {application.candidate.full_name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Applied{" "}
                              {new Date(application.applied_at).toLocaleDateString()}
                            </p>
                          </div>

                          <span
                            className={`px-3 py-1.5 text-xs font-semibold rounded-full shadow-md ${getStatusColor(
                              application.status
                            )}`}
                          >
                            {application.status}
                          </span>
                        </div>

                        {/* ================= MATCH SCORE ================= */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-700">
                              Match Score
                            </span>
                            <span className="text-sm font-bold text-gray-900">
                              {application.match_score}%
                            </span>
                          </div>

                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full transition-all"
                              style={{ width: `${application.match_score}%` }}
                            />
                          </div>
                        </div>

                        {/* ================= VERTICAL TIMELINE ================= */}
                        {/* Note: using mockTimeline for now, context should ideally provide this or we map it */}
                        <div className="mt-4 border-gray-200 space-y-4">
                          {TIMELINE_STEPS.map((step) => {
                            const status = getStageStatus(
                              application.timeline || mockTimeline[application.id] || [], // Use application timeline if available (JobContext lacks it for upload, so maybe default to empty or pending)
                              step.stage
                            );

                            return (
                              <div
                                key={step.stage}
                                className="flex items-center gap-3"
                              >
                                <div className="">
                                  <StageIcon status={status} />
                                </div>

                                <div>
                                  <p className="text-sm font-medium text-gray-700">
                                    {step.label}
                                  </p>
                                </div>
                                <div className='ml-auto'>
                                  <p className="text-xs text-gray-500 capitalize">
                                    {status.replace("_", " ")}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* ================= SKILLS ================= */}

                        {application.candidate.skills && application.candidate.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4 mb-4">
                            {application.candidate.skills.slice(0, 3).map((skill, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-[linear-gradient(to_right,#EFF6FF,#EEF2FF)] text-blue-700 text-xs font-medium rounded-lg border border-blue-100"
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

                        {/* ================= ACTIONS ================= */}
                        <div className="flex gap-2 mt-4">
                          <div className="relative block w-full">
                            <select value={application.status}
                              onChange={(e) =>
                                handleStatusChange(application.id, e.target.value)
                              }
                              className="flex-1 w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                            >
                              <option value="screening">Screening</option>
                              <option value="interview">Interview</option>
                              <option value="qualified">Qualified</option>
                              <option value="rejected">Rejected</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setSelectedApplication(application);
                              setView("candidate");
                            }}
                            className="p-2.5 bg-[linear-gradient(to_right,#EFF6FF,#EEF2FF)] text-blue-600 rounded-xl hover:shadow-md transition-all duration-200 border border-blue-100"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>

                        {/* ================= HOVER DETAILS ================= */}
                        <div
                          className="
                absolute left-0 right-0 bottom-20 mx-4
                bg-white border border-gray-200 rounded-lg shadow-lg
                p-4 text-sm text-gray-700
                opacity-0 translate-y-2
                group-hover:opacity-100 group-hover:translate-y-0
                transition-all duration-200
                pointer-events-none z-10
              "
                        >
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-500" />
                              {application.candidate.email}
                            </div>

                            {application.candidate.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-500" />
                                {application.candidate.phone}
                              </div>
                            )}

                            <div className="flex items-center gap-2">
                              <Briefcase className="w-4 h-4 text-gray-500" />
                              {application.candidate.years_of_experience} years experience
                            </div>

                            {application.candidate.education && (
                              <div className="flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-gray-500" />
                                {application.candidate.education}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'details' && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Job Overview */}
                <div className="bg-[linear-gradient(to_bottom_right,#EFF6FF,#EEF2FF)] rounded-2xl p-4 border border-blue-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Job Overview
                  </h3>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between pb-2 border-b border-blue-100">
                      <span className="text-sm font-medium text-gray-600">Job Title</span>
                      <span className="text-sm font-medium text-gray-900">{job.title}</span>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-blue-100">
                      <span className="text-sm font-medium text-gray-600">Department</span>
                      <span className="text-sm font-medium text-gray-900">{job.department}</span>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-blue-100">
                      <span className="text-sm font-medium text-gray-600">Location</span>
                      <span className="text-sm font-medium text-gray-900">{job.location}</span>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-blue-100">
                      <span className="text-sm font-medium text-gray-600">Status</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${job.status === 'active'
                          ? 'bg-[linear-gradient(to_right,#4ADE80,#10B981)] text-white'
                          : 'bg-[linear-gradient(to_right,#9CA3AF,#4B5563)] text-white'
                          }`}
                      >
                        {job.status}
                      </span>
                    </div>

                    {job.experience_required !== undefined && (
                      <div className="flex items-center justify-between pb-2 border-b border-blue-100">
                        <span className="text-sm font-medium text-gray-600">Experience Required</span>
                        <span className="text-sm font-medium text-gray-900">
                          {job.experience_required} years
                        </span>
                      </div>
                    )}

                    {job.created_at && (
                      <div className="flex items-center justify-between pb-2">
                        <span className="text-sm font-medium text-gray-600">Created On</span>
                        <span className="text-sm font-medium text-gray-900">
                          {new Date(job.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Job Description */}
                <div className="bg-[linear-gradient(to_bottom_right,#EFF6FF,#EEF2FF)] rounded-2xl p-4 border border-blue-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
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
          }}
        />
      )}

      {showUploadModal && (
        <UploadResumeModal
          jobId={jobId}
          jobDescription={job.description || ""}
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => {
            setShowUploadModal(false)
          }}
          onUploadProgress={(data) => setResumeQueue(data)}
          onExtracted={handleExtractedProfiles}
        />
      )}

    </div>
  );
}
