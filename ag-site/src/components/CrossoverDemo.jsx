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
    const { filho1, filho2, corte } = crossover(pai, mae, 1.0) // força crossover
    const m1 = mutacao(filho1, taxaMut)
    const m2 = mutacao(filho2, taxaMut)
    setResultado({ filho1: m1.cromossomo, filho2: m2.cromossomo, corte, mut1: m1.posicoesMutadas, mut2: m2.posicoesMutadas })
  }

  function novosPais() {
    setPai(criarCromossomo())
    setMae(criarCromossomo())
    setResultado(null)
  }

  return (
    <section style={{ padding: '5rem 1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span className="tag tag-amber" style={{ marginBottom: '1rem', display: 'inline-block' }}>demonstração</span>
        <h2 style={{ fontFamily: 'Syne', fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 700 }}>
          Crossover + Mutação na prática
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', marginTop: '0.75rem' }}>
          Veja exatamente como dois cromossomos se combinam para gerar filhos
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* PAI */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '1.25rem' }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'IBM Plex Mono', marginBottom: 10 }}>
            PAI — fitness: <span style={{ color: '#60a5fa' }}>{fitness(pai)}/{TAM}</span>
          </div>
          <Cromossomo bits={pai} corte={resultado?.corte} />
          <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
            <button onClick={() => { setPai(criarCromossomo()); setResultado(null) }} style={{
              background: 'rgba(96,165,250,0.1)', color: '#60a5fa',
              border: '1px solid rgba(96,165,250,0.2)', borderRadius: 7,
              padding: '6px 14px', fontSize: 12,
            }}>↺ Novo pai</button>
          </div>
        </div>

        {/* MÃE */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '1.25rem' }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'IBM Plex Mono', marginBottom: 10 }}>
            MÃE — fitness: <span style={{ color: '#a78bfa' }}>{fitness(mae)}/{TAM}</span>
          </div>
          <Cromossomo bits={mae} corte={resultado?.corte} />
          <div style={{ marginTop: 10 }}>
            <button onClick={() => { setMae(criarCromossomo()); setResultado(null) }} style={{
              background: 'rgba(167,139,250,0.1)', color: '#a78bfa',
              border: '1px solid rgba(167,139,250,0.2)', borderRadius: 7,
              padding: '6px 14px', fontSize: 12,
            }}>↺ Nova mãe</button>
          </div>
        </div>
      </div>

      {/* controle mutação + botão */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button onClick={executar} style={{
          background: '#f59e0b', color: '#000',
          border: 'none', borderRadius: 9,
          padding: '11px 28px', fontSize: 14, fontWeight: 700, fontFamily: 'Syne',
        }}>
          🔀 Executar crossover + mutação
        </button>
        <button onClick={novosPais} style={{
          background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)',
          border: '1px solid rgba(255,255,255,0.08)', borderRadius: 9,
          padding: '11px 18px', fontSize: 13,
        }}>↺ Novos pais aleatórios</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
          Taxa de mutação:
          <input type="range" min={0} max={50} value={Math.round(taxaMut*100)}
            onChange={e => setTaxaMut(e.target.value/100)} style={{ width: 80 }} />
          <span style={{ color: '#f87171', fontFamily: 'IBM Plex Mono', minWidth: 32 }}>{Math.round(taxaMut*100)}%</span>
        </div>
      </div>

      {/* resultado */}
      {resultado && (
        <div style={{ animation: 'fadeIn 0.25s ease' }}>
          <style>{`@keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }`}</style>

          {resultado.corte && (
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: '1rem', fontFamily: 'IBM Plex Mono' }}>
              Ponto de corte sorteado: <span style={{ color: '#a78bfa' }}>posição {resultado.corte}</span>
              {resultado.mut1.length > 0 && <span style={{ marginLeft: 16 }}>Mutações filho 1: <span style={{ color: '#f87171' }}>posições {resultado.mut1.join(', ')}</span></span>}
              {resultado.mut2.length > 0 && <span style={{ marginLeft: 8 }}>filho 2: <span style={{ color: '#f87171' }}>posições {resultado.mut2.join(', ')}</span></span>}
              {resultado.mut1.length === 0 && resultado.mut2.length === 0 && <span style={{ marginLeft: 16, color: 'rgba(255,255,255,0.25)' }}>nenhuma mutação nessa rodada</span>}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 12, padding: '1.1rem' }}>
              <div style={{ fontSize: 11, color: 'rgba(34,197,94,0.6)', fontFamily: 'IBM Plex Mono', marginBottom: 10 }}>
                FILHO 1 — fitness: <span style={{ color: '#22c55e' }}>{fitness(resultado.filho1)}/{TAM}</span>
                {fitness(resultado.filho1) > Math.max(fitness(pai), fitness(mae)) && (
                  <span style={{ marginLeft: 8, color: '#22c55e' }}>↑ melhor que os pais!</span>
                )}
              </div>
              <Cromossomo bits={resultado.filho1} highlight={resultado.mut1} />
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 8 }}>
                bits amarelos = sofreram mutação
              </div>
            </div>

            <div style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 12, padding: '1.1rem' }}>
              <div style={{ fontSize: 11, color: 'rgba(34,197,94,0.6)', fontFamily: 'IBM Plex Mono', marginBottom: 10 }}>
                FILHO 2 — fitness: <span style={{ color: '#22c55e' }}>{fitness(resultado.filho2)}/{TAM}</span>
                {fitness(resultado.filho2) > Math.max(fitness(pai), fitness(mae)) && (
                  <span style={{ marginLeft: 8, color: '#22c55e' }}>↑ melhor que os pais!</span>
                )}
              </div>
              <Cromossomo bits={resultado.filho2} highlight={resultado.mut2} />
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 8 }}>
                bits amarelos = sofreram mutação
              </div>
            </div>
          </div>
        </div>
      )}

      {/* código lado a lado */}
      <div style={{ marginTop: '2.5rem' }}>
        <CodeBlock title="crossover + mutacao — ag_zamberlan.py" code={`def crossover(pai, mae):
    corte = random.randint(1, TAM_CROMOSSOMO - 1)
    filho1 = pai[:corte] + mae[corte:]
    filho2 = mae[:corte] + pai[corte:]
    return filho1, filho2

def mutacao(cromossomo):
    return [
        1 - gene if random.random() < TAXA_MUTACAO else gene
        for gene in cromossomo
    ]`} />
      </div>
    </section>
  )
}
