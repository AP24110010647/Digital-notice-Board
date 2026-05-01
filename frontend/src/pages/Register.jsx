import { Lock, Mail, MonitorCheck, User } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { getErrorMessage } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await register(form);
      navigate("/", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0b0f19] px-4 py-10 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.24),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(45,212,191,0.14),transparent_32%),linear-gradient(135deg,#0b0f19_0%,#111827_100%)]" />
      <div className="absolute left-1/2 top-20 h-80 w-80 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />

      <section className="relative z-10 w-full max-w-md rounded-2xl bg-white/10 p-6 shadow-[0_30px_100px_rgba(30,41,59,0.45)] ring-1 ring-white/15 backdrop-blur-xl">
        <div className="mb-7">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400 to-indigo-500 text-white shadow-2xl shadow-indigo-500/20">
            <MonitorCheck size={24} />
          </div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-amber-200">
            Notice Board
          </p>
          <h1 className="mt-2 text-3xl font-black">Create account</h1>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            The first registered account becomes admin. Later accounts are users.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-bold text-slate-200">Name</span>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className="w-full rounded-xl bg-white/10 py-3 pl-10 pr-3 text-white outline-none ring-1 ring-white/10 backdrop-blur transition placeholder:text-slate-500 focus:bg-white/15 focus:ring-indigo-300/40"
                placeholder="Your name"
                minLength={2}
                required
              />
            </div>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-200">Email</span>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                className="w-full rounded-xl bg-white/10 py-3 pl-10 pr-3 text-white outline-none ring-1 ring-white/10 backdrop-blur transition placeholder:text-slate-500 focus:bg-white/15 focus:ring-indigo-300/40"
                placeholder="you@example.com"
                required
              />
            </div>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-200">Password</span>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                className="w-full rounded-xl bg-white/10 py-3 pl-10 pr-3 text-white outline-none ring-1 ring-white/10 backdrop-blur transition placeholder:text-slate-500 focus:bg-white/15 focus:ring-indigo-300/40"
                placeholder="At least 6 characters"
                minLength={6}
                required
              />
            </div>
          </label>

          {error && (
            <p className="rounded-xl bg-violet-950/70 p-3 text-sm font-semibold text-violet-100 ring-1 ring-violet-300/15">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-3 text-sm font-black text-white shadow-xl shadow-indigo-500/20 transition hover:from-violet-400 hover:to-teal-400 disabled:opacity-60"
          >
            {submitting ? "Creating..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-300">
          Already registered?{" "}
          <Link to="/login" className="font-bold text-amber-200 hover:text-amber-100">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
};

export default Register;
