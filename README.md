# AG.learn — Algoritmos Genéticos de forma interativa

![Preview do site](<img width="1280" height="698" alt="Image" src="https://github.com/user-attachments/assets/1efd5473-191f-476e-b86a-0e7f15963095" />)


Site didático sobre Algoritmos Genéticos com simulações interativas, feito como projeto da disciplina de Técnicas de IA (Sistemas de Informação).

🔗 **[ag-site-nu.vercel.app](https://ag-site-nu.vercel.app)**

---

## O que é

Algoritmos Genéticos são uma técnica de IA inspirada na evolução natural. Em vez de explicar isso só com texto, esse site deixa você ver acontecendo na sua frente.

## O que tem no site

**Achando uma palavra**
Você digita qualquer palavra. O AG começa com 80 tentativas aleatórias e vai evoluindo, letra por letra, geração por geração, até achar exatamente o que você digitou. É o exemplo mais visual de como o algoritmo funciona.

**Conceitos**
Os 6 blocos fundamentais do AG explicados com texto e código Python lado a lado: Cromossomo, Fitness, Seleção por Roleta, Crossover, Mutação e Elitismo.

**Simulador de bits**
Controle cada geração manualmente ou em modo automático. Veja a população evoluindo, o fitness crescendo e o gráfico de evolução sendo construído em tempo real.

**Crossover interativo**
Escolha um pai e uma mãe, defina a taxa de mutação e veja exatamente como os filhos são gerados — quais bits vieram de cada pai e quais sofreram mutação.

**Problema da Mochila**
O exemplo clássico do AG aplicado a um problema real: escolher quais itens colocar numa mochila com capacidade limitada para maximizar o valor total.

---

## Stack

- **React 18** + **Vite 5**
- Sem backend — toda a lógica do AG roda no navegador em JavaScript puro
- Hospedado no **Vercel**

---

## Rodar localmente

```bash
# clonar
git clone https://github.com/FaresMahmud/AG-site.git
cd AG-site/ag-site

# instalar dependências
npm install

# rodar em modo dev
npm run dev
# acessa http://localhost:5173

# build de produção
npm run build
```

---

## Estrutura

```
ag-site/
├── src/
│   ├── ag.js                  # lógica do AG (espelho do código Python)
│   ├── App.jsx                # estrutura do site + navbar
│   ├── index.css              # design system
│   └── components/
│       ├── Hero.jsx           # página inicial com população animada
│       ├── PalavraAG.jsx      # simulador de palavra (o mais visual)
│       ├── Conceitos.jsx      # 6 conceitos clicáveis com código Python
│       ├── Simulador.jsx      # simulador de bits geração por geração
│       ├── CrossoverDemo.jsx  # demonstração interativa de crossover
│       ├── Mochila.jsx        # Problema da Mochila
│       ├── Cromossomo.jsx     # componente visual de bits reutilizável
│       ├── CodeBlock.jsx      # syntax highlight do Python
│       └── Footer.jsx
```

---

## Referências

- Material do Prof. Alexandre Zamberlan — Técnicas de IA / UFN
- HOLLAND, J. *Adaptation in Natural and Artificial Systems*. University of Michigan Press, 1992.
- REZENDE, S. O. *Sistemas Inteligentes: Fundamentos e Aplicações*. Manole, 2003.
