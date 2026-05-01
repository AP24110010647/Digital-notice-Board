import { Edit3, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { api, getErrorMessage } from "../api/client.js";
import PremiumCard from "../components/PremiumCard.jsx";
import NoticeForm from "../components/NoticeForm.jsx";
import { prioritizeNotices } from "../utils/noticeAlgorithms.js";

const AdminNotices = () => {
  const [notices, setNotices] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchNotices = async () => {
    const { data } = await api.get("/notices");
    setNotices(prioritizeNotices(data.notices || []));
  };

  useEffect(() => {
    fetchNotices().catch((err) => setError(getErrorMessage(err)));
  }, []);

  const saveNotice = async (formData) => {
    setSubmitting(true);
    setError("");

    try {
      if (editing) {
        await api.put(`/notices/${editing._id}`, formData);
        setEditing(null);
      } else {
        await api.post("/notices", formData);
      }

      await fetchNotices();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const deleteNotice = async (notice) => {
    const confirmed = window.confirm(`Delete "${notice.title}"?`);
    if (!confirmed) return;

    try {
      await api.delete(`/notices/${notice._id}`);
      setNotices((current) => prioritizeNotices(current.filter((item) => item._id !== notice._id)));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] px-4 pb-16 pt-28 text-white sm:px-8 lg:px-12">
      <div className="grid gap-8 xl:grid-cols-[420px_1fr]">
        <section className="rounded-2xl bg-white/10 p-5 shadow-2xl shadow-indigo-950/20 ring-1 ring-white/10 backdrop-blur-xl">
          <div className="mb-5">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-200">
              Admin Studio
            </p>
            <h2 className="mt-1 text-3xl font-black">Manage Notices</h2>
          </div>
          <NoticeForm
            initialNotice={editing}
            onSubmit={saveNotice}
            onCancel={() => setEditing(null)}
            submitting={submitting}
          />
          {error && (
            <p className="mt-4 rounded-xl bg-violet-950/70 p-3 text-sm font-semibold text-violet-100 ring-1 ring-violet-300/15">
              {error}
            </p>
          )}
        </section>

        <section className="grid gap-8 md:grid-cols-2">
          {notices.length === 0 && (
            <div className="rounded-2xl bg-white/10 p-10 text-center text-slate-300 shadow-2xl shadow-indigo-950/20 ring-1 ring-white/10 backdrop-blur-xl md:col-span-2">
              No notices created yet
            </div>
          )}

          {notices.map((notice, index) => (
            <PremiumCard
              key={notice._id}
              notice={notice}
              index={index}
              className="w-full"
              actions={
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditing(notice)}
                    className="rounded-xl bg-white/90 p-2 text-slate-950 shadow-xl transition hover:scale-105 hover:bg-white"
                    aria-label="Edit notice"
                  >
                    <Edit3 size={17} />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteNotice(notice)}
                    className="rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 p-2 text-white shadow-xl shadow-indigo-500/20 transition hover:scale-105 hover:from-violet-400 hover:to-teal-400"
                    aria-label="Delete notice"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              }
            />
          ))}
        </section>
      </div>
    </div>
  );
};

export default AdminNotices;
