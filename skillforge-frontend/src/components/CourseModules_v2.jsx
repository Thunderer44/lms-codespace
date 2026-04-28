import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function CourseModules() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");

        // 1. Fetch user FIRST
        const userRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!userRes.ok) {
          navigate("/login");
          return;
        }

        const userData = await userRes.json();

        // 2. FIXED enrollment check
        const isEnrolled = userData.enrolledCourses?.some(
          (c) => (c._id || c).toString() === courseId,
        );

        console.log("isEnrolled:", isEnrolled);

        if (!isEnrolled) {
          console.log("❌ Not enrolled → redirecting");
          navigate("/");
          return;
        }

        // 3. Fetch course ONLY if enrolled
        const courseRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/courses/${courseId}`,
        );

        const courseData = await courseRes.json();
        setCourse(courseData);

        // 4. Set progress safely
        const courseProgress = userData.progress?.[courseId] || {
          overallProgress: 0,
          modules: {},
        };

        setProgress(courseProgress);
      } catch (err) {
        console.error("Error loading modules:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) fetchData();
  }, [courseId, isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  if (isLoading || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        Loading modules...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F4] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900">{course.title}</h1>
          <p className="mt-2 text-slate-600">{course.description}</p>

          {/* Overall Progress */}
          <div className="mt-6">
            <p className="text-sm font-semibold text-orange-600">
              Course Progress
            </p>
            <div className="mt-2 h-3 w-full rounded-full bg-orange-100">
              <div
                className="h-3 rounded-full bg-orange-500"
                style={{ width: `${progress.overallProgress || 0}%` }}
              />
            </div>
            <p className="mt-1 text-sm text-slate-600">
              {progress.overallProgress || 0}% completed
            </p>
          </div>
        </div>

        {/* Modules */}
        <div className="space-y-4">
          {course.modules.map((module, index) => {
            const moduleProgress =
              progress.modules?.[module._id]?.progress || 0;

            const completed =
              progress.modules?.[module._id]?.completed || false;

            return (
              <div
                key={module._id}
                className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm hover:shadow-md transition cursor-pointer"
                onClick={() =>
                  navigate(`/courses/${courseId}/modules/${module._id}`)
                }
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {index + 1}. {module.title}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      {module.description}
                    </p>
                  </div>

                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      completed
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {completed ? "Completed" : "In Progress"}
                  </span>
                </div>

                {/* Module Progress */}
                <div className="mt-4">
                  <div className="h-2 w-full bg-orange-100 rounded-full">
                    <div
                      className="h-2 bg-orange-500 rounded-full"
                      style={{ width: `${moduleProgress}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {moduleProgress}% complete
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
