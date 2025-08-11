export default function normalizeLink(url) {
  try {
    const u = new URL(url);
    u.search = "";
    return u.toString();
  } catch {
    return url;
  }
}

