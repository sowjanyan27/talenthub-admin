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

interface Props {
  profiles: Profile[];
  excelFile?: string | null;
}

export default function ExtractedProfiles({ profiles ,excelFile}: Props) {
  console.log("📄 excelFile in ExtractedProfiles:", excelFile);
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

  /* ---------------- UI ---------------- */

  const downloadExcel = async (fileName: string) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:9099/api/v1/profiles/download/${fileName}`,
        { method: "GET" }
      );

      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
     {excelFile && (
  <div className="ml-64 px-6 mb-4">
    <button
      onClick={() => downloadExcel(excelFile)}
      className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
    >
      ⬇ Download Excel
    </button>
  </div>
)}
      <div className="ml-64 flex-1 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       

        {profiles.map((p, i) => {
          const skillsArr = getSkillsArray(p.skills);
          const preview = skillsArr.slice(0, 3);
          const remaining = skillsArr.length - 3;

          return (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md p-5 border hover:shadow-lg transition"
            >
              <h3 className="font-bold text-lg">
                {p.name || p.file_name || "Unknown"}
              </h3>

              <p className="text-sm text-gray-500">
                {p.current_designation || "Unknown"} @{" "}
                {p.current_company || "Unknown"}
              </p>

              <div className="mt-3 text-sm space-y-1">
                <p><b>Email:</b> {p.email || "N/A"}</p>
                <p><b>Phone:</b> {p.phone_number || "N/A"}</p>
                <p><b>Location:</b> {p.location || "N/A"}</p>
                <p><b>Experience:</b> {p.total_experience || "N/A"}</p>

                {/* Skills Preview */}
                <p>
                  <b>Skills:</b>{" "}
                  {skillsArr.length === 0 ? (
                    "N/A"
                  ) : (
                    <>
                      {preview.join(" • ")}
                      {remaining > 0 && (
                        <span
                          className="text-blue-600 cursor-pointer font-medium"
                          onClick={() => setSelectedProfile(p)}
                        >
                          {" "}+{remaining} more
                        </span>
                      )}
                    </>
                  )}
                </p>

                <p><b>Education:</b> {p.education || "N/A"}</p>
              </div>

              {/* Match Score */}
              {p.match_score && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm">
                  <p><b>Match Score:</b> {p.match_score}%</p>
                  <p className="text-green-600"><b>Matched:</b> {p.matched_skills || "N/A"}</p>
                  <p className="text-red-600"><b>Missing:</b> {p.missing_skills || "N/A"}</p>
                  <p className="text-gray-600 mt-1">{p.gap_summary || ""}</p>
                </div>
              )}

              {/* Extraction Error */}
              {p.extraction_status === "failed" && (
                <p className="text-red-500 text-sm mt-2">
                  {p.error_message || "Failed to extract profile"}
                </p>
              )}

              {/* Buttons */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setSelectedProfile(p)}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded"
                >
                  View
                </button>
                <button
                  onClick={() => setSelectedProfile(p)}
                  className="px-3 py-1 text-sm bg-gray-200 rounded"
                >
                  Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ---------------- MODAL ---------------- */}
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
              {selectedProfile.current_designation} @ {selectedProfile.current_company}
            </p>

            <div className="space-y-2 text-sm">
              <p><b>Email:</b> {selectedProfile.email}</p>
              <p><b>Phone:</b> {selectedProfile.phone_number}</p>
              <p><b>Location:</b> {selectedProfile.location}</p>
              <p><b>Experience:</b> {selectedProfile.total_experience}</p>

              {/* Full Skills */}
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
    </>
  );
}
