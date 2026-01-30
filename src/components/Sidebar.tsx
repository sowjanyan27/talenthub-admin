import { Briefcase, LayoutDashboard, Users, Calendar, Shield, LogOut, LayoutGrid } from 'lucide-react';
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
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0 z-30">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="rounded-xl w-10 h-10 flex items-center justify-center shadow-lg"
          style={{background: "linear-gradient(to bottom right, #3B82F6, #2563EB)"}}>
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
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200  ${
                isActive
                  ? 'bg-[linear-gradient(to_bottom_right,#3B82F6,#2563EB)] text-white shadow-lg shadow-blue-500/30'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className='p-4 border-t border-gray-200'>
        <div className='flex items-center justify-between'>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-400 flex items-center justify-center overflow-hidden">
              <img
                src="https://api.dicebear.com/7.x/adventurer/svg?seed=John"
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h6 className="font-semibold text-gray-900 capitalize">{profile?.full_name || 'User'}</h6>
              {/* <p className='text-sm'>{profile?.email}</p> */}
              <small>{profile?.role}</small>
            </div>
          </div>
          <button  onClick={signOut} className="p-2 rounded-md hover:bg-red-50 transition group">
            <LogOut className="w-5 h-5 text-gray-700 group-hover:text-red-600" />
          </button>
        </div>  
      </div>

      {/* <div className="p-4 border-t border-gray-200">
        <div className="mb-4">
          <div className="text-sm font-semibold text-gray-900">
            
          </div>
          <div className="text-xs text-gray-500"></div>
          <div className="text-xs text-blue-600 font-medium mt-1"></div>
        </div>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div> */}
    </div>
  );
}
