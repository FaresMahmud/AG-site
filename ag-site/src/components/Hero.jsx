import { useState, useEffect } from 'react'
import { criarCromossomo, fitness, TAM } from '../ag.js'

export default function Hero({ onStart }) {
  const [pop, setPop] = useState(() => Array.from({ length: 6 }, criarCromossomo))
  const [gen, setGen] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setPop(p => p.map(c => c.map(g => Math.random() < 0.06 ? 1 - g : g)))
      setGen(g => g + 1)
    }, 600)
    return () => clearInterval(t)
  }, [])

  return (
    <section style={{
      minHeight: '100svh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 'clamp(5rem,10vw,7rem) 1.25rem 3rem',
      textAlign: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(124,111,255,0.12) 0%, transparent 70%)',
      }} />

      {/* mini população animada */}
      <div style={{ marginBottom: '2.5rem', width: '100%', maxWidth: 480 }}>
        {pop.map((c, i) => {
          const f = fitness(c)
          const pct = f / TAM
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, opacity: 0.6 + i * 0.06 }}>
              <div style={{ display: 'flex', gap: 3, flex: 1, justifyContent: 'center' }}>
                {c.map((b, j) => (
                  <div key={j} style={{
                    width: 'clamp(14px,2.5vw,20px)', height: 'clamp(14px,2.5vw,20px)',
                    borderRadius: 4, flexShrink: 0,
                    background: b === 1
                      ? `hsla(${160 + i * 20}, 70%, ${40 + pct * 20}%, 0.85)`
                      : 'rgba(255,255,255,0.04)',
                    border: b === 1
                      ? `1px solid hsla(${160 + i * 20}, 70%, 60%, 0.3)`
                      : '1px solid rgba(255,255,255,0.05)',
                    transition: 'all 0.4s ease',
                  }} />
                ))}
              </div>
              <span style={{ fontSize: 10, fontFamily: 'IBM Plex Mono', color: 'rgba(255,255,255,0.2)', minWidth: 28 }}>
                {f}/{TAM}
              </span>
            </div>
          )
        })}
        <div style={{ fontSize: 10, fontFamily: 'IBM Plex Mono', color: 'rgba(255,255,255,0.15)', marginTop: 6 }}>
          geração {gen} — evoluindo em tempo real
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: '1.25rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <span className="tag tag-purple">Computação Evolutiva</span>
        <span className="tag tag-blue">IA / Sistemas de Informação</span>
      </div>

      <h1 style={{
        fontFamily: 'Syne, sans-serif',
        fontSize: 'clamp(2rem, 7vw, 3.8rem)',
        fontWeight: 800, lineHeight: 1.08,
        marginBottom: '1.25rem', maxWidth: 640,
        letterSpacing: '-0.02em',
      }}>
        Algoritmos Genéticos{' '}
        <span style={{
          background: 'linear-gradient(135deg, #7c6fff, #34d399)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          de verdade
        </span>
      </h1>

      <p style={{
        fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
        color: 'rgba(255,255,255,0.45)',
        maxWidth: 460, marginBottom: '2.5rem', lineHeight: 1.8,
      }}>
        Do zero ao código Python. Simulações interativas onde você controla
        cada geração e vê a evolução acontecendo.
      </p>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={onStart} style={{
          background: 'linear-gradient(135deg, #7c6fff, #5b4fd4)',
          color: '#fff', border: 'none', borderRadius: 10,
          padding: '13px 28px', fontSize: 14, fontWeight: 600,
          fontFamily: 'Syne, sans-serif',
          boxShadow: '0 0 32px rgba(124,111,255,0.3)',
        }}>
          Começar agora →
        </button>
        <a href="https://github.com/FaresMahmud/AG-site" target="_blank" rel="noreferrer" style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: 10, padding: '13px 22px',
          fontSize: 13, color: 'rgba(255,255,255,0.5)',
          textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6,
        }}>
          ↗ GitHub
        </a>
      </div>
    </section>
  )
}
