import { useState } from 'react'

const ITENS = [
  { nome: 'Notebook', peso: 3, valor: 10, emoji: '💻' },
  { nome: 'Câmera', peso: 2, valor: 8, emoji: '📷' },
  { nome: 'Livros', peso: 4, valor: 6, emoji: '📚' },
  { nome: 'Roupas', peso: 3, valor: 4, emoji: '👕' },
  { nome: 'Tênis', peso: 2, valor: 3, emoji: '👟' },
  { nome: 'Carregador', peso: 1, valor: 5, emoji: '🔋' },
  { nome: 'Tablet', peso: 2, valor: 7, emoji: '📱' },
  { nome: 'Fone', peso: 1, valor: 6, emoji: '🎧' },
]
const CAPACIDADE = 8

function fitness(cromossomo) {
  let peso = 0, valor = 0
  cromossomo.forEach((b, i) => { if (b) { peso += ITENS[i].peso; valor += ITENS[i].valor } })
  return peso <= CAPACIDADE ? valor : 0
}

function pesoTotal(c) { return c.reduce((s, b, i) => s + (b ? ITENS[i].peso : 0), 0) }
function valorTotal(c) { return c.reduce((s, b, i) => s + (b ? ITENS[i].valor : 0), 0) }

function criarPop(n) { return Array.from({ length: n }, () => Array.from({ length: ITENS.length }, () => Math.random() < 0.5 ? 1 : 0)) }

function roleta(pop) {
  const fits = pop.map(fitness)
  const total = fits.reduce((a, b) => a + b, 0)
  if (total === 0) return pop[Math.floor(Math.random() * pop.length)]
  let p = Math.random() * total, acc = 0
  for (let i = 0; i < pop.length; i++) { acc += fits[i]; if (acc >= p) return pop[i] }
  return pop[pop.length - 1]
}

function crossover(a, b) {
  const c = Math.floor(Math.random() * (a.length - 1)) + 1
  return [[...a.slice(0, c), ...b.slice(c)], [...b.slice(0, c), ...a.slice(c)]]
}

function mutar(c, taxa = 0.1) { return c.map(g => Math.random() < taxa ? 1 - g : g) }

export default function Mochila() {
  const [pop, setPop] = useState(() => criarPop(12))
  const [geracao, setGeracao] = useState(0)
  const [melhor, setMelhor] = useState(null)

  function avancar() {
    const fits = pop.map(fitness)
    const mi = fits.indexOf(Math.max(...fits))
    const elite = [...pop[mi]]
    const nova = [elite]
    while (nova.length < pop.length) {
      const [f1, f2] = crossover(roleta(pop), roleta(pop))
      nova.push(mutar(f1)); if (nova.length < pop.length) nova.push(mutar(f2))
    }
    setPop(nova)
    setGeracao(g => g + 1)
    const nf = nova.map(fitness)
    const ni = nf.indexOf(Math.max(...nf))
    setMelhor(nova[ni])
  }

  function reset() { setPop(criarPop(12)); setGeracao(0); setMelhor(null) }

  const fits = pop.map(fitness)
  const mi = fits.indexOf(Math.max(...fits))
  const atual = melhor || pop[mi]
  const peso = pesoTotal(atual)
  const valor = valorTotal(atual)
  const valido = peso <= CAPACIDADE

  return (
    <section className="section" id="mochila">
      <div className="section-label">problema clássico</div>
      <h2 className="section-title">Problema da Mochila</h2>
      <p className="section-sub" style={{ marginBottom: '1.75rem' }}>
        O AG precisa escolher quais itens colocar na mochila (capacidade {CAPACIDADE}kg) para maximizar o valor total sem exceder o peso.
        Cada cromossomo = quais itens entram (1) ou não (0).
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        {/* itens disponíveis */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '1.1rem' }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontFamily: 'IBM Plex Mono', marginBottom: '0.85rem', letterSpacing: '0.06em' }}>
            ITENS DISPONÍVEIS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {ITENS.map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '7px 10px', borderRadius: 8,
                background: atual[i] ? 'rgba(124,111,255,0.1)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${atual[i] ? 'rgba(124,111,255,0.25)' : 'transparent'}`,
                transition: 'all 0.3s',
              }}>
                <span style={{ fontSize: 16, width: 24, textAlign: 'center' }}>{item.emoji}</span>
                <span style={{ flex: 1, fontSize: 13, color: atual[i] ? '#dddaf0' : 'rgba(255,255,255,0.4)' }}>{item.nome}</span>
                <span style={{ fontSize: 11, fontFamily: 'IBM Plex Mono', color: 'rgba(255,255,255,0.3)' }}>{item.peso}kg</span>
                <span style={{ fontSize: 11, fontFamily: 'IBM Plex Mono', color: '#fbbf24' }}>+{item.valor}</span>
                <div style={{
                  width: 20, height: 20, borderRadius: 4,
                  background: atual[i] ? '#7c6fff' : 'rgba(255,255,255,0.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, color: '#fff',
                  transition: 'all 0.3s',
                }}>{atual[i] ? '✓' : ''}</div>
              </div>
            ))}
          </div>
        </div>

        {/* resultado */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{
            background: valido ? 'rgba(52,211,153,0.06)' : 'rgba(248,113,113,0.06)',
            border: `1px solid ${valido ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)'}`,
            borderRadius: 12, padding: '1.25rem',
          }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontFamily: 'IBM Plex Mono', marginBottom: '0.85rem', letterSpacing: '0.06em' }}>
              MELHOR SOLUÇÃO — GERAÇÃO {geracao}
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, fontFamily: 'Syne', color: valido ? '#34d399' : '#f87171', marginBottom: 4 }}>
              {valor} pts
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>
              Peso: <span style={{ color: valido ? '#34d399' : '#f87171', fontWeight: 500 }}>{peso}kg</span> / {CAPACIDADE}kg
              {!valido && <span style={{ color: '#f87171', marginLeft: 8 }}>⚠ excedeu!</span>}
            </div>
            {/* barra de peso */}
            <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 4,
                width: `${Math.min(peso / CAPACIDADE * 100, 100)}%`,
                background: valido ? '#34d399' : '#f87171',
                transition: 'width 0.4s ease',
              }} />
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', marginTop: 4, fontFamily: 'IBM Plex Mono' }}>
              capacidade da mochila
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '1.1rem' }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontFamily: 'IBM Plex Mono', marginBottom: 8, letterSpacing: '0.06em' }}>CROMOSSOMO</div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {atual.map((b, i) => (
                <div key={i} title={ITENS[i].nome} style={{
                  width: 28, height: 28, borderRadius: 5,
                  background: b ? '#7c6fff' : 'rgba(255,255,255,0.05)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, color: b ? '#fff' : 'rgba(255,255,255,0.2)',
                  fontFamily: 'IBM Plex Mono', fontWeight: 500,
                  transition: 'all 0.3s',
                  border: b ? '1px solid rgba(124,111,255,0.4)' : '1px solid rgba(255,255,255,0.05)',
                }}>{b}</div>
              ))}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', marginTop: 6, fontFamily: 'IBM Plex Mono' }}>
              1 = item na mochila · 0 = item fora
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={avancar} style={{
              flex: 1, background: '#7c6fff', color: '#fff',
              border: 'none', borderRadius: 9, padding: '11px',
              fontSize: 13, fontWeight: 600, fontFamily: 'Syne',
            }}>▶ Evoluir</button>
            <button onClick={() => { for(let i=0;i<10;i++) avancar() }} style={{
              flex: 1, background: 'rgba(124,111,255,0.15)', color: '#a78bfa',
              border: '1px solid rgba(124,111,255,0.2)', borderRadius: 9, padding: '11px',
              fontSize: 13,
            }}>⏩ +10 gerações</button>
            <button onClick={reset} style={{
              background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)',
              border: '1px solid rgba(255,255,255,0.07)', borderRadius: 9, padding: '11px 14px', fontSize: 13,
            }}>↺</button>
          </div>
        </div>
      </div>
    </section>
  )
}
