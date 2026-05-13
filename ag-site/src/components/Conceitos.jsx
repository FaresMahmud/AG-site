import { useState } from 'react'
import CodeBlock from './CodeBlock.jsx'

const conceitos = [
  {
    id: 'cromossomo', emoji: '🧬', titulo: 'Cromossomo',
    resumo: 'Uma possível solução, representada como lista de bits.',
    cor: '#34d399', corDim: 'rgba(52,211,153,0.08)',
    explicacao: `Um cromossomo é uma lista de 0s e 1s. Cada posição é um gene. Cada cromossomo representa uma solução candidata.

No nosso exemplo, maximizamos a quantidade de 1s:

[1,1,0,1,1,0,1,1,0,1,1,0] → fitness = 7
[1,1,1,1,1,1,1,1,1,1,1,1] → fitness = 12 ← ótimo!

Em problemas reais (ex: Problema da Mochila), cada bit diz se um item entra ou não na mochila.`,
    codigo: `def criar_cromossomo():
    # lista de 12 bits aleatórios
    return [random.randint(0, 1) for _ in range(12)]

# resultado: [1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1]
#             gene0  gene2  gene4  ...  gene11`,
  },
  {
    id: 'fitness', emoji: '📊', titulo: 'Fitness',
    resumo: 'A nota de cada cromossomo — quanto maior, melhor.',
    cor: '#60a5fa', corDim: 'rgba(96,165,250,0.08)',
    explicacao: `O fitness é a "nota" do cromossomo. Ele diz o quão boa é aquela solução para o problema.

O AG usa o fitness para decidir quem vai se reproduzir: cromossomos com fitness maior têm mais chance de gerar filhos.

No nosso exemplo: fitness = soma dos bits 1
[1,0,0,1,0,1] → fitness 3  (fraco)
[1,1,1,0,1,1] → fitness 5  (melhor → mais chance na roleta)`,
    codigo: `def calcular_fitness(cromossomo):
    return sum(cromossomo)  # conta os 1s

# [1,0,0,1,1,0,1,0,1,1,0,1] → fitness = 7
# [1,1,1,1,1,0,1,1,0,1,1,0] → fitness = 9 ← melhor!`,
  },
  {
    id: 'selecao', emoji: '🎰', titulo: 'Seleção Roleta',
    resumo: 'Fitness maior = fatia maior na roleta = mais chance de ser pai.',
    cor: '#a78bfa', corDim: 'rgba(167,139,250,0.08)',
    explicacao: `Cada indivíduo ocupa um espaço proporcional ao seu fitness. Fitness 8 ocupa o dobro do espaço de fitness 4.

Não garante que o melhor sempre vai — só aumenta a probabilidade. Isso mantém diversidade na população.

Analogia: numa rifa, quem comprou mais bilhetes tem mais chance. Fitness alto = mais bilhetes.`,
    codigo: `def selecao_roleta(populacao, fitness_lista):
    fitness_total = sum(fitness_lista)
    ponto = random.uniform(0, fitness_total)

    acumulado = 0
    for individuo, fit in zip(populacao, fitness_lista):
        acumulado += fit
        if acumulado >= ponto:
            return individuo  # selecionado!`,
  },
  {
    id: 'crossover', emoji: '🔀', titulo: 'Crossover',
    resumo: 'Dois pais geram dois filhos trocando partes dos cromossomos.',
    cor: '#fbbf24', corDim: 'rgba(251,191,36,0.08)',
    explicacao: `Sorteia um ponto de corte aleatório. O filho 1 recebe o início do pai + o fim da mãe. O filho 2 faz o contrário.

Pai: [1,0,0,1,1,0 | 1,0,1,1,0,1]
Mãe: [0,1,1,0,0,1 | 0,1,0,0,1,0]
                  ↑ corte pos. 6

F1:  [1,0,0,1,1,0 | 0,1,0,0,1,0]
F2:  [0,1,1,0,0,1 | 1,0,1,1,0,1]`,
    codigo: `def crossover(pai, mae):
    corte = random.randint(1, len(pai) - 1)

    filho1 = pai[:corte] + mae[corte:]
    filho2 = mae[:corte] + pai[corte:]

    return filho1, filho2`,
  },
  {
    id: 'mutacao', emoji: '🎲', titulo: 'Mutação',
    resumo: 'Cada gene tem ~5% de chance de ser invertido aleatoriamente.',
    cor: '#f87171', corDim: 'rgba(248,113,113,0.08)',
    explicacao: `Depois do crossover, cada gene tem pequena chance de inverter: 0→1 ou 1→0.

Isso é essencial para:
• Evitar convergência prematura
• Garantir que qualquer solução possa ser alcançada

Taxa muito alta → busca vira aleatória
Taxa muito baixa → AG pode estagnar
Ideal: entre 1% e 10%`,
    codigo: `def mutacao(cromossomo, taxa=0.05):
    return [
        1 - gene if random.random() < taxa else gene
        for gene in cromossomo
    ]

# Antes:  [1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0]
# gene 6 sorteado → inverteu 0 para 1
# Depois: [1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0]`,
  },
  {
    id: 'elitismo', emoji: '👑', titulo: 'Elitismo',
    resumo: 'O melhor indivíduo passa direto para a próxima geração.',
    cor: '#34d399', corDim: 'rgba(52,211,153,0.08)',
    explicacao: `Sem elitismo, o melhor cromossomo pode "morrer" entre gerações — não ser selecionado, ou ser alterado pelo crossover/mutação.

Com elitismo: o melhor é copiado diretamente antes de qualquer operação.

Isso garante que o melhor fitness NUNCA piora entre gerações — só melhora ou fica igual.`,
    codigo: `def pegar_elite(populacao, fitness_lista):
    idx = fitness_lista.index(max(fitness_lista))
    return populacao[idx][:]  # cópia direta

# No loop principal:
nova_populacao = [elite]  # entra sem alteração!

while len(nova_populacao) < TAM_POPULACAO:
    # seleção → crossover → mutação
    nova_populacao.append(filho)`,
  },
]

export default function Conceitos() {
  const [aberto, setAberto] = useState('cromossomo')
  const atual = conceitos.find(c => c.id === aberto)

  return (
    <section className="section" id="conceitos">
      <div className="section-label">conceitos</div>
      <h2 className="section-title">Os 6 blocos do AG</h2>
      <p className="section-sub" style={{ marginBottom: '2rem' }}>
        Clique em cada conceito para ver a explicação e o código Python lado a lado.
      </p>

      {/* tabs móbile-friendly */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: '1.5rem',
      }}>
        {conceitos.map(c => (
          <button key={c.id} onClick={() => setAberto(c.id)} style={{
            background: aberto === c.id ? c.corDim : 'transparent',
            border: `1px solid ${aberto === c.id ? c.cor + '40' : 'rgba(255,255,255,0.07)'}`,
            borderRadius: 8, padding: '7px 14px',
            display: 'flex', alignItems: 'center', gap: 6,
            color: aberto === c.id ? c.cor : 'rgba(255,255,255,0.45)',
            fontSize: 13, fontWeight: aberto === c.id ? 600 : 400,
            transition: 'all 0.2s',
          }}>
            <span>{c.emoji}</span>
            <span>{c.titulo}</span>
          </button>
        ))}
      </div>

      {/* painel */}
      {atual && (
        <div key={atual.id} style={{
          background: atual.corDim,
          border: `1px solid ${atual.cor}25`,
          borderRadius: 14, padding: 'clamp(1rem, 3vw, 1.75rem)',
          animation: 'fadeUp 0.2s ease',
        }}>
          <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`}</style>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: '1.25rem' }}>
            <span style={{ fontSize: 24, lineHeight: 1 }}>{atual.emoji}</span>
            <div>
              <h3 style={{ fontFamily: 'Syne', fontSize: '1.1rem', fontWeight: 700, color: atual.cor }}>{atual.titulo}</h3>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{atual.resumo}</p>
            </div>
          </div>

          {/* grid que empilha no mobile */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}>
            <div>
              <div style={{ fontSize: 10, fontFamily: 'IBM Plex Mono', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em', marginBottom: 10 }}>
                EXPLICAÇÃO
              </div>
              <pre style={{
                fontFamily: 'Inter, sans-serif', fontSize: 13,
                color: 'rgba(255,255,255,0.6)', lineHeight: 1.85,
                whiteSpace: 'pre-wrap', margin: 0,
              }}>{atual.explicacao}</pre>
            </div>
            <div>
              <div style={{ fontSize: 10, fontFamily: 'IBM Plex Mono', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em', marginBottom: 10 }}>
                CÓDIGO PYTHON
              </div>
              <CodeBlock code={atual.codigo} />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
