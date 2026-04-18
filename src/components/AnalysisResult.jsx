import { useMemo } from 'react'

// Parses Claude's markdown-ish response into structured sections
function parseAnalysis(text) {
  if (!text) return []

  const lines = text.split('\n')
  const sections = []
  let current = null

  for (const line of lines) {
    // Match markdown headers: ## Header or **Header**
    const h2Match = line.match(/^#{1,3}\s+(.+)/)
    const boldMatch = line.match(/^\*\*(.+?)\*\*\s*$/)
    const numberedHeader = line.match(/^\d+\.\s+\*\*(.+?)\*\*/)

    if (h2Match || boldMatch || numberedHeader) {
      if (current) sections.push(current)
      current = {
        title: (h2Match && h2Match[1]) || (boldMatch && boldMatch[1]) || (numberedHeader && numberedHeader[1]),
        content: []
      }
    } else if (line.trim()) {
      if (!current) {
        current = { title: null, content: [] }
      }
      // Clean up markdown bold/italic in body text
      const cleaned = line
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/^[-•]\s+/, '• ')
      current.content.push(cleaned)
    }
  }
  if (current) sections.push(current)

  return sections
}

export default function AnalysisResult({ text }) {
  const sections = useMemo(() => parseAnalysis(text), [text])

  if (!sections.length) {
    return <div className="result-raw">{text}</div>
  }

  return (
    <div className="result card">
      <div className="result-header">
        <span className="result-header-icon">🌿</span>
        <h2 className="result-title">Your PermaSage Analysis</h2>
      </div>

      {sections.map((section, i) => (
        <div key={i} className="result-section">
          {section.title && <h3>{section.title.replace(/[#*]/g, '').trim()}</h3>}
          {section.content.map((line, j) => (
            <p key={j}>{line}</p>
          ))}
        </div>
      ))}
    </div>
  )
}
