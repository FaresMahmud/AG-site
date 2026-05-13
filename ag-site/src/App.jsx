import { useRef } from 'react'
import Hero from './components/Hero.jsx'
import Conceitos from './components/Conceitos.jsx'
import Simulador from './components/Simulador.jsx'
import CrossoverDemo from './components/CrossoverDemo.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  const conceitosRef = useRef(null)

  function scrollParaConceitos() {
    conceitosRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div>
      {/* navbar fixa */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0 1.5rem', height: 52,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 15, letterSpacing: '-0.01em' }}>
          AG<span style={{ color: '#22c55e' }}>.</span>learn
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          {['Conceitos', 'Simulador', 'Crossover'].map(s => (
            <a key={s} href={`#${s.toLowerCase()}`} style={{
              fontSize: 13, color: 'rgba(255,255,255,0.45)',
              textDecoration: 'none', padding: '6px 12px', borderRadius: 7,
              transition: 'color 0.15s, background 0.15s',
            }}
              onMouseEnter={e => { e.target.style.color='#fff'; e.target.style.background='rgba(255,255,255,0.05)' }}
              onMouseLeave={e => { e.target.style.color='rgba(255,255,255,0.45)'; e.target.style.background='transparent' }}
            >{s}</a>
          ))}
        </div>
      </nav>

      <div style={{ paddingTop: 52 }}>
        <Hero onStart={scrollParaConceitos} />

        <div ref={conceitosRef} id="conceitos">
          <Conceitos />
        </div>

        {/* divisor */}
        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)', margin: '0 1.5rem' }} />

        <div id="simulador">
          <Simulador />
        </div>

        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)', margin: '0 1.5rem' }} />

        <div id="crossover">
          <CrossoverDemo />
        </div>

        <Footer />
      </div>
    </div>
  )
}
