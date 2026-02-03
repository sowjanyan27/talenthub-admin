
import { useState } from "react";
import type { Profile } from "./UploadResumeModal";
import { Award, Briefcase, BriefcaseBusiness, Download, Eye, FileText, GraduationCap, Mail, MapPin, Pencil, Phone, SquarePen, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  profiles: Profile[];
  excelFile?: string | null;
  setProfiles: React.Dispatch<React.SetStateAction<Profile[]>>;
}
type Status = "New" | "Screening" | "Interview" | "Rejected" | "Hired";


export default function ExtractedProfiles({ profiles, excelFile, setProfiles }: Props) {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [editMode, setEditMode] = useState(false);
  const [statusValue, setStatusValue] = useState<Status>("New");

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
      ? "bg-[linear-gradient(to_right,#0ea5e9,#06b6d4)] text-white"
      : "bg-[linear-gradient(to_right,#0ea5e9,#06b6d4)] text-white";

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
    <div className="pl-64 min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="flex items-center justify-end gap-3 max-w-7xl px-6 pt-6">
        <button
          onClick={() =>
            setViewMode(viewMode === "card" ? "table" : "card")
          }
          className="px-5 py-2 border bg-[linear-gradient(to_right,#3B82F6,#2563EB)] text-white rounded-lg shadow-sm text-sm font-medium hover:bg-gray-50 transition"
        >
          {viewMode === "card" ? "Switch to Table" : "Switch to Cards"}
        </button>

        {/* 🔹 Top Action Bar */}
        {excelFile && (
          <div className="">
            <button
              onClick={() => downloadExcel(excelFile)}
              className="flex items-center gap-2 px-5 py-2 bg-[linear-gradient(to_bottom_right,#4ade80,#22c55e,#16a34a)] text-sm text-white font-medium rounded-lg shadow hover:bg-green-700 transition"
            >
              <Download size={18} /> Download Excel
            </button>
          </div>
        )}
      </div>

      {/* 🔹 Profile List (Refined Horizontal View) */}
      {viewMode === "card" && (
        <div className="max-w-7xl mx-auto px-6 py-6 space-y-4">

          {profiles.map((p, i) => {
            const skillsArr = getSkillsArray(p.skills);
            const preview = skillsArr.slice(0, 8); // Show more skills now
            const remaining = skillsArr.length - 8;

            return (
              <div
                key={i}
                className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 p-5 flex flex-col gap-5"
              >
                {/* --- TOP ROW: Identity | Details | Actions --- */}
                <div className="flex flex-col xl:flex-row items-start xl:items-start gap-6">

                  {/* 1. Left: Identity (Narrower) */}
                  <div className="flex items-center gap-3 w-full xl:w-[220px] shrink-0">
                    <div className="shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md text-white">
                      <span className="text-lg font-bold">{p.name ? p.name.charAt(0).toUpperCase() : <FileText />}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors" title={p.name || p.file_name}>
                        {p.name || p.file_name || "Unknown"}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[150px]" title={`${p.current_designation || ""} @ ${p.current_company || ""}`}>
                        {p.current_designation || "No Role"}
                      </p>
                    </div>
                  </div>

                  {/* 2. Middle: Quick Stats & Contact (Expanded Grid) */}
                  <div className="flex-1 w-full grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 xl:border-l xl:px-6 xl:border-gray-100">

                    {/* Email */}
                    <div className="flex flex-col gap-1 min-w-0">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Mail size={12} /> Email
                      </p>
                      <p className="truncate font-medium text-gray-900 text-xs" title={p.email}>{p.email || "-"}</p>
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col gap-1 min-w-0">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Phone size={12} /> Phone
                      </p>
                      <p className="truncate font-medium text-gray-900 text-xs">{p.phone_number || "-"}</p>
                    </div>

                    {/* Experience */}
                    <div className="flex flex-col gap-1 min-w-0">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <BriefcaseBusiness size={12} /> Exp
                      </p>
                      <p className="truncate font-medium text-gray-900 text-xs">{p.total_experience || "-"}</p>
                    </div>

                    {/* Location */}
                    <div className="flex flex-col gap-1 min-w-0">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <MapPin size={12} /> Location
                      </p>
                      <p className="truncate font-medium text-gray-900 text-xs" title={p.location}>{p.location || "-"}</p>
                    </div>

                  </div>

                  {/* 3. Right: Score & Actions (Fixed Side Panel) */}
                  <div className="flex xl:flex-col items-center xl:items-end gap-3 w-full xl:w-auto shrink-0 justify-between xl:justify-start">

                    {/* Match Score */}
                    {p.match_score && (
                      <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg border border-emerald-100">
                        <span className="text-[10px] font-bold uppercase">Match</span>
                        <span className="text-sm font-black">{p.match_score}%</span>
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-2">
                      <button
                        // onClick={() => setSelectedProfile(p)}
                        onClick={() => {
                          setSelectedProfile(p);
                          setStatusValue(p.status || "New");
                          setEditMode(false);
                        }}

                        className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                      >
                        View
                      </button>
                      <button
                        // onClick={() => setSelectedProfile(p)}
                        onClick={() => {
                          setSelectedProfile(p);
                          setStatusValue(p.status || "New");
                          setEditMode(true);
                        }}

                        className="px-3 py-1.5 text-xs font-medium flex items-center justify-center rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition border border-gray-200"
                      >
                        {/* <SquarePen size={14} /> */}
                        Edit
                      </button>
                    </div>

                  </div>

                </div>

                {/* --- BOTTOM ROW: Skills --- */}
                <div className="border-t border-gray-50 pt-3 flex items-start gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-md bg-amber-50 flex items-center justify-center text-amber-600 mt-0.5">
                    <Award size={14} />
                  </div>
                  <div className="flex flex-wrap gap-1.5 flex-1">
                    {preview.length > 0 ? preview.map((skill, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-gray-50 border border-gray-100 text-gray-600 text-[10px] font-medium rounded-md">
                        {skill}
                      </span>
                    )) : <span className="text-xs text-gray-400 italic">No skills extracted</span>}
                    {remaining > 0 && (
                      <span className="px-2 py-0.5 bg-gray-50 border border-gray-100 text-gray-400 text-[10px] font-medium rounded-md hover:text-blue-600 cursor-pointer">
                        +{remaining} more
                      </span>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
      {viewMode === "table" && (
        <div className="w-full px-6 py-6">
          <div className="w-full overflow-hidden bg-white rounded-lg shadow ring-1 ring-gray-200">
            <table className="w-full table-fixed">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="w-[20%] px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name & Title
                  </th>
                  <th className="w-[15%] px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5" />
                      Email
                    </div>
                  </th>
                  <th className="w-[12%] px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5" />
                      Phone
                    </div>
                  </th>
                  <th className="w-[12%] px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5" />
                      Location
                    </div>
                  </th>
                  <th className="w-[8%] px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5" />
                      Exp
                    </div>
                  </th>
                  <th className="w-[20%] px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Award className="w-3.5 h-3.5" />
                      Skills
                    </div>
                  </th>
                  <th className="w-[10%] px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="w-[13%] px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {profiles.map((p, i) => {
                  const skillsArr = getSkillsArray(p.skills);
                  const preview = skillsArr.slice(0, 2);
                  const remaining = skillsArr.length - 2;
                  return (
                    <tr key={i} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <h3 className="text-sm font-semibold text-gray-900 truncate" title={p.name || p.file_name}>
                            {p.name || p.file_name || "Unknown"}
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5 truncate" title={`${p.current_designation || ""} @ ${p.current_company || ""}`}>
                            {p.current_designation || "No Role"}
                          </p>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-xs font-medium text-gray-700 truncate" title={p.email}>{p.email || "-"}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span className="text-xs text-gray-600 truncate block" title={p.phone_number}>{p.phone_number || "-"}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span className="text-xs text-gray-600 truncate block" title={p.location}>{p.location || "-"}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span className="text-xs text-gray-600 font-medium block">{p.total_experience || "-"}</span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-1.5">
                          {preview.map((skill, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 truncate max-w-full"
                            >
                              {skill}
                            </span>
                          ))}
                          {remaining > 0 && (
                            <span
                              className="text-[10px] text-gray-500 font-medium cursor-pointer hover:text-blue-600"
                              // onClick={() => setSelectedProfile(p)}
                              onClick={() => {
                                setSelectedProfile(p);
                                setStatusValue(p.status || "New");
                                setEditMode(false);
                              }}

                            >
                              +{remaining}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span
                          className={`text-[10px] px-2 py-1 rounded-full font-semibold
                             ${p.status === "Hired"
                              ? "bg-emerald-100 text-emerald-700"
                              : p.status === "Interview"
                                ? "bg-blue-100 text-blue-700"
                                : p.status === "Screening"
                                  ? "bg-amber-100 text-amber-700"
                                  : p.status === "Rejected"
                                    ? "bg-rose-100 text-rose-700"
                                    : "bg-gray-100 text-gray-600"
                            }`}
                        >
                          {p.status || "New"}
                        </span>
                      </td>

                      <td className="px-3 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            // onClick={() => setSelectedProfile(p)}
                            onClick={() => {
                              setSelectedProfile(p);
                              setStatusValue(p.status || "New");
                              setEditMode(false);
                            }}

                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="View"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            // onClick={() => setSelectedProfile(p)}
                            onClick={() => {
                              setSelectedProfile(p);
                              setStatusValue(p.status || "New");
                              setEditMode(true);
                            }}

                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
            <motion.div initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              className="fixed top-0 right-0 h-full w-[28.125rem] bg-white shadow-2xl z-50 p-6 overflow-y-auto">
              <button
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 transition-colors"
                onClick={() => setSelectedProfile(null)}
              >
                <X className="w-6 h-6 text-slate-400 hover:text-slate-600" />
              </button>
              <div className="border-b border-slate-100 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-1">
                  {selectedProfile.name || selectedProfile.file_name}
                </h2>

                <p className="text-[0.90rem] text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 font-medium">
                  {selectedProfile.current_designation} @{" "}
                  {selectedProfile.current_company}
                </p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-[linear-gradient(to_bottom_right,#eff6ff,#eef2ff)] flex items-center justify-center flex-shrink-0">
                    <Mail size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Email</p>
                    <p className="text-slate-900">{selectedProfile.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-[linear-gradient(to_bottom_right,#ecfdf5,#f0fdfa)] flex items-center justify-center flex-shrink-0">
                    <Phone size={18} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Phone</p>
                    <p className="text-slate-900">{selectedProfile.phone_number}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-[linear-gradient(to_bottom_right,#f5f3ff,#faf5ff)] flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} className="text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Location</p>
                    <p className="text-slate-900">{selectedProfile.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-[linear-gradient(to_bottom_right,#f1efff,#e0e7ff)] flex items-center justify-center flex-shrink-0">
                    <BriefcaseBusiness size={18} className="text-[#2944f8]" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Experience</p>
                    <p className="text-slate-900"> {selectedProfile.total_experience}</p>
                  </div>
                </div>
            
                <div className="pt-4">
                  <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4 border-l-4 border-blue-500 pl-4">Skills</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {getSkillsArray(selectedProfile.skills).map((skill, i) => (
                      <span
                        key={i}
                        className={`${skillClass(skill)} px-3 py-1 rounded-full text-xs font-normal`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-5">
                  <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 mb-4 border-l-4 border-emerald-500 pl-4">
                    Education
                  </h2>
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200/50"
                    >
                      <p className="text-slate-700 leading-relaxed">{selectedProfile.education}</p>
                    </div>
                  </div>
                </div>
                  {editMode && (
                  <div className="pt-5">
                    <h2 className="text-lg font-bold text-slate-800 mb-2">Update Status</h2>

                    <select
                      value={statusValue}
                     onChange={(e) => setStatusValue(e.target.value as Status)}
                      className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option>New</option>
                      <option>Screening</option>
                      <option>Interview</option>
                      <option>Hired</option>
                      <option>Rejected</option>
                    </select>

                    <button
                      onClick={() => {
                        if (!selectedProfile) return;

                        setProfiles((prev) =>
                          prev.map((prof) =>
                            prof === selectedProfile
                              ? { ...prof, status: statusValue }
                              : prof
                          )
                        );

                        setSelectedProfile({ ...selectedProfile, status: statusValue });
                        setEditMode(false);
                      }}

                      className="mt-3 w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
