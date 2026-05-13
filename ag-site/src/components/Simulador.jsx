import { useState, useRef } from 'react'
import { criarPopulacao, fitness, fitnessTodos, proximaGeracao, TAM } from '../ag.js'
import Cromossomo from './Cromossomo.jsx'

const TAM_POP_INIT = 8

export default function Simulador() {
  const [pop, setPop] = useState(() => criarPopulacao(TAM_POP_INIT))
  const [geracao, setGeracao] = useState(0)
  const [historico, setHistorico] = useState([])
  const [taxaMut, setTaxaMut] = useState(0.05)
  const [tamPop, setTamPop] = useState(TAM_POP_INIT)
  const [log, setLog] = useState('Clique em Avançar para iniciar o AG.')
  const [done, setDone] = useState(false)
  const [eliteIdx, setEliteIdx] = useState(null)
  const autoRef = useRef(null)

  const fits = fitnessTodos(pop)
  const melhor = Math.max(...fits)
  const media = (fits.reduce((a, b) => a + b, 0) / fits.length).toFixed(1)

  function avancar() {
    if (done) return
    const resultado = proximaGeracao(pop, taxaMut)
    const novaGeracao = geracao + 1
    const novaPop = resultado.populacao
    const novaFits = fitnessTodos(novaPop)
    const novaMelhor = Math.max(...novaFits)

    setPop(novaPop)
    setGeracao(novaGeracao)
    setEliteIdx(resultado.eliteIdx)
    setHistorico(h => [...h, { gen: novaGeracao, melhor: novaMelhor, media: parseFloat((novaFits.reduce((a,b)=>a+b,0)/novaFits.length).toFixed(1)) }])

    if (novaMelhor === TAM) {
      setLog(`✔ Solução ótima encontrada na geração ${novaGeracao}! Cromossomo perfeito com ${TAM}/${TAM} bits.`)
      setDone(true)
      if (autoRef.current) { clearInterval(autoRef.current); autoRef.current = null }
    } else {
      setLog(`Geração ${novaGeracao} → melhor fitness: ${novaMelhor}/${TAM} | média: ${(novaFits.reduce((a,b)=>a+b,0)/novaFits.length).toFixed(1)} | mutação: ${(taxaMut*100).toFixed(0)}%`)
    }
  }

  function toggleAuto() {
    if (autoRef.current) {
      clearInterval(autoRef.current)
      autoRef.current = null
      return
    }
    autoRef.current = setInterval(() => {
      avancar()
    }, 500)
    setTimeout(() => {
      if (autoRef.current) { clearInterval(autoRef.current); autoRef.current = null }
    }, 5000)
  }

  function reset(novoTam) {
    if (autoRef.current) { clearInterval(autoRef.current); autoRef.current = null }
    const t = novoTam || tamPop
    setPop(criarPopulacao(t))
    setGeracao(0)
    setHistorico([])
    setLog('Clique em Avançar para iniciar o AG.')
    setDone(false)
    setEliteIdx(null)
  }

  function changePop(v) {
    setTamPop(v)
    reset(v)
  }

  return (
    <section style={{ padding: '5rem 1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span className="tag tag-green" style={{ marginBottom: '1rem', display: 'inline-block' }}>simulador interativo</span>
        <h2 style={{ fontFamily: 'Syne', fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 700 }}>
          Veja o AG evoluindo ao vivo
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', marginTop: '0.75rem' }}>
          Controle cada geração e observe os cromossomos melhorando
        </p>
      </div>

      {/* controles */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 10,
        marginBottom: '1.5rem', alignItems: 'center',
      }}>
        <button onClick={avancar} disabled={done} style={{
          background: done ? 'rgba(255,255,255,0.05)' : '#22c55e', color: done ? 'rgba(255,255,255,0.3)' : '#000',
          border: 'none', borderRadius: 9, padding: '10px 22px',
          fontSize: 14, fontWeight: 600, fontFamily: 'Syne',
        }}>
          ▶ Avançar 1 geração
        </button>

        <button onClick={toggleAuto} disabled={done} style={{
          background: 'rgba(96,165,250,0.12)', color: '#60a5fa',
          border: '1px solid rgba(96,165,250,0.2)', borderRadius: 9,
          padding: '10px 20px', fontSize: 14,
        }}>
          ⏩ Auto (10 ger.)
        </button>

        <button onClick={() => reset()} style={{
          background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)',
          border: '1px solid rgba(255,255,255,0.08)', borderRadius: 9,
          padding: '10px 18px', fontSize: 14,
        }}>
          ↺ Reiniciar
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.5)', marginLeft: 'auto' }}>
          <span>Mutação:</span>
          <input type="range" min={1} max={30} value={Math.round(taxaMut*100)}
            onChange={e => setTaxaMut(e.target.value/100)}
            style={{ width: 80 }} />
          <span style={{ fontFamily: 'IBM Plex Mono', color: '#f59e0b', minWidth: 32 }}>{Math.round(taxaMut*100)}%</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
          <span>Pop:</span>
          <input type="range" min={4} max={16} value={tamPop}
            onChange={e => changePop(+e.target.value)}
            style={{ width: 70 }} />
          <span style={{ fontFamily: 'IBM Plex Mono', color: '#a78bfa', minWidth: 20 }}>{tamPop}</span>
        </div>
      </div>

      {/* stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: '1.5rem' }}>
        {[
          { label: 'Geração', val: geracao, color: '#e8e6f0' },
          { label: 'Melhor fitness', val: `${melhor}/${TAM}`, color: '#22c55e' },
          { label: 'Média', val: media, color: '#60a5fa' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 10, padding: '1rem',
          }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 600, fontFamily: 'Syne', color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* população */}
      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 14, padding: '1.25rem',
        marginBottom: '1rem',
      }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: '1rem', fontFamily: 'IBM Plex Mono' }}>
          POPULAÇÃO — {pop.length} indivíduos
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {pop.map((c, i) => {
            const f = fitness(c)
            const pct = (f / TAM * 100).toFixed(0)
            const isElite = i === 0 && eliteIdx !== null
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', fontFamily: 'IBM Plex Mono', width: 24, textAlign: 'right', flexShrink: 0 }}>
                  #{i+1}
                </span>
                <Cromossomo bits={c} size="sm" />
                {/* barra fitness */}
                <div style={{ flex: 1, height: 18, background: 'rgba(255,255,255,0.04)', borderRadius: 4, overflow: 'hidden', position: 'relative', minWidth: 60 }}>
                  <div style={{
                    height: '100%', borderRadius: 4,
                    width: `${pct}%`,
                    background: `hsl(${Math.round(pct * 1.2)}, 70%, 45%)`,
                    transition: 'width 0.4s ease',
                  }} />
                  <span style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', fontSize: 10, fontFamily: 'IBM Plex Mono', color: 'rgba(255,255,255,0.5)' }}>
                    {f}
                  </span>
                </div>
                {isElite && <span className="tag tag-amber" style={{ fontSize: 10, padding: '2px 7px' }}>elite</span>}
              </div>
            )
          })}
        </div>
      </div>

      {/* log */}
      <div style={{
        background: done ? 'rgba(34,197,94,0.07)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${done ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 10, padding: '0.9rem 1.1rem',
        fontSize: 13, color: done ? '#22c55e' : 'rgba(255,255,255,0.5)',
        fontFamily: 'IBM Plex Mono',
      }}>
        {log}
      </div>

      {/* mini gráfico de evolução */}
      {historico.length > 1 && (
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 8, fontFamily: 'IBM Plex Mono' }}>
            EVOLUÇÃO DO FITNESS
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 60 }}>
            {historico.map((h, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <div style={{
                  width: '100%', borderRadius: '3px 3px 0 0',
                  background: '#22c55e',
                  height: `${(h.melhor / TAM) * 52}px`,
                  transition: 'height 0.3s',
                  minHeight: 2,
                }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(255,255,255,0.2)', fontFamily: 'IBM Plex Mono', marginTop: 4 }}>
            <span>gen 1</span><span>gen {historico.length}</span>
          </div>
        </div>
      )}
    </section>
  )
}
