import React from 'react'

// Exibe um cromossomo como blocos coloridos
// highlight: array de índices a destacar
// corte: posição do ponto de corte (linha vertical)
// origem: 'pai' | 'mae' | null (colore a metade de quem veio)
export default function Cromossomo({ bits, highlight = [], corte = null, dim = false, size = 'md' }) {
  const sz = size === 'sm' ? 22 : size === 'lg' ? 36 : 28

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap', opacity: dim ? 0.4 : 1 }}>
      {bits.map((bit, i) => {
        const isHighlight = highlight.includes(i)
        const isCorte = corte !== null && i === corte

        const bg = isHighlight
          ? (bit === 1 ? '#f59e0b' : '#f87171')
          : (bit === 1 ? '#22c55e' : 'rgba(255,255,255,0.06)')

        const color = isHighlight ? '#000' : (bit === 1 ? '#000' : 'rgba(255,255,255,0.25)')

        return (
          <React.Fragment key={i}>
            {isCorte && (
              <div style={{
                width: 2, height: sz + 8,
                background: '#a78bfa',
                borderRadius: 2,
                flexShrink: 0,
                boxShadow: '0 0 6px #a78bfa88'
              }} />
            )}
            <div style={{
              width: sz, height: sz,
              background: bg,
              color,
              borderRadius: 5,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: size === 'sm' ? 10 : size === 'lg' ? 15 : 12,
              fontFamily: 'IBM Plex Mono, monospace',
              fontWeight: 500,
              transition: 'background 0.3s, color 0.3s',
              flexShrink: 0,
            }}>
              {bit}
            </div>
          </React.Fragment>
        )
      })}
    </div>
  )
}
