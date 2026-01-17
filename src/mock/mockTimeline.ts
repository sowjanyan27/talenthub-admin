


export const mockTimeline: any = {
  'app-1': [
    {
      id: '1',
      type: 'email',
      title: 'Interview Email Sent',
      summary: 'Interview invitation sent',
      date: '10 Jan 2026',
      data: {
        subject: 'Interview Invitation',
        body: 'Hi Sarah,\n\nWe would like to invite you for an interview...'
      }
    },
    {
      id: '2',
      type: 'bot_call',
      title: 'Bot Call Completed',
      summary: '15 min AI screening call',
      date: '11 Jan 2026',
      data: {
        summary: 'Discussed React, state management, hooks',
        topics: ['React', 'Hooks', 'Performance']
      }
    },
    {
      id: '3',
      type: 'screening',
      title: 'Screening Passed',
      summary: 'Rule-based screening',
      date: '12 Jan 2026',
      data: {
        rules: [
          { rule: 'Experience ≥ 3 years', result: 'pass' },
          { rule: 'React skill', result: 'pass' },
          { rule: 'Notice period ≤ 30 days', result: 'fail' }
        ]
      }
    },
    {
      id: '4',
      type: 'ranking',
      title: 'Ranked #2',
      summary: 'Top candidate shortlist',
      date: '13 Jan 2026',
      data: {
        rank: 2,
        total: 18,
        reason: 'Strong frontend skills, slight notice period issue'
      }
    }
  ],
    'app-2': [
    {
      id: 'r-1',
      type: 'rejection',
      title: 'Application Rejected',
      date: '12 Jan 2026',
      data: {
        reason: 'Did not meet minimum experience requirements',
      },
    },
  ],
};
