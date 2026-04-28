import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ModuleDetail() {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [module, setModule] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Auth guard
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");

        // Get course
        const courseRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/courses/${courseId}`,
        );
        const courseData = await courseRes.json();

        const moduleData = courseData.modules.find((m) => m._id === moduleId);

        setModule(moduleData);

        // Get user progress
        const userRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const userData = await userRes.json();

        // Enrollment check
        const isEnrolled = userData.enrolledCourses?.some(
          (c) => (c._id || c).toString() === courseId,
        );

        console.log("isEnrolled:", isEnrolled);

        if (!isEnrolled) {
          console.log("❌ Not enrolled → redirecting");
          navigate("/");
          return;
        }

        const moduleProgress =
          userData.progress?.[courseId]?.modules?.[moduleId]?.progress || 0;

        setProgress(moduleProgress);
      } catch (err) {
        console.error("Error loading module:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) fetchData();
  }, [courseId, moduleId, isAuthenticated, navigate]);

  // 🔥 Progress update handler (READY for backend)
  const updateProgress = async (value) => {
    try {
      const token = localStorage.getItem("authToken");

      await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/progress/${courseId}/${moduleId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            progress: value,
            completed: value === 100,
          }),
        },
      );

      setProgress(value);
    } catch (err) {
      console.error("Progress update failed:", err);
    }
  };

  if (!isAuthenticated) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        Loading module...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F4] px-4 py-10">
      <div className="mx-auto max-w-3xl">
        {/* Title */}
        <h1 className="text-3xl font-bold text-slate-900">{module.title}</h1>

        <p className="mt-2 text-slate-600">{module.description}</p>

        {/* Progress */}
        <div className="mt-6">
          <p className="text-sm font-semibold text-orange-600">Progress</p>
          <div className="mt-2 h-3 bg-orange-100 rounded-full">
            <div
              className="h-3 bg-orange-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-slate-600 mt-1">{progress}%</p>
        </div>

        {/* Content Placeholder */}
        <div className="mt-8 rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
          <p className="text-slate-700">
            Module content (videos, documents, etc.) will be displayed here.
          </p>
        </div>

        {/* Demo Controls (remove later) */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => updateProgress(50)}
            className="rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700"
          >
            Mark 50%
          </button>
          <button
            onClick={() => updateProgress(100)}
            className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700"
          >
            Complete Module
          </button>
        </div>
      </div>
    </div>
  );
}
