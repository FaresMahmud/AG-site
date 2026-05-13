export default function CodeBlock({ code, title }) {
  // syntax highlight básico sem lib externa
  const highlight = (line) => {
    return line
      .replace(/(&lt;|<)/g, '&lt;')
      .replace(/(&gt;|>)/g, '&gt;')
      .replace(/(#.*)$/gm, '<span style="color:#5a576e">$1</span>')
      .replace(/\b(def|return|for|if|in|range|import|while|and|or|not|else|elif)\b/g,
        '<span style="color:#a78bfa">$1</span>')
      .replace(/\b(random|sum|len|list|map|zip|max|min|int|float|print|append|index)\b/g,
        '<span style="color:#60a5fa">$1</span>')
      .replace(/(\d+\.?\d*)/g, '<span style="color:#f59e0b">$1</span>')
      .replace(/("[^"]*"|'[^']*')/g, '<span style="color:#22c55e">$1</span>')
  }

  const lines = code.trim().split('\n')

  return (
    <div style={{
      background: '#0d0d14',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 12,
      overflow: 'hidden',
      fontSize: 13,
    }}>
      {title && (
        <div style={{
          padding: '8px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          fontSize: 11,
          fontFamily: 'IBM Plex Mono, monospace',
          color: 'rgba(255,255,255,0.3)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 9 }}>●●●</span> {title}
        </div>
      )}
      <pre style={{
        padding: '16px',
        overflowX: 'auto',
        fontFamily: 'IBM Plex Mono, monospace',
        lineHeight: 1.7,
        color: '#c8c5d8',
        margin: 0,
      }}>
        {lines.map((line, i) => (
          <div key={i} dangerouslySetInnerHTML={{ __html: highlight(line) || '&nbsp;' }} />
        ))}
      </pre>
    </div>
  )
}
