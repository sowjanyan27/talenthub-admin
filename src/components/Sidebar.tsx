import { Briefcase, LayoutDashboard, Users, Calendar, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { profile, signOut } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'candidates', label: 'Candidates', icon: Users },
    { id: 'interviews', label: 'Interviews', icon: Calendar },
    { id: 'roles', label: 'Roles & Permissions', icon: Shield },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="bg-blue-600 rounded-lg p-2 mr-3">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">HireAI</h1>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="mb-4">
          <div className="text-sm font-semibold text-gray-900">
            {profile?.full_name || 'User'}
          </div>
          <div className="text-xs text-gray-500">{profile?.email}</div>
          <div className="text-xs text-blue-600 font-medium mt-1">{profile?.role}</div>
        </div>
        <button
          onClick={signOut}
          className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
