import React, { useState } from "react";
import { trackDocumentDownload } from "../utils/progressApi";

export default function DocumentList({ courseId, moduleId, documents }) {
  const [downloading, setDownloading] = useState(null);
  const [downloadedIds, setDownloadedIds] = useState([]);

  if (!documents || documents.length === 0) {
    return (
      <div className="rounded-2xl border border-orange-100 bg-orange-50/60 p-8 text-center">
        <p className="text-slate-600">No documents available for this module</p>
      </div>
    );
  }

  const handleDownload = async (doc) => {
    try {
      setDownloading(doc._id);

      // Track the download
      await trackDocumentDownload(courseId, moduleId, doc._id);

      // Mark as downloaded
      setDownloadedIds((prev) => [...new Set([...prev, doc._id])]);

      // Trigger actual download
      if (doc.downloadUrl) {
        const link = document.createElement("a");
        link.href = doc.downloadUrl;
        link.download = doc.title || "document";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error downloading document:", error);
      // Still trigger download even if tracking fails
      if (doc.downloadUrl) {
        window.open(doc.downloadUrl, "_blank");
      }
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="rounded-2xl border border-orange-100 bg-white shadow-sm overflow-hidden">
      <div className="p-6 border-b border-orange-100">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-orange-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          Module Documents ({documents.length})
        </h3>
      </div>

      <div className="divide-y divide-orange-100">
        {documents.map((doc) => {
          const isDownloaded = downloadedIds.includes(doc._id);
          const isDownloading = downloading === doc._id;

          return (
            <div key={doc._id} className="p-6 hover:bg-orange-50/30 transition">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900">{doc.title}</h4>
                  <p className="mt-1 text-sm text-slate-600">
                    {doc.uploadedAt
                      ? new Date(doc.uploadedAt).toLocaleDateString()
                      : "Uploaded recently"}
                  </p>
                </div>

                <button
                  onClick={() => handleDownload(doc)}
                  disabled={isDownloading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition whitespace-nowrap ${
                    isDownloaded
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                  } ${isDownloading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isDownloading ? (
                    <>
                      <svg
                        className="w-4 h-4 animate-spin"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Downloading...
                    </>
                  ) : isDownloaded ? (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                      Downloaded
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      Download
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
