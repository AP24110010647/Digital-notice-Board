import { Filter, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { io } from "socket.io-client";
import HeroBanner from "../components/HeroBanner.jsx";
import CardRow from "../components/CardRow.jsx";
import { api, getErrorMessage, SOCKET_URL } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { buildNoticeRows, prioritizeNotices, searchNotices } from "../utils/noticeAlgorithms.js";

const Dashboard = () => {
  const [notices, setNotices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { setNewCount, search } = useOutletContext();
  const { isAdmin } = useAuth();

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    return params.toString();
  }, [category]);

  const filteredNotices = useMemo(() => searchNotices(notices, search), [notices, search]);
  const rows = useMemo(() => buildNoticeRows(filteredNotices), [filteredNotices]);
  const prioritizedNotices = useMemo(() => prioritizeNotices(notices), [notices]);
  const heroNotice = prioritizedNotices[0];

  const fetchNotices = async () => {
    try {
      setError("");
      const { data } = await api.get(`/notices${queryParams ? `?${queryParams}` : ""}`);
      setNotices(data.notices || []);
      setNewCount(data.newCount || 0);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [queryParams]);

  useEffect(() => {
    api
      .get("/notices/categories")
      .then(({ data }) => setCategories(data))
      .catch(() => {});
  }, [notices.length]);

  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on("notice:created", (notice) => {
      setNotices((current) => [notice, ...current]);
      setNewCount((count) => count + 1);
    });

    socket.on("notice:updated", (notice) => {
      setNotices((current) =>
        current.map((item) => (item._id === notice._id ? notice : item))
      );
    });

    socket.on("notice:deleted", ({ id }) => {
      setNotices((current) => current.filter((item) => item._id !== id));
    });

    return () => socket.disconnect();
  }, [setNewCount]);

  return (
    <div className="min-h-screen bg-[#0b0f19]">
      <HeroBanner notice={heroNotice} />

      <section id="notice-rows" className="-mt-10 space-y-4 pb-16">
        <div className="relative z-20 flex flex-col gap-3 px-4 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-200">
              Curated Notices
            </p>
            <h2 className="mt-1 text-3xl font-black text-white">Notice Library</h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {isAdmin && (
              <Link
                to="/admin"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-4 text-sm font-black text-white shadow-xl shadow-indigo-500/20 transition hover:from-violet-400 hover:to-teal-400"
              >
                <Plus size={16} />
                Add Notice
              </Link>
            )}

            <label className="flex h-11 items-center gap-2 rounded-xl bg-white/10 px-3 text-sm font-semibold text-white shadow-2xl shadow-indigo-950/20 ring-1 ring-white/10 backdrop-blur-xl">
              <Filter size={16} className="text-teal-200" />
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="bg-transparent text-sm text-white outline-none [&>option]:bg-slate-950"
              >
                <option value="">All categories</option>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {error && (
          <div className="mx-4 rounded-2xl bg-violet-950/60 p-4 text-sm font-semibold text-violet-100 shadow-2xl shadow-violet-950/20 ring-1 ring-violet-300/15 backdrop-blur-xl sm:mx-8 lg:mx-12">
            {error}
          </div>
        )}

        {loading && (
          <div className="mx-4 rounded-2xl bg-white/10 p-10 text-center text-slate-300 shadow-2xl shadow-indigo-950/20 ring-1 ring-white/10 backdrop-blur-xl sm:mx-8 lg:mx-12">
            Loading premium notices...
          </div>
        )}

        {!loading && filteredNotices.length === 0 && (
          <div className="mx-4 rounded-2xl bg-white/10 p-10 text-center text-slate-300 shadow-2xl shadow-indigo-950/20 ring-1 ring-white/10 backdrop-blur-xl sm:mx-8 lg:mx-12">
            No active notices found
          </div>
        )}

        {!loading &&
          rows.map((row) => (
            <CardRow key={row.title} title={row.title} notices={row.notices} />
          ))}
      </section>
    </div>
  );
};

export default Dashboard;
