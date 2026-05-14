import { useState, useRef, useEffect } from 'react'

const CHARS = 'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?'

function charAleatorio() {
  return CHARS[Math.floor(Math.random() * CHARS.length)]
}

function criarIndividuo(tamanho) {
  return Array.from({ length: tamanho }, charAleatorio)
}

function criarPopulacao(n, tamanho) {
  return Array.from({ length: n }, () => criarIndividuo(tamanho))
}

function fitness(individuo, alvo) {
  return individuo.reduce((s, c, i) => s + (c === alvo[i] ? 1 : 0), 0)
}

function selecaoRoleta(pop, alvo) {
  const fits = pop.map(i => fitness(i, alvo))
  const total = fits.reduce((a, b) => a + b, 0)
  if (total === 0) return pop[Math.floor(Math.random() * pop.length)]
  let p = Math.random() * total, acc = 0
  for (let i = 0; i < pop.length; i++) {
    acc += fits[i]
    if (acc >= p) return pop[i]
  }
  return pop[pop.length - 1]
}

function crossover(a, b) {
  const c = Math.floor(Math.random() * (a.length - 1)) + 1
  return [[...a.slice(0, c), ...b.slice(c)], [...b.slice(0, c), ...a.slice(c)]]
}

function mutar(ind, taxa) {
  return ind.map(c => Math.random() < taxa ? charAleatorio() : c)
}

function proximaGeracao(pop, alvo, taxa) {
  const fits = pop.map(i => fitness(i, alvo))
  const eliteIdx = fits.indexOf(Math.max(...fits))
  const elite = [...pop[eliteIdx]]
  const nova = [elite]
  while (nova.length < pop.length) {
    const [f1, f2] = crossover(selecaoRoleta(pop, alvo), selecaoRoleta(pop, alvo))
    nova.push(mutar(f1, taxa))
    if (nova.length < pop.length) nova.push(mutar(f2, taxa))
  }
  return nova
}

export default function PalavraAG() {
  const [alvo, setAlvo] = useState('evolucao')
  const [input, setInput] = useState('evolucao')
  const [pop, setPop] = useState(null)
  const [geracao, setGeracao] = useState(0)
  const [historico, setHistorico] = useState([])
  const [rodando, setRodando] = useState(false)
  const [done, setDone] = useState(false)
  const [taxa, setTaxa] = useState(0.04)
  const autoRef = useRef(null)
  const popRef = useRef(null)
  popRef.current = pop

  function iniciar() {
    const alvoLimpo = input.slice(0, 20)
    if (!alvoLimpo) return
    if (autoRef.current) { clearInterval(autoRef.current); autoRef.current = null }
    const novaPop = criarPopulacao(80, alvoLimpo.length)
    setAlvo(alvoLimpo)
    setPop(novaPop)
    setGeracao(0)
    setHistorico([])
    setDone(false)
    setRodando(false)
  }

  function avancarUm(p, g, h, alvoAtual) {
    const nova = proximaGeracao(p, alvoAtual.split(''), taxa)
    const ng = g + 1
    const fits = nova.map(i => fitness(i, alvoAtual.split('')))
    const mi = fits.indexOf(Math.max(...fits))
    const nh = [...h, { gen: ng, melhor: fits[mi], max: alvoAtual.length }]
    const achou = fits[mi] === alvoAtual.length
    return { nova, ng, nh, mi, achou }
  }

  function stepUm() {
    if (!pop || done) return
    const { nova, ng, nh, achou } = avancarUm(pop, geracao, historico, alvo)
    setPop(nova); setGeracao(ng); setHistorico(nh)
    if (achou) { setDone(true); setRodando(false) }
  }

  function toggleAuto() {
    if (rodando) {
      clearInterval(autoRef.current); autoRef.current = null; setRodando(false); return
    }
    if (!pop || done) return
    setRodando(true)
    let p = pop, g = geracao, h = historico
    autoRef.current = setInterval(() => {
      const alvoAtual = alvo
      const res = avancarUm(p, g, h, alvoAtual)
      p = res.nova; g = res.ng; h = res.nh
      setPop([...p]); setGeracao(g); setHistorico([...h])
      if (res.achou) {
        setDone(true); setRodando(false)
        clearInterval(autoRef.current); autoRef.current = null
      }
    }, 80)
  }

  useEffect(() => () => { if (autoRef.current) clearInterval(autoRef.current) }, [])

  const fits = pop ? pop.map(i => fitness(i, alvo.split(''))) : []
  const mi = fits.length ? fits.indexOf(Math.max(...fits)) : 0
  const melhorInd = pop ? pop[mi] : []
  const melhorFit = fits.length ? fits[mi] : 0
  const pct = alvo.length ? melhorFit / alvo.length : 0

  // top 5 para mostrar
  const top5 = pop
    ? [...pop].sort((a, b) => fitness(b, alvo.split('')) - fitness(a, alvo.split(''))).slice(0, 5)
    : []

  return (
    <section className="section" id="palavra">
      <div className="section-label">exemplo visual</div>
      <h2 className="section-title">Achando uma palavra</h2>
      <p className="section-sub" style={{ marginBottom: '0.75rem' }}>
        O AG começa com 80 "palavras" aleatórias e vai evoluindo até achar a sua.
        Cada letra é um gene — o crossover mistura letras de dois pais, a mutação troca uma letra aleatória.
      </p>
      <div style={{
        background: 'rgba(124,111,255,0.07)', border: '1px solid rgba(124,111,255,0.15)',
        borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1.75rem',
        fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7,
      }}>
        💡 <strong style={{ color: 'rgba(255,255,255,0.75)' }}>Como funciona:</strong> fitness = quantidade de letras na posição certa.
        "evolucao" tem fitness 8 (perfeito). "exxxucao" tem fitness 4 (metade certa).
        A roleta favorece as palavras mais parecidas com o alvo.
      </div>

      {/* input */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'IBM Plex Mono', marginBottom: 6, letterSpacing: '0.06em' }}>
            PALAVRA ALVO (máx. 20 caracteres)
          </div>
          <input
            value={input}
            onChange={e => setInput(e.target.value.slice(0, 20))}
            onKeyDown={e => e.key === 'Enter' && iniciar()}
            placeholder="digite uma palavra..."
            style={{
              width: '100%', background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9,
              padding: '10px 14px', fontSize: 15,
              fontFamily: 'IBM Plex Mono', color: '#dddaf0',
              outline: 'none',
            }}
          />
        </div>
        <button onClick={iniciar} style={{
          background: '#7c6fff', color: '#fff', border: 'none',
          borderRadius: 9, padding: '10px 22px', fontSize: 14,
          fontWeight: 600, fontFamily: 'Syne, sans-serif',
          whiteSpace: 'nowrap',
        }}>Iniciar AG</button>
      </div>

      {pop && (
        <>
          {/* controles */}
          <div style={{ display: 'flex', gap: 8, marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button onClick={stepUm} disabled={done} style={{
              background: done ? 'rgba(255,255,255,0.04)' : 'rgba(124,111,255,0.15)',
              color: done ? 'rgba(255,255,255,0.3)' : '#a78bfa',
              border: `1px solid ${done ? 'rgba(255,255,255,0.06)' : 'rgba(124,111,255,0.25)'}`,
              borderRadius: 8, padding: '8px 16px', fontSize: 13,
            }}>▶ +1 geração</button>

            <button onClick={toggleAuto} disabled={done} style={{
              background: rodando ? 'rgba(251,191,36,0.12)' : 'rgba(52,211,153,0.1)',
              color: rodando ? '#fbbf24' : '#34d399',
              border: `1px solid ${rodando ? 'rgba(251,191,36,0.2)' : 'rgba(52,211,153,0.2)'}`,
              borderRadius: 8, padding: '8px 16px', fontSize: 13,
            }}>{rodando ? '⏹ Pausar' : '⚡ Rodar rápido'}</button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'rgba(255,255,255,0.35)', marginLeft: 'auto' }}>
              Mutação:
              <input type="range" min={1} max={20} value={Math.round(taxa * 100)}
                onChange={e => setTaxa(e.target.value / 100)} style={{ width: 70 }} />
              <span style={{ fontFamily: 'IBM Plex Mono', color: '#f87171', minWidth: 30 }}>{Math.round(taxa * 100)}%</span>
            </div>
          </div>

          {/* melhor atual — destaque principal */}
          <div style={{
            background: done ? 'rgba(52,211,153,0.08)' : 'rgba(255,255,255,0.02)',
            border: `1px solid ${done ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.07)'}`,
            borderRadius: 14, padding: '1.25rem',
            marginBottom: '1rem', transition: 'all 0.3s',
          }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontFamily: 'IBM Plex Mono', marginBottom: 10, letterSpacing: '0.06em' }}>
              MELHOR INDIVÍDUO — GERAÇÃO {geracao}
              {done && <span style={{ color: '#34d399', marginLeft: 8 }}>✔ ENCONTRADO!</span>}
            </div>

            {/* palavra letra por letra */}
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: '1rem' }}>
              {melhorInd.map((c, i) => {
                const certo = c === alvo[i]
                return (
                  <div key={i} style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                  }}>
                    <div style={{
                      width: 'clamp(28px,6vw,38px)', height: 'clamp(28px,6vw,38px)',
                      borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'IBM Plex Mono', fontWeight: 600,
                      fontSize: 'clamp(12px,2.5vw,16px)',
                      background: certo ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${certo ? 'rgba(52,211,153,0.4)' : 'rgba(255,255,255,0.08)'}`,
                      color: certo ? '#34d399' : 'rgba(255,255,255,0.5)',
                      transition: 'all 0.2s',
                    }}>{c}</div>
                    <div style={{
                      width: 'clamp(28px,6vw,38px)', height: 'clamp(28px,6vw,38px)',
                      borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'IBM Plex Mono', fontWeight: 600,
                      fontSize: 'clamp(12px,2.5vw,16px)',
                      background: 'rgba(124,111,255,0.1)',
                      border: '1px solid rgba(124,111,255,0.2)',
                      color: '#a78bfa',
                    }}>{alvo[i]}</div>
                  </div>
                )
              })}
            </div>

            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', marginBottom: '0.75rem', fontFamily: 'IBM Plex Mono' }}>
              linha de cima = melhor atual · linha de baixo = alvo
            </div>

            {/* barra de progresso */}
            <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden', marginBottom: 6 }}>
              <div style={{
                height: '100%', borderRadius: 4,
                width: `${pct * 100}%`,
                background: done ? '#34d399' : `hsl(${Math.round(pct * 140)}, 65%, 55%)`,
                transition: 'width 0.3s ease',
              }} />
            </div>
            <div style={{ fontSize: 11, fontFamily: 'IBM Plex Mono', color: 'rgba(255,255,255,0.3)' }}>
              {melhorFit}/{alvo.length} letras corretas ({Math.round(pct * 100)}%)
            </div>
          </div>

          {/* top 5 */}
          <div style={{
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12, padding: '1rem', marginBottom: '1rem',
          }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontFamily: 'IBM Plex Mono', marginBottom: 10, letterSpacing: '0.06em' }}>
              TOP 5 DA POPULAÇÃO ATUAL
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {top5.map((ind, i) => {
                const f = fitness(ind, alvo.split(''))
                const p = f / alvo.length
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', fontFamily: 'IBM Plex Mono', width: 16 }}>#{i + 1}</span>
                    <span style={{
                      fontFamily: 'IBM Plex Mono', fontSize: 13,
                      color: p > 0.8 ? '#34d399' : p > 0.5 ? '#fbbf24' : 'rgba(255,255,255,0.4)',
                      flex: 1, letterSpacing: '0.05em',
                    }}>{ind.join('')}</span>
                    <div style={{ width: 60, height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: 3,
                        width: `${p * 100}%`,
                        background: `hsl(${Math.round(p * 140)}, 60%, 55%)`,
                      }} />
                    </div>
                    <span style={{ fontSize: 10, fontFamily: 'IBM Plex Mono', color: 'rgba(255,255,255,0.3)', minWidth: 32, textAlign: 'right' }}>
                      {f}/{alvo.length}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* gráfico de evolução */}
          {historico.length > 1 && (
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '1rem' }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontFamily: 'IBM Plex Mono', marginBottom: 10, letterSpacing: '0.06em' }}>
                EVOLUÇÃO — {historico.length} GERAÇÕES
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 48 }}>
                {historico.slice(-120).map((h, i) => (
                  <div key={i} style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'flex-end' }}>
                    <div style={{
                      width: '100%', borderRadius: '2px 2px 0 0',
                      background: h.melhor === h.max ? '#34d399' : `hsl(${Math.round(h.melhor / h.max * 140)}, 65%, 50%)`,
                      height: `${(h.melhor / h.max) * 44}px`,
                      minHeight: 2, transition: 'height 0.1s',
                    }} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'rgba(255,255,255,0.2)', fontFamily: 'IBM Plex Mono', marginTop: 4 }}>
                <span>gen 1</span>
                <span>gen {historico.length}</span>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  )
}
