import { ArrowLeft, Mail, Phone, Briefcase, GraduationCap } from 'lucide-react';
import { useState } from 'react';
import { mockTimeline } from '../mock/mockTimeline';
import { EventRenderer } from './EventRenderer';
import { CheckCircle, Clock } from 'lucide-react';

const formatText = (text: any) => {
  if (!text) return [];

  return text
    // Normalize line breaks
    .replace(/\r\n/g, "\n")

    // Force line breaks before bullets and section headers
    .replace(/\s+-\s+/g, "\n- ")
    .replace(/\s+(SUMMARY:|MATCHES:|GAPS:|CONCLUSION & RECOMMENDATIONS:)/g, "\n$1")

    // Split on one or more newlines
    .split(/\n+/)

    // Clean up
    .map((line: any) => line.trim())
    .filter(Boolean);
};

interface Analysis {
  SUMMARY: string;
  MATCHES: string[];
  GAPS: string[];
  CONCLUSION: string;
}

const parseAnalysis = (text: string): Analysis => {
  const sections: Analysis = {
    SUMMARY: "",
    MATCHES: [],
    GAPS: [],
    CONCLUSION: "",
  };

  if (!text) return sections;

  // Normalize newlines
  const normalized = text.replace(/\r\n/g, "\n").trim();

  // Remove leading numbers like 1), 2), etc.
  const removeNumberPrefix = (str: string) => str.replace(/^\d+\)\s*/, "");

  // Helper to extract section content
  const getSection = (name: string) => {
    const regex = new RegExp(
      `${name}:([\\s\\S]*?)(?=SUMMARY:|MATCHES:|GAPS:|CONCLUSION & RECOMMENDATIONS:|$)`,
      "i"
    );
    const match = normalized.match(regex);
    return match ? match[1].trim() : "";
  };

  // Parse bullets, handling:
  // - lines starting with "-"
  // - lines like "Technical Skills: ..." as separate bullets
  // - multi-line continuation added to previous bullet
  const parseBullets = (str: string) =>
    str
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => removeNumberPrefix(line))
      .reduce<string[]>((acc, line) => {
        if (line.startsWith("-")) {
          acc.push(line.replace(/^-/, "").trim());
        } else if (/^[A-Z][a-zA-Z ]+:/.test(line)) {
          acc.push(line.trim());
        } else if (acc.length > 0) {
          acc[acc.length - 1] += " " + line;
        } else {
          acc.push(line);
        }
        return acc;
      }, []);

  // Fill sections
  sections.SUMMARY = removeNumberPrefix(getSection("SUMMARY"));
  sections.CONCLUSION = removeNumberPrefix(
    getSection("CONCLUSION & RECOMMENDATIONS")
  );
  sections.MATCHES = parseBullets(getSection("MATCHES"));
  sections.GAPS = parseBullets(getSection("GAPS"));

  return sections;
};




const getStatusIcon = (event: any) => {
  if (event.status === 'completed')
    return (
      <div className="w-9 h-9 flex items-center justify-center rounded-full bg-green-100">
        <CheckCircle className="w-5 h-5 text-green-600" />
      </div>
    );

  if (event.status === 'pending')
    return (
      <div className="w-9 h-9 flex items-center justify-center rounded-full bg-orange-100">
        <Clock className="w-5 h-5 text-orange-500" />
      </div>
    );

  if (event.type === 'email')
    return (
      <div className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-100">
        <Mail className="w-5 h-5 text-blue-500" />
      </div>
    );

  if (event.type === 'bot_call')
    return (
      <div className="w-9 h-9 flex items-center justify-center rounded-full bg-purple-100">
        <Phone className="w-5 h-5 text-purple-500" />
      </div>
    );

  return null;
};

export default function CandidatePage({ application, onBack }: any) {
  const candidate = application.candidate;

  const events = application.timeline || mockTimeline[application.id] || [];
  const [selectedEvent, setSelectedEvent] = useState(events.length > 0 ? events[0] : null);
  const analysis = parseAnalysis(candidate.gap_summary);
  return (
    <div className="ml-64 min-h-screen flex-1 bg-gray-50">
      <div className='flex gap-2'>
        {/* LEFT – TIMELINE */}
        <div className="w-1/4 bg-white min-h-screen border-r p-4 overflow-y-auto">
          <button
            onClick={onBack}
            className="flex items-center text-sm text-gray-600 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to candidates
          </button>

          <h3 className="text-lg font-semibold text-slate-900 mb-6">Timeline</h3>

          {events.map((event: any) => (
            <div
              key={event.id}
              onClick={() => setSelectedEvent(event)}   // ✅ CLICK HERE
              className={`w-full text-left p-4 rounded-xl transition-all duration-200 relative ${selectedEvent.id === event.id
                ? 'bg-blue-50 border-2 border-blue-500'
                : 'hover:bg-gray-50 border-2 border-transparent'
                }`}
            >
              {/* <p className="font-medium text-sm">{event.title}</p> */}
              <div className="flex items-start gap-3">
                {getStatusIcon(event)}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm mb-1">{event.title}</p>
                  <p className="text-xs text-slate-500 mb-1">{event.stage}</p>
                  {event.date && (
                    <p className="text-xs text-slate-400">{event.date}</p>
                  )}
                </div>
              </div>

              {/* <p className="text-xs text-gray-500">{event.summary}</p>
              <p className="text-xs text-gray-400 mt-1">{event.date}</p> */}
            </div>
          ))}
        </div>

        {/* RIGHT – DETAILS */}
        <div className="w-2/3 p-6 overflow-y-auto">

          {/* PROFILE HEADER */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 backdrop-blur-sm mb-4">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">{candidate.full_name}</h2>

            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="w-4 h-4 mr-1" />
                <span>{candidate.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="w-4 h-4 mr-1" />
                <span>{candidate.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Briefcase className="w-4 h-4 mr-1" />
                <span>{candidate.years_of_experience} yrs</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <GraduationCap className="w-4 h-4 mr-1" />
                <span>{candidate.education}</span>
              </div>
            </div>
          </div>

          {/* GAP ANALYSIS */}
          {candidate.gap_summary && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Gap Analysis
              </h3>

              <div className="space-y-5">

                {/* SUMMARY */}
                {analysis.SUMMARY && (
                  <div className="border-l-4 border-blue-400 pl-4">
                    <h4 className="font-semibold text-blue-900 mb-1 flex items-center gap-2">
                      📄 Summary
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {analysis.SUMMARY}
                    </p>
                  </div>
                )}

                {/* MATCHES */}
                {analysis.MATCHES.length > 0 && (
                  <div className="border-l-4 border-green-400 pl-4">
                    <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                      ✅ Matches
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                      {analysis.MATCHES.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* GAPS */}
                {analysis.GAPS.length > 0 && (
                  <div className="border-l-4 border-orange-400 pl-4">
                    <h4 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
                      ⚠️ Gaps
                    </h4>
                    <ul className="list-disc pl-5 space-y-0.5 text-sm text-gray-700">
                      {analysis.GAPS.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}


                {/* CONCLUSION */}
                {analysis.CONCLUSION && (
                  <div className="border-l-4 border-gray-400 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                      🧠 Conclusion & Recommendations
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {analysis.CONCLUSION}
                    </p>
                  </div>
                )}
              </div>

              {/* SKILLS */}
              <div className="mt-8 space-y-5">

                {candidate.matched_skills && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      Matched Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {candidate.matched_skills.split(",").map((skill: any, i: any) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full border border-green-100"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {candidate.missing_skills && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      Missing Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {candidate.missing_skills.split(",").map((skill: any, i: any) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-red-50 text-red-700 text-sm rounded-full border border-red-100"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}


          {/* EVENT DETAILS */}
          {selectedEvent ? (
            <EventRenderer event={selectedEvent} />
          ) : (
            <div className="flex flex-col items-center justify-center bg-white rounded-2xl p-10 shadow-sm border border-gray-100 h-64">
              <p className="text-gray-500">No timeline events details available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
