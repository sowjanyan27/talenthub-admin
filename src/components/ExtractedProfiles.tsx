// import type 
// { Profile } from "./UploadResumeModal";

// interface Props {
//   profiles: Profile[];
// }
// const formatSkill = (skill: string) => {
//   return skill
//     .trim()
//     .replace(/\b\w/g, c => c.toUpperCase()); // Title Case
// };

// const getSkillsArray = (skills: string | string[] | undefined): string[] => {
//   if (!skills) return [];
//   if (Array.isArray(skills)) return skills.map(formatSkill);
//   return skills.split(",").map(s => formatSkill(s));
// };

// export default function ExtractedProfiles({ profiles }: Props) {
//   if (!profiles.length) return null;

//   return (
//     <div className="ml-64 flex-1 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//       {profiles.map((p, i) => (
//         <div
//           key={i}
//           className="bg-white rounded-xl shadow-md p-5 border hover:shadow-lg transition"
//         >
//           {/* Use file_name as fallback */}
//           <h3 className="font-bold text-lg">{p.name || p.file_name || "Unknown"}</h3>
//           <p className="text-sm text-gray-500">
//             {(p.current_designation || "Unknown")} @ {(p.current_company || "Unknown")}
//           </p>

//           <div className="mt-3 text-sm space-y-1">
//             <p><b>Email:</b> {p.email || "N/A"}</p>
//             <p><b>Phone:</b> {p.phone_number || "N/A"}</p>
//             <p><b>Location:</b> {p.location || "N/A"}</p>
//             <p><b>Experience:</b> {p.total_experience || "N/A"}</p>
//             <p><b>Skills:</b> {p.skills || "N/A"}</p>
//             <p><b>Education:</b> {p.education || "N/A"}</p>
//           </div>

//           {/* Match Score Section */}
//           {p.match_score && (
//             <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm">
//               <p><b>Match Score:</b> {p.match_score}%</p>
//               <p className="text-green-600"><b>Matched:</b> {p.matched_skills || "N/A"}</p>
//               <p className="text-red-600"><b>Missing:</b> {p.missing_skills || "N/A"}</p>
//               <p className="text-gray-600 mt-1">{p.gap_summary || ""}</p>
//             </div>
//           )}

//           {/* Extraction error */}
//           {p.extraction_status === "failed" && (
//             <p className="text-red-500 text-sm mt-2">{p.error_message || "Failed to extract profile"}</p>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }
import { useState } from "react";
import type { Profile } from "./UploadResumeModal";
import { Download } from "lucide-react";

interface Props {
  profiles: Profile[];
  excelFile?: string | null;
}

export default function ExtractedProfiles({ profiles, excelFile }: Props) {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  if (!profiles.length) return null;

  /* ---------------- SKILL HELPERS ---------------- */

  const formatSkill = (skill: string) =>
    skill.trim().replace(/\b\w/g, (c) => c.toUpperCase());

  const getSkillsArray = (
    skills: string | string[] | undefined
  ): string[] => {
    if (!skills) return [];
    if (Array.isArray(skills)) return skills.map(formatSkill);
    return skills.split(",").map((s) => formatSkill(s));
  };

  const skillClass = (skill: string) =>
    skill.toLowerCase().includes("sap")
      ? "bg-blue-100 text-blue-700"
      : "bg-gray-100 text-gray-700";

  /* ---------------- DOWNLOAD EXCEL ---------------- */

  const downloadExcel = async (fileName: string) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:9099/api/v1/profiles/download/${fileName}`
      );
      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="ml-64 min-h-screen bg-gray-50">

      {/* 🔹 Top Action Bar */}
      {excelFile && (
        <div className="max-w-7xl mx-auto px-6 pt-6 flex justify-end">
          <button
            onClick={() => downloadExcel(excelFile)}
            className="flex items-center gap-2 px-5 py-2 bg-[linear-gradient(to_bottom_right,#4ade80,#22c55e,#16a34a)] text-white font-medium rounded-lg shadow hover:bg-green-700 transition"
          >
            <Download size={18} /> Download Excel
          </button>
        </div>
      )}

      {/* 🔹 Profile Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid gap-6 
                      grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

        {profiles.map((p, i) => {
          const skillsArr = getSkillsArray(p.skills);
          const preview = skillsArr.slice(0, 3);
          const remaining = skillsArr.length - 3;

          return (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300"
            >
              <h3 className="font-semibold text-lg text-gray-800 truncate">
                {p.name || p.file_name || "Unknown"}
              </h3>

              <p className="text-sm text-gray-500 truncate">
                {p.current_designation || "Unknown"} @{" "}
                {p.current_company || "Unknown"}
              </p>

              <div className="mt-3 text-sm space-y-1">
                <p><b>Email:</b> {p.email || "N/A"}</p>
                <p><b>Phone:</b> {p.phone_number || "N/A"}</p>
                <p><b>Location:</b> {p.location || "N/A"}</p>
                <p><b>Experience:</b> {p.total_experience || "N/A"}</p>

                {/* Skills */}
                <div>
                  <b>Skills:</b>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {preview.map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {remaining > 0 && (
                      <span
                        className="text-xs text-blue-600 cursor-pointer font-medium"
                        onClick={() => setSelectedProfile(p)}
                      >
                        +{remaining} more
                      </span>
                    )}
                  </div>
                </div>

                <p><b>Education:</b> {p.education || "N/A"}</p>
              </div>

              {/* Match Score */}
              {p.match_score && (
                <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-sm">
                  <p><b>Match Score:</b> {p.match_score}%</p>
                  <p className="text-green-600"><b>Matched:</b> {p.matched_skills}</p>
                  <p className="text-red-600"><b>Missing:</b> {p.missing_skills}</p>
                  <p className="text-gray-600 mt-1">{p.gap_summary}</p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setSelectedProfile(p)}
                  className="flex-1 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg"
                >
                  View
                </button>
                <button
                  onClick={() => setSelectedProfile(p)}
                  className="flex-1 px-3 py-1 text-sm bg-gray-200 rounded-lg"
                >
                  Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 🔹 MODAL */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[650px] max-h-[90vh] overflow-y-auto rounded-xl p-6 relative shadow-xl">
            <button
              className="absolute top-3 right-3 text-gray-500 text-lg"
              onClick={() => setSelectedProfile(null)}
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-2">
              {selectedProfile.name || selectedProfile.file_name}
            </h2>

            <p className="text-gray-600 mb-4">
              {selectedProfile.current_designation} @{" "}
              {selectedProfile.current_company}
            </p>

            <div className="space-y-2 text-sm">
              <p><b>Email:</b> {selectedProfile.email}</p>
              <p><b>Phone:</b> {selectedProfile.phone_number}</p>
              <p><b>Location:</b> {selectedProfile.location}</p>
              <p><b>Experience:</b> {selectedProfile.total_experience}</p>

              <div>
                <b>Skills:</b>
                <div className="flex flex-wrap gap-2 mt-2">
                  {getSkillsArray(selectedProfile.skills).map((skill, i) => (
                    <span
                      key={i}
                      className={`${skillClass(skill)} px-3 py-1 rounded-full text-xs font-medium`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <p><b>Education:</b> {selectedProfile.education}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
