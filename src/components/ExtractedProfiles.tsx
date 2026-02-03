
import { useState } from "react";
import type { Profile } from "./UploadResumeModal";
import { Award, BriefcaseBusiness, Download, Eye, FileText, GraduationCap, Mail, MapPin, Phone, SquarePen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
      <div className="max-w-7xl mx-auto px-6 py-6 grid gap-6 
        grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">

        {profiles.map((p, i) => {
          const skillsArr = getSkillsArray(p.skills);
          const preview = skillsArr.slice(0, 3);
          const remaining = skillsArr.length - 3;

          return (
            <div
              key={i}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-gray-100"
            >
              <div className="p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-[linear-gradient(to_bottom_right,#3B82F6,#4F46E5)] flex items-center justify-center shadow-md">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate leading-tight">
                      {p.name || p.file_name || "Unknown"}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5 truncate">
                      {p.current_designation || "Unknown"} @{" "}
                      {p.current_company || "Unknown"}
                    </p>
                  </div>
                </div>

                <div className="mt-3 text-sm space-y-1">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-[linear-gradient(to_bottom_right,#60A5FA,#2563EB)] flex items-center justify-center shadow-sm">
                      <Mail size={18} className="text-white"/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Email</p>
                      <p className="text-[0.80rem] font-medium text-gray-700 truncate">
                        {p.email || "N/A"}
                      </p>
                    </div>
                  </div>


                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-[linear-gradient(to_bottom_right,#4ADE80,#16A34A)] flex items-center justify-center shadow-sm">
                      <Phone size={18} className="text-white"/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Phone</p>
                      <p className="text-[0.80rem]  font-medium text-gray-700 truncate">
                        {p.phone_number || "N/A"}
                      </p>
                    </div>
                  </div>
                  

                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-[linear-gradient(to_bottom_right,#F87171,#DC2626)] flex items-center justify-center shadow-sm">
                      <MapPin size={18} className="text-white"/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Location</p>
                      <p className="text-[0.80rem]  font-medium text-gray-700 truncate">
                        {p.location || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-[linear-gradient(to_bottom_right,#C084FC,#9333EA)] flex items-center justify-center shadow-sm">
                      <BriefcaseBusiness size={18} className="text-white"/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Experience</p>
                      <p className="text-[0.80rem]  font-medium text-gray-700 truncate">
                        {p.total_experience || "N/A"}
                      </p>
                    </div>
                  </div>
                  

                  {/* Skills */}

                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-[linear-gradient(to_bottom_right,#FBBF24,#D97706)] flex items-center justify-center shadow-sm">
                      <Award size={18} className="text-white"/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Skills</p>
                      <p className="text-[0.80rem]  font-medium text-gray-700 truncate">
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
                      </p>
                    </div>
                  </div>
                  
                  
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-[linear-gradient(to_bottom_right,#818CF8,#4F46E5)] flex items-center justify-center shadow-sm">
                      <GraduationCap size={18} className="text-white"/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Education</p>
                      <p className="text-[0.80rem]  font-medium text-gray-700 truncate">
                        {p.education || "N/A"}
                      </p>
                    </div>
                  </div>
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
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-[linear-gradient(to_right,#3B82F6,#2563EB)] text-white rounded-lg"
                  >
                    <Eye size={19} /> View
                  </button>
                  <button
                    onClick={() => setSelectedProfile(p)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-[linear-gradient(to_bottom_right,#22D3EE,#2563EB)] text-white rounded-lg"
                  ><SquarePen size={19} />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 🔹 MODAL */}
      <AnimatePresence>
      {selectedProfile && (
        <>
         <motion.div
          className="fixed inset-0 bg-black/40 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedProfile(null)}
        />
        <motion.div  initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className="fixed top-0 right-0 h-full w-88 bg-white shadow-2xl z-50 p-6 overflow-y-auto">
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
          </motion.div>
        </>
      )}
      </AnimatePresence>
    </div>
  );
}
