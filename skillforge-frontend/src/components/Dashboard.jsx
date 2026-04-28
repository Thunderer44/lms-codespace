import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Fetch user's enrolled courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/courses/my-courses/enrolled`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          setCourses(data);
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchCourses();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FFF9F4] text-slate-800">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-orange-100/70 bg-[#FFF9F4]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 shadow-sm">
              <span className="text-lg font-bold">SF</span>
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight text-slate-900">
                Skill Forge
              </p>
              <p className="text-xs text-slate-500">Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-700">
              {user?.name || "Learner"}
            </span>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-orange-300 hover:bg-orange-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900">
            Welcome back,{" "}
            <span className="text-orange-600">{user?.name || "Learner"}</span>!
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            Continue your learning journey and explore new courses.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="mb-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-orange-600 uppercase tracking-wide">
              Enrolled Courses
            </p>
            <p className="mt-3 text-3xl font-bold text-slate-900">
              {courses.length}
            </p>
          </div>
          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-orange-600 uppercase tracking-wide">
              Progress
            </p>
            <p className="mt-3 text-3xl font-bold text-slate-900">0%</p>
            <p className="mt-2 text-sm text-slate-600">
              Keep learning to improve
            </p>
          </div>
          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-orange-600 uppercase tracking-wide">
              Learning Hours
            </p>
            <p className="mt-3 text-3xl font-bold text-slate-900">0h</p>
            <p className="mt-2 text-sm text-slate-600">
              Start your first course
            </p>
          </div>
        </div>

        {/* Courses Section */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Your Courses</h2>
            <p className="mt-2 text-slate-600">
              Manage your enrolled courses and continue learning.
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-slate-600">Loading your courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="rounded-2xl border border-orange-100 bg-orange-50 p-8 text-center">
              <p className="text-lg font-semibold text-slate-900">
                No courses enrolled yet
              </p>
              <p className="mt-2 text-slate-600">
                Explore available courses and start your learning journey.
              </p>
              <button
                onClick={() => navigate("/courses")}
                className="mt-4 inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-2 text-sm font-semibold text-white shadow-md shadow-orange-200 transition hover:bg-orange-600"
              >
                Explore Courses
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-100/60"
                >
                  <div className="mb-4 h-2 w-16 rounded-full bg-orange-300" />
                  <h3 className="text-lg font-semibold text-slate-900">
                    {course.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    {course.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs font-semibold text-orange-600 uppercase tracking-wide">
                      {course.modules?.length || 0} Modules
                    </span>
                    <button
                      onClick={() => navigate(`/courses/${course._id}/modules`)}
                      className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700 transition hover:bg-orange-200"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="mt-12 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-10 text-white shadow-xl shadow-orange-200 sm:px-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Continue Learning</h2>
              <p className="mt-2 text-white/90">
                Explore more courses to expand your skills.
              </p>
            </div>
            <button
              onClick={() => navigate("/courses")}
              className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-50"
            >
              Browse Courses
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-orange-100 bg-[#FFF9F4] mt-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-slate-500 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>© 2026 Skill Forge. All rights reserved.</p>
          <p>Learn. Build. Grow.</p>
        </div>
      </footer>
    </div>
  );
}
