import { z } from "zod";

const escapeHtml = (text: string) => {
  const map: Record<string, string> = {
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&#39;",
    '"': "&quot;",
    "/": "/",
  };
  return text.replace(/[<>&'"\/]/g, (char: string): string => map[char]);
};

const safeHtmlString = z.string().transform((str) => escapeHtml(str));

export default safeHtmlString;
