export default function extractJSON(text) {
  const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  return match ? match[0] : text;
}
