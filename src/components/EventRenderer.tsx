// // export function EventRenderer({ event }: any) {
// //   const data = event.payload;

// //   switch (event.type) {
// //     case 'application':
// //       return (
// //         <>
// //           <h2 className="text-xl font-semibold mb-4">
// //             📄 Application Details
// //           </h2>
// //           <p><b>Source:</b> {data.source}</p>
// //           <p><b>Resume:</b> {data.resume}</p>
// //         </>
// //       );

// //     case 'rule_engine':
// //       return (
// //         <>
// //           <h2 className="text-xl font-semibold mb-4">
// //             ⚙️ Rule Engine Parameters
// //           </h2>
// //           <ul className="list-disc ml-6">
// //             {data.parameters.map((p: string) => (
// //               <li key={p}>{p}</li>
// //             ))}
// //           </ul>
// //         </>
// //       );

// //     case 'screening':
// //       return (
// //         <>
// //           <h2 className="text-xl font-semibold mb-4">
// //             🧠 Screening Result
// //           </h2>
// //           {data.rules.map((r: any, i: number) => (
// //             <div key={i} className="flex justify-between border-b py-2">
// //               <span>{r.rule}</span>
// //               <span
// //                 className={
// //                   r.result === 'pass'
// //                     ? 'text-green-600'
// //                     : 'text-red-600'
// //                 }
// //               >
// //                 {r.result.toUpperCase()}
// //               </span>
// //             </div>
// //           ))}
// //           <p className="mt-4 font-semibold">
// //             Screening Score: {data.score}%
// //           </p>
// //         </>
// //       );

// //     case 'bot_call':
// //       return (
// //         <>
// //           <h2 className="text-xl font-semibold mb-4">
// //             🤖 Bot Call Overview
// //           </h2>
// //           <p><b>Duration:</b> {data.duration}</p>
// //           <p><b>Confidence:</b> {data.confidence}</p>

// //           <p className="mt-3">{data.summary}</p>

// //           <div className="mt-4 space-y-2">
// //             {data.conversation.map((c: any, i: number) => (
// //               <div
// //                 key={i}
// //                 className={`p-3 rounded-lg ${
// //                   c.speaker === 'Bot'
// //                     ? 'bg-blue-50'
// //                     : 'bg-gray-100'
// //                 }`}
// //               >
// //                 <b>{c.speaker}:</b> {c.text}
// //               </div>
// //             ))}
// //           </div>
// //         </>
// //       );

// //     case 'email':
// //       return (
// //         <>
// //           <h2 className="text-xl font-semibold mb-4">
// //             📧 Email Content
// //           </h2>
// //           <p><b>To:</b> {data.to}</p>
// //           <p><b>Subject:</b> {data.subject}</p>
// //           <div className="mt-4 bg-gray-50 p-4 rounded whitespace-pre-line">
// //             {data.body}
// //           </div>
// //         </>
// //       );

// //     case 'ranking':
// //       return (
// //         <>
// //           <h2 className="text-xl font-semibold mb-4">
// //             🏆 Candidate Ranking
// //           </h2>
// //           <p>
// //             Ranked <b>#{data.rank}</b> out of {data.total}
// //           </p>
// //           <h4 className="mt-3 font-medium">Ranking Based On:</h4>
// //           <ul className="list-disc ml-6">
// //             {data.basis.map((b: string) => (
// //               <li key={b}>{b}</li>
// //             ))}
// //           </ul>
// //         </>
// //       );

// //     case 'qualified':
// //       return (
// //         <h2 className="text-xl font-semibold text-green-600">
// //           ✅ Candidate Qualified
// //         </h2>
// //       );

// //     default:
// //       return null;
// //   }
// // }
// export function EventRenderer({ event }: any) {
//   switch (event.type) {

//     case 'email':
//       return (
//         <div>
//           <h3 className="font-semibold mb-2">📧 Email Sent</h3>
//           <p><b>Subject:</b> {event.data.subject}</p>
//           <pre className="bg-gray-50 p-4 mt-3 rounded text-sm">
//             {event.data.body}
//           </pre>
//         </div>
//       );

//    case 'bot_call':
//   return (
//     <div className="space-y-6">
//       <h3 className="font-semibold text-lg">🤖 Bot Call Summary</h3>
//       <p className="text-sm text-gray-600">{event.data.summary}</p>

//       {/* ================= SCORES ================= */}
//       <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//         <Score label="Overall" value={event.data.overall_score} highlight />
//         {Object.entries(event.data.scores).map(([k, v]) => (
//           <Score key={k} label={k} value={v as number} />
//         ))}
//       </div>

//       {/* ================= TOPICS ================= */}
//       <div>
//         <h4 className="font-semibold text-sm">Topics Covered</h4>
//         <ul className="list-disc ml-6 mt-2 text-sm">
//           {event.data.topics.map((t: string) => (
//             <li key={t}>{t}</li>
//           ))}
//         </ul>
//       </div>

//       {/* ================= STRENGTHS ================= */}
//       <div>
//         <h4 className="font-semibold text-sm text-green-600">Strengths</h4>
//         <ul className="list-disc ml-6 text-sm">
//           {event.data.strengths.map((s: string) => (
//             <li key={s}>{s}</li>
//           ))}
//         </ul>
//       </div>

//       {/* ================= WEAKNESSES ================= */}
//       <div>
//         <h4 className="font-semibold text-sm text-red-600">Weaknesses</h4>
//         <ul className="list-disc ml-6 text-sm">
//           {event.data.weaknesses.map((w: string) => (
//             <li key={w}>{w}</li>
//           ))}
//         </ul>
//       </div>

//       {/* ================= AREAS OF IMPROVEMENT ================= */}
//       {event.data.areas_of_improvement && (
//         <div>
//           <h4 className="font-semibold text-sm">Areas of Improvement</h4>
//           <div className="space-y-3 mt-2">
//             {event.data.areas_of_improvement.map((a: any) => (
//               <div
//                 key={a.area}
//                 className="border rounded p-3 text-sm bg-yellow-50"
//               >
//                 <p className="font-medium">{a.area}</p>
//                 <p className="text-gray-600">{a.recommendation}</p>
//                 <p className="text-xs text-gray-500 mt-1">
//                   Impact: {a.hiring_impact}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* ================= QUESTIONS ================= */}
//       {event.data.questions && (
//         <div>
//           <h4 className="font-semibold text-sm">Questions Asked</h4>
//           <div className="space-y-3 mt-2">
//             {event.data.questions.map((q: any) => (
//               <div key={q.id} className="border rounded p-3 text-sm">
//                 <p className="font-medium">{q.question}</p>
//                 <p className="text-gray-600 mt-1">
//                   {q.candidate_answer_summary}
//                 </p>
//                 <p className="text-xs text-gray-500 mt-1">
//                   Score: {q.score} | Confidence: {(q.confidence * 100).toFixed(0)}%
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* ================= RISK FLAGS ================= */}
//       {event.data.risk_flags?.length > 0 && (
//         <div>
//           <h4 className="font-semibold text-sm text-red-600">Risk Flags</h4>
//           <ul className="list-disc ml-6 text-sm">
//             {event.data.risk_flags.map((r: any, i: number) => (
//               <li key={i}>
//                 <b>{r.type}:</b> {r.message}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {/* ================= AI VERDICT ================= */}
//       <div className="border rounded p-4 bg-blue-50">
//         <h4 className="font-semibold text-sm">AI Verdict</h4>
//         <p className="mt-1">
//           Decision:{' '}
//           <span className="font-bold text-blue-600">
//             {event.data.ai_verdict.decision}
//           </span>
//         </p>
//         <p className="text-xs text-gray-600 mt-1">
//           Confidence: {(event.data.ai_verdict.confidence * 100).toFixed(0)}%
//         </p>

//         <ul className="list-disc ml-6 mt-2 text-sm">
//           {event.data.ai_verdict.reasoning.map((r: string) => (
//             <li key={r}>{r}</li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   )
//     case 'screening':
//       return (
//         <div>
//           <h3 className="font-semibold mb-2">🧠 Screening</h3>
//           {event.data.rules.map((r: any) => (
//             <div key={r.rule} className="flex justify-between text-sm border-b py-1">
//               <span>{r.rule}</span>
//               <span className={r.result === 'pass' ? 'text-green-600' : 'text-red-600'}>
//                 {r.result.toUpperCase()}
//               </span>
//             </div>
//           ))}
//         </div>
//       );

//     case 'ranking':
//       return (
//         <div>
//           <h3 className="font-semibold mb-2">🏆 Ranking</h3>
//           <p>
//             Ranked <b>#{event.data.rank}</b> out of {event.data.total}
//           </p>
//           <p className="text-sm text-gray-600 mt-2">{event.data.reason}</p>
//         </div>
//       );

//     case 'rejection':
//       return (
//         <div className="bg-red-50 border border-red-200 rounded p-4">
//           <h3 className="font-semibold text-red-700 mb-2">
//             ❌ Application Rejected
//           </h3>
//           <p className="text-sm text-red-600">
//             {event.data?.reason || 'Candidate was rejected'}
//           </p>
//         </div>
//       );

//     default:
//       return null;
//   }
// }

// function Score({
//   label,
//   value,
//   highlight,
// }: {
//   label: string;
//   value: number;
//   highlight?: boolean;
// }) {
//   return (
//     <div
//       className={`rounded-lg border p-3 text-center ${
//         highlight
//           ? 'bg-indigo-600 text-white border-indigo-600'
//           : 'bg-white border-gray-200'
//       }`}
//     >
//       <div className="text-xl font-bold">{value}%</div>
//       <div className="text-xs capitalize opacity-70">{label}</div>
//     </div>
//   );
// }





// import { CheckCircle, Clock, Mail, Phone, FileText } from 'lucide-react';

// interface EventRendererProps {
//   event: any;
// }

// export const EventRenderer = ({ event }: EventRendererProps) => {
//   if (!event) return null;

//   /* ================= PROFILE UPLOAD ================= */
//   if (event.stage === 'profile_uploaded') {
//     return (
//       <div className="bg-white border rounded-xl p-6">
//         <div className="flex items-center gap-2 mb-4">
//           <FileText className="w-5 h-5 text-blue-600" />
//           <h3 className="font-semibold text-lg">Profile Uploaded</h3>
//         </div>

//         <p className="text-sm text-gray-700">
//           Resume File:
//           <span className="font-medium ml-2">
//             {event.data.file}
//           </span>
//         </p>
//       </div>
//     );
//   }

//   /* ================= MATCHING RESULT ================= */
//   if (event.stage === 'matching_completed') {
//     return (
//       <div className="bg-white border rounded-xl p-6">
//         <h3 className="font-semibold text-lg mb-4">
//           JD Matching Result
//         </h3>

//         <div className="mb-4">
//           <p className="text-3xl font-bold text-blue-600">
//             {event.data.match_score}%
//           </p>
//           <p className="text-sm text-gray-500">Overall Match Score</p>
//         </div>

//         <div className="grid grid-cols-2 gap-6">
//           <div>
//             <h4 className="font-medium mb-2">Matched Skills</h4>
//             <ul className="list-disc list-inside text-sm text-gray-700">
//               {event.data.matched_skills.map((skill: string) => (
//                 <li key={skill}>{skill}</li>
//               ))}
//             </ul>
//           </div>

//           <div>
//             <h4 className="font-medium mb-2">Missing Skills</h4>
//             <ul className="list-disc list-inside text-sm text-gray-700">
//               {event.data.missing_skills.map((skill: string) => (
//                 <li key={skill}>{skill}</li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   /* ================= EMAIL EVENT ================= */
//   if (event.stage === 'email_sent') {
//     return (
//       <div className="bg-white border rounded-xl p-6">
//         <div className="flex items-center gap-2 mb-4">
//           <Mail className="w-5 h-5 text-green-600" />
//           <h3 className="font-semibold text-lg">Interview Email Sent</h3>
//           <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
//         </div>

//         <div className="space-y-2 text-sm">
//           <p>
//             <strong>To:</strong> {event.data.to}
//           </p>
//           <p>
//             <strong>Subject:</strong> {event.data.subject}
//           </p>
//         </div>

//         <pre className="mt-4 bg-gray-50 p-4 rounded text-sm whitespace-pre-wrap">
//           {event.data.body}
//         </pre>
//       </div>
//     );
//   }

//   /* ================= BOT CALL (SCREENING / CONFERENCE) ================= */
//   if (event.type === 'bot_call') {
//     return (
//       <div className="bg-white border rounded-xl p-6">
//         <div className="flex items-center gap-2 mb-4">
//           <Phone className="w-5 h-5 text-purple-600" />
//           <h3 className="font-semibold text-lg">{event.title}</h3>

//           {event.status === 'completed' && (
//             <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
//           )}
//           {event.status === 'pending' && (
//             <Clock className="w-4 h-4 text-orange-500 ml-auto" />
//           )}
//         </div>

//         {/* PENDING BOT CALL */}
//         {event.status === 'pending' && (
//           <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-lg">
//             <p className="font-medium text-yellow-800">
//               ⏳ Interview Scheduled
//             </p>
//             <p className="text-sm text-gray-700 mt-1">
//               {event.data.scheduled_at}
//             </p>
//           </div>
//         )}

//         {/* COMPLETED BOT CALL */}
//         {event.status === 'completed' && (
//           <div className="space-y-3 text-sm">
//             {event.data.duration && (
//               <p>
//                 <strong>Duration:</strong> {event.data.duration}
//               </p>
//             )}

//             {event.data.score !== undefined && (
//               <p>
//                 <strong>Score:</strong> {event.data.score}
//               </p>
//             )}

//             {event.data.verdict && (
//               <p>
//                 <strong>Verdict:</strong>
//                 <span className="ml-2 px-2 py-1 rounded bg-green-100 text-green-700 text-xs">
//                   {event.data.verdict}
//                 </span>
//               </p>
//             )}
//           </div>
//         )}
//       </div>
//     );
//   }

//   /* ================= REJECT EVENT ================= */
// if (event.stage === 'rejected') {
//   return (
//     <div className="bg-red-50 border border-red-300 rounded-xl p-6">
//       <div className="flex items-center gap-2 mb-4">
//         <span className="text-red-600 text-lg font-semibold">
//           ❌ Candidate Rejected
//         </span>
//       </div>

//       <div className="space-y-2 text-sm text-gray-800">
//         <p>
//           <strong>Reason:</strong> {event.data.reason}
//         </p>
//         <p>
//           <strong>Rejected By:</strong> {event.data.rejected_by}
//         </p>
//         <p>
//           <strong>Date:</strong> {event.data.rejected_at}
//         </p>
//       </div>

//       <div className="mt-4">
//         <h4 className="font-medium mb-2 text-red-700">
//           Feedback
//         </h4>
//         <ul className="list-disc list-inside text-sm text-gray-700">
//           {event.data.feedback.map((item: string) => (
//             <li key={item}>{item}</li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }


//   /* ================= FALLBACK ================= */
//   return (
//     <div className="bg-white border rounded-xl p-6">
//       <p className="text-gray-500">No details available</p>
//     </div>
//   );
// };



import { CheckCircle, Clock, Mail, Phone, FileText, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

// interface CandidateQuestion {
//   question: string;
//   score?: number;
// }

// interface EventData {
//   file?: string;
//   match_score?: number;
//   matched_skills?: string[];
//   missing_skills?: string[];
//   to?: string;
//   subject?: string;
//   body?: string;
//   duration?: string;
//   score?: number;
//   verdict?: string;
//   scheduled_at?: string;
//   reason?: string;
//   rejected_by?: string;
//   rejected_at?: string;
//   feedback?: string[];
//   questions?: Array<string | CandidateQuestion>;
// }

interface EventData {
  /* ================= COMMON ================= */
  file?: string;

  reason?: string;
  rejected_by?: string;
  rejected_at?: string;
  feedback?: string[];

  match_score?: number;
  matched_skills?: string[];
  missing_skills?: string[];

  to?: string;
  subject?: string;
  body?: string;

  scheduled_at?: string;
  duration?: string;

  /* ================= SIMPLE BOT CALL ================= */
  score?: number;
  verdict?: string;

  /* ================= ADVANCED BOT CALL ================= */
  summary?: string;
  topics: string[];

  overall_score?: number;
  scores?: {
    technical?: number;
    behavioral?: number;
    communication?: number;
    logical?: number;
  };

  answer_quality?: {
    clarity?: number;
    depth?: number;
    relevance?: number;
    examples?: number;
  };

  questions: Array<{
    id: string;
    question: string;
    category?: string;
    difficulty?: string;
    score?: number;
    confidence?: number;
    candidate_answer_summary?: string;
    ai_feedback?: string;
  }>;

  strengths: string[];
  weaknesses: string[];

  areas_of_improvement: Array<{
    area: string;
    severity?: 'Low' | 'Medium' | 'High';
    evidence?: string[];
    impacted_questions?: string[];
    recommendation: string;
    hiring_impact: string;
  }>;

  risk_flags: Array<{
    type: string;
    message: string;
  }>;

  ai_verdict?: {
    decision: string;
    confidence: number;
    reasoning: string[];
  };

  hiring_readiness?: {
    level: string;
    next_round: string;
    estimated_training_weeks: number;
  };
}


interface Event {
  id: string;
  stage?: string; // profile_uploaded, matching_completed, email_sent, rejected
  type?: string;  // bot_call
  title: string;
  status?: 'completed' | 'pending';
  date?: string;
  data: EventData;
}

interface EventRendererProps {
  event: Event;
}

export const EventRenderer = ({ event }: EventRendererProps) => {
  if (!event) return null;

  /* ================= PROFILE UPLOAD ================= */
  if (event.stage === 'profile_uploaded') {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[linear-gradient(to_bottom_right,#3b82f6,#06b6d4)] flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900">Profile Uploaded</h3>
        </div>
        <div className="text-sm text-slate-600 mt-5">
          <span className="font-medium inline-block mb-1">Resume File:</span>{' '}
          <p className="text-blue-600 hover:text-blue-700 underline decoration-blue-300 hover:decoration-blue-500 transition-colors">
          {event.data.file}
          </p>
        </div>
        
      </div>
    );
  }

  /* ================= MATCHING RESULT ================= */
  if (event.stage === 'matching_completed') {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
        <h3 className="text-xl font-semibold text-slate-900 mb-6">JD Matching Result</h3>

        <div className="mb-6">
          <div className="text-5xl font-bold bg-[linear-gradient(to_right,#2563eb,#0891b2)] bg-clip-text text-transparent mb-2">
            {event.data.match_score}%
          </div>
          <p className="text-slate-500 text-sm">Overall Match Score</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Matched Skills</h4>
            <div className="flex items-center gap-3">
            {/* <ul className="list-disc list-inside text-sm text-gray-700">
              {event.data.matched_skills?.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul> */}
            {event.data.matched_skills?.map((skill) => (
              <div key={skill} className='flex items-center w-auto gap-2 text-sm px-3 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200'>
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{skill}</span>
              </div>
            ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Missing Skills</h4>
            {/* <ul className="list-disc list-inside text-sm text-gray-700">
              {event.data.missing_skills?.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul> */}
            <div className="flex items-center gap-3">
              {event.data.missing_skills?.map((skill) => (
                <div key={skill} className="flex items-center gap-2 text-sm px-3 py-2 bg-red-50 text-red-700 rounded-lg border border-red-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ================= EMAIL EVENT ================= */
  if (event.stage === 'email_sent') {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md 
        transition-all duration-200 relative">
          <div className="absolute top-6 right-6">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-[linear-gradient(to_bottom_right,#22c55e,#10b981)] text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/30">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">Interview Email Sent</h3>
          </div>

        <div className="space-y-2">
          <div>
            <span className="text-sm font-semibold text-slate-900">To: </span>
            <span className="text-sm text-slate-600">{event.data.to}</span>
          </div>
          <div>
            <span className="text-sm font-semibold text-slate-900">Subject: </span>
            <span className="text-sm text-slate-600">{event.data.subject}</span>
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mt-4">
          <pre  className="text-sm text-slate-700 font-mono whitespace-pre-wrap">
            {event.data.body}
          </pre>
        </div>
      </div>
    );
  }

  /* ================= BOT CALL (SCREENING / CONFERENCE) ================= */
  if (event.type === 'bot_call') {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 relative">
        {event.status === 'completed' &&
          <div className="absolute top-6 right-6">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
          </div>
        }
        {event.status === 'pending' &&
          <div className="absolute top-6 right-6">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        }
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-[linear-gradient(to_bottom_right,#3b82f6,#14b8a6)] flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
            <Phone className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-semibold text-lg">{event.title}</h3>
        </div>
        <div>
          {/* {event.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />}
          {event.status === 'pending' && <Clock className="w-4 h-4 text-orange-500 ml-auto" />} */}
        </div>

        {/* PENDING BOT CALL */}
        {event.status === 'pending' && event.data.scheduled_at && (
          <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-lg">
            <p className="font-medium text-yellow-800">⏳ Interview Scheduled</p>
            <p className="text-sm text-gray-700 mt-1">{event.data.scheduled_at}</p>
          </div>
        )}

        {/* COMPLETED BOT CALL */}
        {/* {event.status === 'completed' && (
          <div className="space-y-3 text-sm">
            {event.data.duration && (
              <p>
                <strong>Duration:</strong> {event.data.duration}
              </p>
            )}

            {event.data.score !== undefined && (
              <p>
                <strong>Score:</strong> {event.data.score}
              </p>
            )}

            {event.data.verdict && (
              <p>
                <strong>Verdict:</strong>
                <span className="ml-2 px-2 py-1 rounded bg-green-100 text-green-700 text-xs">
                  {event.data.verdict}
                </span>
              </p>
            )}

            {Array.isArray(event.data.questions) && (
              <div>
                <h4 className="font-medium text-gray-800 mt-4 mb-1">Questions</h4>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {event.data.questions.map(
                    (q: string | CandidateQuestion, idx: number) => (
                      <li key={idx}>
                        {typeof q === 'string' ? q : q.question}{' '}
                        {typeof q !== 'string' && q.score !== undefined && (
                          <span className="ml-2 text-green-600">({q.score}/10)</span>
                        )}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>
        )} */}

        {event.status === 'completed' && (
          <div className="space-y-6 text-sm">

            {/* ================= SUMMARY ================= */}
            {event.data.summary && (
              <p className="text-gray-600">{event.data.summary}</p>
            )}

            {/* ================= DURATION ================= */}
            {event.data.duration && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                <span className="font-semibold">Duration:</span>
                <span>{event.data.duration}</span>
              </div>
            )}

            {/* ================= SCORES ================= */}
            {(event.data.overall_score !== undefined || event.data.scores) && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {event.data.overall_score !== undefined && (
                  <div className="bg-purple-50 border rounded p-3">
                    <p className="text-xs text-gray-500">Overall</p>
                    <p className="text-xl font-bold text-purple-700">
                      {event.data.overall_score}%
                    </p>
                  </div>
                )}

                {event.data.scores &&
                  Object.entries(event.data.scores).map(([k, v]) => (
                    <div key={k} className="bg-gray-50 border rounded p-3">
                      <p className="text-xs capitalize text-gray-500">{k}</p>
                      <p className="font-semibold">{v}</p>
                    </div>
                  ))}
              </div>
            )}

            {/* ================= TOPICS ================= */}
            {event.data.topics?.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-800">Topics Covered</h4>
                <ul className="list-disc ml-6 mt-1">
                  {event.data.topics.map((t: string) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* ================= STRENGTHS ================= */}
            {event.data.strengths?.length > 0 && (
              <div>
                <h4 className="font-medium text-green-700">Strengths</h4>
                <ul className="list-disc ml-6">
                  {event.data.strengths.map((s: string) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* ================= WEAKNESSES ================= */}
            {event.data.weaknesses?.length > 0 && (
              <div>
                <h4 className="font-medium text-red-700">Weaknesses</h4>
                <ul className="list-disc ml-6">
                  {event.data.weaknesses.map((w: string) => (
                    <li key={w}>{w}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* ================= AREAS OF IMPROVEMENT ================= */}
            {event.data.areas_of_improvement?.length > 0 && (
              <div>
                <h4 className="font-medium">Areas of Improvement</h4>
                <div className="space-y-3 mt-2">
                  {event.data.areas_of_improvement.map((a: any) => (
                    <div
                      key={a.area}
                      className="border rounded p-3 bg-yellow-50"
                    >
                      <p className="font-medium">{a.area}</p>
                      <p className="text-gray-600">{a.recommendation}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Impact: {a.hiring_impact}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= QUESTIONS ================= */}
            {event.data.questions?.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-800">Questions Asked</h4>
                <div className="space-y-3 mt-2">
                  {event.data.questions.map((q: any) => (
                    <div key={q.id} className="border rounded p-3">
                      <p className="font-medium">{q.question}</p>

                      {q.candidate_answer_summary && (
                        <p className="text-gray-600 mt-1">
                          {q.candidate_answer_summary}
                        </p>
                      )}

                      <p className="text-xs text-gray-500 mt-1">
                        Score: {q.score} | Confidence:{' '}
                        {(q.confidence * 100).toFixed(0)}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= RISK FLAGS ================= */}
            {event.data.risk_flags?.length > 0 && (
              <div>
                <h4 className="font-medium text-red-700">Risk Flags</h4>
                <ul className="list-disc ml-6">
                  {event.data.risk_flags.map((r: any, i: number) => (
                    <li key={i}>
                      <b>{r.type}:</b> {r.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ================= AI VERDICT ================= */}
            {event.data.ai_verdict && (
              <div className="border rounded p-4 bg-blue-50">
                <h4 className="font-medium">AI Verdict</h4>

                <p className="mt-1">
                  Decision:{' '}
                  <span className="font-bold text-blue-600">
                    {event.data.ai_verdict.decision}
                  </span>
                </p>

                <p className="text-xs text-gray-600 mt-1">
                  Confidence:{' '}
                  {(event.data.ai_verdict.confidence * 100).toFixed(0)}%
                </p>

                <ul className="list-disc ml-6 mt-2">
                  {event.data.ai_verdict.reasoning.map((r: string) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        )}

      </div>
    );
  }

  /* ================= REJECT EVENT ================= */
  if (event.stage === 'rejected') {
    return (
      <div className="bg-[linear-gradient(to_bottom_right,#fef2f2,#fff1f2)] rounded-2xl p-6 shadow-sm border border-red-200 hover:shadow-md transition-all duration-200">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-10 h-10 rounded-full bg-[linear-gradient(to_bottom_right,#ef4444,#f43f5e)] flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-500/30">
            <XCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-red-900">Candidate Rejected</h3>
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <span className="text-sm font-semibold text-red-900">Reason: </span>
            <span className="text-sm text-red-700">{event.data.reason}</span>
          </div>
          <div>
            <span className="text-sm font-semibold text-red-900">Rejected By: </span>
            <span className="text-sm text-red-700">{event.data.rejected_by}</span>
          </div>
          <div>
            <span className="text-sm font-semibold text-red-900">Date: </span>
            <span className="text-sm text-red-700">{event.data.rejected_at}</span>
          </div>
        </div>

        {event.data.feedback && event.data.feedback.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-red-900 mb-2">Feedback</h4>
            <ul className="space-y-2">
              {event.data.feedback.map((item, idx) => (
                <li key={idx} className='flex items-center gap-2 text-sm text-red-700'>
                  <span className=" w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  /* ================= FALLBACK ================= */
  return (
    <div className="bg-white border rounded-xl p-6">
      <p className="text-gray-500">No details available</p>
    </div>
  );
};
