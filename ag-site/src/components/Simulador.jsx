import { useState, useRef } from 'react'
import { criarPopulacao, fitness, fitnessTodos, proximaGeracao, TAM } from '../ag.js'
import Cromossomo from './Cromossomo.jsx'

export default function Simulador() {
  const [pop, setPop] = useState(() => criarPopulacao(8))
  const [geracao, setGeracao] = useState(0)
  const [historico, setHistorico] = useState([])
  const [taxaMut, setTaxaMut] = useState(0.05)
  const [tamPop, setTamPop] = useState(8)
  const [log, setLog] = useState('Clique em Avançar para iniciar.')
  const [done, setDone] = useState(false)
  const [eliteIdx, setEliteIdx] = useState(null)
  const autoRef = useRef(null)
  const [autoOn, setAutoOn] = useState(false)

  const fits = fitnessTodos(pop)
  const melhor = Math.max(...fits)
  const media = (fits.reduce((a,b)=>a+b,0)/fits.length).toFixed(1)

  function avancar(popAtual, gerAtual, histAtual) {
    const p = popAtual || pop
    const g = gerAtual !== undefined ? gerAtual : geracao
    const h = histAtual || historico
    if (done) return

    const res = proximaGeracao(p, taxaMut)
    const ng = g + 1
    const nf = fitnessTodos(res.populacao)
    const nm = Math.max(...nf)
    const navg = parseFloat((nf.reduce((a,b)=>a+b,0)/nf.length).toFixed(1))

    setPop(res.populacao)
    setGeracao(ng)
    setEliteIdx(0)
    const nh = [...h, { gen: ng, melhor: nm, media: navg }]
    setHistorico(nh)

    if (nm === TAM) {
      setLog(`✔ Ótimo encontrado na geração ${ng}! Todos os ${TAM} bits = 1.`)
      setDone(true)
      if (autoRef.current) { clearInterval(autoRef.current); autoRef.current = null; setAutoOn(false) }
    } else {
      setLog(`Geração ${ng} → melhor: ${nm}/${TAM} | média: ${navg} | mutação: ${Math.round(taxaMut*100)}%`)
    }
    return { pop: res.populacao, ger: ng, hist: nh }
  }

  function toggleAuto() {
    if (autoRef.current) {
      clearInterval(autoRef.current); autoRef.current = null; setAutoOn(false); return
    }
    setAutoOn(true)
    let p = pop, g = geracao, h = historico
    autoRef.current = setInterval(() => {
      const res = proximaGeracao(p, taxaMut)
      const ng = g + 1
      const nf = fitnessTodos(res.populacao)
      const nm = Math.max(...nf)
      const navg = parseFloat((nf.reduce((a,b)=>a+b,0)/nf.length).toFixed(1))
      p = res.populacao; g = ng
      h = [...h, { gen: ng, melhor: nm, media: navg }]
      setPop(p); setGeracao(g); setHistorico(h); setEliteIdx(0)
      setLog(`Geração ${ng} → melhor: ${nm}/${TAM} | média: ${navg}`)
      if (nm === TAM) {
        setLog(`✔ Ótimo na geração ${ng}!`)
        setDone(true)
        clearInterval(autoRef.current); autoRef.current = null; setAutoOn(false)
      }
    }, 400)
    setTimeout(() => {
      if (autoRef.current) { clearInterval(autoRef.current); autoRef.current = null; setAutoOn(false) }
    }, 8000)
  }

  function reset(n) {
    if (autoRef.current) { clearInterval(autoRef.current); autoRef.current = null }
    setAutoOn(false)
    const t = n || tamPop
    setPop(criarPopulacao(t)); setGeracao(0); setHistorico([])
    setLog('Clique em Avançar para iniciar.'); setDone(false); setEliteIdx(null)
  }

  const btnBase = {
    border: 'none', borderRadius: 9,
    padding: '10px 18px', fontSize: 13, fontWeight: 500,
  }

  return (
    <section className="section" id="simulador">
      <div className="section-label">simulador</div>
      <h2 className="section-title">Veja o AG evoluindo</h2>
      <p className="section-sub" style={{ marginBottom: '1.75rem' }}>
        Controle cada geração e observe os cromossomos melhorando em tempo real.
      </p>

      {/* controles */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: '1.25rem', alignItems: 'center' }}>
        <button onClick={() => avancar()} disabled={done} style={{
          ...btnBase,
          background: done ? 'rgba(255,255,255,0.04)' : '#7c6fff',
          color: done ? 'rgba(255,255,255,0.3)' : '#fff',
          fontFamily: 'Syne, sans-serif',
        }}>▶ Avançar 1 geração</button>

        <button onClick={toggleAuto} disabled={done} style={{
          ...btnBase,
          background: autoOn ? 'rgba(251,191,36,0.12)' : 'rgba(96,165,250,0.1)',
          color: autoOn ? '#fbbf24' : '#60a5fa',
          border: `1px solid ${autoOn ? 'rgba(251,191,36,0.2)' : 'rgba(96,165,250,0.2)'}`,
        }}>
          {autoOn ? '⏹ Pausar' : '⏩ Auto'}
        </button>

        <button onClick={() => reset()} style={{
          ...btnBase,
          background: 'rgba(255,255,255,0.04)',
          color: 'rgba(255,255,255,0.45)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}>↺ Reiniciar</button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'rgba(255,255,255,0.4)', marginLeft: 'auto' }}>
          <span>Mutação</span>
          <input type="range" min={1} max={30} value={Math.round(taxaMut*100)}
            onChange={e => setTaxaMut(e.target.value/100)} style={{ width: 70 }} />
          <span style={{ fontFamily: 'IBM Plex Mono', color: '#f87171', minWidth: 30 }}>{Math.round(taxaMut*100)}%</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
          <span>Pop</span>
          <input type="range" min={4} max={14} value={tamPop}
            onChange={e => { setTamPop(+e.target.value); reset(+e.target.value) }} style={{ width: 60 }} />
          <span style={{ fontFamily: 'IBM Plex Mono', color: '#a78bfa', minWidth: 20 }}>{tamPop}</span>
        </div>
      </div>

      {/* stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: '1.25rem' }}>
        {[
          { label: 'Geração', val: geracao, color: '#dddaf0' },
          { label: 'Melhor fitness', val: `${melhor}/${TAM}`, color: '#34d399' },
          { label: 'Média', val: media, color: '#60a5fa' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 10, padding: '0.85rem 1rem',
          }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 4, fontFamily: 'IBM Plex Mono' }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 600, fontFamily: 'Syne, sans-serif', color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* população */}
      <div style={{
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 12, padding: '1.1rem', marginBottom: '0.75rem',
      }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginBottom: '0.85rem', fontFamily: 'IBM Plex Mono', letterSpacing: '0.06em' }}>
          POPULAÇÃO — {pop.length} indivíduos
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {pop.map((c, i) => {
            const f = fitness(c)
            const pct = f / TAM * 100
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', fontFamily: 'IBM Plex Mono', width: 22, textAlign: 'right', flexShrink: 0 }}>
                  {i + 1}
                </span>
                <Cromossomo bits={c} size="sm" />
                <div style={{ flex: 1, height: 16, background: 'rgba(255,255,255,0.04)', borderRadius: 4, overflow: 'hidden', position: 'relative', minWidth: 40 }}>
                  <div style={{
                    height: '100%', borderRadius: 4,
                    width: `${pct}%`,
                    background: `hsl(${Math.round(pct * 1.3)}, 65%, 50%)`,
                    transition: 'width 0.4s ease',
                  }} />
                  <span style={{ position: 'absolute', right: 5, top: '50%', transform: 'translateY(-50%)', fontSize: 9, fontFamily: 'IBM Plex Mono', color: 'rgba(255,255,255,0.4)' }}>
                    {f}
                  </span>
                </div>
                {i === 0 && eliteIdx !== null && (
                  <span className="tag tag-amber" style={{ fontSize: 9, padding: '1px 6px' }}>elite</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* log */}
      <div style={{
        background: done ? 'rgba(52,211,153,0.06)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${done ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 9, padding: '0.8rem 1rem',
        fontSize: 12, color: done ? '#34d399' : 'rgba(255,255,255,0.4)',
        fontFamily: 'IBM Plex Mono',
      }}>{log}</div>

      {/* gráfico */}
      {historico.length > 1 && (
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginBottom: 8, fontFamily: 'IBM Plex Mono', letterSpacing: '0.06em' }}>
            EVOLUÇÃO DO FITNESS
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 56 }}>
            {historico.map((h, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                <div style={{
                  width: '100%', borderRadius: '3px 3px 0 0',
                  background: `hsl(${Math.round(h.melhor/TAM*140)}, 65%, 50%)`,
                  height: `${(h.melhor / TAM) * 50}px`,
                  transition: 'height 0.3s', minHeight: 2,
                }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'rgba(255,255,255,0.2)', fontFamily: 'IBM Plex Mono', marginTop: 4 }}>
            <span>gen 1</span><span>gen {historico.length}</span>
          </div>
        </div>
      )}
    </section>
  )
}
