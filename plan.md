# Plano de clonagem — ReKindle

## Escopo confirmado pela inspeção

Clonar o dashboard OS do site `https://rekindle.ink/` preservando a linguagem visual e os caminhos observáveis. A primeira entrega terá:

1. Homepage com cabeçalho, guest mode, navegação por categorias, banner ReKindle+, cards de destaque, busca, modo de edição e modal de login/guest.
2. Catálogo completo de aplicativos e jogos visíveis na homepage, com rotas locais equivalentes e links funcionando.
3. Estados navegáveis de cada entrada: disponível, PLUS, BETA, NEW, LIVE e integração externa não configurada.
4. Implementações reais e editáveis para os fluxos centrais que podem ser recriados sem serviços proprietários: notas, tarefas, diário, calculadora, calendário, countdown, timer, reader, flashcards, translate mock, weather mock local e sketchpad.
5. Um conjunto inicial de jogos jogáveis em navegador (2048, Snake, Minesweeper, Wordle, Sudoku, Tic-Tac-Toe, Memory, Hangman e Tower of Hanoi), com a mesma moldura visual; os demais jogos terão páginas próprias, instruções e estado de “em breve” até que sua lógica específica seja implementada.
6. Responsividade para desktop e mobile, preservando o aspecto de painel compacto e toque confortável.

Integrações como Mail, Dropbox, Libby, Bluesky, Discord, Mastodon, Pinterest, Readwise e AI Assistant não serão simuladas como conectadas: terão estados honestos de integração/PLUS e pontos de extensão para credenciais ou APIs futuras.

## Mapa de rotas

- `/` — dashboard principal
- `/app/:slug` — rota de app do catálogo
- `/game/:slug` — rota de jogo do catálogo
- `/settings` — preferências locais
- `/membership` — descrição de ReKindle+
- `/help` — ajuda e status das integrações
- `/preview.html?app=chat` — alias local do AI Assistant preview

O manifesto `public/manus-routes.json` manterá o conjunto acima. Os slugs do catálogo serão resolvidos no cliente para manter as rotas legíveis sem gerar dezenas de arquivos duplicados.

## Arquitetura

- Vite + React + TypeScript, sem backend na primeira fase.
- `src/catalog.ts`: catálogo completo de apps/jogos e metadados de estado.
- `src/App.tsx`: roteamento leve, shell e estados globais.
- `src/components/`: Header, CategoryNav, PromoStrip, FeatureCard, AppGrid, Modal, Search, AppFrame.
- `src/apps/`: apps locais com estado em `localStorage`.
- `src/games/`: jogos locais e tela genérica de jogo não implementado.
- `public/`: logo e manifesto de rotas.
- `docs/research/rekindle/`: inventário e comparação com a fonte.

## Design system

### Design Read

- Artifact: dashboard/app launcher + coleção de miniapps.
- Audience: leitores e usuários de Kindle/e-ink que querem ferramentas rápidas e jogos leves.
- Visual language: desktop web dos anos 1990/2000 reinterpretado como painel e-ink, com textura pontilhada, bordas pretas, tipografia Geneva/Verdana e iconografia monocromática.
- Mode: clone fiel / preserve.
- Visual variance: 3/10.
- Motion intensity: 2/10.
- Information density: 9/10.
- Asset dependence: 5/10.
- Brand fidelity: 10/10.

### Direção escolhida

O inventário e a fonte pedem “e-ink utility dashboard”: o próprio painel é o artefato. Não serão adicionados gradientes, cards de SaaS, sombras suaves ou ícones emoji.

### Tokens

- Ground: `#e5e5e5`, com textura pontilhada de 16px.
- Surface: `#ffffff`.
- Ink: `#000000`.
- Muted ink: `#666666`.
- Accent/status: preto e cinza; amarelo somente para estados de alerta/PLUS quando existir no original.
- Fontes: Geneva, Verdana, sans-serif; fallback Arial apenas quando necessário.
- Espaçamento base: 4px, com múltiplos de 4/8/12/16/24.
- Raios: 0–4px.
- Bordas: 1–2px solid black, com inner highlight branco onde necessário.
- Sombras: nenhuma ou `1px 1px 0 #000` em controles ativos.
- Motion: transições curtas de 120–180ms, sem movimento essencial; respeitar `prefers-reduced-motion`.

### Ideia de interação

“Tudo cabe no bolso”: o painel funciona como um desktop compacto. A busca revela rapidamente qualquer app/jogo; os cards de catálogo abrem uma moldura consistente e os controles persistem localmente quando fizer sentido.

## Fontes e limitações

A identidade visual, nomes e organização são derivados da observação pública do site original. A implementação será código novo e assets locais, não um bundle copiado. Conteúdo de integrações privadas, dados de usuários e serviços PLUS exigirá credenciais/APIs que não estão disponíveis nesta sessão.

## Próxima etapa

Após confirmação do plano visual, entregar o v0 navegável da homepage e do catálogo. Depois completar os apps/jogos locais e rodar build, diagnósticos, inspeção de responsividade e comparação visual.
