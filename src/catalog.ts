export type ItemKind = 'app' | 'game'
export type ItemStatus = 'plus' | 'beta' | 'new' | 'live' | 'ready'

export type CatalogItem = {
  slug: string
  name: string
  kind: ItemKind
  category: string
  status: ItemStatus
  blurb: string
}

const item = (name: string, slug: string, category: string, status: ItemStatus = 'ready', blurb = ''): CatalogItem => ({
  name, slug, category, status, kind: 'app', blurb: blurb || `${name} in the ReKindle workspace.`
})

export const apps: CatalogItem[] = [
  item('AI Assistant', 'chat', 'tools', 'plus', 'A small reading-sidekick for prompts, notes and quick answers.'),
  item('AirType', 'airtype', 'tools', 'plus'), item('Bluesky', 'bluesky', 'lifestyle', 'plus'),
  item('Books', 'books', 'essentials'), item('Breathing', 'breathing', 'lifestyle'), item('Browser', 'browser', 'essentials'),
  item('Calculator', 'calculator', 'tools'), item('Calendar', 'calendar', 'essentials'), item('Chords', 'chords', 'lifestyle'),
  item('Clock', 'clocks', 'essentials'), item('Comics', 'comics', 'lifestyle'), item('Contacts', 'contacts', 'essentials'),
  item('Converter', 'converter', 'tools'), item('Cookbook', 'cookbook', 'lifestyle'), item('Countdown', 'countdown', 'tools'),
  item('Decider', 'decide', 'tools'), item('Dictionary', 'dictionary', 'essentials'), item('Discord', 'discord', 'lifestyle'),
  item('Docs', 'docs', 'tools', 'plus'), item('Dropbox', 'dropbox', 'tools', 'plus'), item('ePub', 'epub', 'essentials'),
  item('Files', 'files', 'tools', 'plus'), item('Flashcards', 'flashcards', 'essentials'), item('Flipbook', 'flipbook', 'lifestyle', 'plus'),
  item('Food Log', 'food', 'lifestyle'), item('Habit Tracker', 'streak', 'lifestyle'), item('Interactive Reader', 'interactive', 'essentials'),
  item('Journal', 'journal', 'lifestyle'), item('Languages', 'language', 'tools', 'beta'), item('Libby', 'libby', 'essentials', 'beta'),
  item('Life Calendar', 'life', 'lifestyle'), item('Maps', 'maps', 'essentials'), item('Mastodon', 'mastodon', 'lifestyle', 'plus'),
  item('Mindmap', 'mindmap', 'tools'), item('News', 'newspaper', 'essentials'), item('Notes', 'notes', 'essentials'),
  item('On This Day', 'history', 'lifestyle'), item('Photo Frame', 'photoframe', 'lifestyle', 'plus'), item('Pinterest', 'pinterest', 'lifestyle', 'plus'),
  item('Pixel', 'pixel', 'tools'), item('Quick ToDo', 'quicktodo', 'tools', 'plus'), item('Read Later', 'readlater', 'essentials'),
  item('Reader', 'reader', 'essentials'), item('Readwise', 'readwise', 'essentials', 'beta'), item('Reddit', 'reddit', 'lifestyle'),
  item('Scores', 'scores', 'tools'), item('Scriptures', 'bible', 'lifestyle'), item('Sheet Music', 'sheetmusic', 'lifestyle'),
  item('Sketchpad', 'napkin', 'tools'), item('Stocks', 'stocks', 'tools'), item('Suggestions', 'suggestions', 'tools'),
  item('Tasks', 'tasks', 'tools'), item('Teleprompter', 'teleprompter', 'tools'), item('Timers', 'timer', 'tools'),
  item('Translator', 'translate', 'tools'), item('Watchlist', 'watchlist', 'lifestyle'), item('Weather', 'weather', 'essentials'),
  item('Wikipedia', 'wikipedia', 'essentials')
]

const game = (name: string, slug: string, status: ItemStatus = 'ready', blurb = ''): CatalogItem => ({
  name, slug, kind: 'game', category: 'games', status, blurb: blurb || `${name} — a quiet browser game for e-ink.`
})

export const games: CatalogItem[] = [
  game('2048', '2048'), game('8 Ball', 'folder_pool'), game('Akinator', 'akinator', 'new'), game('Anagrams', 'anagrams'),
  game('Battleship', 'battleship'), game('Blackjack', 'blackjack'), game('Block Blast', 'blockblast'), game('Car Games', 'cargames', 'new'),
  game('Checkers', 'folder_checkers'), game('Chess', 'folder_chess'), game('Codebreaker', 'codebreaker'), game('Connect 4', 'folder_connect4'),
  game('Connections', 'bindings'), game('Crossword', 'crossword'), game('Crossy', 'crossy', 'new'), game('Cube Dash', 'cubedash', 'new'),
  game('Dino', 'dino'), game('DOOM', 'doom'), game('Dots & Boxes', 'dots'), game('Hangman', 'hangman'), game('Jigsaw', 'jigsaw'),
  game('Lights Out', 'lightsout'), game('Mario', 'mario'), game('Maze', 'maze'), game('Memory', 'memory'), game('Minesweeper', 'minesweeper'),
  game('Mini Crossword', 'mini'), game('Nerdle', 'nerdle'), game('Nonograms', 'nonograms'), game('Oregon Trail', 'oregontrail'),
  game('Pac-Man', 'pacman', 'new'), game('Perfect Circle', 'circle'), game('Pet', 'pet'), game('Pictionary', 'livepictionary', 'live'),
  game('Snake', 'snake'), game('Solitaire', 'solitaire'), game('Spelling Bee', 'spellbound'), game('Strands', 'strands'), game('Sudoku', 'sudoku'),
  game('Surfer', 'surfer', 'new'), game('Tetris', 'tetris'), game('Tic-Tac-Toe', 'tictactoe'), game('Tower of Hanoi', 'hanoi'),
  game('Trivia', 'trivia'), game('UNO', 'uno'), game('Word Search', 'wordsearch'), game('Wordle', 'wordle'), game('Yahtzee', 'yahtzee')
]

export const allItems = [...apps, ...games]
export const appBySlug = (slug: string) => apps.find(entry => entry.slug === slug)
export const gameBySlug = (slug: string) => games.find(entry => entry.slug === slug)
export const statusLabel = (status: ItemStatus) => ({ plus: 'PLUS', beta: 'BETA', new: 'NEW', live: 'LIVE', ready: '' }[status])
