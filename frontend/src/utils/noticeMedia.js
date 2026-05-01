import { SOCKET_URL } from "../api/client.js";

const fallbackCovers = [
  `${SOCKET_URL}/uploads/1777310902340-beautiful-stars-in-outer-space-dricwi4ulf0p6lkl.webp`,
  `${SOCKET_URL}/uploads/1777348296385-beautiful-stars-in-outer-space-dricwi4ulf0p6lkl.webp`,
  `${SOCKET_URL}/uploads/1777308909758-beautiful-stars-in-outer-space-dricwi4ulf0p6lkl.webp`
];

export const formatNoticeDate = (date) => {
  if (!date) return "No expiry";

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(new Date(date));
};

export const getAttachmentUrl = (notice) => {
  const url = notice?.attachment?.url || notice?.image;
  return url ? `${SOCKET_URL}${url}` : "";
};

export const isImageAttachment = (notice) => {
  const mimeType = notice?.attachment?.mimeType || "";
  const url = notice?.attachment?.url || notice?.image || "";
  return mimeType.startsWith("image/") || /\.(png|jpe?g|webp|gif)$/i.test(url);
};

export const getNoticeCover = (notice, index = 0) => {
  const attachmentUrl = getAttachmentUrl(notice);

  if (attachmentUrl && isImageAttachment(notice)) {
    return attachmentUrl;
  }

  return fallbackCovers[index % fallbackCovers.length];
};
