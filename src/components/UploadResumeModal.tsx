

// export default function UploadResumeModal({
//   jobId,
//   jobTitle,
//   onClose,
//   onSuccess,
// }: UploadResumeModalProps) {
//   const [files, setFiles] = useState<File[]>([]);
//   const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
//   const [loading, setLoading] = useState(false);
//   const API_BASE = import.meta.env.VITE_API_BASE_URL;
//   const folderInputRef = useRef<HTMLInputElement | null>(null);
//   const singleInputRef = useRef<HTMLInputElement | null>(null);
//   const [mode, setMode] = useState<"files" | "folderPath">("files");
//   const [folderPath, setFolderPath] = useState("");

//   /* Enable folder selection */
//   useEffect(() => {
//     if (folderInputRef.current) {
//       (folderInputRef.current as any).webkitdirectory = true;
//       (folderInputRef.current as any).directory = true;
//     }
//   }, []);

//   // const handleUpload = async () => {
//   //   if (files.length === 0) return;

//   //   setLoading(true);

//   //   try {
//   //     for (const file of files) {
//   //       const filePath = `${jobId}/${Date.now()}-${file.name}`;

//   //       // Init progress
//   //       setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }));

//   //       const interval = setInterval(() => {
//   //         setUploadProgress((prev) => {
//   //           const progress = prev[file.name] ?? 0;
//   //           if (progress >= 90) return prev;
//   //           return { ...prev, [file.name]: progress + 10 };
//   //         });
//   //       }, 200);

//   //       // Upload to Supabase Storage
//   //       const { error: uploadError } = await supabase.storage
//   //         .from('resumes')
//   //         .upload(filePath, file);

//   //       clearInterval(interval);
//   //       setUploadProgress((prev) => ({ ...prev, [file.name]: 100 }));

//   //       if (uploadError) throw uploadError;

//   //       // Create candidate
//   //       const { data: candidate, error: candidateError } = await supabase
//   //         .from('candidates')
//   //         .insert({
//   //           full_name: file.name.replace(/\.(pdf|doc|docx)$/i, ''),
//   //           resume_url: filePath,
//   //         })
//   //         .select()
//   //         .single();

//   //       if (candidateError) throw candidateError;

//   //       // Create application
//   //       const { error: applicationError } = await supabase
//   //         .from('applications')
//   //         .insert({
//   //           job_id: jobId,
//   //           candidate_id: candidate.id,
//   //           status: 'screening',
//   //           match_score: 0,
//   //         });

//   //       if (applicationError) throw applicationError;
//   //     }

//   //     toast.success(`${files.length} resume(s) uploaded successfully`);
//   //     onSuccess();
//   //   } catch (error) {
//   //     console.error(error);
//   //     toast.error('Failed to upload resumes');
//   //   } finally {
//   //     setLoading(false);
//   //     setFiles([]);
//   //     setUploadProgress({});
//   //   }
//   // };


// const handleUpload = async () => {
//   if (mode === "files" && files.length === 0) return;
//   if (mode === "folderPath" && !folderPath.trim()) {
//     toast.error("Enter server folder path");
//     return;
//   }

//   setLoading(true);

//   try {
//     // 🟢 MODE 1: USER FILE UPLOAD (single or multiple)
//     if (mode === "files") {
//       for (const file of files) {
//         const formData = new FormData();
//         formData.append("file", file);
//         formData.append("first_name", file.name.split(" ")[0] || "");
//         formData.append("last_name", "");
//         formData.append("email", "");

//         setUploadProgress(prev => ({ ...prev, [file.name]: 25 }));

//         const res = await fetch(
//           `${API_BASE}/api/v1/candidates/upload-resume`,
//           { method: "POST", body: formData }
//         );

//         setUploadProgress(prev => ({ ...prev, [file.name]: 70 }));

//         if (!res.ok) {
//           let msg = "Upload failed";
//           try {
//             const err = await res.json();
//             msg = err.detail || msg;
//           } catch {}
//           throw new Error(`${file.name}: ${msg}`);
//         }

//         await res.json();
//         setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
//       }

//       toast.success(`${files.length} resume(s) processed 🚀`);
//     }

//     // 🟣 MODE 2: SERVER FOLDER IMPORT
//     if (mode === "folderPath") {
//       const res = await fetch(
//         `${API_BASE}/api/v1/candidates/batch-upload-folder?folder_path=${encodeURIComponent(folderPath)}`,
//         { method: "POST" }
//       );

//       if (!res.ok) {
//         const err = await res.json();
//         throw new Error(err.detail || "Batch import failed");
//       }

//       const data = await res.json();
//       toast.success(`${data.processed || "All"} resumes imported 🚀`);
//     }

//     onSuccess();

//   } catch (err: any) {
//     console.error(err);
//     toast.error(err.message);
//   } finally {
//     setLoading(false);
//     setFiles([]);
//     setUploadProgress({});
//     setFolderPath("");
//   }
// };

//   const removeFile = (fileName: string) => {
//     setFiles((prev) => prev.filter((f) => f.name !== fileName));
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl w-full max-w-lg">

//         {/* Header */}
//         <div className="flex items-center justify-between px-6 py-4 border-b">
//           <div>
//             <h2 className="text-lg font-semibold text-gray-900">Upload Resumes</h2>
//             {jobTitle && (
//               <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full w-fit mt-2">
//                 <Briefcase className="w-4 h-4" />
//                 <span className="font-medium">{jobTitle}</span>
//               </div>
//             )}
//           </div>

//           <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="p-6">

//           {/* Hidden Inputs */}
//           <input
//             ref={folderInputRef}
//             type="file"
//             multiple
//             className="hidden"
//             onChange={(e) => {
//               const allFiles = Array.from(e.target.files || []);
//               const resumeFiles = allFiles.filter(file =>
//                 /\.(pdf|doc|docx)$/i.test(file.name)
//               );
//               setFiles(resumeFiles);
//             }}
//           />

//           <input
//             ref={singleInputRef}
//             type="file"
//             accept=".pdf,.doc,.docx"
//             className="hidden"
//             onChange={(e) => {
//               const file = e.target.files?.[0];
//               if (file) setFiles([file]);
//             }}
//           />


//           {/* Upload Options */}
//           <div className="grid grid-cols-2 gap-4">
//             <button
//               onClick={() => folderInputRef.current?.click()}
//               className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center hover:bg-blue-50 transition"
//             >
//               <Upload className="w-6 h-6 text-blue-600 mb-2" />
//               <p className="text-sm font-medium">Upload Folder</p>
//               <p className="text-xs text-gray-500 mt-1">Bulk resumes</p>
//             </button>

//             <button
//               onClick={() => singleInputRef.current?.click()}
//               className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center hover:bg-green-50 transition"
//             >
//               <FileText className="w-6 h-6 text-green-600 mb-2" />
//               <p className="text-sm font-medium">Upload Single</p>
//               <p className="text-xs text-gray-500 mt-1">One resume</p>
//             </button>
//           </div>

//           {/* Files List */}
//           {files.length > 0 && (
//             <div className="mt-4 space-y-2">
//               {files.map((file) => (
//                 <div key={file.name} className="border rounded p-2">
//                   <div className="flex justify-between items-center">
//                     <div className="flex items-center text-sm">
//                       <FileText className="w-4 h-4 mr-2" />
//                       {file.name}
//                     </div>
//                     <button
//                       onClick={() => removeFile(file.name)}
//                       className="text-red-500"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </div>

//                   <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
//                     <div
//                       className="bg-blue-600 h-2 rounded-full"
//                       style={{ width: `${uploadProgress[file.name] ?? 0}%` }}
//                     />
//                   </div>

//                   <div className="text-xs text-right text-gray-500 mt-1">
//                     {uploadProgress[file.name] ?? 0}%
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="px-6 py-4 border-t flex justify-end gap-2">
//           <button onClick={onClose} className="px-4 py-2 border rounded-lg">
//             Cancel
//           </button>
//           <button
//             onClick={handleUpload}
//             disabled={loading || files.length === 0}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
//           >
//             {loading ? 'Uploading...' : 'Upload'}
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }

// import { useState, useRef, useEffect } from "react";
// import { X, Upload, FileText, Briefcase } from "lucide-react";
// import toast from "react-hot-toast";

// /* ================= TYPES ================= */

// export interface ResumeProcess {
//   file: string;
//   status: "uploading" | "processing" | "completed" | "failed";
//   candidate_id?: string;
// }

// interface UploadResumeModalProps {
//   jobId: string;
//   jobTitle?: string;
//   onClose: () => void;
//   onSuccess: () => void;
//   onUploadProgress: (data: ResumeProcess[]) => void;
//   onExtracted: (profile: any) => void;
// }

// type Status = "waiting" | "uploading" | "processing" | "completed" | "error";

// /* ================= COMPONENT ================= */

// export default function UploadResumeModal({
//   jobTitle,
//   onClose,
//   onSuccess,
//   onUploadProgress,
//   onExtracted,
// }: UploadResumeModalProps) {
//   const API_BASE = import.meta.env.VITE_API_BASE_URL;

//   const [mode, setMode] = useState<"single" | "multiple" | "server">("single");
//   const [files, setFiles] = useState<File[]>([]);
//   const [folderPath, setFolderPath] = useState("");
//   const [loading, setLoading] = useState(false);

//   const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
//     {}
//   );
//   const [fileStatus, setFileStatus] = useState<Record<string, Status>>({});
//   const [serverResults, setServerResults] = useState<Record<string, any>>({});

//   const singleInputRef = useRef<HTMLInputElement | null>(null);
//   const folderInputRef = useRef<HTMLInputElement | null>(null);

//   useEffect(() => {
//     if (folderInputRef.current) {
//       (folderInputRef.current as any).webkitdirectory = true;
//     }
//   }, []);

//   /* ================= FILE SELECT ================= */

//   const handleFiles = (selected: File[]) => {
//     const resumeFiles = selected.filter((f) =>
//       /\.(pdf|doc|docx)$/i.test(f.name)
//     );

//     setFiles(resumeFiles);

//     const statusInit: any = {};
//     const progressInit: any = {};

//     resumeFiles.forEach((f) => {
//       statusInit[f.name] = "waiting";
//       progressInit[f.name] = 0;
//     });

//     setFileStatus(statusInit);
//     setUploadProgress(progressInit);

//     // Notify parent
//     onUploadProgress(
//       resumeFiles.map((f) => ({
//         file: f.name,
//         status: "uploading",
//       }))
//     );
//   };

//   /* ================= UPLOAD ================= */

//   const handleUpload = async () => {
//     if (mode === "single" && !folderPath.trim()) {
//       toast.error("Enter file path");
//       return;
//     }

//     /* 🟣 SERVER MODE → FOLDER EXTRACTION API */
//     if (mode === "server") {
//       if (!folderPath.trim()) {
//         toast.error("Enter server folder path");
//         return;
//       }

//       const folderName =
//         folderPath.split("\\").pop() || folderPath.split("/").pop() || "folder";

//       // UI row for batch
//       setFiles([{ name: folderName } as File]);
//       setFileStatus({ [folderName]: "processing" });
//       setUploadProgress({ [folderName]: 40 });
//       onUploadProgress([{ file: folderName, status: "processing" }]);

//       const url = `${API_BASE}/api/v1/profiles/extract`;
//       const payload = {
//         folder_path: folderPath,
//         recursive: false,
//         output_filename: "batch_output.json",
//         max_concurrent: 5,
//         enable_gap_analysis: false,
//         job_description: "",
//       };

//       console.log("📤 Sending folder extraction request:", payload);

//       const res = await fetch(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();
//       const flatProfiles = Array.isArray(data.profiles[0])
//   ? data.profiles.flat()
//   : data.profiles;

//       if (!res.ok) {
//         console.error("❌ Folder extraction failed:", data);
//         setFileStatus({ [folderName]: "error" });
//         setUploadProgress({ [folderName]: 0 });
//         onUploadProgress([{ file: folderName, status: "failed" }]);
//         toast.error(data?.detail || "Folder extraction failed");
//         return;
//       }

//       // Only pass the profiles array **after confirming success**
//       console.log("✅ Folder Extraction Result:", data);
//       onExtracted(flatProfiles || []);

//       setFileStatus({ [folderName]: "completed" });
//       setUploadProgress({ [folderName]: 100 });
//       onUploadProgress([{ file: folderName, status: "completed" }]);

//       toast.success("Folder profiles extracted 🚀");
//     }



//     if (mode === "multiple" && files.length === 0) return;

//     setLoading(true);

//     try {
//       /* 🟢 SINGLE MODE → FILE PATH API */
//       if (mode === "single") {
//         const fileName =
//           folderPath.split("\\").pop() || folderPath.split("/").pop() || "file";

//         setFiles([{ name: fileName } as File]);
//         setFileStatus({ [fileName]: "processing" });
//         setUploadProgress({ [fileName]: 50 });

//         onUploadProgress([{ file: fileName, status: "processing" }]);

//         const url = `${API_BASE}/api/v1/profiles/extract-single?file_path=${encodeURIComponent(
//           folderPath
//         )}`;

//         console.log("📤 Sending file path:", folderPath);
//         console.log("🌍 API URL:", url);

//         const res = await fetch(url, { method: "POST" });
//         const data = await res.json();
//         onExtracted(data);

//         if (!res.ok) {
//           console.error("❌ Extraction failed:", data);
//           setFileStatus({ [fileName]: "error" });
//           setUploadProgress({ [fileName]: 0 });
//           onUploadProgress([{ file: fileName, status: "failed" }]);
//           toast.error(data?.detail || "Extraction failed");
//           return;
//         }

//         console.log("✅ Extraction Result:", data);

//         setFileStatus({ [fileName]: "completed" });
//         setUploadProgress({ [fileName]: 100 });

//         onUploadProgress([
//           {
//             file: fileName,
//             status: "completed",
//             candidate_id: data?.candidate_id,
//           },
//         ]);

//         toast.success("Profile extracted successfully 🚀");
//       }

//       /* 🟦 MULTIPLE MODE (keep upload logic if needed) */
//       if (mode === "multiple") {
//         for (const file of files) {
//           const formData = new FormData();
//           formData.append("file", file);

//           setFileStatus((s) => ({ ...s, [file.name]: "uploading" }));
//           setUploadProgress((p) => ({ ...p, [file.name]: 30 }));
//           onUploadProgress([{ file: file.name, status: "uploading" }]);

//           const res = await fetch(
//             `${API_BASE}/api/v1/candidates/upload-resume`,
//             { method: "POST", body: formData }
//           );

//           if (!res.ok) {
//             setFileStatus((s) => ({ ...s, [file.name]: "error" }));
//             onUploadProgress([{ file: file.name, status: "failed" }]);
//             continue;
//           }

//           const data = await res.json();

//           setFileStatus((s) => ({ ...s, [file.name]: "completed" }));
//           setUploadProgress((p) => ({ ...p, [file.name]: 100 }));

//           onUploadProgress([
//             { file: file.name, status: "completed", candidate_id: data?.candidate_id },
//           ]);
//         }

//         toast.success("Resumes uploaded 🚀");
//       }

//       onSuccess();
//     } catch (err: any) {
//       console.error("🔥 Error:", err);
//       toast.error(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const statusColor = {
//     waiting: "bg-gray-100 text-gray-600",
//     uploading: "bg-blue-100 text-blue-600",
//     processing: "bg-yellow-100 text-yellow-700",
//     completed: "bg-green-100 text-green-700",
//     error: "bg-red-100 text-red-600",
//   };

//   /* ================= UI ================= */

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl w-full max-w-lg shadow-lg">
//         <div className="flex justify-between items-center px-6 py-4 border-b">
//           <div>
//             <h2 className="text-lg font-semibold">Upload Resumes</h2>
//             {jobTitle && (
//               <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full mt-2 w-fit">
//                 <Briefcase className="w-4 h-4" />
//                 {jobTitle}
//               </div>
//             )}
//           </div>
//           <button onClick={onClose}><X /></button>
//         </div>

//         <div className="p-6 space-y-4">
//           <div className="flex gap-2">
//             {["single", "multiple", "server"].map((m) => (
//               <button
//                 key={m}
//                 onClick={() => setMode(m as any)}
//                 className={`px-3 py-1 rounded border ${mode === m ? "bg-blue-600 text-white" : ""
//                   }`}
//               >
//                 {m}
//               </button>
//             ))}
//           </div>

//           {/* {mode === "single" && (
//             <>
//               <input
//                 ref={singleInputRef}
//                 type="text"
//                 hidden
//                 onChange={(e) =>
//                   handleFiles(e.target.files ? [e.target.files[0]] : [])
//                 }
//               />
//               <button
//                 onClick={() => singleInputRef.current?.click()}
//                 className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center"
//               >
//                 <FileText className="w-6 h-6 text-green-600 mb-2" />
//                 Upload Single Resume
//               </button>
//             </>
//           )} */}

//           {mode === "single" && (
//             <input
//               type="text"
//               placeholder="Enter full file path (C:\resume.pdf or /home/resume.pdf)"
//               value={folderPath}
//               onChange={(e) => setFolderPath(e.target.value)}
//               className="w-full border rounded p-2"
//             />
//           )}


//           {/* {mode === "multiple" && (
//             <>
//               <input
//                 ref={folderInputRef}
//                 type="file"
//                 multiple
//                 hidden
//                 onChange={(e) =>
//                   handleFiles(Array.from(e.target.files || []))
//                 }
//               />
//               <button
//                 onClick={() => folderInputRef.current?.click()}
//                 className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center"
//               >
//                 <Upload className="w-6 h-6 text-blue-600 mb-2" />
//                 Upload Multiple Resumes
//               </button>
//             </>
//           )} */}

//           {mode === "server" && (
//             <input
//               type="text"
//               placeholder="/home/resumes"
//               value={folderPath}
//               onChange={(e) => setFolderPath(e.target.value)}
//               className="w-full border rounded p-2"
//             />
//           )}

//           {files.map((file) => (
//             <div key={file.name} className="border rounded p-2">
//               <div className="flex justify-between text-sm">
//                 <span className="flex gap-2 items-center">
//                   <FileText className="w-4 h-4" /> {file.name}
//                 </span>
//                 <span className={`text-xs px-2 py-1 rounded-full ${statusColor[fileStatus[file.name]]}`}>
//                   {fileStatus[file.name]}
//                 </span>
//               </div>

//               <div className="w-full bg-gray-200 h-2 mt-2 rounded">
//                 <div
//                   className="bg-blue-600 h-2 rounded"
//                   style={{ width: `${uploadProgress[file.name] || 0}%` }}
//                 />
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="px-6 py-4 border-t flex justify-end gap-2">
//           <button onClick={onClose} className="border px-4 py-2 rounded">
//             Cancel
//           </button>
//           <button
//             onClick={handleUpload}
//             disabled={loading}
//             className="bg-blue-600 text-white px-4 py-2 rounded"
//           >
//             {loading ? "Uploading..." : "Upload"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState, useRef, useEffect } from "react";
import { X, FileText, Briefcase } from "lucide-react";
import toast from "react-hot-toast";

/* ================= TYPES ================= */

export interface ResumeProcess {
  file: string;
  status: "uploading" | "processing" | "completed" | "failed";
  candidate_id?: string;
}

export interface Profile {
  file_name: string;
  name: string;
  phone_number: string;
  email: string;
  current_company: string;
  current_designation: string;
  total_experience: string;
  skills: string;
  education: string;
  location: string;
  extraction_status: string;
  error_message?: string;
  match_score?: string;
  matched_skills?: string;
  missing_skills?: string;
  gap_summary?: string;
}

interface UploadResumeModalProps {
  jobId: string;
  jobTitle?: string;
  onClose: () => void;
  onSuccess: () => void;
  onUploadProgress: (data: ResumeProcess[]) => void;
  onExtracted: (profiles: Profile[]) => void;
}

type Status = "waiting" | "uploading" | "processing" | "completed" | "error";

/* ================= COMPONENT ================= */

export default function UploadResumeModal({
  jobTitle,
  onClose,
  onSuccess,
  onUploadProgress,
  onExtracted,
}: UploadResumeModalProps) {
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const [mode, setMode] = useState<"single" | "multiple" | "server">("single");
  const [files, setFiles] = useState<File[]>([]);
  const [folderPath, setFolderPath] = useState("");
  const [loading, setLoading] = useState(false);

  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [fileStatus, setFileStatus] = useState<Record<string, Status>>({});

  const singleInputRef = useRef<HTMLInputElement | null>(null);
  const folderInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (folderInputRef.current) {
      (folderInputRef.current as any).webkitdirectory = true;
    }
  }, []);

  /* ================= FILE SELECT ================= */
  const handleFiles = (selected: File[]) => {
    const resumeFiles = selected.filter((f) => /\.(pdf|doc|docx)$/i.test(f.name));
    setFiles(resumeFiles);

    const statusInit: any = {};
    const progressInit: any = {};
    resumeFiles.forEach((f) => {
      statusInit[f.name] = "waiting";
      progressInit[f.name] = 0;
    });

    setFileStatus(statusInit);
    setUploadProgress(progressInit);

    onUploadProgress(
      resumeFiles.map((f) => ({ file: f.name, status: "uploading" }))
    );
  };

  /* ================= UPLOAD ================= */
  const handleUpload = async () => {
    if ((mode === "single" || mode === "server") && !folderPath.trim()) {
      toast.error(`Enter ${mode === "single" ? "file" : "folder"} path`);
      return;
    }

    setLoading(true);

    try {
      /* 🟣 SERVER MODE → FOLDER EXTRACTION */
      if (mode === "server") {
        const folderName = folderPath.split("\\").pop() || folderPath.split("/").pop() || "folder";

        // UI placeholder
        setFiles([{ name: folderName } as File]);
        setFileStatus({ [folderName]: "processing" });
        setUploadProgress({ [folderName]: 40 });
        onUploadProgress([{ file: folderName, status: "processing" }]);

        const url = `${API_BASE}/api/v1/profiles/extract`;
        const payload = {
          folder_path: folderPath,
          recursive: false,
          output_filename: "batch_output.json",
          max_concurrent: 5,
          enable_gap_analysis: false,
          job_description: "",
        };

        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          setFileStatus({ [folderName]: "error" });
          setUploadProgress({ [folderName]: 0 });
          onUploadProgress([{ file: folderName, status: "failed" }]);
          toast.error(data?.message || "Folder extraction failed");
          return;
        }

        // Flatten in case API returns nested arrays
        const profiles: Profile[] = Array.isArray(data.profiles[0])
          ? data.profiles.flat()
          : data.profiles;

        onExtracted(profiles || []);
        setFileStatus({ [folderName]: "completed" });
        setUploadProgress({ [folderName]: 100 });
        onUploadProgress([{ file: folderName, status: "completed" }]);
        toast.success("Folder profiles extracted 🚀");
      }

      /* 🟢 SINGLE MODE → FILE PATH */
      if (mode === "single") {
        const fileName = folderPath.split("\\").pop() || folderPath.split("/").pop() || "file";

        setFiles([{ name: fileName } as File]);
        setFileStatus({ [fileName]: "processing" });
        setUploadProgress({ [fileName]: 50 });
        onUploadProgress([{ file: fileName, status: "processing" }]);

        const url = `${API_BASE}/api/v1/profiles/extract-single?file_path=${encodeURIComponent(folderPath)}`;
        const res = await fetch(url, { method: "POST" });
        const data = await res.json();

        if (!res.ok || !data.success) {
          setFileStatus({ [fileName]: "error" });
          setUploadProgress({ [fileName]: 0 });
          onUploadProgress([{ file: fileName, status: "failed" }]);
          toast.error(data?.message || "Extraction failed");
          return;
        }

        onExtracted(data.profiles || []);
        setFileStatus({ [fileName]: "completed" });
        setUploadProgress({ [fileName]: 100 });
        onUploadProgress([{ file: fileName, status: "completed", candidate_id: data.profiles[0]?.candidate_id }]);
        toast.success("Profile extracted successfully 🚀");
      }

      /* 🟦 MULTIPLE MODE → FILE UPLOAD */
      if (mode === "multiple" && files.length > 0) {
        for (const file of files) {
          const formData = new FormData();
          formData.append("file", file);

          setFileStatus((s) => ({ ...s, [file.name]: "uploading" }));
          setUploadProgress((p) => ({ ...p, [file.name]: 30 }));
          onUploadProgress([{ file: file.name, status: "uploading" }]);

          const res = await fetch(`${API_BASE}/api/v1/candidates/upload-resume`, { method: "POST", body: formData });
          if (!res.ok) {
            setFileStatus((s) => ({ ...s, [file.name]: "error" }));
            onUploadProgress([{ file: file.name, status: "failed" }]);
            continue;
          }

          const data = await res.json();
          setFileStatus((s) => ({ ...s, [file.name]: "completed" }));
          setUploadProgress((p) => ({ ...p, [file.name]: 100 }));
          onUploadProgress([{ file: file.name, status: "completed", candidate_id: data?.candidate_id }]);
        }
        toast.success("Resumes uploaded 🚀");
      }

      onSuccess();
    } catch (err: any) {
      console.error("🔥 Upload error:", err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const statusColor = {
    waiting: "bg-gray-100 text-gray-600",
    uploading: "bg-blue-100 text-blue-600",
    processing: "bg-yellow-100 text-yellow-700",
    completed: "bg-green-100 text-green-700",
    error: "bg-red-100 text-red-600",
  };

  /* ================= UI ================= */
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-lg">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-semibold">Upload Resumes</h2>
            {jobTitle && (
              <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full mt-2 w-fit">
                <Briefcase className="w-4 h-4" />
                {jobTitle}
              </div>
            )}
          </div>
          <button onClick={onClose}><X /></button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex gap-2">
            {["single", "multiple", "server"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m as any)}
                className={`px-3 py-1 rounded border ${mode === m ? "bg-blue-600 text-white" : ""}`}
              >
                {m}
              </button>
            ))}
          </div>

          {mode === "single" && (
            <input
              type="text"
              placeholder="Enter full file path (C:/resume.pdf or /home/resume.pdf)"
              value={folderPath}
              onChange={(e) => setFolderPath(e.target.value)}
              className="w-full border rounded p-2"
            />
          )}

          {mode === "server" && (
            <input
              type="text"
              placeholder="/home/resumes"
              value={folderPath}
              onChange={(e) => setFolderPath(e.target.value)}
              className="w-full border rounded p-2"
            />
          )}

          {files.map((file) => (
            <div key={file.name} className="border rounded p-2">
              <div className="flex justify-between text-sm">
                <span className="flex gap-2 items-center">
                  <FileText className="w-4 h-4" /> {file.name}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${statusColor[fileStatus[file.name]]}`}>
                  {fileStatus[file.name]}
                </span>
              </div>

              <div className="w-full bg-gray-200 h-2 mt-2 rounded">
                <div className="bg-blue-600 h-2 rounded" style={{ width: `${uploadProgress[file.name] || 0}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t flex justify-end gap-2">
          <button onClick={onClose} className="border px-4 py-2 rounded">Cancel</button>
          <button
            onClick={handleUpload}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}

