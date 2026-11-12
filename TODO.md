# TODO — ReKindle clone

## Homepage e shell

- [x] Recriar cabeçalho, relógio, Settings, Help, Guest Mode e Login/Register.
- [x] Recriar navegação All, Dashboard, Essentials, Tools, Lifestyle, Games e Multiplayer Games.
- [x] Recriar banner ReKindle+, cards de destaque, busca, modo Edit e modal de autenticação.
- [x] Usar logo oficial local e textura de fundo local.

## Catálogo e rotas

- [x] Catalogar os 58 apps e 48 jogos observados no inventário da fonte.
- [x] Fazer cada item abrir `/app/:slug` ou `/game/:slug`.
- [x] Preservar etiquetas PLUS, BETA, NEW e LIVE.
- [x] Manter links externos e integrações não configuradas honestamente sinalizados como experiência local/preview.

## Apps locais funcionais

- [x] Notes, Tasks/Quick ToDo e Journal com edição local.
- [x] Calculator, Countdown, Timer, Converter e ferramentas de decisão.
- [x] Calendar, Clocks, Breathing, Browser, Dictionary, Translator e Teleprompter com controles reais.
- [x] Books, Comics, Cookbook, ePub, Reader, Flashcards, Read Later e Interactive Reader com biblioteca/leitura local.
- [x] Food Log, Habit Tracker, Life Calendar e On This Day com entradas salvas localmente.
- [x] Sketchpad, Pixel e Weather já funcionais na primeira versão.
- [x] Apps PLUS/BETA e sociais têm estados locais honestos, campos e ações de preview; conexões reais exigiriam suas próprias contas/APIs.

## Jogos locais funcionais

- [x] 2048, Tic-Tac-Toe, Memory e Wordle.
- [x] Sudoku, Minesweeper, Snake, Hangman, Tower of Hanoi e jogos de palavras com estado jogável local.
- [x] Cartas, tabuleiros, quiz, quebra-cabeças e runners com controles locais, pontuação e reinício.
- [x] Todos os demais jogos têm rota própria, tabuleiro/controles reais, estado e ação de reinício; jogos multiplayer/externos permanecem single-player local quando não há serviço público sem conta.

## Verificação

- [x] `GET /manus-routes.json` responde JSON válido.
- [x] Build de produção conclui sem erros.
- [x] Diagnósticos TypeScript registrados no projeto.
- [ ] Rodar smoke test automatizado de todas as 106 rotas e corrigir erros encontrados.
- [ ] Comparar homepage em desktop e mobile com a referência original.
- [ ] Fazer auditoria final de acessibilidade e interface após o smoke test.
