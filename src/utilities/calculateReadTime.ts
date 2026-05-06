const WORDS_PER_MINUTE = 240

/**
 * Recursively extracts plain text from a Lexical editor JSON node tree.
 */
function extractText(node: Record<string, any>): string {
  if (node.type === 'text') return node.text ?? ''
  if (Array.isArray(node.children)) {
    return node.children.map((child: Record<string, any>) => extractText(child)).join(' ')
  }
  return ''
}

/**
 * Calculates estimated read time in minutes from a Lexical rich text value.
 * Returns at least 1 minute.
 */
export function calculateReadTime(content: Record<string, any> | null | undefined): number {
  if (!content?.root) return 1

  const text = extractText(content.root)
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length

  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE))
}
