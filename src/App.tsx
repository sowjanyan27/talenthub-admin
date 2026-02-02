import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Jobs from './pages/Jobs';
import Sidebar from './components/Sidebar';
import { Toaster } from 'react-hot-toast';
import TaskNotificationsPaging from './pages/Dashboard';
import UploadResumeModal from './components/UploadResumeModal';
import ExtractedProfiles from './components/ExtractedProfiles';


function App() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('jobs');
const [showUploadModal, setShowUploadModal] = useState(false);
const [profiles, setProfiles] = useState<any[]>([]);

const handleExtractedProfile = (newProfiles: any[]) => {
  setProfiles(prev => [...prev, ...newProfiles]); // 🔥 SPREAD, not push
  setActiveTab('extraction');
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="flex min-h-screen bg-[linear-gradient(to_bottom_right,#F9FAFB,#F9FAFB,#EFF6FF)]">
      <Toaster position="top-right" />
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onOpenKeyExtraction={() => setShowUploadModal(true)} />
      {/* {activeTab === 'jobs' && <Jobs />} */}
    
      {/* {activeTab === 'dashboard' &&< (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Dashboard - Coming soon</div>
        </div>
      )} */}
      {activeTab === 'dashboard'}
      {activeTab === 'candidates' && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Candidates - Coming soon</div>
        </div>
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
  <ExtractedProfiles profiles={profiles} />
)}

      {showUploadModal && (
  <UploadResumeModal
    jobId=""
    onClose={() => setShowUploadModal(false)}
    onSuccess={() => setShowUploadModal(false)}
    onUploadProgress={() => {}}
    onExtracted={handleExtractedProfile}

  />
)}

    </div>
  );
}

export default App;
