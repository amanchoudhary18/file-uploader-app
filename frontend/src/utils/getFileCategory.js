export const getFileCategory = (mimeType) => {
  if (!mimeType) return "others";

  if (mimeType.includes("image")) return "image";
  if (mimeType.includes("application/json")) return "json";
  if (mimeType.includes("text")) return "document";

  return "others";
};
