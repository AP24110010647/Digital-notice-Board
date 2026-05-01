import { CalendarDays, Download, Eye, Pin } from "lucide-react";
import { formatNoticeDate, getAttachmentUrl, getNoticeCover } from "../utils/noticeMedia.js";

const PremiumCard = ({ notice, actions, index = 0, className = "" }) => {
  const attachmentUrl = getAttachmentUrl(notice);
  const coverUrl = getNoticeCover(notice, index);
  const actionUrl = attachmentUrl || coverUrl;

  return (
    <article
      className={`group relative h-96 w-64 flex-none origin-center overflow-hidden rounded-2xl bg-slate-900/80 shadow-[0_18px_60px_rgba(30,41,59,0.45)] ring-1 ring-white/10 transition-all duration-500 hover:z-30 hover:-translate-y-2 hover:scale-105 hover:shadow-[0_28px_90px_rgba(99,102,241,0.24)] sm:w-72 lg:w-80 ${className}`}
    >
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-violet-400/20 via-indigo-500/10 to-teal-300/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

      <img
        src={coverUrl}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-indigo-950/45 to-slate-900/10 transition-all duration-500 group-hover:from-slate-950/95 group-hover:via-violet-950/55" />
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-slate-950/60 to-transparent" />

      <div className="absolute left-4 top-4 z-20 flex flex-wrap gap-2">
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white shadow-lg ring-1 ring-white/15 backdrop-blur">
          {notice.category}
        </span>
        {notice.isPinned && (
          <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-300 to-yellow-500 px-3 py-1 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20">
            <Pin size={12} />
            Pinned
          </span>
        )}
      </div>

      {actions && (
        <div className="absolute right-4 top-4 z-30 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
          {actions}
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 z-20 space-y-3 p-4">
        <div className="rounded-2xl bg-white/10 p-4 shadow-2xl ring-1 ring-white/10 backdrop-blur-md">
          <h3 className="line-clamp-2 text-xl font-bold leading-tight text-white drop-shadow-lg">
            {notice.title}
          </h3>
          <div className="mt-2 flex items-center gap-2 text-xs font-medium text-slate-200">
            <CalendarDays size={14} className="text-teal-200" />
            <span>{formatNoticeDate(notice.expiryDate)}</span>
          </div>

          <p className="line-clamp-3 max-h-0 text-sm leading-5 text-slate-200 opacity-0 transition-all duration-500 group-hover:mt-3 group-hover:max-h-24 group-hover:opacity-100 group-focus-within:mt-3 group-focus-within:max-h-24 group-focus-within:opacity-100">
            {notice.description}
          </p>

          <div className="flex translate-y-3 gap-2 opacity-0 transition-all duration-500 group-hover:mt-4 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:mt-4 group-focus-within:translate-y-0 group-focus-within:opacity-100">
            <a
              href={actionUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-white/90 px-3 py-2 text-sm font-bold text-slate-950 shadow-xl transition hover:bg-white"
            >
              <Eye size={16} />
              View
            </a>
            <a
              href={actionUrl}
              target="_blank"
              rel="noreferrer"
              download
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-500/80 to-indigo-500/80 px-3 py-2 text-sm font-bold text-white shadow-xl shadow-indigo-500/20 backdrop-blur transition hover:from-violet-400 hover:to-teal-400"
            >
              <Download size={16} />
              Download
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PremiumCard;
