import { useEffect, useState } from "react";

const emptyForm = {
  title: "",
  description: "",
  category: "",
  expiryDate: "",
  isPinned: false,
  attachment: null
};

const toDateInput = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
};

const NoticeForm = ({ initialNotice, onSubmit, onCancel, submitting }) => {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initialNotice) {
      setForm({
        title: initialNotice.title,
        description: initialNotice.description,
        category: initialNotice.category,
        expiryDate: toDateInput(initialNotice.expiryDate),
        isPinned: initialNotice.isPinned,
        attachment: null
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialNotice]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = new FormData();
    payload.append("title", form.title);
    payload.append("description", form.description);
    payload.append("category", form.category);
    payload.append("expiryDate", form.expiryDate);
    payload.append("isPinned", String(form.isPinned));

    if (form.attachment) {
      payload.append("attachment", form.attachment);
    }

    onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-slate-950/40 p-5 shadow-2xl shadow-indigo-950/20 ring-1 ring-white/10 backdrop-blur-xl"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="sm:col-span-2">
          <span className="text-sm font-bold text-slate-200">Title</span>
          <input
            value={form.title}
            onChange={(event) => updateField("title", event.target.value)}
            className="mt-1 w-full rounded-xl bg-white/10 px-3 py-2 text-white outline-none ring-1 ring-white/10 backdrop-blur transition placeholder:text-slate-500 focus:bg-white/15 focus:ring-indigo-300/40"
            required
            minLength={3}
          />
        </label>

        <label>
          <span className="text-sm font-bold text-slate-200">Category</span>
          <input
            value={form.category}
            onChange={(event) => updateField("category", event.target.value)}
            className="mt-1 w-full rounded-xl bg-white/10 px-3 py-2 text-white outline-none ring-1 ring-white/10 backdrop-blur transition focus:bg-white/15 focus:ring-indigo-300/40"
            required
          />
        </label>

        <label>
          <span className="text-sm font-bold text-slate-200">Expiry date</span>
          <input
            type="date"
            value={form.expiryDate}
            onChange={(event) => updateField("expiryDate", event.target.value)}
            className="mt-1 w-full rounded-xl bg-white/10 px-3 py-2 text-white outline-none ring-1 ring-white/10 backdrop-blur transition focus:bg-white/15 focus:ring-indigo-300/40"
            required
          />
        </label>

        <label className="sm:col-span-2">
          <span className="text-sm font-bold text-slate-200">Description</span>
          <textarea
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
            rows={5}
            className="mt-1 w-full resize-y rounded-xl bg-white/10 px-3 py-2 text-white outline-none ring-1 ring-white/10 backdrop-blur transition focus:bg-white/15 focus:ring-indigo-300/40"
            required
            minLength={5}
          />
        </label>

        <label>
          <span className="text-sm font-bold text-slate-200">Attachment</span>
          <input
            type="file"
            accept="application/pdf,image/*"
            onChange={(event) => updateField("attachment", event.target.files?.[0] || null)}
            className="mt-1 w-full rounded-xl bg-white/10 px-3 py-2 text-sm text-slate-300 ring-1 ring-white/10 file:mr-3 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-violet-500 file:to-indigo-500 file:px-3 file:py-1 file:text-sm file:font-bold file:text-white"
          />
        </label>

        <label className="flex items-center gap-3 self-end rounded-xl bg-white/10 px-3 py-2 text-slate-200 ring-1 ring-white/10 backdrop-blur">
          <input
            type="checkbox"
            checked={form.isPinned}
            onChange={(event) => updateField("isPinned", event.target.checked)}
            className="h-4 w-4"
          />
          <span className="text-sm font-medium">Pin important notice</span>
        </label>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-2 text-sm font-black text-white shadow-xl shadow-indigo-500/20 transition hover:from-violet-400 hover:to-teal-400 disabled:opacity-60"
        >
          {submitting ? "Saving..." : initialNotice ? "Update notice" : "Create notice"}
        </button>
        {initialNotice && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl bg-white/10 px-4 py-2 text-sm font-bold text-white ring-1 ring-white/10 backdrop-blur transition hover:bg-white/20"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default NoticeForm;
