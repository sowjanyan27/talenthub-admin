import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface PostJobModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Post New Job</h2>
            <p className="text-sm text-gray-600 mt-1">
              Fill in the details for the job posting and configure screening rules
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('details')}
              className={`flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'details'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Job Details
            </button>
            <button
              onClick={() => setActiveTab('screening')}
              className={`flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'screening'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Screening Rules
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {activeTab === 'details' ? (
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Senior Software Engineer"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g., Engineering"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., New York, NY"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employment Type
                  </label>
                  <select
                    value={formData.employmentType}
                    onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the role, responsibilities, and what you're looking for..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Requirements (one per line)
                </label>
                <textarea
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  placeholder="5+ years experience&#10;Strong communication skills&#10;Bachelor's degree or equivalent"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Salary (USD)
                  </label>
                  <input
                    type="number"
                    value={formData.minSalary}
                    onChange={(e) => setFormData({ ...formData, minSalary: e.target.value })}
                    placeholder="80000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Salary (USD)
                  </label>
                  <input
                    type="number"
                    value={formData.maxSalary}
                    onChange={(e) => setFormData({ ...formData, maxSalary: e.target.value })}
                    placeholder="120000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Quick Start</h3>
                <p className="text-sm text-gray-600">Load pre-configured screening rules</p>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Screening Rules</h3>
                  <p className="text-sm text-gray-600">
                    Automatically screen candidates based on job requirements
                  </p>
                </div>
                <button
                  type="button"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center text-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Rule
                </button>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <span className="text-2xl text-gray-400">!</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  No rules configured
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Add screening rules to automate candidate evaluation
                </p>
                <button
                  type="button"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Rule
                </button>
              </div>
            </div>
          )}

          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
