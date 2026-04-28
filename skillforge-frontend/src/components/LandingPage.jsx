import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LandingPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

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
              <p className="text-xs text-slate-500">Learn. Practice. Grow.</p>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#features" className="transition hover:text-orange-700">
              Features
            </a>
            <a href="#courses" className="transition hover:text-orange-700">
              Courses
            </a>
            <a href="#benefits" className="transition hover:text-orange-700">
              Benefits
            </a>
            <a href="#faq" className="transition hover:text-orange-700">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm font-medium text-slate-700">
                  Welcome, {user?.name || "Learner"}!
                </span>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-orange-200 transition hover:bg-orange-600"
                >
                  Dashboard
                </button>
                <button
                  onClick={logout}
                  className="rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-orange-300 hover:bg-orange-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-orange-300 hover:bg-orange-50"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-orange-200 transition hover:bg-orange-600"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.16),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(249,115,22,0.10),_transparent_30%)]" />
        <div className="mx-auto grid w-full items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div className="relative">
            <span className="inline-flex items-center rounded-full border border-orange-200 bg-white px-4 py-1 text-sm font-medium text-orange-700 shadow-sm">
              {isAuthenticated
                ? "Welcome back to your learning journey"
                : "Smart learning for students and educators"}
            </span>

            <h1 className="mt-6 max-w-2xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              {isAuthenticated ? (
                <>
                  Ready to continue learning,{" "}
                  <span className="text-orange-600">
                    {user?.name || "Learner"}
                  </span>
                  ?
                </>
              ) : (
                <>
                  Build your future with{" "}
                  <span className="text-orange-600">Skill Forge</span>.
                </>
              )}
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              {isAuthenticated
                ? "Access your dashboard to view your enrolled courses, track your progress, and continue your learning adventure with Skill Forge."
                : "A modern learning management platform where users can log in, explore courses, view modules, and track progress in one clean dashboard."}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={() => navigate("/courses")}
                    className="inline-flex items-center justify-center rounded-full border border-orange-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-orange-50"
                  >
                    Explore Courses
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600"
                  >
                    Get Started
                  </Link>
                  <a
                    href="#features"
                    className="inline-flex items-center justify-center rounded-full border border-orange-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-orange-50"
                  >
                    Explore Features
                  </a>
                </>
              )}
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-3 gap-4">
              <div className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm">
                <p className="text-2xl font-bold text-slate-900">100+</p>
                <p className="mt-1 text-sm text-slate-500">Courses available</p>
              </div>
              <div className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm">
                <p className="text-2xl font-bold text-slate-900">24/7</p>
                <p className="mt-1 text-sm text-slate-500">Learning access</p>
              </div>
              <div className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm">
                <p className="text-2xl font-bold text-slate-900">Easy</p>
                <p className="mt-1 text-sm text-slate-500">Course navigation</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-orange-200/60 blur-3xl" />
            <div className="absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-amber-200/50 blur-3xl" />

            <div className="relative rounded-3xl border border-orange-100 bg-white p-6 shadow-xl shadow-orange-100/50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Welcome to Skill Forge
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Your learning journey starts here.
                  </p>
                </div>
                <div className="rounded-2xl bg-orange-100 px-3 py-2 text-sm font-semibold text-orange-700">
                  Active
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  {
                    title: "Secure Login",
                    desc: "Access your personalized dashboard safely.",
                  },
                  {
                    title: "Course Selection",
                    desc: "Browse available courses with short descriptions.",
                  },
                  {
                    title: "Module Progress",
                    desc: "Track lessons and continue from where you stopped.",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 rounded-2xl border border-orange-100 bg-[#FFFDFB] p-4"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-100 font-semibold text-orange-700">
                      0{index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 p-5">
                <p className="text-sm font-medium text-orange-700">Next step</p>
                <p className="mt-1 text-sm text-slate-600">
                  Login to access your courses, dashboard, and learning modules.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-16"
      >
        <div className="max-w-2xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
            Features
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Everything you need in one learning platform
          </h2>
          <p className="mt-4 text-slate-600">
            Skill Forge gives users a smooth path from landing page to login and
            into a structured course experience.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Clean dashboard",
              desc: "A simple interface to view courses, modules, and progress without clutter.",
            },
            {
              title: "Course previews",
              desc: "Show short descriptions and module lists before users enroll or begin learning.",
            },
            {
              title: "Fast access",
              desc: "Quick sign in, responsive layout, and a polished experience on all screen sizes.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-100/60"
            >
              <div className="mb-4 inline-flex rounded-2xl bg-orange-100 px-3 py-2 text-sm font-semibold text-orange-700">
                0{index + 1}
              </div>
              <h3 className="text-xl font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-3 leading-7 text-slate-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Courses preview */}
      <section
        id="courses"
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-16"
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
              Courses
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Designed to make learning feel organized
            </h2>
            <p className="mt-4 max-w-xl text-slate-600">
              Users can choose from available courses, see module breakdowns,
              and continue their learning path with ease.
            </p>

            <div className="mt-8 rounded-3xl border border-orange-100 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-orange-700">
                Example course flow
              </p>
              <div className="mt-4 space-y-4">
                {[
                  "Select a course",
                  "Read the short description",
                  "View course modules",
                  "Begin learning",
                ].map((step, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-700">
                      {index + 1}
                    </div>
                    <p className="text-slate-700">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {[
              {
                title: "Web Development",
                desc: "HTML, CSS, JavaScript, React, and backend basics.",
              },
              {
                title: "UI / UX Design",
                desc: "Modern interfaces, layout principles, and usability.",
              },
              {
                title: "Data Fundamentals",
                desc: "Core concepts for structured thinking and analysis.",
              },
              {
                title: "Career Skills",
                desc: "Communication, teamwork, and workplace readiness.",
              },
            ].map((course, index) => (
              <div
                key={index}
                className="rounded-3xl border border-orange-100 bg-[#FFFDFB] p-5 shadow-sm"
              >
                <div className="mb-4 h-2 w-16 rounded-full bg-orange-300" />
                <h3 className="text-lg font-semibold text-slate-900">
                  {course.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {course.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section
        id="benefits"
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-16"
      >
        <div className="rounded-[2rem] border border-orange-100 bg-white p-8 shadow-sm sm:p-10">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
                Benefits
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                A page that feels warm, modern, and complete
              </h2>
              <p className="mt-4 max-w-xl text-slate-600">
                Soft backgrounds, subtle shadows, and balanced spacing keep the
                interface comfortable to view while still feeling rich and
                professional.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Soft orange accents",
                "Comfortable contrast",
                "Responsive layout",
                "Professional landing feel",
              ].map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-orange-100 bg-orange-50/60 p-5"
                >
                  <p className="font-medium text-slate-800">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-16"
      >
        <div className="max-w-2xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
            FAQ
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Common questions
          </h2>
        </div>

        <div className="mt-8 grid gap-4">
          {[
            {
              q: "What happens after landing on this page?",
              a: "Users can click Login or Sign Up and then enter the LMS dashboard.",
            },
            {
              q: "Can I connect this to React Router?",
              a: "Yes. Replace the href links with Link components if you are using React Router.",
            },
            {
              q: "Can I add animation later?",
              a: "Yes. You can add subtle hover transitions or Framer Motion if needed.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm"
            >
              <h3 className="font-semibold text-slate-900">{item.q}</h3>
              <p className="mt-2 text-slate-600">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-10 text-white shadow-xl shadow-orange-200 sm:px-10">
          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {isAuthenticated
                  ? "Continue Your Learning Adventure"
                  : "Ready to forge your learning journey?"}
              </h2>
              <p className="mt-3 max-w-2xl text-white/90">
                {isAuthenticated
                  ? "Head to your dashboard to see your courses, track progress, and achieve your learning goals."
                  : "Start with Skill Forge and move into a focused, clean, and user-friendly LMS experience."}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-orange-700 transition hover:bg-orange-50"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={logout}
                    className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-orange-700 transition hover:bg-orange-50"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-orange-100 bg-[#FFF9F4]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-slate-500 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>© 2026 Skill Forge. All rights reserved.</p>
          <p>Learn. Build. Grow.</p>
        </div>
      </footer>
    </div>
  );
}
