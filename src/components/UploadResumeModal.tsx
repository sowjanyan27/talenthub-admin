
import { useState, useRef, useEffect } from "react";
import { X, FileText, Briefcase } from "lucide-react";
import toast from "react-hot-toast";
import { apiQueue } from "../utils/requestQueue";


async function fetchWithRetry(
  url: string,
  options?: RequestInit,
  maxRetries = 3
): Promise<Response> {
  return apiQueue.enqueue(async () => {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const res = await fetch(url, options);

      if (res.status === 429 && attempt < maxRetries) {
        const retryAfter = res.headers.get("Retry-After");
        const delay = retryAfter
          ? parseInt(retryAfter, 10) * 1000
          : Math.min(2000 * 2 ** attempt, 30000); // 2s, 4s, 8s … cap 30s
        toast(`Rate limited — retrying in ${Math.round(delay / 1000)}s…`, {
          icon: "⏳",
        });
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }

      return res;
    }

    throw new Error("Max retries exceeded (429 rate limit)");
  });
}

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
          max_concurrent: 2,
          enable_gap_analysis: false,
          job_description: "",
        };

        const res = await fetchWithRetry(url, {
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
        const res = await fetchWithRetry(url, { method: "POST" });
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
        const uploadOne = async (file: File) => {
          const formData = new FormData();
          formData.append("file", file);

          setFileStatus((s) => ({ ...s, [file.name]: "uploading" }));
          setUploadProgress((p) => ({ ...p, [file.name]: 30 }));
          onUploadProgress([{ file: file.name, status: "uploading" }]);

          const res = await fetchWithRetry(`${API_BASE}/api/v1/candidates/upload-resume`, { method: "POST", body: formData });
          if (!res.ok) {
            setFileStatus((s) => ({ ...s, [file.name]: "error" }));
            onUploadProgress([{ file: file.name, status: "failed" }]);
            return;
          }

          const data = await res.json();
          setFileStatus((s) => ({ ...s, [file.name]: "completed" }));
          setUploadProgress((p) => ({ ...p, [file.name]: 100 }));
          onUploadProgress([{ file: file.name, status: "completed", candidate_id: data?.candidate_id }]);
        };

        await Promise.allSettled(files.map((f) => uploadOne(f)));
        toast.success("Resumes uploaded 🚀");
      }

      onSuccess();
    } catch (err: any) {
      console.error("🔥 Upload error:", err);
      if (err.message?.includes("429") || err.message?.includes("rate limit")) {
        toast.error("Too many requests — please wait a moment and try again.");
      } else {
        toast.error(err.message);
      }
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

