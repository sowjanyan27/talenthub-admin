import { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AddCandidateModalProps {
  jobId: string;
  jobTitle: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddCandidateModal({
  jobId,
  jobTitle,
  onClose,
  onSuccess,
}: AddCandidateModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    skills: '',
    yearsOfExperience: '',
    education: '',
  });

  const calculateMatchScore = (skills: string[], experience: number): number => {
    let score = 50;

    if (experience >= 5) score += 30;
    else if (experience >= 3) score += 20;
    else if (experience >= 1) score += 10;

    if (skills.length >= 3) score += 20;
    else if (skills.length >= 1) score += 10;

    return Math.min(score, 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const skillsArray = formData.skills
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s !== '');

      const { data: existingCandidate } = await supabase
        .from('candidates')
        .select('id')
        .eq('email', formData.email)
        .maybeSingle();

      let candidateId: string;

      if (existingCandidate) {
        candidateId = existingCandidate.id;
      } else {
        const { data: newCandidate, error: candidateError } = await supabase
          .from('candidates')
          .insert({
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone || null,
            skills: skillsArray,
            years_of_experience: parseInt(formData.yearsOfExperience) || 0,
            education: formData.education || null,
          })
          .select()
          .single();

        if (candidateError) throw candidateError;
        candidateId = newCandidate.id;
      }

      const matchScore = calculateMatchScore(
        skillsArray,
        parseInt(formData.yearsOfExperience) || 0
      );

      const { error: applicationError } = await supabase.from('applications').insert({
        job_id: jobId,
        candidate_id: candidateId,
        status: 'screening',
        match_score: matchScore,
      });

      if (applicationError) {
        if (applicationError.message.includes('duplicate')) {
          alert('This candidate has already applied to this job');
        } else {
          throw applicationError;
        }
        return;
      }

      onSuccess();
    } catch (error) {
      console.error('Error adding candidate:', error);
      alert('Failed to add candidate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Add Candidate to {jobTitle}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Enter candidate information. Match score will be calculated automatically.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="John Doe"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills (comma separated)
              </label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="React, TypeScript, Node.js, AWS"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Years of Experience
                </label>
                <input
                  type="number"
                  value={formData.yearsOfExperience}
                  onChange={(e) =>
                    setFormData({ ...formData, yearsOfExperience: e.target.value })
                  }
                  placeholder="5"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Education
                </label>
                <input
                  type="text"
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  placeholder="Bachelor's in Computer Science"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
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
              {loading ? 'Adding...' : 'Add Candidate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
