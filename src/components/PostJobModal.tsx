import { useState } from 'react';
import { X, Plus, ChevronDown, TriangleAlert } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

interface PostJobModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

const drawerVariants: Variants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    x: "100%",
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

export default function PostJobModal({ onClose, onSuccess }: PostJobModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'screening'>('details');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    employmentType: 'Full Time',
    status: 'draft',
    description: '',
    requirements: '',
    minSalary: '',
    maxSalary: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const requirementsArray = formData.requirements
        .split('\n')
        .filter((req) => req.trim() !== '')
        .map((req) => req.trim());

      const { error } = await supabase.from('jobs').insert({
        title: formData.title,
        department: formData.department,
        location: formData.location,
        employment_type: formData.employmentType,
        status: formData.status,
        description: formData.description,
        requirements: requirementsArray,
        min_salary: formData.minSalary ? parseInt(formData.minSalary) : null,
        max_salary: formData.maxSalary ? parseInt(formData.maxSalary) : null,
        created_by: user?.id,
      });

      if (error) throw error;
      onSuccess();
    } catch (error) {
      console.error('Error creating job:', error);
      alert('Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <motion.div
      className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 transition-opacity duration-300"
      onClick={onClose}
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    />
      <motion.div variants={drawerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className='flex flex-col items-start justify-start'>
            <h2 className="text-2xl font-bold text-gray-900 mb-1.5">Post New Job</h2>
            <p className="text-sm text-gray-600">
              Fill in the details for the job posting and configure screening rules
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="border-b border-[#ddd] pb-1">
          <div className="flex gap-3 m-2 mt-3">
            <button
              onClick={() => setActiveTab('details')}
              className={`flex-1 px-6 py-3 text-[0.92rem] font-medium rounded-3xl transition-colors ${
                activeTab === 'details'
                  ? 'bg-[linear-gradient(to_right,#3B82F6,#2563EB)] text-white'
                  : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
              }`}
            >
              Job Details
            </button>
            <button
              onClick={() => setActiveTab('screening')}
              className={`flex-1 px-6 py-3 text-[0.92rem] font-medium rounded-3xl transition-colors ${
                activeTab === 'screening'
                  ? 'bg-[linear-gradient(to_right,#3B82F6,#2563EB)] text-white'
                  : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
              }`}
            >
              Screening Rules
            </button>
          </div>
        </div>
        
          <form onSubmit={handleSubmit}>
            <div className="overflow-y-auto max-h-[62vh] thin-scrollbar">
              {activeTab === 'details' ? (
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-[0.92rem] font-semibold text-gray-700 mb-2">
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Senior Software Engineer"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 
                      focus:border-transparent transition-all duration-200 outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[0.92rem] font-semibold text-gray-700 mb-2">
                        Department
                      </label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        placeholder="e.g., Engineering"
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 
                        focus:border-transparent transition-all duration-200 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[0.92rem] font-semibold text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g., New York, NY"
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 
                        focus:border-transparent transition-all duration-200 outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[0.92rem] font-semibold text-gray-700 mb-2">
                        Employment Type
                      </label>
                      <div className='relative block'>
                        <select
                          value={formData.employmentType}
                          onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                          className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 
                          focus:border-transparent transition-all duration-200 outline-none bg-white appearance-none"
                        >
                          <option value="Full Time">Full Time</option>
                          <option value="Part Time">Part Time</option>
                          <option value="Contract">Contract</option>
                          <option value="Internship">Internship</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                          <ChevronDown size={20} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[0.92rem] font-semibold text-gray-700 mb-2">
                        Status
                      </label>
                      <div className='relative block'>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 
                          focus:border-transparent transition-all duration-200 outline-none bg-white appearance-none"
                        >
                          <option value="draft">Draft</option>
                          <option value="active">Active</option>
                          <option value="closed">Closed</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                          <ChevronDown size={20} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[0.92rem] font-semibold text-gray-700 mb-2">
                      Job Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe the role, responsibilities, and what you're looking for..."
                      rows={4}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 
                        focus:border-transparent transition-all duration-200 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[0.92rem] font-semibold text-gray-700 mb-2">
                      Requirements (one per line)
                    </label>
                    <textarea
                      value={formData.requirements}
                      onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                      placeholder="5+ years experience&#10;Strong communication skills&#10;Bachelor's degree or equivalent"
                      rows={4}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 
                        focus:border-transparent transition-all duration-200 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[0.92rem] font-semibold text-gray-700 mb-2">
                        Minimum Salary (USD)
                      </label>
                      <input
                        type="number"
                        value={formData.minSalary}
                        onChange={(e) => setFormData({ ...formData, minSalary: e.target.value })}
                        placeholder="80000"
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 
                        focus:border-transparent transition-all duration-200 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[0.92rem] font-semibold text-gray-700 mb-2">
                        Maximum Salary (USD)
                      </label>
                      <input
                        type="number"
                        value={formData.maxSalary}
                        onChange={(e) => setFormData({ ...formData, maxSalary: e.target.value })}
                        placeholder="120000"
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 
                        focus:border-transparent transition-all duration-200 outline-none"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <div className="bg-green-50 border-2 border-dashed border-[#1db555] rounded-lg p-3 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-1">Quick Start</h3>
                    <p className="text-sm text-gray-600">Load pre-configured screening rules</p>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Screening Rules</h3>
                      <p className="text-sm text-gray-600">
                        Automatically screen candidates based on job requirements
                      </p>
                    </div>
                    <button
                      type="button"
                      className="flex items-center gap-2 px-3.5 py-2 text-[0.90rem] bg-[linear-gradient(to_right,#22C55E,#16A34A)]
                      text-white rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-all duration-200 font-normal"
                    >
                      <Plus className="w-5 h-5" />
                      Add Rule
                    </button>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center bg-gray-50">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl text-gray-400"><TriangleAlert size={24} /></span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-1">
                      No rules configured
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Add screening rules to automate candidate evaluation
                    </p>
                    <button type="button"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[linear-gradient(to_right,#3B82F6,#2563EB)]
                      text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 font-medium"
                    >
                      <Plus size={20} />
                      Create First Rule
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className=" bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-5 py-2.5 bg-[linear-gradient(to_right,#3B82F6,#2563EB)] text-white rounded-xl hover:shadow-lg 
                hover:shadow-blue-500/30 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Job'}
              </button>
            </div>
          </form>
        
      </motion.div>
    </div>
  );
}
