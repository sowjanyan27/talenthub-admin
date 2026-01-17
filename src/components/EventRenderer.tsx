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
        <div>
          <h3 className="font-semibold mb-2">🤖 Bot Call Summary</h3>
          <p>{event.data.summary}</p>

          <ul className="list-disc ml-6 mt-3 text-sm">
            {event.data.topics.map((t: string) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      );

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
