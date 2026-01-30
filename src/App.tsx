import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Jobs from './pages/Jobs';
import Sidebar from './components/Sidebar';
import { Toaster } from 'react-hot-toast';
import TaskNotificationsPaging from './pages/Dashboard';

function App() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('jobs');

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
    <div className="flex h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'jobs' && <Jobs />}
      {/* {activeTab === 'dashboard' &&< (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Dashboard - Coming soon</div>
        </div>
      )} */}
      {activeTab === 'dashboard'&& <TaskNotificationsPaging/>}
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
    </div>
  );
}

export default App;
