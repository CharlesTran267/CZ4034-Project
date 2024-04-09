export function fixJsonLikeString(jsonLikeString: string) {
  // First, add double quotes around any keys (assuming keys are simple words)
  return jsonLikeString.replace(/'/g, '"');
}