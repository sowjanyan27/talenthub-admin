import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Jobs from './pages/Jobs';
import Sidebar from './components/Sidebar';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import PostJobModal from './components/PostJobModal';
// import TaskNotificationsPaging from './pages/Dashboard';
import UploadResumeModal, { type Profile } from './components/UploadResumeModal';
import ExtractedProfiles from './components/ExtractedProfiles';
import { JobProvider, type Application } from './contexts/JobContext';
import CandidatePage from './components/CandidatePage';


function App() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('jobs');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [excelFile, setExcelFile] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showPostJobModal, setShowPostJobModal] = useState(false);


  const handleExtractedProfile = (
    newProfiles: any[],
    excel?: string | null
  ) => {
    console.log("📄 EXCEL RECEIVED IN APP:", excel);

    setProfiles(prev => [...prev, ...newProfiles]);
    setExcelFile(excel ?? null);
    setActiveTab("extraction");
  };

  const handleViewProfile = (profile: Profile) => {
    // Transform Profile to Application format
    const skillsArray = profile.skills ? profile.skills.split(',').map(s => s.trim()) : [];

    // Parse experience to number
    let experience = 0;
    if (profile.total_experience) {
      const match = profile.total_experience.match(/(\d+(\.\d+)?)/);
      if (match) experience = parseFloat(match[0]);
    }

    const app: Application = {
      id: `generated-${Date.now()}`,
      jobId: 'generated-job', // Placeholder or pass actual job ID if available
      status: profile.status || 'New',
      match_score: profile.match_score ? parseFloat(profile.match_score) : 0,
      applied_at: new Date().toISOString(),
      candidate: {
        id: `cand-${Date.now()}`,
        full_name: profile.name || profile.file_name,
        email: profile.email,
        phone: profile.phone_number,
        years_of_experience: experience,
        education: profile.education,
        skills: skillsArray,
        gap_summary: profile.gap_summary,
        matched_skills: profile.matched_skills,
        missing_skills: profile.missing_skills
      },
      timeline: []
    };

    setSelectedApplication(app);
    setActiveTab('candidate-view');
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <JobProvider>
      <Toaster position="top-right" />
      {!user ? (
        <Login />
      ) : (
        <div className="flex min-h-screen bg-[linear-gradient(to_bottom_right,#F9FAFB,#F9FAFB,#EFF6FF)]">
          <Sidebar activeTab={activeTab === 'candidate-view' ? 'candidates' : activeTab} onTabChange={setActiveTab} onOpenKeyExtraction={() => setShowUploadModal(true)} onOpenPostJob={() => setShowPostJobModal(true)} />

          {activeTab === 'jobs' && <Jobs onExtracted={handleExtractedProfile} />}

          {activeTab === 'dashboard'}

          {activeTab === 'candidates' && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-gray-500">Candidates - Coming soon</div>
            </div>
          )}

          {activeTab === 'candidate-view' && selectedApplication && (
            <CandidatePage
              application={selectedApplication}
              onBack={() => setActiveTab('extraction')}
              onUpdateStatus={(newStatus: string) => {
                const candidateEmail = selectedApplication.candidate.email;
                setProfiles(prev => prev.map(p =>
                  p.email === candidateEmail ? { ...p, status: newStatus as any } : p
                ));
                setSelectedApplication(prev => prev ? { ...prev, status: newStatus } : null);
              }}
            />
          )}

          {activeTab === 'interviews' && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-gray-500">Interviews - Coming soon</div>
            </div>
          )}
          {activeTab === 'roles' && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-gray-500">Roles & Permissions - Coming soon</div>
            </div>
          )}
          {activeTab === 'extraction' && (
            <ExtractedProfiles
              profiles={profiles}
              excelFile={excelFile}
              setProfiles={setProfiles}
              onView={handleViewProfile}
            />

          )}

          {showUploadModal && (
            <UploadResumeModal
              jobId=""
              onClose={() => setShowUploadModal(false)}
              onSuccess={() => setShowUploadModal(false)}
              onUploadProgress={() => { }}
              onExtracted={handleExtractedProfile}

            />
          )}

          <AnimatePresence>
            {showPostJobModal && (
              <PostJobModal
                onClose={() => setShowPostJobModal(false)}
                onSuccess={() => {
                  setShowPostJobModal(false);
                  setActiveTab('jobs');
                }}
              />
            )}
          </AnimatePresence>
        </div>
      )}
    </JobProvider>
  );
}

export default App;
