import { Briefcase, LayoutDashboard, Users, Calendar, Shield, LogOut, LayoutGrid, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

// interface SidebarProps {
//   activeTab: string;
//   onTabChange: (tab: string) => void;
// }
interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenKeyExtraction: () => void;
  onOpenPostJob: () => void;
}

export default function Sidebar({ activeTab, onTabChange, onOpenKeyExtraction, onOpenPostJob,
}: SidebarProps) {
  const [open, setOpen] = useState(false)
  const [userData, setUserData] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null)

  const menuItems = [
    // { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    // { id: 'candidates', label: 'Candidates', icon: Users },
    // { id: 'interviews', label: 'Interviews', icon: Calendar },
    // { id: 'roles', label: 'Roles & Permissions', icon: Shield },
  ];

  const { logout } = useAuth();
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0 z-30">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="rounded-xl w-10 h-10 flex items-center justify-center shadow-lg"
            style={{ background: "linear-gradient(to bottom right, #3B82F6, #2563EB)" }}>
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">HireAI</h1>
        </div>
      </div>
      <div className='flex justify-center w-full mt-4'>
        <div className="relative inline-block" ref={dropdownRef}>
          <button
            onClick={() => setOpen(prev => !prev)}
            className="flex items-center gap-2 px-10 py-3 bg-[linear-gradient(to_bottom_right,#ffffff,#f3f4f6)]
          text-[#2563EB] rounded-xl shadow-sm border border-[#eee] hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200
          font-semibold"
          >
            <Plus size={20} />
            New
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute left-full top-0 ml-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
              >
                <ul className="p-2 text-gray-700 font-medium">
                  <li
                    onClick={() => {
                      setOpen(false);          // close dropdown
                      onTabChange('extraction');
                      onOpenKeyExtraction();   // open modal
                    }}
                    className="px-5 py-3 text-[0.98rem] hover:bg-[linear-gradient(to_right,#f8fafc,#eef2f7,#e5eaf1)] rounded-xl cursor-pointer transition-colors"
                  >
                    Key Extraction
                  </li>

                  <li
                    onClick={() => {
                      setOpen(false);        // close dropdown
                      onOpenPostJob();      // open post job modal
                    }}
                    className="px-5 py-3 text-[0.98rem] hover:bg-[linear-gradient(to_right,#f8fafc,#eef2f7,#e5eaf1)] rounded-xl cursor-pointer transition-colors"
                  >
                    Extraction with Matching Score
                  </li>

                </ul>
              </motion.div>
            )}
          </AnimatePresence>
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
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200  ${isActive
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

            <h6 className="font-semibold text-gray-900 capitalize">
              {userData?.full_name || userData?.name || "User"}
            </h6>

            <small>{userData?.user_role || "Admin"}</small>

          </div>
          <button onClick={logout} className="p-2 rounded-md hover:bg-red-50 transition group">
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
