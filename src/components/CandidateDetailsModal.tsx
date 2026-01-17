// import { X, FileText, Mail, Phone, Briefcase, GraduationCap } from 'lucide-react';
// import { useState, useEffect } from 'react';
// import { supabase } from '../lib/supabase';

// interface Props {
//   application: any;
//   onClose: () => void;
// }

// export default function CandidateDetailsModal({ application, onClose }: Props) {
//   const [activeTab, setActiveTab] =
//     useState<'overview' | 'resume' | 'bot' | 'call'>('overview');

//   const [resumeText, setResumeText] = useState<string>('');
//   const [questions, setQuestions] = useState<any[]>([]);
//   const [transcripts, setTranscripts] = useState<any[]>([]);

//   const candidate = application.candidate;

//   useEffect(() => {
//     loadInterviewData();
//   }, []);

//   const loadInterviewData = async () => {
//     /* Bot Interview Q&A */
//     const { data: qData } = await supabase
//       .from('interview_questions')
//       .select('*')
//       .eq('candidate_id', candidate.id);

//     setQuestions(qData || []);

//     /* Call transcript */
//     const { data: tData } = await supabase
//       .from('call_transcripts')
//       .select('*')
//       .eq('candidate_id', candidate.id)
//       .order('timestamp');

//     setTranscripts(tData || []);

//     /* Resume script (optional parsed text) */
//     const { data: resumeData } = await supabase
//       .from('candidates')
//       .select('resume_text')
//       .eq('id', candidate.id)
//       .single();

//     setResumeText(resumeData?.resume_text || '');
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center p-4">
//       <div className="bg-white rounded-xl w-full max-w-3xl">

//         {/* Header */}
//         <div className="flex justify-between items-start p-6 border-b">
//           <div>
//             <h2 className="text-2xl font-bold">{candidate.full_name}</h2>
//             <p className="text-gray-600 text-sm mt-1">
//               {application.job_title || 'Applied Candidate'}
//             </p>
//           </div>

//           <div className="flex items-center gap-4">
//             <div className="text-green-600 text-xl font-bold">
//               {application.match_score}%
//               <div className="text-xs text-gray-500">Match</div>
//             </div>

//             <button onClick={onClose}>
//               <X className="w-5 h-5 text-gray-400" />
//             </button>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="flex border-b px-6">
//           {['overview', 'resume', 'bot', 'call'].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab as any)}
//               className={`px-4 py-3 text-sm font-medium border-b-2 ${
//                 activeTab === tab
//                   ? 'border-blue-600 text-blue-600'
//                   : 'border-transparent text-gray-500'
//               }`}
//             >
//               {tab === 'overview' && 'Overview'}
//               {tab === 'resume' && 'Resume / Script'}
//               {tab === 'bot' && 'Bot Interview'}
//               {tab === 'call' && 'Bot Call'}
//             </button>
//           ))}
//         </div>

//         {/* Content */}
//         <div className="p-6 max-h-[70vh] overflow-y-auto">

//           {/* OVERVIEW */}
//           {activeTab === 'overview' && (
//             <div className="space-y-4 text-sm">
//               <div className="flex items-center">
//                 <Mail className="w-4 h-4 mr-2" />
//                 {candidate.email}
//               </div>

//               {candidate.phone && (
//                 <div className="flex items-center">
//                   <Phone className="w-4 h-4 mr-2" />
//                   {candidate.phone}
//                 </div>
//               )}

//               <div className="flex items-center">
//                 <Briefcase className="w-4 h-4 mr-2" />
//                 {candidate.years_of_experience} years experience
//               </div>

//               {candidate.education && (
//                 <div className="flex items-center">
//                   <GraduationCap className="w-4 h-4 mr-2" />
//                   {candidate.education}
//                 </div>
//               )}

//               {candidate.skills && (
//                 <div className="flex flex-wrap gap-2 mt-4">
//                   {candidate.skills.map((skill: string, i: number) => (
//                     <span
//                       key={i}
//                       className="px-3 py-1 bg-gray-100 rounded-full text-xs"
//                     >
//                       {skill}
//                     </span>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* RESUME / SCRIPT */}
//           {activeTab === 'resume' && (
//             <div className="space-y-4">
//               <h3 className="font-semibold">Parsed Resume</h3>

//               <div className="bg-gray-50 border rounded-lg p-4 text-sm whitespace-pre-line">
//                 {resumeText || 'Resume parsing not available yet.'}
//               </div>

//               {candidate.resume_url && (
//                 <a
//                   href={candidate.resume_url}
//                   target="_blank"
//                   className="inline-flex items-center text-blue-600 text-sm"
//                 >
//                   <FileText className="w-4 h-4 mr-2" />
//                   Download Resume
//                 </a>
//               )}
//             </div>
//           )}

//           {/* BOT INTERVIEW */}
//           {activeTab === 'bot' && (
//             <div className="space-y-5">
//               {questions.length === 0 ? (
//                 <p className="text-gray-500 text-sm">
//                   No bot interview conducted.
//                 </p>
//               ) : (
//                 questions.map((q, index) => (
//                   <div key={q.id} className="border rounded-lg p-4">
//                     <p className="font-medium">
//                       Q{index + 1}. {q.question}
//                     </p>

//                     <p className="text-sm mt-2 bg-gray-50 p-3 rounded">
//                       {q.answer}
//                     </p>

//                     <div className="flex justify-between text-xs text-gray-500 mt-2">
//                       <span>Score: {q.score}%</span>
//                       <span>Confidence: {q.confidence}</span>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           )}

//           {/* BOT CALL */}
//           {activeTab === 'call' && (
//             <div className="space-y-3">
//               {transcripts.length === 0 ? (
//                 <p className="text-gray-500 text-sm">
//                   No bot call available.
//                 </p>
//               ) : (
//                 transcripts.map((t) => (
//                   <div
//                     key={t.id}
//                     className={`max-w-[80%] p-3 rounded-lg text-sm ${
//                       t.speaker === 'bot'
//                         ? 'bg-blue-50 text-blue-900'
//                         : 'bg-gray-100 ml-auto'
//                     }`}
//                   >
//                     {t.text}
//                   </div>
//                 ))
//               )}
//             </div>
//           )}

//         </div>
//       </div>
//     </div>
//   );
// }


// import { X, CheckCircle, XCircle, Phone, Bot } from 'lucide-react';
// import { useEffect, useState } from 'react';
// import { supabase } from '../lib/supabase';

// interface Props {
//   application: any;
//   onClose: () => void;
// }

// export default function CandidateProcessModal({ application, onClose }: Props) {
//   const candidate = application.candidate;

//   const [botInterview, setBotInterview] = useState<any>(null);
//   const [questions, setQuestions] = useState<any[]>([]);

//   useEffect(() => {
//     loadInterviewData();
//   }, []);

//   const loadInterviewData = async () => {
//     // Bot interview session
//     const { data: interview } = await supabase
//       .from('bot_interviews')
//       .select('*')
//       .eq('application_id', application.id)
//       .single();

//     if (interview) {
//       setBotInterview(interview);

//       const { data: qData } = await supabase
//         .from('bot_questions')
//         .select('*')
//         .eq('bot_interview_id', interview.id);

//       setQuestions(qData || []);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-xl w-full max-w-3xl overflow-hidden">

//         {/* HEADER */}
//         <div className="flex justify-between items-start p-6 border-b">
//           <div>
//             <h2 className="text-xl font-bold">{candidate.full_name}</h2>
//             <p className="text-sm text-gray-600">
//               {candidate.email}
//             </p>
//           </div>

//           <button onClick={onClose}>
//             <X className="w-5 h-5 text-gray-400" />
//           </button>
//         </div>

//         {/* BODY */}
//         <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">

//           {/* BASIC INFO */}
//           <Section title="Candidate Overview">
//             <div className="grid grid-cols-2 gap-4 text-sm">
//               <div><strong>Experience:</strong> {candidate.years_of_experience} years</div>
//               <div><strong>Status:</strong> {application.status}</div>
//             </div>
//           </Section>

//           {/* RULE ENGINE */}
//           {application.rule_result && (
//             <Section title="Rule Engine Evaluation">
//               <StatusLine
//                 passed={application.rule_result === 'pass'}
//                 text={
//                   application.rule_result === 'pass'
//                     ? 'Candidate passed rule engine checks'
//                     : 'Candidate failed rule engine checks'
//                 }
//               />

//               <Progress value={application.rule_score} />

//               {application.rule_result === 'fail' && (
//                 <p className="text-sm text-red-600 mt-2">
//                   Candidate rejected by rule engine
//                 </p>
//               )}
//             </Section>
//           )}

//           {/* BOT CALL */}
//           {['bot_call_initiated', 'interview_completed', 'qualified', 'rejected']
//             .includes(application.status) && (
//             <Section title="Bot Call">
//               <div className="flex items-center gap-2 text-sm">
//                 <Phone className="w-4 h-4 text-blue-600" />
//                 <span>
//                   {botInterview?.status === 'completed'
//                     ? 'Bot interview call completed'
//                     : 'Bot interview call initiated'}
//                 </span>
//               </div>
//             </Section>
//           )}

//           {/* INTERVIEW QUESTIONS */}
//           {application.status === 'interview_completed' && (
//             <Section title="Interview Questions & Answers">
//               {questions.map((q, index) => (
//                 <div key={q.id} className="border rounded-lg p-4 mb-3">
//                   <p className="font-medium">
//                     Q{index + 1}. {q.question}
//                   </p>
//                   <p className="mt-2 text-sm bg-gray-50 p-3 rounded">
//                     {q.answer}
//                   </p>
//                   <p className="text-xs text-gray-500 mt-2">
//                     Score: {q.score}%
//                   </p>
//                 </div>
//               ))}
//             </Section>
//           )}

//           {/* FINAL DECISION */}
//           {['qualified', 'rejected'].includes(application.status) && (
//             <Section title="Final Decision">
//               <StatusLine
//                 passed={application.status === 'qualified'}
//                 text={
//                   application.status === 'qualified'
//                     ? 'Candidate Qualified'
//                     : 'Candidate Rejected'
//                 }
//               />

//               {application.status === 'rejected' && (
//                 <p className="text-sm text-gray-600 mt-2">
//                   Candidate did not meet interview or rule criteria.
//                 </p>
//               )}
//             </Section>
//           )}

//         </div>
//       </div>
//     </div>
//   );
// }

// /* -------------------- */
// /* Helper Components */
// /* -------------------- */

// function Section({ title, children }: any) {
//   return (
//     <div className="border rounded-xl p-4">
//       <h3 className="font-semibold text-gray-900 mb-3">{title}</h3>
//       {children}
//     </div>
//   );
// }

// function StatusLine({ passed, text }: { passed: boolean; text: string }) {
//   return (
//     <div className={`flex items-center gap-2 text-sm ${
//       passed ? 'text-green-600' : 'text-red-600'
//     }`}>
//       {passed ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
//       {text}
//     </div>
//   );
// }

// function Progress({ value = 0 }: { value?: number }) {
//   return (
//     <div className="mt-3">
//       <div className="flex justify-between text-xs mb-1">
//         <span>Score</span>
//         <span>{value}%</span>
//       </div>
//       <div className="h-2 bg-gray-200 rounded-full">
//         <div
//           className="h-2 bg-blue-600 rounded-full"
//           style={{ width: `${value}%` }}
//         />
//       </div>
//     </div>
//   );
// }

import { X, Mail, Phone, Briefcase, GraduationCap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Props {
  application: any;
  onClose: () => void;
}

export default function CandidateDetailsModal({ application, onClose }: Props) {
  const candidate = application.candidate;

  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTimeline();
  }, []);

  const loadTimeline = async () => {
    const { data } = await supabase
      .from('candidate_timeline')
      .select('*')
      .eq('application_id', application.id)
      .order('created_at', { ascending: true });

    setEvents(data || []);
    setLoading(false);
  };

  const renderEventDetails = (event: any) => {
    const data = event.payload;

    switch (event.type) {
      case 'email':
        return (
          <>
            <h3 className="font-semibold mb-3">📧 Email Sent</h3>
            <p className="text-sm"><b>To:</b> {data.to}</p>
            <p className="text-sm"><b>Subject:</b> {data.subject}</p>

            <div className="mt-4 bg-gray-50 p-4 rounded text-sm whitespace-pre-line">
              {data.body}
            </div>
          </>
        );

      case 'bot_call':
        return (
          <>
            <h3 className="font-semibold mb-3">🤖 Bot Call Overview</h3>

            <p className="text-sm"><b>Duration:</b> {data.duration}</p>
            <p className="text-sm"><b>Confidence:</b> {data.confidence}</p>

            <p className="mt-3 text-sm">{data.summary}</p>

            <div className="mt-4">
              <b className="text-sm">Topics Discussed</b>
              <ul className="list-disc ml-6 mt-1 text-sm">
                {data.topics.map((t: string) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </>
        );

      case 'screening':
        return (
          <>
            <h3 className="font-semibold mb-3">🧠 Screening Rules</h3>

            <div className="space-y-2">
              {data.rules.map((r: any, i: number) => (
                <div
                  key={i}
                  className="flex justify-between text-sm border-b pb-1"
                >
                  <span>{r.rule}</span>
                  <span
                    className={
                      r.result === 'pass'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }
                  >
                    {r.result.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-4 font-medium text-sm">
              Screening Score: {data.score}%
            </p>
          </>
        );

      case 'ranking':
        return (
          <>
            <h3 className="font-semibold mb-3">🏆 Candidate Ranking</h3>

            <p className="text-sm">
              Ranked <b>#{data.rank}</b> out of {data.total_candidates}
            </p>

            <p className="mt-3 text-sm text-gray-600">{data.reason}</p>
          </>
        );

      default:
        return <p>No data available</p>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-5xl">

        {/* HEADER */}
        <div className="flex justify-between items-start p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold">{candidate.full_name}</h2>
            <p className="text-gray-500 text-sm">
              {application.job_title}
            </p>

            <div className="flex gap-6 mt-3 text-sm text-gray-600">
              <span className="flex items-center">
                <Mail className="w-4 h-4 mr-1" />
                {candidate.email}
              </span>

              {candidate.phone && (
                <span className="flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  {candidate.phone}
                </span>
              )}

              <span className="flex items-center">
                <Briefcase className="w-4 h-4 mr-1" />
                {candidate.years_of_experience} yrs
              </span>

              {candidate.education && (
                <span className="flex items-center">
                  <GraduationCap className="w-4 h-4 mr-1" />
                  {candidate.education}
                </span>
              )}
            </div>
          </div>

          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex h-[70vh]">

          {/* TIMELINE */}
          <div className="w-1/3 border-r p-4 overflow-y-auto">
            <h3 className="font-semibold mb-4">Timeline</h3>

            {loading && <p className="text-sm text-gray-500">Loading...</p>}

            {events.map((event) => (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className={`cursor-pointer p-3 rounded-lg border mb-3 ${
                  selectedEvent?.id === event.id
                    ? 'bg-blue-50 border-blue-500'
                    : 'hover:bg-gray-50'
                }`}
              >
                <p className="font-medium text-sm">{event.title}</p>
                <p className="text-xs text-gray-500">{event.summary}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(event.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* DETAILS */}
          <div className="w-2/3 p-6 overflow-y-auto">
            {!selectedEvent ? (
              <p className="text-gray-500">
                Select a timeline event to view details
              </p>
            ) : (
              renderEventDetails(selectedEvent)
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
