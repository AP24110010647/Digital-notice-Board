import { Download, Eye, Play, Sparkles } from "lucide-react";
import { formatNoticeDate, getAttachmentUrl, getNoticeCover } from "../utils/noticeMedia.js";

const HeroBanner = ({ notice }) => {
  const coverUrl = notice ? getNoticeCover(notice, 0) : getNoticeCover(null, 0);
  const attachmentUrl = notice ? getAttachmentUrl(notice) || coverUrl : coverUrl;

  return (
    <section className="relative min-h-[74vh] overflow-hidden bg-[#0b0f19]">
      <img
        src={coverUrl}
        alt=""
        className="absolute inset-0 h-full w-full scale-105 object-cover opacity-70 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f19] via-slate-950/75 to-indigo-950/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-slate-950/20 to-slate-950/50" />
      <div className="absolute left-1/4 top-24 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="absolute right-10 top-40 h-80 w-80 rounded-full bg-teal-400/10 blur-3xl" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#0b0f19] to-transparent" />

      <div className="relative z-10 flex min-h-[74vh] max-w-7xl flex-col justify-end px-4 pb-20 pt-28 sm:px-8 lg:px-12">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-2xl shadow-indigo-950/30 ring-1 ring-white/15 backdrop-blur-xl">
            <Sparkles size={16} className="text-amber-200" />
            Featured Notice
          </div>

          <h1 className="text-4xl font-black leading-none tracking-tight text-white drop-shadow-2xl sm:text-6xl lg:text-7xl">
            {notice?.title || "Digital Notice Board"}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-200">
            <span className="rounded-full bg-gradient-to-r from-violet-400/90 to-indigo-400/90 px-3 py-1 text-white shadow-lg shadow-indigo-500/20">
              {notice?.category || "Campus"}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/10 backdrop-blur">
              {notice ? formatNoticeDate(notice.expiryDate) : "Live updates"}
            </span>
          </div>

          <p className="mt-6 line-clamp-3 max-w-2xl text-base leading-7 text-slate-200 drop-shadow-lg sm:text-lg">
            {notice?.description || "Browse campus and office notices in a polished, image-first dashboard."}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#notice-rows"
              className="inline-flex items-center gap-2 rounded-xl bg-white/90 px-5 py-3 text-sm font-black text-slate-950 shadow-2xl shadow-slate-950/30 transition-all duration-300 hover:scale-105 hover:bg-white"
            >
              <Play size={18} fill="currentColor" />
              Browse Notices
            </a>
            <a
              href={attachmentUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-sm font-bold text-white shadow-2xl ring-1 ring-white/15 backdrop-blur transition-all duration-300 hover:scale-105 hover:bg-white/20"
            >
              <Eye size={18} />
              View
            </a>
            <a
              href={attachmentUrl}
              target="_blank"
              rel="noreferrer"
              download
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-300 to-yellow-500 px-5 py-3 text-sm font-bold text-slate-950 shadow-2xl shadow-amber-500/20 transition-all duration-300 hover:scale-105"
            >
              <Download size={18} />
              Download
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
