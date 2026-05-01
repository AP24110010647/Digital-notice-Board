import { Bell, LogOut, Search, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const navLinkClass = ({ isActive }) =>
  `text-sm font-semibold transition ${isActive ? "text-white" : "text-slate-300/75 hover:text-white"}`;

const Navbar = ({ newCount, search, onSearchChange }) => {
  const [scrolled, setScrolled] = useState(false);
  const { user, isAdmin, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 32);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-slate-950/75 shadow-2xl shadow-indigo-950/20 ring-1 ring-white/10 backdrop-blur-xl"
          : "bg-gradient-to-b from-slate-950/80 to-transparent"
      }`}
    >
      <nav className="flex h-20 items-center justify-between gap-4 px-4 sm:px-8 lg:px-12">
        <div className="flex min-w-0 items-center gap-6">
          <Link to="/" className="shrink-0 text-xl font-black tracking-tight text-white sm:text-2xl">
            <span className="bg-gradient-to-r from-amber-200 via-violet-200 to-cyan-200 bg-clip-text text-transparent">
              Notice Board
            </span>
          </Link>

          <div className="hidden items-center gap-5 md:flex">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" className={navLinkClass}>
                Manage
              </NavLink>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search"
              className="h-10 w-44 rounded-xl bg-white/10 pl-9 pr-3 text-sm font-medium text-white outline-none ring-1 ring-white/10 backdrop-blur transition-all duration-300 placeholder:text-slate-400 focus:w-64 focus:bg-white/15 focus:ring-indigo-300/40"
            />
          </div>

          <span className="hidden items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm font-bold capitalize text-white ring-1 ring-white/10 backdrop-blur sm:inline-flex">
            {isAdmin && <ShieldCheck size={15} className="text-amber-200" />}
            {user?.role}
          </span>

          {isAdmin && (
            <Link
              to="/admin"
              className="rounded-xl bg-white/10 p-2 text-white ring-1 ring-white/10 backdrop-blur transition hover:bg-white/20 md:hidden"
              aria-label="Manage notices"
              title="Manage notices"
            >
              <ShieldCheck size={18} />
            </Link>
          )}

          <div className="relative rounded-xl bg-white/10 p-2 text-white ring-1 ring-white/10 backdrop-blur">
            <Bell size={18} />
            {newCount > 0 && (
              <span className="absolute -right-2 -top-2 min-w-5 rounded-full bg-gradient-to-r from-amber-300 to-yellow-500 px-1.5 text-center text-xs font-black text-slate-950">
                {newCount}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={logout}
            className="rounded-xl bg-white/10 p-2 text-white ring-1 ring-white/10 backdrop-blur transition hover:bg-white/20"
            aria-label="Log out"
            title="Log out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      <div className="px-4 pb-3 sm:hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search notices"
            className="h-10 w-full rounded-xl bg-white/10 pl-9 pr-3 text-sm font-medium text-white outline-none ring-1 ring-white/10 backdrop-blur placeholder:text-slate-400 focus:bg-white/15"
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
