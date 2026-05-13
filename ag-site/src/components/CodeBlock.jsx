export default function CodeBlock({ code, title }) {
  const escape = (str) =>
    str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  const highlight = (raw) => {
    let line = escape(raw)
    line = line.replace(/(#.*)$/, '<s-c>$1</s-c>')
    line = line.replace(
      /\b(def|return|for|if|in|range|import|while|and|or|not|else|elif|class|lambda|None|True|False)\b/g,
      '<s-k>$1</s-k>'
    )
    line = line.replace(
      /\b(random|sum|len|list|map|zip|max|min|int|float|print|append|index|randint|uniform)\b/g,
      '<s-b>$1</s-b>'
    )
    line = line.replace(/(\d+\.?\d*)/g, '<s-n>$1</s-n>')
    line = line
      .replace(/<s-c>(.*?)<\/s-c>/g, '<span style="color:#636070">$1</span>')
      .replace(/<s-k>(.*?)<\/s-k>/g, '<span style="color:#c084fc">$1</span>')
      .replace(/<s-b>(.*?)<\/s-b>/g, '<span style="color:#60a5fa">$1</span>')
      .replace(/<s-n>(.*?)<\/s-n>/g, '<span style="color:#fb923c">$1</span>')
    return line
  }

  const lines = code.trim().split('\n')

  return (
    <div style={{
      background: '#0c0c14',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 12,
      overflow: 'hidden',
    }}>
      {title && (
        <div style={{
          padding: '8px 14px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          fontSize: 11,
          fontFamily: 'IBM Plex Mono, monospace',
          color: 'rgba(255,255,255,0.25)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ color: '#f87171', fontSize: 8 }}>●</span>
          <span style={{ color: '#fbbf24', fontSize: 8 }}>●</span>
          <span style={{ color: '#4ade80', fontSize: 8 }}>●</span>
          <span style={{ marginLeft: 4 }}>{title}</span>
        </div>
      )}
      <pre style={{
        padding: '14px 16px',
        overflowX: 'auto',
        fontFamily: 'IBM Plex Mono, monospace',
        lineHeight: 1.75,
        color: '#a8a4c0',
        margin: 0,
        fontSize: 12,
      }}>
        {lines.map((line, i) => (
          <div key={i} style={{ display: 'flex', gap: 12 }}>
            <span style={{ color: 'rgba(255,255,255,0.12)', userSelect: 'none', minWidth: 16, textAlign: 'right', fontSize: 11, flexShrink: 0 }}>
              {i + 1}
            </span>
            <span dangerouslySetInnerHTML={{ __html: highlight(line) || ' ' }} />
          </div>
        ))}
      </pre>
    </div>
  )
}
