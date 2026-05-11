# Ethnos Web

Demo visual do jogo de tabuleiro **Ethnos** — implementação local (hotseat) em React + TypeScript + Tailwind CSS v4, sem backend.

## Sobre o Jogo

Ethnos é um jogo de controle de territórios onde 2 a 4 jogadores competem pelo domínio de 6 reinos fantásticos formando **bandos** de tribos. Um bando é um grupo de cartas da mesma tribo **ou** do mesmo reino. Ao jogar um bando, o jogador coloca marcadores nos reinos correspondentes — quem tiver mais marcadores ao fim de cada Era pontua.

O jogo é disputado em **3 Eras**. Ao fim da terceira, quem acumular mais pontos vence.

### Reinos

| Reino | Ícone |
|---|---|
| Homeland | 🏔️ |
| Underglen | 🌲 |
| Rivermeet | 🌊 |
| Thornwood | 🌋 |
| Skyfell | ☁️ |
| Shadowmoor | 🌑 |

### Tribos

`dwarf` · `elf` · `halfling` · `merfolk` · `minotaur` · `orc` · `skeleton` · `troll` · `wingfolk` · `wizard`

## Stack

- **React 19** + **TypeScript**
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **Vite 8**
- **PGlite 0.4** — banco PostgreSQL no navegador, persistido via IndexedDB (`idb://ethnos-web`)
- **Vitest 4** — testes unitários da lógica de jogo
- Estado de jogo 100% no frontend (`useState`) — sem backend, sem WebSocket

## Estrutura

```
src/
├── types.ts              # Tipos e interfaces do estado do jogo
├── gameLogic.ts          # Lógica: deck, embaralhamento, validação de bando, pontuação
├── gameLogic.test.ts     # 44 testes unitários (Vitest)
├── App.tsx               # Roteamento entre telas (start → setup → game → score → history)
├── db/
│   ├── database.ts       # Conexão PGlite singleton + criação do schema
│   └── gameResults.ts    # saveGameResult / getGameHistory
└── components/
    ├── StartScreen.tsx       # Tela inicial (acesso ao histórico)
    ├── SetupScreen.tsx       # Configuração de jogadores (2–4)
    ├── GameScreen.tsx        # Tela principal de jogo
    ├── PlayerHUD.tsx         # HUD superior: era, jogadores, pontos, deck
    ├── KingdomBoard.tsx      # Tabuleiro dos 6 reinos com marcadores
    ├── TribeCard.tsx         # Componente de carta (selecionável)
    ├── PlayerHandPanel.tsx   # Mão do jogador + ações
    ├── ScoreScreen.tsx       # Placar final com ranking (salva resultado no PGlite)
    └── HistoryScreen.tsx     # Histórico de partidas anteriores
```

## Como Jogar (demo)

1. Clique em **Iniciar Partida**
2. Escolha o número de jogadores (2–4) e os nomes
3. Em cada turno, o jogador atual pode:
   - **Comprar Carta** — retira uma carta do deck para a mão
   - **Jogar Bando** — seleciona cartas da mão (mesma tribo ou mesmo reino) e as joga, adicionando marcadores nos reinos correspondentes
   - **Avançar Era** — encerra a Era atual, calcula pontos e inicia a próxima
4. Após 3 Eras, o placar final é exibido e o resultado é salvo automaticamente
5. Clique em **Ver Histórico** na tela inicial para consultar partidas anteriores

## Histórico de Partidas

O resultado de cada partida (jogadores, pontuações, vencedor e data) é persistido localmente via **PGlite** sobre IndexedDB — sem servidor, sem conta, sem sincronização. Os dados ficam no navegador do usuário.

Tabela `game_results`:

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `SERIAL` | Chave primária |
| `players` | `JSONB` | Lista de nomes dos jogadores |
| `scores` | `JSONB` | Mapa nome → pontuação final |
| `winner` | `TEXT` | Nome do vencedor |
| `played_at` | `TIMESTAMPTZ` | Data/hora automática |

## Testes

```bash
npm run test:run   # execução única (usado no CI)
npm test           # modo watch (desenvolvimento)
```

44 testes unitários cobrindo todas as funções exportadas de `gameLogic.ts`: `buildDeck`, `createInitialState`, `drawCard`, `toggleCardSelection`, `validateBand`, `playBand`, `calculateScores` e `advanceEra`.

Testes de PGlite/IndexedDB ficam **fora do CI** (IndexedDB não está disponível em Node).

## CI

GitHub Actions roda em push e PR para `main` e `develop`:

```
checkout → setup Node 22 → npm ci → vitest run → npm run build
```

Workflow: [`.github/workflows/ci.yml`](.github/workflows/ci.yml)

## Instalação

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`.

## Build

```bash
npm run build
```

## Estimativas do Projeto

| Métrica | Valor |
|---|---|
| Story Points totais | 49 SP |
| Esforço estimado | ~196h |
| Custo estimado | R$ 6.762 (com contingência 15%) |
| Função Pontos (APF) | 39 PF ajustados |
| Duração | 2 meses / 4 sprints |
