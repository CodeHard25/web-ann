export const withBasePath = (src: string) => {
  if (!src) return src;
  if (src.startsWith("http") || src.startsWith("data:")) return src;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const path = src.startsWith("/") ? src : `/${src}`;
  return `${basePath}${encodeURI(path)}`;
};
