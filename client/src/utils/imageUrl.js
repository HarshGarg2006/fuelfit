/**
 * Resolves a product image URL.
 * If the URL starts with '/' (local upload), prepend the API base URL.
 * If it's already a full URL (https://...), return as-is.
 * If no URL, return a placeholder.
 */
export const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  // Local upload path like /uploads/products/xxx.jpg
  const apiBase = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace('/api', '')
    : 'http://localhost:5000';
  return `${apiBase}${url}`;
};

export const getProductImage = (product) => {
  const url = product?.images?.[0]?.url;
  return getImageUrl(url);
};
