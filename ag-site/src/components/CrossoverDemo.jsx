import { useState } from 'react'
import { criarCromossomo, crossover, mutacao, fitness, TAM } from '../ag.js'
import Cromossomo from './Cromossomo.jsx'
import CodeBlock from './CodeBlock.jsx'

export default function CrossoverDemo() {
  const [pai, setPai] = useState(criarCromossomo)
  const [mae, setMae] = useState(criarCromossomo)
  const [resultado, setResultado] = useState(null)
  const [taxaMut, setTaxaMut] = useState(0.05)

  function executar() {
    const { filho1, filho2, corte } = crossover(pai, mae, 1.0)
    const m1 = mutacao(filho1, taxaMut)
    const m2 = mutacao(filho2, taxaMut)
    setResultado({ filho1: m1.cromossomo, filho2: m2.cromossomo, corte, mut1: m1.posicoesMutadas, mut2: m2.posicoesMutadas })
  }

  const btnBase = { border: 'none', borderRadius: 9, padding: '10px 20px', fontSize: 13, fontWeight: 500 }

  return (
    <section className="section" id="crossover">
      <div className="section-label">demonstração</div>
      <h2 className="section-title">Crossover + Mutação</h2>
      <p className="section-sub" style={{ marginBottom: '1.75rem' }}>
        Escolha pais e veja exatamente como os filhos são gerados.
      </p>

      {/* pais */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px,1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
        {[
          { label: 'PAI', bits: pai, cor: '#60a5fa', corDim: 'rgba(96,165,250,0.06)', onNew: () => { setPai(criarCromossomo()); setResultado(null) } },
          { label: 'MÃE', bits: mae, cor: '#a78bfa', corDim: 'rgba(167,139,250,0.06)', onNew: () => { setMae(criarCromossomo()); setResultado(null) } },
        ].map(({ label, bits, cor, corDim, onNew }) => (
          <div key={label} style={{ background: corDim, border: `1px solid ${cor}20`, borderRadius: 12, padding: '1.1rem' }}>
            <div style={{ fontSize: 10, color: cor, fontFamily: 'IBM Plex Mono', marginBottom: 10, opacity: 0.7 }}>
              {label} — fitness: <span style={{ opacity: 1 }}>{fitness(bits)}/{TAM}</span>
            </div>
            <Cromossomo bits={bits} corte={resultado?.corte} />
            <button onClick={onNew} style={{
              ...btnBase,
              marginTop: 12, background: `${cor}15`,
              color: cor, border: `1px solid ${cor}25`, padding: '6px 14px', fontSize: 12,
            }}>↺ Novo</button>
          </div>
        ))}
      </div>

      {/* controles */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: '1.5rem', alignItems: 'center' }}>
        <button onClick={executar} style={{
          ...btnBase, background: '#fbbf24', color: '#000', fontFamily: 'Syne, sans-serif', fontWeight: 700,
        }}>🔀 Executar crossover</button>
        <button onClick={() => { setPai(criarCromossomo()); setMae(criarCromossomo()); setResultado(null) }} style={{
          ...btnBase, background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.07)',
        }}>↺ Novos pais</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
          Mutação:
          <input type="range" min={0} max={50} value={Math.round(taxaMut*100)} onChange={e => setTaxaMut(e.target.value/100)} style={{ width: 70 }} />
          <span style={{ color: '#f87171', fontFamily: 'IBM Plex Mono', minWidth: 30 }}>{Math.round(taxaMut*100)}%</span>
        </div>
      </div>

      {/* resultado */}
      {resultado && (
        <div style={{ animation: 'fadeUp 0.25s ease' }}>
          <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`}</style>
          {resultado.corte && (
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: '1rem', fontFamily: 'IBM Plex Mono', lineHeight: 1.8 }}>
              Ponto de corte: <span style={{ color: '#a78bfa' }}>posição {resultado.corte}</span>
              {resultado.mut1.length > 0 && <> · Mutações F1: <span style={{ color: '#f87171' }}>{resultado.mut1.join(', ')}</span></>}
              {resultado.mut2.length > 0 && <> · F2: <span style={{ color: '#f87171' }}>{resultado.mut2.join(', ')}</span></>}
              {resultado.mut1.length === 0 && resultado.mut2.length === 0 && <span style={{ color: 'rgba(255,255,255,0.2)' }}> · sem mutações nessa rodada</span>}
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px,1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {[
              { label: 'FILHO 1', bits: resultado.filho1, mut: resultado.mut1 },
              { label: 'FILHO 2', bits: resultado.filho2, mut: resultado.mut2 },
            ].map(({ label, bits, mut }) => {
              const melhorQuePais = fitness(bits) > Math.max(fitness(pai), fitness(mae))
              return (
                <div key={label} style={{ background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.15)', borderRadius: 12, padding: '1.1rem' }}>
                  <div style={{ fontSize: 10, color: 'rgba(52,211,153,0.7)', fontFamily: 'IBM Plex Mono', marginBottom: 10 }}>
                    {label} — fitness: <span style={{ color: '#34d399' }}>{fitness(bits)}/{TAM}</span>
                    {melhorQuePais && <span style={{ color: '#34d399', marginLeft: 8 }}>↑ melhor que os pais!</span>}
                  </div>
                  <Cromossomo bits={bits} highlight={mut} />
                  {mut.length > 0 && (
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', marginTop: 8 }}>bits laranja = sofreram mutação</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      <CodeBlock title="crossover + mutacao — ag.py" code={`def crossover(pai, mae):
    corte = random.randint(1, TAM_CROMOSSOMO - 1)
    filho1 = pai[:corte] + mae[corte:]
    filho2 = mae[:corte] + pai[corte:]
    return filho1, filho2

def mutacao(cromossomo, taxa=0.05):
    return [
        1 - gene if random.random() < taxa else gene
        for gene in cromossomo
    ]`} />
    </section>
  )
}
