


// export const mockTimeline: any = {
//   'app-1': [
//     {
//       id: '1',
//       type: 'email',
//       title: 'Interview Email Sent',
//       summary: 'Interview invitation sent',
//       date: '10 Jan 2026',
//       data: {
//         subject: 'Interview Invitation',
//         body: 'Hi Sarah,\n\nWe would like to invite you for an interview...'
//       }
//     },
//     {
//   id: '2',
//   type: 'bot_call',
//   title: 'Bot Call Completed',
//   summary: '15 min AI screening call',
//   date: '11 Jan 2026',
//   data: {
//     /* ================= BASIC INFO ================= */
//     duration: '15 mins',
//     summary: 'Discussed React, Hooks, performance optimization, and teamwork',
//     topics: ['React', 'Hooks', 'Performance', 'Team Collaboration'],

//     /* ================= SCORES ================= */
//     overall_score: 20,
//     scores: {
//       technical: 35,
//       behavioral: 25,
//       communication: 30,
//       logical: 10
//     },

//     answer_quality: {
//       clarity: 80,
//       depth: 65,
//       relevance: 78,
//       examples: 60
//     },

//     /* ================= QUESTIONS ================= */
//     questions: [
//       {
//         id: 'q1',
//         question: 'Explain how React useEffect works',
//         category: 'Technical',
//         difficulty: 'Medium',
//         expected_topics: ['Dependencies', 'Cleanup', 'Side effects'],
//         candidate_answer_summary:
//           'Explained basics but missed dependency array edge cases',
//         score: 68,
//         confidence: 0.74,
//         strengths: ['Correct basic explanation'],
//         weaknesses: ['Did not mention cleanup function'],
//         ai_feedback: 'Good fundamentals, needs deeper understanding'
//       },
//       {
//         id: 'q2',
//         question: 'How do you handle conflicts in a team?',
//         category: 'Behavioral',
//         difficulty: 'Easy',
//         candidate_answer_summary:
//           'Generic answer without real examples',
//         score: 52,
//         confidence: 0.61,
//         ai_feedback: 'Needs concrete real-world examples'
//       },
//       {
//         id: 'q3',
//         question: 'How would you optimize a slow React page?',
//         category: 'Problem Solving',
//         difficulty: 'Hard',
//         candidate_answer_summary:
//           'Mentioned memoization and lazy loading',
//         score: 75,
//         confidence: 0.82,
//         strengths: ['Good practical approach'],
//         ai_feedback: 'Strong performance awareness'
//       }
//     ],

//     question_metrics: {
//       average_response_time_sec: 18,
//       hesitation_questions: ['q1'],
//       follow_up_questions_asked: 2,
//       interruptions: 0
//     },

//     /* ================= IMPROVEMENTS ================= */
//     areas_of_improvement: [
//       {
//         area: 'Logical Reasoning',
//         severity: 'High',
//         evidence: [
//           'Struggled with optimization question',
//           'Long pauses before answers'
//         ],
//         impacted_questions: ['q3'],
//         recommendation:
//           'Practice structured problem-solving and logical reasoning exercises',
//         hiring_impact:
//           'May struggle with real-time debugging and complex logic'
//       },
//       {
//         area: 'System Design Basics',
//         severity: 'Medium',
//         evidence: [
//           'Did not discuss scalability',
//           'Missed trade-offs discussion'
//         ],
//         impacted_questions: ['q1'],
//         recommendation:
//           'Review frontend architecture and scalability concepts',
//         hiring_impact:
//           'Needs guidance while designing scalable features'
//       },
//       {
//         area: 'Behavioral Examples',
//         severity: 'Low',
//         evidence: ['Answers lacked concrete examples'],
//         impacted_questions: ['q2'],
//         recommendation:
//           'Use STAR method for behavioral answers',
//         hiring_impact:
//           'Minor risk in stakeholder communication'
//       }
//     ],

//     /* ================= STRENGTHS / WEAKNESSES ================= */
//     strengths: [
//       'Clear and confident communication',
//       'Strong React fundamentals',
//       'Good performance optimization awareness'
//     ],

//     weaknesses: [
//       'Limited system design depth',
//       'Inconsistent logical reasoning'
//     ],

//     /* ================= RISK FLAGS ================= */
//     risk_flags: [
//       {
//         type: 'Knowledge Gap',
//         message: 'Missed cleanup concept in useEffect'
//       }
//     ],

//     /* ================= SKILLS ================= */
//     detected_skills: [
//       { skill: 'React', confidence: 0.92 },
//       { skill: 'Hooks', confidence: 0.85 },
//       { skill: 'Performance Optimization', confidence: 0.48 }
//     ],

//     /* ================= JD ALIGNMENT ================= */
//     jd_alignment: {
//       overall_match: 68,
//       matched_skills: ['React', 'Hooks'],
//       missing_skills: ['Testing', 'System Design']
//     },

//     /* ================= AI VERDICT ================= */
//     ai_verdict: {
//       decision: 'Proceed',
//       confidence: 0.81,
//       reasoning: [
//         'Strong communication skills',
//         'Meets frontend expectations',
//         'Logical depth can be improved'
//       ]
//     },

//     /* ================= HIRING READINESS ================= */
//     hiring_readiness: {
//       level: 'Good',
//       next_round: 'Technical Interview',
//       estimated_training_weeks: 4
//     }
//   }
// },

//     {
//       id: '3',
//       type: 'screening',
//       title: 'Screening Passed',
//       summary: 'Rule-based screening',
//       date: '12 Jan 2026',
//       data: {
//         rules: [
//           { rule: 'Experience ≥ 3 years', result: 'pass' },
//           { rule: 'React skill', result: 'pass' },
//           { rule: 'Notice period ≤ 30 days', result: 'fail' }
//         ]
//       }
//     },
//     {
//       id: '4',
//       type: 'ranking',
//       title: 'Ranked #2',
//       summary: 'Top candidate shortlist',
//       date: '13 Jan 2026',
//       data: {
//         rank: 2,
//         total: 18,
//         reason: 'Strong frontend skills, slight notice period issue'
//       }
//     }
//   ],
//     'app-2': [
//     {
//       id: 'r-1',
//       type: 'rejection',
//       title: 'Application Rejected',
//       date: '12 Jan 2026',
//       data: {
//         reason: 'Did not meet minimum experience requirements',
//       },
//     },
//   ],
// };
// export const mockTimeline: Record<string, any[]> = {
//   'app-1': [
//     {
//       id: '1',
//       stage: 'profile_uploaded',
//       type: 'system',
//       title: 'Profile Uploaded',
//       status: 'completed',
//       date: '10 Jan 2026',
//       data: {
//         file: 'Rahul_Sharma_Resume.pdf',
//       },
//     },

//     {
//       id: '2',
//       stage: 'matching_completed',
//       type: 'system',
//       title: 'Profile Matched with JD',
//       status: 'completed',
//       date: '10 Jan 2026',
//       data: {
//         match_score: 82,
//         matched_skills: ['React', 'TypeScript'],
//         missing_skills: ['Testing'],
//       },
//     },

//     {
//       id: '3',
//       stage: 'email_sent',
//       type: 'email',
//       title: 'Interview Email Sent',
//       status: 'completed',
//       date: '10 Jan 2026',
//       data: {
//         subject: 'Interview Invitation',
//         to: 'rahul@gmail.com',
//         body: 'Please attend AI interview',
//       },
//     },

//     {
//       id: '4',
//       stage: 'bot_call_scheduled',
//       type: 'bot_call',
//       title: 'AI Screening Scheduled',
//       status: 'completed',
//       date: '11 Jan 2026',
//       data: {
//         scheduled_at: '11 Jan 2026 3:00 PM',
//         duration: '15 mins',
//       },
//     },

//     {
//       id: '5',
//       stage: 'bot_call_completed',
//       type: 'bot_call',
//       title: 'AI Screening Completed',
//       status: 'completed',
//       date: '11 Jan 2026',
//       data: {
//         score: 68,
//         verdict: 'Proceed',
//       },
//     },

//     {
//       id: '6',
//       stage: 'conference_scheduled',
//       type: 'bot_call',
//       title: 'Technical Interview Scheduled',
//       status: 'pending',
//       data: {
//         scheduled_at: '15 Jan 2026 11:00 AM',
//       },
//     },
//     {
//   id: '7',
//   stage: 'rejected',
//   type: 'system',
//   title: 'Candidate Rejected',
//   date: '15 Jan 2026',
//   data: {
//     reason: 'Low technical depth in Azure',
//     rejected_by: 'Hiring Manager',
//     rejected_at: '15 Jan 2026, 4:30 PM',
//     feedback: [
//       'Limited hands-on Azure experience',
//       'No event-driven architecture exposure',
//       'Real-time sync concepts not clear'
//     ]
//   }
// }

//   ],
// };


export const mockTimeline: Record<string, any[]> = {
  /* ================= APP 1 – STRONG CANDIDATE ================= */
  'app-1': [
    {
      id: '1',
      stage: 'profile_uploaded',
      type: 'system',
      title: 'Profile Uploaded',
      status: 'completed',
      date: '10 Jan 2026',
      data: { file: 'Rahul_Resume.pdf' },
    },
    {
      id: '2',
      stage: 'matching_completed',
      type: 'system',
      title: 'JD Matching Completed',
      status: 'completed',
      date: '10 Jan 2026',
      data: {
        match_score: 82,
        matched_skills: ['React', 'TypeScript'],
        missing_skills: ['Testing'],
      },
    },
    {
      id: '3',
      stage: 'email_sent',
      type: 'email',
      title: 'Interview Email Sent',
      status: 'completed',
      date: '11 Jan 2026',
      data: {
        to: 'rahul@gmail.com',
        subject: 'Interview Invitation',
        body: 'Please attend AI interview.',
      },
    },
    {
      id: '4',
      stage: 'bot_call_completed',
      type: 'bot_call',
      title: 'AI Screening Completed',
      status: 'completed',
      date: '12 Jan 2026',
      data: {
        duration: '20 mins',
        score: 78,
        verdict: 'Proceed',
      },
    },
  ],

  /* ================= APP 2 – AUTO REJECT (LOW MATCH) ================= */
  'app-2': [
    {
      id: '1',
      stage: 'profile_uploaded',
      type: 'system',
      title: 'Profile Uploaded',
      status: 'completed',
      date: '12 Jan 2026',
      data: { file: 'Anita_Resume.pdf' },
    },
    {
      id: '2',
      stage: 'matching_completed',
      type: 'system',
      title: 'JD Matching Completed',
      status: 'completed',
      date: '12 Jan 2026',
      data: {
        match_score: 48,
        matched_skills: ['CSS'],
        missing_skills: ['React', 'TypeScript'],
      },
    },
    {
      id: '3',
      stage: 'rejected',
      type: 'system',
      title: 'Candidate Rejected',
      date: '12 Jan 2026',
      data: {
        reason: 'Low JD match score',
        rejected_by: 'System',
        rejected_at: '12 Jan 2026, 2:15 PM',
        feedback: [
          'Core frontend skills missing',
          'React experience not found',
        ],
      },
    },
  ],

  /* ================= APP 3 – INTERVIEW SCHEDULED ================= */
  'app-3': [
    {
      id: '1',
      stage: 'profile_uploaded',
      type: 'system',
      title: 'Profile Uploaded',
      status: 'completed',
      date: '13 Jan 2026',
      data: { file: 'Vikram_Resume.pdf' },
    },
    {
      id: '2',
      stage: 'matching_completed',
      type: 'system',
      title: 'JD Matching Completed',
      status: 'completed',
      date: '13 Jan 2026',
      data: {
        match_score: 65,
        matched_skills: ['Node.js'],
        missing_skills: ['System Design'],
      },
    },
    {
      id: '3',
      stage: 'conference_scheduled',
      type: 'bot_call',
      title: 'Technical Interview Scheduled',
      status: 'pending',
      date: '15 Jan 2026',
      data: {
        scheduled_at: '15 Jan 2026 11:00 AM',
      },
    },
  ],

  /* ================= APP 4 – CLOUD REJECT ================= */
  'app-4': [
    {
      id: '1',
      stage: 'profile_uploaded',
      type: 'system',
      title: 'Profile Uploaded',
      status: 'completed',
      date: '14 Jan 2026',
      data: { file: 'Neha_Resume.pdf' },
    },
    {
      id: '2',
      stage: 'matching_completed',
      type: 'system',
      title: 'JD Matching Completed',
      status: 'completed',
      date: '14 Jan 2026',
      data: {
        match_score: 35,
        matched_skills: ['Docker'],
        missing_skills: ['Azure', 'Terraform'],
      },
    },
    {
      id: '3',
      stage: 'rejected',
      type: 'system',
      title: 'Candidate Rejected',
      date: '14 Jan 2026',
      data: {
        reason: 'Azure skills missing',
        rejected_by: 'Hiring Manager',
        rejected_at: '14 Jan 2026, 5:00 PM',
        feedback: [
          'Worked only on AWS',
          'No Azure hands-on',
          'Infra automation missing',
        ],
      },
    },
  ],
  'app-5': [
    {
      id: '1',
      stage: 'profile_uploaded',
      type: 'system',
      title: 'Profile Uploaded',
      date: '14 Jan 2026',
       data: {
        file: 'Rahul_Sharma_Resume.pdf',
      },
    },
    {
      id: '2',
      stage: 'matching_completed',
      type: 'system',
      title: 'JD Matching Completed',
      date: '14 Jan 2026',
      data: { match_score: 88 },
    },
    {
      id: '3',
      stage: 'bot_call_completed',
      type: 'bot_call',
      title: 'AI Screening Completed',
      date: '15 Jan 2026',
      data: {
        duration: '25 mins',
        score: 85,
        verdict: 'Passed',
        questions: [
          { question: 'Explain React reconciliation', score: 9 },
          { question: 'Node.js event loop', score: 8 },
          { question: 'Design URL shortener', score: 8 },
        ],
      },
    },
    {
      id: '4',
      stage: 'technical_interview',
      type: 'interview',
      title: 'Technical Interview Completed',
      date: '16 Jan 2026',
      data: {
        interviewer: 'Senior Engineer',
        questions: [
          'System design – scalable APIs',
          'Database indexing',
          'React performance optimization',
        ],
        score: 8.5,
        feedback: 'Strong system design skills',
      },
    },
  ],
  'app-6': [
    {
      id: '1',
      stage: 'profile_uploaded',
      type: 'system',
      title: 'Profile Uploaded',
      date: '14 Jan 2026',
      data: { file: 'Pooja.pdf' },
    },
    {
      id: '2',
      stage: 'bot_call_failed',
      type: 'bot_call',
      title: 'AI Screening Failed',
      date: '14 Jan 2026',
      data: {
        score: 42,
        failed_topics: ['System Design', 'Async JS'],
        verdict: 'Rejected',
      },
    },
  ],
  'app-7': [
    {
      id: '1',
      stage: 'profile_uploaded',
      type: 'system',
      title: 'Profile Uploaded',
      date: '15 Jan 2026',
       data: { file: 'Sandeep.docx' },
    },
    {
      id: '2',
      stage: 'bot_call_completed',
      type: 'bot_call',
      title: 'AI Screening Completed',
      date: '16 Jan 2026',
      data: {
        score: 74,
        verdict: 'Proceed',
      },
    },
    {
      id: '3',
      stage: 'hr_round',
      type: 'interview',
      title: 'HR Discussion Completed',
      date: '17 Jan 2026',
      data: {
        discussed: ['Salary', 'Notice period', 'Work culture'],
        feedback: 'Positive attitude',
      },
    },
  ],
  'app-8': [
    {
      id: '1',
      stage: 'profile_uploaded',
      type: 'system',
      title: 'Profile Uploaded',
      status: 'completed',
      date: '10 Jan 2026',
      data: {
        file: 'Rahul_Sharma_Resume.pdf',
      },
    },

    {
      id: '2',
      stage: 'matching_completed',
      type: 'system',
      title: 'Profile Matched with JD',
      status: 'completed',
      date: '10 Jan 2026',
      data: {
        match_score: 82,
        matched_skills: ['React', 'TypeScript'],
        missing_skills: ['Testing'],
      },
    },

    {
      id: '3',
      stage: 'email_sent',
      type: 'email',
      title: 'Interview Email Sent',
      status: 'completed',
      date: '10 Jan 2026',
      data: {
        subject: 'Interview Invitation',
        to: 'rahul@gmail.com',
        body: 'Please attend AI interview',
      },
    },

    {
      id: '4',
      stage: 'bot_call_scheduled',
      type: 'bot_call',
      title: 'AI Screening Scheduled',
      status: 'completed',
      date: '11 Jan 2026',
      data: {
        scheduled_at: '11 Jan 2026 3:00 PM',
        duration: '15 mins',
      },
    },

    // {
    //   id: '5',
    //   stage: 'bot_call_completed',
    //   type: 'bot_call',
    //   title: 'AI Screening Completed',
    //   status: 'completed',
    //   date: '11 Jan 2026',
    //   data: {
    //     score: 68,
    //     verdict: 'Proceed',
    //   },
    // },
        {
  id: '5',
  stage: 'bot_call_completed',
  type: 'bot_call',
  status: 'completed',
  title: 'Bot Call Completed',
  summary: '15 min AI screening call',
  date: '11 Jan 2026',
  data: {
    /* ================= BASIC INFO ================= */
    duration: '15 mins',
    summary: 'Discussed React, Hooks, performance optimization, and teamwork',
    topics: ['React', 'Hooks', 'Performance', 'Team Collaboration'],

    /* ================= SCORES ================= */
    overall_score: 20,
    scores: {
      technical: 35,
      behavioral: 25,
      communication: 30,
      logical: 10
    },

    answer_quality: {
      clarity: 80,
      depth: 65,
      relevance: 78,
      examples: 60
    },

    /* ================= QUESTIONS ================= */
    questions: [
      {
        id: 'q1',
        question: 'Explain how React useEffect works',
        category: 'Technical',
        difficulty: 'Medium',
        expected_topics: ['Dependencies', 'Cleanup', 'Side effects'],
        candidate_answer_summary:
          'Explained basics but missed dependency array edge cases',
        score: 68,
        confidence: 0.74,
        strengths: ['Correct basic explanation'],
        weaknesses: ['Did not mention cleanup function'],
        ai_feedback: 'Good fundamentals, needs deeper understanding'
      },
      {
        id: 'q2',
        question: 'How do you handle conflicts in a team?',
        category: 'Behavioral',
        difficulty: 'Easy',
        candidate_answer_summary:
          'Generic answer without real examples',
        score: 52,
        confidence: 0.61,
        ai_feedback: 'Needs concrete real-world examples'
      },
      {
        id: 'q3',
        question: 'How would you optimize a slow React page?',
        category: 'Problem Solving',
        difficulty: 'Hard',
        candidate_answer_summary:
          'Mentioned memoization and lazy loading',
        score: 75,
        confidence: 0.82,
        strengths: ['Good practical approach'],
        ai_feedback: 'Strong performance awareness'
      }
    ],

    question_metrics: {
      average_response_time_sec: 18,
      hesitation_questions: ['q1'],
      follow_up_questions_asked: 2,
      interruptions: 0
    },

    /* ================= IMPROVEMENTS ================= */
    areas_of_improvement: [
      {
        area: 'Logical Reasoning',
        severity: 'High',
        evidence: [
          'Struggled with optimization question',
          'Long pauses before answers'
        ],
        impacted_questions: ['q3'],
        recommendation:
          'Practice structured problem-solving and logical reasoning exercises',
        hiring_impact:
          'May struggle with real-time debugging and complex logic'
      },
      {
        area: 'System Design Basics',
        severity: 'Medium',
        evidence: [
          'Did not discuss scalability',
          'Missed trade-offs discussion'
        ],
        impacted_questions: ['q1'],
        recommendation:
          'Review frontend architecture and scalability concepts',
        hiring_impact:
          'Needs guidance while designing scalable features'
      },
      {
        area: 'Behavioral Examples',
        severity: 'Low',
        evidence: ['Answers lacked concrete examples'],
        impacted_questions: ['q2'],
        recommendation:
          'Use STAR method for behavioral answers',
        hiring_impact:
          'Minor risk in stakeholder communication'
      }
    ],

    /* ================= STRENGTHS / WEAKNESSES ================= */
    strengths: [
      'Clear and confident communication',
      'Strong React fundamentals',
      'Good performance optimization awareness'
    ],

    weaknesses: [
      'Limited system design depth',
      'Inconsistent logical reasoning'
    ],

    /* ================= RISK FLAGS ================= */
    risk_flags: [
      {
        type: 'Knowledge Gap',
        message: 'Missed cleanup concept in useEffect'
      }
    ],

    /* ================= SKILLS ================= */
    detected_skills: [
      { skill: 'React', confidence: 0.92 },
      { skill: 'Hooks', confidence: 0.85 },
      { skill: 'Performance Optimization', confidence: 0.48 }
    ],

    /* ================= JD ALIGNMENT ================= */
    jd_alignment: {
      overall_match: 68,
      matched_skills: ['React', 'Hooks'],
      missing_skills: ['Testing', 'System Design']
    },

    /* ================= AI VERDICT ================= */
    ai_verdict: {
      decision: 'Proceed',
      confidence: 0.81,
      reasoning: [
        'Strong communication skills',
        'Meets frontend expectations',
        'Logical depth can be improved'
      ]
    },

    /* ================= HIRING READINESS ================= */
    hiring_readiness: {
      level: 'Good',
      next_round: 'Technical Interview',
      estimated_training_weeks: 4
    }
  }
},

    {
      id: '6',
      stage: 'conference_scheduled',
      type: 'bot_call',
      title: 'Technical Interview Scheduled',
      status: 'pending',
      data: {
        scheduled_at: '15 Jan 2026 11:00 AM',
      },
    },
    // {
    //   id: '7',
    //   stage: 'rejected',
    //   type: 'system',
    //   title: 'Candidate Rejected',
    //   date: '15 Jan 2026',
    //   data: {
    //     reason: 'Low technical depth in Azure',
    //     rejected_by: 'Hiring Manager',
    //     rejected_at: '15 Jan 2026, 4:30 PM',
    //     feedback: [
    //       'Limited hands-on Azure experience',
    //       'No event-driven architecture exposure',
    //       'Real-time sync concepts not clear'
    //     ]
    //   }
    // }

  ],
};
