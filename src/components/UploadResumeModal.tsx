// import { useState } from 'react';
// import { X, Upload, FileText, Trash2, Briefcase } from 'lucide-react';
// import { supabase } from '../lib/supabase';
// import toast from 'react-hot-toast';

// interface UploadResumeModalProps {
//   jobId: string;
//   jobTitle?: string;
//   onClose: () => void;
//   onSuccess: () => void;
// }

// export default function UploadResumeModal({
//   jobId,
//   jobTitle,
//   onClose,
//   onSuccess,
// }: UploadResumeModalProps) {
//   const [files, setFiles] = useState<File[]>([]);
//   const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
//   const [loading, setLoading] = useState(false);
//   const [dragActive, setDragActive] = useState(false);

//   const handleUpload = async () => {
//     if (files.length === 0) return;

//     setLoading(true);

//     try {
//       for (const file of files) {
//         const filePath = `${jobId}/${Date.now()}-${file.name}`;

//         // Simulate progress for demo
//         setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }));
//         const interval = setInterval(() => {
//           setUploadProgress((prev) => {
//             const progress = prev[file.name] ?? 0;
//             if (progress >= 90) return prev;
//             return { ...prev, [file.name]: progress + 10 };
//           });
//         }, 200);

//         // Upload file
//         const { error: uploadError } = await supabase.storage
//           .from('resumes')
//           .upload(filePath, file);

//         clearInterval(interval);
//         setUploadProgress((prev) => ({ ...prev, [file.name]: 100 }));

//         if (uploadError) throw uploadError;

//         // Create candidate
//         const { data: candidate, error: candidateError } = await supabase
//           .from('candidates')
//           .insert({
//             full_name: file.name.replace(/\.(pdf|doc|docx)$/i, ''),
//             resume_url: filePath,
//           })
//           .select()
//           .single();

//         if (candidateError) throw candidateError;

//         // Create application
//         const { error: applicationError } = await supabase
//           .from('applications')
//           .insert({
//             job_id: jobId,
//             candidate_id: candidate.id,
//             status: 'screening',
//             match_score: 0,
//           });

//         if (applicationError) throw applicationError;
//       }

//       toast.success(`${files.length} resume(s) uploaded successfully!`);
//       onSuccess();
//     } catch (error) {
//       console.error('Resume upload failed:', error);
//       toast.error('Failed to upload resume(s)');
//     } finally {
//       setLoading(false);
//       setFiles([]);
//       setUploadProgress({});
//     }
//   };

//   const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
//     e.preventDefault();
//     setDragActive(false);
//     if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
//       setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
//     }
//   };

//   const removeFile = (fileName: string) => {
//     setFiles((prev) => prev.filter((f) => f.name !== fileName));
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl w-full max-w-lg">
//         {/* Header */}
//         {/* Header */}
// <div className="flex items-center justify-between px-6 py-4 border-b">
//   <div>
//     <h2 className="text-lg font-semibold text-gray-900 mb-2">Upload Resumes</h2>

//     {/* Job Title Highlight */}
//     <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full w-fit">
//       <Briefcase  className="w-4 h-4" />
//       <span className="font-medium">{jobTitle}</span>
//     </div>
//   </div>

//   <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
//     <X className="w-5 h-5" />
//   </button>
// </div>


//         {/* Body */}
//         <div className="p-6">
//           {/* Drag-and-Drop */}
//           <label
//             className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition ${
//               dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
//             }`}
//             onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
//             onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
//             onDrop={handleDrop}
//           >
//             <Upload className="w-8 h-8 text-gray-400 mb-2" />
//             <p className="text-sm text-gray-600">
//               Click or drag PDF / DOCX files
//             </p>
//             {/* <input
//               type="file"
//               accept=".pdf,.doc,.docx"
//               multiple
//               className="hidden"
//               onChange={(e) => setFiles((prev) => [...prev, ...Array.from(e.target.files || [])])}
//             /> */}
//             <input
//   type="file"
//   multiple
//   className="hidden"
//   ref={(el) => {
//     if (el) {
//       // Enable folder selection safely
//       (el as any).webkitdirectory = true;
//       (el as any).directory = true;
//     }
//   }}
//   onChange={(e) => {
//     const allFiles = Array.from(e.target.files || []);

//     // Filter resumes AFTER folder selection
//     const resumeFiles = allFiles.filter(file =>
//       /\.(pdf|doc|docx)$/i.test(file.name)
//     );

//     setFiles(resumeFiles);
//   }}
// />

//           </label>

//           {/* Files List with Progress and Remove */}
//           {files.length > 0 && (
//             <div className="mt-4 space-y-2">
//               {files.map((file) => (
//                 <div key={file.name} className="flex flex-col border rounded p-2">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center text-sm text-gray-700">
//                       <FileText className="w-4 h-4 mr-2" />
//                       {file.name}
//                     </div>
//                     <button
//                       onClick={() => removeFile(file.name)}
//                       className="text-red-500 hover:text-red-700"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </div>
//                   <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
//                     <div
//                       className="bg-blue-600 h-2 rounded-full transition-all"
//                       style={{ width: `${uploadProgress[file.name] ?? 0}%` }}
//                     />
//                   </div>
//                   <div className="text-right text-xs text-gray-500 mt-1">
//                     {uploadProgress[file.name] ?? 0}%
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="px-6 py-4 border-t flex justify-end gap-2">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 border rounded-lg"
//           >
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
import { useState, useRef, useEffect } from 'react';
import { X, Upload, FileText, Trash2, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

interface UploadResumeModalProps {
  jobId: string;
  jobTitle?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UploadResumeModal({
  jobId,
  jobTitle,
  onClose,
  onSuccess,
}: UploadResumeModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const folderInputRef = useRef<HTMLInputElement | null>(null);
  const singleInputRef = useRef<HTMLInputElement | null>(null);

  /* Enable folder selection */
  useEffect(() => {
    if (folderInputRef.current) {
      (folderInputRef.current as any).webkitdirectory = true;
      (folderInputRef.current as any).directory = true;
    }
  }, []);

  // const handleUpload = async () => {
  //   if (files.length === 0) return;

  //   setLoading(true);

  //   try {
  //     for (const file of files) {
  //       const filePath = `${jobId}/${Date.now()}-${file.name}`;

  //       // Init progress
  //       setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }));

  //       const interval = setInterval(() => {
  //         setUploadProgress((prev) => {
  //           const progress = prev[file.name] ?? 0;
  //           if (progress >= 90) return prev;
  //           return { ...prev, [file.name]: progress + 10 };
  //         });
  //       }, 200);

  //       // Upload to Supabase Storage
  //       const { error: uploadError } = await supabase.storage
  //         .from('resumes')
  //         .upload(filePath, file);

  //       clearInterval(interval);
  //       setUploadProgress((prev) => ({ ...prev, [file.name]: 100 }));

  //       if (uploadError) throw uploadError;

  //       // Create candidate
  //       const { data: candidate, error: candidateError } = await supabase
  //         .from('candidates')
  //         .insert({
  //           full_name: file.name.replace(/\.(pdf|doc|docx)$/i, ''),
  //           resume_url: filePath,
  //         })
  //         .select()
  //         .single();

  //       if (candidateError) throw candidateError;

  //       // Create application
  //       const { error: applicationError } = await supabase
  //         .from('applications')
  //         .insert({
  //           job_id: jobId,
  //           candidate_id: candidate.id,
  //           status: 'screening',
  //           match_score: 0,
  //         });

  //       if (applicationError) throw applicationError;
  //     }

  //     toast.success(`${files.length} resume(s) uploaded successfully`);
  //     onSuccess();
  //   } catch (error) {
  //     console.error(error);
  //     toast.error('Failed to upload resumes');
  //   } finally {
  //     setLoading(false);
  //     setFiles([]);
  //     setUploadProgress({});
  //   }
  // };
const handleUpload = async () => {
  if (files.length === 0) return;
  setLoading(true);

  try {
    // 👉 SINGLE RESUME → CALL BACKEND API
    if (files.length === 1) {
      const file = files[0];

      const formData = new FormData();
      formData.append("file", file);
      formData.append("first_name", file.name.split(" ")[0] || "");
      formData.append("last_name", "");
      formData.append("email", "");

      setUploadProgress({ [file.name]: 30 });

      const res = await fetch(
        `${API_BASE}/api/v1/candidates/upload-resume`,
        {
          method: "POST",
          body: formData,
        }
      );

      setUploadProgress({ [file.name]: 70 });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Upload failed");
      }

      const data = await res.json();
      console.log("Resume processed:", data);

      setUploadProgress({ [file.name]: 100 });

      toast.success("Resume parsed & candidate created!");
      onSuccess();
    }

    // 👉 MULTIPLE FILES → old Supabase flow (optional)
    else {
      for (const file of files) {
        // keep your existing Supabase logic here
      }
    }

  } catch (error) {
    console.error(error);
    toast.error("Resume upload failed");
  } finally {
    setLoading(false);
    setFiles([]);
    setUploadProgress({});
  }
};
  const removeFile = (fileName: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== fileName));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Upload Resumes</h2>
            {jobTitle && (
              <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full w-fit mt-2">
                <Briefcase className="w-4 h-4" />
                <span className="font-medium">{jobTitle}</span>
              </div>
            )}
          </div>

          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">

          {/* Hidden Inputs */}
          <input
            ref={folderInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              const allFiles = Array.from(e.target.files || []);
              const resumeFiles = allFiles.filter(file =>
                /\.(pdf|doc|docx)$/i.test(file.name)
              );
              setFiles(resumeFiles);
            }}
          />

          <input
            ref={singleInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setFiles([file]);
            }}
          />

          {/* Upload Options */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => folderInputRef.current?.click()}
              className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center hover:bg-blue-50 transition"
            >
              <Upload className="w-6 h-6 text-blue-600 mb-2" />
              <p className="text-sm font-medium">Upload Folder</p>
              <p className="text-xs text-gray-500 mt-1">Bulk resumes</p>
            </button>

            <button
              onClick={() => singleInputRef.current?.click()}
              className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center hover:bg-green-50 transition"
            >
              <FileText className="w-6 h-6 text-green-600 mb-2" />
              <p className="text-sm font-medium">Upload Single</p>
              <p className="text-xs text-gray-500 mt-1">One resume</p>
            </button>
          </div>

          {/* Files List */}
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map((file) => (
                <div key={file.name} className="border rounded p-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm">
                      <FileText className="w-4 h-4 mr-2" />
                      {file.name}
                    </div>
                    <button
                      onClick={() => removeFile(file.name)}
                      className="text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${uploadProgress[file.name] ?? 0}%` }}
                    />
                  </div>

                  <div className="text-xs text-right text-gray-500 mt-1">
                    {uploadProgress[file.name] ?? 0}%
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={loading || files.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </div>

      </div>
    </div>
  );
}
