import { useState } from 'react'
import CodeBlock from './CodeBlock.jsx'

const conceitos = [
  {
    id: 'cromossomo',
    emoji: '🧬',
    titulo: 'Cromossomo',
    resumo: 'Uma possível solução do problema, representada como lista de bits.',
    cor: '#22c55e',
    corDim: 'rgba(34,197,94,0.1)',
    explicacao: `Um cromossomo é simplesmente uma lista de 0s e 1s.
Cada posição é chamada de gene. Cada cromossomo representa
uma solução candidata para o problema que o AG está resolvendo.

No nosso exemplo, maximizamos a quantidade de 1s:
[1,1,0,1,1,0,1,1,0,1,1,0]  →  fitness = 7
[1,1,1,1,1,1,1,1,1,1,1,1]  →  fitness = 12  (ótimo!)

Em problemas reais (ex: Problema da Mochila), cada bit
diz se um item entra ou não na mochila.`,
    codigo: `def criar_cromossomo():
    # lista de 12 bits aleatórios (0 ou 1)
    return [random.randint(0, 1) for _ in range(12)]

# Exemplo de resultado:
# [1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1]
#  gene0  gene2  gene4  ...  gene11`,
  },
  {
    id: 'fitness',
    emoji: '📊',
    titulo: 'Fitness (Aptidão)',
    resumo: 'A nota de cada cromossomo — quanto maior, melhor a solução.',
    cor: '#60a5fa',
    corDim: 'rgba(96,165,250,0.1)',
    explicacao: `O fitness é a "nota" de um cromossomo.
Ele diz o quão boa é aquela solução para o problema.

O AG usa o fitness para decidir quem vai se reproduzir:
cromossomos com fitness maior têm mais chance de gerar filhos.

No nosso exemplo: fitness = soma dos bits 1
[1,0,0,1,0,1]  →  fitness 3  (fraco)
[1,1,1,0,1,1]  →  fitness 5  (melhor — mais chance na roleta)`,
    codigo: `def calcular_fitness(cromossomo):
    return sum(cromossomo)  # conta quantos 1s tem

# Exemplos:
# [1,0,0,1,1,0,1,0,1,1,0,1] → fitness = 7
# [1,1,1,1,1,0,1,1,0,1,1,0] → fitness = 9  ← melhor!`,
  },
  {
    id: 'selecao',
    emoji: '🎰',
    titulo: 'Seleção por Roleta',
    resumo: 'Cromossomos com maior fitness têm mais chance de ser escolhidos como pais.',
    cor: '#a78bfa',
    corDim: 'rgba(167,139,250,0.1)',
    explicacao: `Imagine uma roleta onde cada indivíduo ocupa um espaço
proporcional ao seu fitness. Fitness 8 ocupa o dobro do
espaço de fitness 4. Ao girar, o que tem mais espaço
tem mais chance de ser selecionado.

Isso não garante que o melhor sempre vai — só aumenta
a probabilidade. Cromossomos fracos também podem ser
selecionados (isso é bom para a diversidade).`,
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
    id: 'crossover',
    emoji: '🔀',
    titulo: 'Crossover (Cruzamento)',
    resumo: 'Dois pais geram dois filhos trocando partes dos seus cromossomos.',
    cor: '#f59e0b',
    corDim: 'rgba(245,158,11,0.1)',
    explicacao: `O crossover sorteia um ponto de corte aleatório.
O filho 1 recebe o início do pai + o fim da mãe.
O filho 2 recebe o início da mãe + o fim do pai.

Pai: [1,0,0,1,1,0 | 1,0,1,1,0,1]
Mãe: [0,1,1,0,0,1 | 0,1,0,0,1,0]
                  ↑ corte na posição 6

F1:  [1,0,0,1,1,0 | 0,1,0,0,1,0]  ← início do pai + fim da mãe
F2:  [0,1,1,0,0,1 | 1,0,1,1,0,1]  ← início da mãe + fim do pai`,
    codigo: `def crossover(pai, mae):
    # sorteia onde cortar
    corte = random.randint(1, len(pai) - 1)

    filho1 = pai[:corte] + mae[corte:]
    filho2 = mae[:corte] + pai[corte:]

    return filho1, filho2

# Pai: [1,0,0,1,1,0,1,0,1,1,0,1]
# Mãe: [0,1,1,0,0,1,0,1,0,0,1,0]
# corte = 6
# F1:  [1,0,0,1,1,0,0,1,0,0,1,0]
# F2:  [0,1,1,0,0,1,1,0,1,1,0,1]`,
  },
  {
    id: 'mutacao',
    emoji: '🎲',
    titulo: 'Mutação',
    resumo: 'Cada gene tem pequena chance de ser invertido — garante diversidade.',
    cor: '#f87171',
    corDim: 'rgba(248,113,113,0.1)',
    explicacao: `Depois do crossover, cada gene do filho tem uma pequena
chance (ex: 5%) de ser invertido: 0 vira 1 ou 1 vira 0.

Isso é importante para:
• Evitar que o AG fique preso numa solução local
• Garantir que qualquer ponto do espaço de busca
  possa ser alcançado ao longo do tempo

Taxa muito alta → busca vira aleatória (ruim)
Taxa muito baixa → AG pode estagnar (ruim)
Taxa ideal → entre 1% e 10%`,
    codigo: `def mutacao(cromossomo, taxa=0.05):
    return [
        1 - gene if random.random() < taxa else gene
        for gene in cromossomo
    ]

# Antes: [1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0]
#                          ↑ gene 6 foi sorteado (5% de chance)
# Depois: [1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0]
#                              1 ← inverteu de 0 para 1`,
  },
  {
    id: 'elitismo',
    emoji: '👑',
    titulo: 'Elitismo',
    resumo: 'O melhor indivíduo passa direto para a próxima geração sem alteração.',
    cor: '#22c55e',
    corDim: 'rgba(34,197,94,0.1)',
    explicacao: `Sem elitismo, o melhor cromossomo de uma geração pode
"morrer" — não ser selecionado, ou ser alterado pelo
crossover/mutação e perder qualidade.

Com elitismo: o melhor individuo é copiado diretamente
para a próxima geração antes de qualquer operação.

Isso garante que o melhor fitness NUNCA piora entre
gerações — só pode melhorar ou ficar igual.`,
    codigo: `def pegar_elite(populacao, fitness_lista):
    # acha o índice do maior fitness
    idx_melhor = fitness_lista.index(max(fitness_lista))
    return populacao[idx_melhor][:]  # cópia

# No loop principal:
nova_populacao = [elite]  # entra direto!

while len(nova_populacao) < TAM_POPULACAO:
    # ... seleção, crossover, mutação ...
    nova_populacao.append(filho)`,
  },
]

export default function Conceitos() {
  const [aberto, setAberto] = useState('cromossomo')

  const atual = conceitos.find(c => c.id === aberto)

  return (
    <section style={{ padding: '5rem 1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span className="tag tag-blue" style={{ marginBottom: '1rem', display: 'inline-block' }}>conceitos fundamentais</span>
        <h2 style={{ fontFamily: 'Syne', fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 700 }}>
          Os 6 blocos de construção do AG
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', marginTop: '0.75rem', maxWidth: 500, margin: '0.75rem auto 0' }}>
          Clique em cada conceito para ver a explicação e o código Python correspondente
        </p>
      </div>

      {/* grid de cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: 10, marginBottom: '2rem',
      }}>
        {conceitos.map(c => (
          <button
            key={c.id}
            onClick={() => setAberto(c.id)}
            style={{
              background: aberto === c.id ? c.corDim : 'rgba(255,255,255,0.03)',
              border: `1px solid ${aberto === c.id ? c.cor + '60' : 'rgba(255,255,255,0.07)'}`,
              borderRadius: 12, padding: '1rem 0.75rem',
              textAlign: 'center', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ fontSize: 22, marginBottom: 6 }}>{c.emoji}</div>
            <div style={{
              fontSize: 12, fontWeight: 600, fontFamily: 'Syne',
              color: aberto === c.id ? c.cor : 'rgba(255,255,255,0.7)',
            }}>{c.titulo}</div>
          </button>
        ))}
      </div>

      {/* painel expandido */}
      {atual && (
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: `1px solid ${atual.cor}30`,
          borderRadius: 16, padding: '2rem',
          animation: 'fadeIn 0.2s ease',
        }}>
          <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:none } }`}</style>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.25rem' }}>
            <span style={{ fontSize: 28 }}>{atual.emoji}</span>
            <div>
              <h3 style={{ fontFamily: 'Syne', fontSize: '1.2rem', fontWeight: 700, color: atual.cor }}>
                {atual.titulo}
              </h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{atual.resumo}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 8, fontFamily: 'IBM Plex Mono', letterSpacing: '0.05em' }}>
                EXPLICAÇÃO
              </div>
              <pre style={{
                fontFamily: 'Inter, sans-serif', fontSize: 13,
                color: 'rgba(255,255,255,0.65)', lineHeight: 1.8,
                whiteSpace: 'pre-wrap', margin: 0,
              }}>
                {atual.explicacao}
              </pre>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 8, fontFamily: 'IBM Plex Mono', letterSpacing: '0.05em' }}>
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
