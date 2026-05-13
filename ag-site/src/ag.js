// ag.js — toda a lógica do Algoritmo Genético
// Espelho fiel do ag_zamberlan.py, só que em JavaScript

export const TAM = 12 // tamanho do cromossomo

export function criarCromossomo() {
  return Array.from({ length: TAM }, () => (Math.random() < 0.5 ? 1 : 0))
}

export function criarPopulacao(n) {
  return Array.from({ length: n }, criarCromossomo)
}

export function fitness(cromossomo) {
  return cromossomo.reduce((a, b) => a + b, 0)
}

export function fitnessTodos(populacao) {
  return populacao.map(fitness)
}

// Seleção por Roleta
export function selecaoRoleta(populacao) {
  const fits = fitnessTodos(populacao)
  const total = fits.reduce((a, b) => a + b, 0)
  if (total === 0) return populacao[Math.floor(Math.random() * populacao.length)]
  let ponto = Math.random() * total
  let acumulado = 0
  for (let i = 0; i < populacao.length; i++) {
    acumulado += fits[i]
    if (acumulado >= ponto) return populacao[i]
  }
  return populacao[populacao.length - 1]
}

// Crossover de 1 ponto — retorna [filho1, filho2, pontoDeCorte]
export function crossover(pai, mae, taxaCrossover = 0.8) {
  if (Math.random() > taxaCrossover) {
    return { filho1: [...pai], filho2: [...mae], corte: null }
  }
  const corte = Math.floor(Math.random() * (TAM - 1)) + 1
  const filho1 = [...pai.slice(0, corte), ...mae.slice(corte)]
  const filho2 = [...mae.slice(0, corte), ...pai.slice(corte)]
  return { filho1, filho2, corte }
}

// Mutação binária — retorna { cromossomo, posicoesMutadas }
export function mutacao(cromossomo, taxa = 0.05) {
  const posicoesMutadas = []
  const resultado = cromossomo.map((gene, i) => {
    if (Math.random() < taxa) {
      posicoesMutadas.push(i)
      return 1 - gene
    }
    return gene
  })
  return { cromossomo: resultado, posicoesMutadas }
}

// Uma geração completa — retorna nova população + info para visualização
export function proximaGeracao(populacao, taxaMut = 0.05, taxaCross = 0.8) {
  const fits = fitnessTodos(populacao)
  const eliteIdx = fits.indexOf(Math.max(...fits))
  const elite = [...populacao[eliteIdx]]

  const nova = [elite]
  const log = []

  while (nova.length < populacao.length) {
    const pai = selecaoRoleta(populacao)
    const mae = selecaoRoleta(populacao)
    const { filho1, filho2, corte } = crossover(pai, mae, taxaCross)
    const m1 = mutacao(filho1, taxaMut)
    const m2 = mutacao(filho2, taxaMut)
    log.push({ pai, mae, corte, filho1: m1.cromossomo, filho2: m2.cromossomo })
    nova.push(m1.cromossomo)
    if (nova.length < populacao.length) nova.push(m2.cromossomo)
  }

  return { populacao: nova, eliteIdx, log }
}
