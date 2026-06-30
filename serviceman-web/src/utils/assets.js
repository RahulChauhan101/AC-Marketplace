export const getAssetUrl = (assetPath, cacheKey = "") => {
  if (!assetPath) {
    return "";
  }

  if (assetPath.startsWith("http")) {
    return cacheKey ? `${assetPath}${assetPath.includes("?") ? "&" : "?"}v=${cacheKey}` : assetPath;
  }

  let url = assetPath;

  if (!import.meta.env.DEV) {
    const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const serverBase = apiBase.replace(/\/api\/?$/, "");
    url = `${serverBase}${assetPath}`;
  }

  return cacheKey ? `${url}?v=${cacheKey}` : url;
};
