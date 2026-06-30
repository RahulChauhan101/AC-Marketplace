export const getAssetUrl = (assetPath) => {
  if (!assetPath) {
    return "";
  }

  if (assetPath.startsWith("http")) {
    return assetPath;
  }

  if (import.meta.env.DEV) {
    return assetPath;
  }

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const serverBase = apiBase.replace(/\/api\/?$/, "");

  return `${serverBase}${assetPath}`;
};
