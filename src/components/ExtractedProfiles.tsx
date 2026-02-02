import type 
{ Profile } from "./UploadResumeModal";

interface Props {
  profiles: Profile[];
}

export default function ExtractedProfiles({ profiles }: Props) {
  if (!profiles.length) return null;

  return (
    <div className="ml-64 flex-1 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {profiles.map((p, i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow-md p-5 border hover:shadow-lg transition"
        >
          {/* Use file_name as fallback */}
          <h3 className="font-bold text-lg">{p.name || p.file_name || "Unknown"}</h3>
          <p className="text-sm text-gray-500">
            {(p.current_designation || "Unknown")} @ {(p.current_company || "Unknown")}
          </p>

          <div className="mt-3 text-sm space-y-1">
            <p><b>Email:</b> {p.email || "N/A"}</p>
            <p><b>Phone:</b> {p.phone_number || "N/A"}</p>
            <p><b>Location:</b> {p.location || "N/A"}</p>
            <p><b>Experience:</b> {p.total_experience || "N/A"}</p>
            <p><b>Skills:</b> {p.skills || "N/A"}</p>
            <p><b>Education:</b> {p.education || "N/A"}</p>
          </div>

          {/* Match Score Section */}
          {p.match_score && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm">
              <p><b>Match Score:</b> {p.match_score}%</p>
              <p className="text-green-600"><b>Matched:</b> {p.matched_skills || "N/A"}</p>
              <p className="text-red-600"><b>Missing:</b> {p.missing_skills || "N/A"}</p>
              <p className="text-gray-600 mt-1">{p.gap_summary || ""}</p>
            </div>
          )}

          {/* Extraction error */}
          {p.extraction_status === "failed" && (
            <p className="text-red-500 text-sm mt-2">{p.error_message || "Failed to extract profile"}</p>
          )}
        </div>
      ))}
    </div>
  );
}
