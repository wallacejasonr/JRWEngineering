"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

type FileRow = {
  id: string;
  name: string;
  originalName: string;
  sizeBytes: number;
  mimeType: string | null;
  createdAt: string;
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function FilesSection({
  projectId,
  files,
}: {
  projectId: string;
  files: FileRow[];
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setError(null);

    for (const file of Array.from(fileList)) {
      try {
        setUploading(true);
        setProgress(0);

        // 1. Get presigned URL
        const presignRes = await fetch("/api/files/presign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId,
            filename: file.name,
            contentType: file.type || "application/octet-stream",
            sizeBytes: file.size,
          }),
        });
        if (!presignRes.ok) {
          const data = await presignRes.json().catch(() => ({}));
          throw new Error(data.error ?? "Failed to get upload URL");
        }
        const { url, key } = (await presignRes.json()) as {
          url: string;
          key: string;
        };

        // 2. PUT directly to S3 with XHR for progress
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("PUT", url);
          xhr.setRequestHeader(
            "Content-Type",
            file.type || "application/octet-stream"
          );
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              setProgress(Math.round((e.loaded / e.total) * 100));
            }
          };
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve();
            } else {
              reject(new Error(`S3 upload failed: ${xhr.status}`));
            }
          };
          xhr.onerror = () => reject(new Error("Network error"));
          xhr.send(file);
        });

        // 3. Save metadata
        const metaRes = await fetch("/api/files", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId,
            name: file.name,
            originalName: file.name,
            s3Key: key,
            mimeType: file.type || undefined,
            sizeBytes: file.size,
          }),
        });
        if (!metaRes.ok) {
          throw new Error("Failed to save file metadata");
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
        break;
      }
    }

    setUploading(false);
    setProgress(0);
    if (inputRef.current) inputRef.current.value = "";
    router.refresh();
  }

  async function handleDelete(fileId: string, name: string) {
    if (!confirm(`Delete ${name}?`)) return;
    const res = await fetch(`/api/files/${fileId}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Failed to delete file.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200">
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Files</h2>
        <div>
          <input
            ref={inputRef}
            type="file"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
            id={`file-upload-${projectId}`}
          />
          <label
            htmlFor={`file-upload-${projectId}`}
            className={`text-sm font-medium px-3 py-1.5 rounded-md cursor-pointer ${uploading ? "bg-slate-100 text-slate-400 cursor-wait" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
          >
            {uploading ? `Uploading… ${progress}%` : "+ Upload Files"}
          </label>
        </div>
      </div>

      {error && (
        <div className="px-6 py-3 bg-red-50 border-b border-red-100 text-sm text-red-700">
          {error}
        </div>
      )}

      {files.length === 0 ? (
        <p className="px-6 py-8 text-sm text-slate-500 text-center">No files yet.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {files.map((file) => (
            <li
              key={file.id}
              className="px-6 py-4 flex items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <a
                  href={`/api/files/${file.id}/download`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 truncate block"
                >
                  {file.originalName}
                </a>
                <p className="text-xs text-slate-500">
                  {formatSize(file.sizeBytes)} · {formatDate(file.createdAt)}
                </p>
              </div>
              <button
                onClick={() => handleDelete(file.id, file.originalName)}
                className="text-xs text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
