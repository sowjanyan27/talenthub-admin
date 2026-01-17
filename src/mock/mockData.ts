export const mockJob = {
  id: 'job-1',
  title: 'Frontend Developer',
  department: 'Engineering',
  location: 'Bangalore',
  status: 'active',
  experience_required: 3,
  description: 'We are looking for a React developer...',
};

export const mockApplications = [
  {
    id: 'app-1',
    status: 'interview',
    match_score: 82,
    applied_at: '2025-01-10T10:30:00Z',
    candidate: {
      id: 'cand-1',
      full_name: 'Rahul Sharma',
      email: 'rahul@gmail.com',
      phone: '9876543210',
      years_of_experience: 4,
      education: 'B.Tech Computer Science',
      skills: ['React', 'TypeScript', 'CSS', 'Node.js'],
    },
  },
  {
    id: 'app-2',
    status: 'rejected',
    match_score: 55,
    applied_at: '2025-01-12T11:15:00Z',
    candidate: {
      id: 'cand-2',
      full_name: 'Anita Verma',
      email: 'anita@gmail.com',
      phone: null,
      years_of_experience: 2,
      education: 'MCA',
      skills: ['JavaScript', 'HTML', 'CSS'],
    },
  },
];
