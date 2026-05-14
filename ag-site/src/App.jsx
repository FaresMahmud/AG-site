import { useRef } from 'react'
import Hero from './components/Hero.jsx'
import PalavraAG from './components/PalavraAG.jsx'
import Conceitos from './components/Conceitos.jsx'
import Simulador from './components/Simulador.jsx'
import CrossoverDemo from './components/CrossoverDemo.jsx'
import Mochila from './components/Mochila.jsx'
import Footer from './components/Footer.jsx'

const navLinks = [
  { label: 'Palavra', href: '#palavra' },
  { label: 'Conceitos', href: '#conceitos' },
  { label: 'Simulador', href: '#simulador' },
  { label: 'Crossover', href: '#crossover' },
  { label: 'Mochila', href: '#mochila' },
]

export default function App() {
  const palavraRef = useRef(null)

  return (
    <div>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(8,8,16,0.88)', backdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: '0 1.25rem', height: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 14, letterSpacing: '-0.01em' }}>
          AG<span style={{ color: '#7c6fff' }}>.</span>learn
        </span>
        <div style={{ display: 'flex', gap: 2, overflowX: 'auto' }}>
          {navLinks.map(l => (
            <a key={l.href} href={l.href} style={{
              fontSize: 12, color: 'rgba(255,255,255,0.4)',
              textDecoration: 'none', padding: '5px 10px', borderRadius: 6,
              whiteSpace: 'nowrap',
            }}
              onMouseEnter={e => { e.target.style.color = '#fff'; e.target.style.background = 'rgba(255,255,255,0.05)' }}
              onMouseLeave={e => { e.target.style.color = 'rgba(255,255,255,0.4)'; e.target.style.background = 'transparent' }}
            >{l.label}</a>
          ))}
        </div>
      </nav>

      <div style={{ paddingTop: 50 }}>
        <Hero onStart={() => palavraRef.current?.scrollIntoView({ behavior: 'smooth' })} />

        <div ref={palavraRef}>
          <PalavraAG />
        </div>

        <div className="divider" />
        <Conceitos />
        <div className="divider" />
        <Simulador />
        <div className="divider" />
        <CrossoverDemo />
        <div className="divider" />
        <Mochila />
        <Footer />
      </div>
    </div>
  )
}
