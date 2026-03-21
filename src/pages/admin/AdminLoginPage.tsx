import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { api } from "@/services/api";
import { useContent } from "@/hooks/useContent";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const content = useContent();
  const siteName = content['site_name'] || 'Admin';
  const error = searchParams.get("error");

  useEffect(() => { document.title = `Login | ${siteName}`; }, [siteName]);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setLocalError(null);
    const fd = new FormData(e.currentTarget);
    const username = fd.get("username") as string;
    const password = fd.get("password") as string;

    try {
      await api.post("/auth/login", { username, password });
      navigate("/admin", { replace: true });
    } catch {
      setLocalError("Invalid username or password.");
    } finally {
      setSubmitting(false);
    }
  }

  const displayError = localError || (error === "InvalidCredentials" ? "Invalid username or password." : error === "DatabaseError" ? "A database error occurred." : null);

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between bg-linear-to-br from-[#014d43] via-[#015851] to-[#017a6a] p-12">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">{siteName}</h2>
          <p className="text-white/60 text-sm mt-1">Admin Control Panel</p>
        </div>
        <div>
          <blockquote className="text-white/80 text-lg font-medium leading-relaxed italic mb-4">
            &ldquo;{content['site_tagline'] || 'Welcome to the admin panel.'}&rdquo;
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">NABL Accredited</p>
              <p className="text-white/60 text-xs">Trusted nationwide standards</p>
            </div>
          </div>
        </div>
        <p className="text-white/30 text-xs">&copy; {new Date().getFullYear()} {siteName}. All rights reserved.</p>
      </div>

      {/* Right login panel */}
      <div className="flex flex-col items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Logo mark */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="h-10 w-10 rounded-xl bg-[#015851] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-black text-gray-900 leading-none">{siteName}</p>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>

          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Welcome back</h1>
          <p className="text-sm text-gray-500 mb-8">Sign in to manage your clinic&apos;s content.</p>

          {displayError && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl font-medium">
              {displayError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Username</label>
              <input
                name="username"
                type="text"
                required
                autoComplete="username"
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#015851]/30 focus:border-[#015851] bg-white transition-colors"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#015851]/30 focus:border-[#015851] bg-white transition-colors"
                placeholder="Enter password"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#015851] text-white py-3 rounded-xl font-bold hover:bg-[#013f39] transition-colors text-sm mt-2 disabled:opacity-60"
            >
              {submitting ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-400">
            Protected admin area · Unauthorised access is prohibited
          </p>
        </div>
      </div>
    </div>
  );
}
