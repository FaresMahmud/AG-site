import { useState, useEffect } from 'react'
import { criarCromossomo, fitness, TAM } from '../ag.js'

export default function Hero({ onStart }) {
  const [bits, setBits] = useState(criarCromossomo())

  useEffect(() => {
    const t = setInterval(() => {
      setBits(b => b.map(g => Math.random() < 0.08 ? 1 - g : g))
    }, 400)
    return () => clearInterval(t)
  }, [])

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '4rem 1.5rem',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* fundo animado */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(96,165,250,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* cromossomo animado decorativo */}
      <div style={{ display: 'flex', gap: 4, marginBottom: '2.5rem', flexWrap: 'wrap', justifyContent: 'center', maxWidth: 420 }}>
        {bits.map((b, i) => (
          <div key={i} style={{
            width: 28, height: 28, borderRadius: 6,
            background: b === 1 ? 'rgba(34,197,94,0.7)' : 'rgba(255,255,255,0.05)',
            border: b === 1 ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(255,255,255,0.06)',
            transition: 'all 0.3s ease',
            boxShadow: b === 1 ? '0 0 8px rgba(34,197,94,0.3)' : 'none',
          }} />
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <span className="tag tag-green">Computação Evolutiva</span>
        <span className="tag tag-blue">Inteligência Artificial</span>
        <span className="tag tag-purple">Interativo</span>
      </div>

      <h1 style={{
        fontFamily: 'Syne, sans-serif',
        fontSize: 'clamp(2.2rem, 6vw, 4rem)',
        fontWeight: 800,
        lineHeight: 1.1,
        marginBottom: '1.25rem',
        maxWidth: 700,
      }}>
        Algoritmos{' '}
        <span style={{ color: '#22c55e' }}>Genéticos</span>
        <br />aprenda de verdade
      </h1>

      <p style={{
        fontSize: 'clamp(1rem, 2vw, 1.15rem)',
        color: 'rgba(255,255,255,0.5)',
        maxWidth: 520,
        marginBottom: '2.5rem',
        lineHeight: 1.75,
      }}>
        Do zero ao código Python. Sem enrolação — com simulações interativas
        onde você vê cada geração evoluindo na sua frente.
      </p>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={onStart}
          style={{
            background: '#22c55e', color: '#000',
            border: 'none', borderRadius: 10,
            padding: '14px 32px', fontSize: 15, fontWeight: 600,
            fontFamily: 'Syne, sans-serif',
            boxShadow: '0 0 24px rgba(34,197,94,0.3)',
          }}
        >
          Começar a aprender →
        </button>
        <a href="https://github.com/alexandrezamberlan/tecnicasIA" target="_blank" rel="noreferrer"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10, padding: '14px 24px',
            fontSize: 14, color: 'rgba(255,255,255,0.6)',
            textDecoration: 'none',
          }}
        >
          Ver código fonte
        </a>
      </div>

      <div style={{ marginTop: '4rem', color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>
        fitness atual do cromossomo acima: <span style={{ color: '#22c55e', fontFamily: 'IBM Plex Mono' }}>
          {fitness(bits)}/{TAM}
        </span>
      </div>
    </section>
  )
}
