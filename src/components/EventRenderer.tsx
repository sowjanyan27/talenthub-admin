// export function EventRenderer({ event }: any) {
//   const data = event.payload;

//   switch (event.type) {
//     case 'application':
//       return (
//         <>
//           <h2 className="text-xl font-semibold mb-4">
//             📄 Application Details
//           </h2>
//           <p><b>Source:</b> {data.source}</p>
//           <p><b>Resume:</b> {data.resume}</p>
//         </>
//       );

//     case 'rule_engine':
//       return (
//         <>
//           <h2 className="text-xl font-semibold mb-4">
//             ⚙️ Rule Engine Parameters
//           </h2>
//           <ul className="list-disc ml-6">
//             {data.parameters.map((p: string) => (
//               <li key={p}>{p}</li>
//             ))}
//           </ul>
//         </>
//       );

//     case 'screening':
//       return (
//         <>
//           <h2 className="text-xl font-semibold mb-4">
//             🧠 Screening Result
//           </h2>
//           {data.rules.map((r: any, i: number) => (
//             <div key={i} className="flex justify-between border-b py-2">
//               <span>{r.rule}</span>
//               <span
//                 className={
//                   r.result === 'pass'
//                     ? 'text-green-600'
//                     : 'text-red-600'
//                 }
//               >
//                 {r.result.toUpperCase()}
//               </span>
//             </div>
//           ))}
//           <p className="mt-4 font-semibold">
//             Screening Score: {data.score}%
//           </p>
//         </>
//       );

//     case 'bot_call':
//       return (
//         <>
//           <h2 className="text-xl font-semibold mb-4">
//             🤖 Bot Call Overview
//           </h2>
//           <p><b>Duration:</b> {data.duration}</p>
//           <p><b>Confidence:</b> {data.confidence}</p>

//           <p className="mt-3">{data.summary}</p>

//           <div className="mt-4 space-y-2">
//             {data.conversation.map((c: any, i: number) => (
//               <div
//                 key={i}
//                 className={`p-3 rounded-lg ${
//                   c.speaker === 'Bot'
//                     ? 'bg-blue-50'
//                     : 'bg-gray-100'
//                 }`}
//               >
//                 <b>{c.speaker}:</b> {c.text}
//               </div>
//             ))}
//           </div>
//         </>
//       );

//     case 'email':
//       return (
//         <>
//           <h2 className="text-xl font-semibold mb-4">
//             📧 Email Content
//           </h2>
//           <p><b>To:</b> {data.to}</p>
//           <p><b>Subject:</b> {data.subject}</p>
//           <div className="mt-4 bg-gray-50 p-4 rounded whitespace-pre-line">
//             {data.body}
//           </div>
//         </>
//       );

//     case 'ranking':
//       return (
//         <>
//           <h2 className="text-xl font-semibold mb-4">
//             🏆 Candidate Ranking
//           </h2>
//           <p>
//             Ranked <b>#{data.rank}</b> out of {data.total}
//           </p>
//           <h4 className="mt-3 font-medium">Ranking Based On:</h4>
//           <ul className="list-disc ml-6">
//             {data.basis.map((b: string) => (
//               <li key={b}>{b}</li>
//             ))}
//           </ul>
//         </>
//       );

//     case 'qualified':
//       return (
//         <h2 className="text-xl font-semibold text-green-600">
//           ✅ Candidate Qualified
//         </h2>
//       );

//     default:
//       return null;
//   }
// }
export function EventRenderer({ event }: any) {
  switch (event.type) {

    case 'email':
      return (
        <div>
          <h3 className="font-semibold mb-2">📧 Email Sent</h3>
          <p><b>Subject:</b> {event.data.subject}</p>
          <pre className="bg-gray-50 p-4 mt-3 rounded text-sm">
            {event.data.body}
          </pre>
        </div>
      );

   case 'bot_call':
  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-lg">🤖 Bot Call Summary</h3>
      <p className="text-sm text-gray-600">{event.data.summary}</p>

      {/* ================= SCORES ================= */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Score label="Overall" value={event.data.overall_score} highlight />
        {Object.entries(event.data.scores).map(([k, v]) => (
          <Score key={k} label={k} value={v as number} />
        ))}
      </div>

      {/* ================= TOPICS ================= */}
      <div>
        <h4 className="font-semibold text-sm">Topics Covered</h4>
        <ul className="list-disc ml-6 mt-2 text-sm">
          {event.data.topics.map((t: string) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>

      {/* ================= STRENGTHS ================= */}
      <div>
        <h4 className="font-semibold text-sm text-green-600">Strengths</h4>
        <ul className="list-disc ml-6 text-sm">
          {event.data.strengths.map((s: string) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>

      {/* ================= WEAKNESSES ================= */}
      <div>
        <h4 className="font-semibold text-sm text-red-600">Weaknesses</h4>
        <ul className="list-disc ml-6 text-sm">
          {event.data.weaknesses.map((w: string) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      </div>

      {/* ================= AREAS OF IMPROVEMENT ================= */}
      {event.data.areas_of_improvement && (
        <div>
          <h4 className="font-semibold text-sm">Areas of Improvement</h4>
          <div className="space-y-3 mt-2">
            {event.data.areas_of_improvement.map((a: any) => (
              <div
                key={a.area}
                className="border rounded p-3 text-sm bg-yellow-50"
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
      {event.data.questions && (
        <div>
          <h4 className="font-semibold text-sm">Questions Asked</h4>
          <div className="space-y-3 mt-2">
            {event.data.questions.map((q: any) => (
              <div key={q.id} className="border rounded p-3 text-sm">
                <p className="font-medium">{q.question}</p>
                <p className="text-gray-600 mt-1">
                  {q.candidate_answer_summary}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Score: {q.score} | Confidence: {(q.confidence * 100).toFixed(0)}%
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= RISK FLAGS ================= */}
      {event.data.risk_flags?.length > 0 && (
        <div>
          <h4 className="font-semibold text-sm text-red-600">Risk Flags</h4>
          <ul className="list-disc ml-6 text-sm">
            {event.data.risk_flags.map((r: any, i: number) => (
              <li key={i}>
                <b>{r.type}:</b> {r.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ================= AI VERDICT ================= */}
      <div className="border rounded p-4 bg-blue-50">
        <h4 className="font-semibold text-sm">AI Verdict</h4>
        <p className="mt-1">
          Decision:{' '}
          <span className="font-bold text-blue-600">
            {event.data.ai_verdict.decision}
          </span>
        </p>
        <p className="text-xs text-gray-600 mt-1">
          Confidence: {(event.data.ai_verdict.confidence * 100).toFixed(0)}%
        </p>

        <ul className="list-disc ml-6 mt-2 text-sm">
          {event.data.ai_verdict.reasoning.map((r: string) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </div>
    </div>
  )
    case 'screening':
      return (
        <div>
          <h3 className="font-semibold mb-2">🧠 Screening</h3>
          {event.data.rules.map((r: any) => (
            <div key={r.rule} className="flex justify-between text-sm border-b py-1">
              <span>{r.rule}</span>
              <span className={r.result === 'pass' ? 'text-green-600' : 'text-red-600'}>
                {r.result.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      );

    case 'ranking':
      return (
        <div>
          <h3 className="font-semibold mb-2">🏆 Ranking</h3>
          <p>
            Ranked <b>#{event.data.rank}</b> out of {event.data.total}
          </p>
          <p className="text-sm text-gray-600 mt-2">{event.data.reason}</p>
        </div>
      );

    case 'rejection':
      return (
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <h3 className="font-semibold text-red-700 mb-2">
            ❌ Application Rejected
          </h3>
          <p className="text-sm text-red-600">
            {event.data?.reason || 'Candidate was rejected'}
          </p>
        </div>
      );

    default:
      return null;
  }
}

function Score({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-3 text-center ${
        highlight
          ? 'bg-indigo-600 text-white border-indigo-600'
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="text-xl font-bold">{value}%</div>
      <div className="text-xs capitalize opacity-70">{label}</div>
    </div>
  );
}
