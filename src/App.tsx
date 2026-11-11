import { useEffect, useMemo, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { allItems, appBySlug, apps, gameBySlug, games, statusLabel, type CatalogItem } from './catalog'
import { originalIcons } from './iconData'

type ModalName = 'login' | 'membership' | 'help' | 'settings' | null
type TabName = 'all' | 'dashboard' | 'essentials' | 'tools' | 'lifestyle' | 'games' | 'two_player'

const navTabs: Array<{ id: TabName; label: string }> = [
  { id: 'all', label: 'All' }, { id: 'dashboard', label: 'Dashboard' }, { id: 'essentials', label: 'Essentials' },
  { id: 'tools', label: 'Tools' }, { id: 'lifestyle', label: 'Lifestyle' }, { id: 'games', label: 'Games' }, { id: 'two_player', label: 'Multiplayer Games' }
]

const navigate = (path: string) => {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

const useLocation = () => {
  const [location, setLocation] = useState(window.location.pathname + window.location.search)
  useEffect(() => {
    const update = () => setLocation(window.location.pathname + window.location.search)
    window.addEventListener('popstate', update)
    return () => window.removeEventListener('popstate', update)
  }, [])
  return location
}

const Glyph = ({ item, large = false }: { item?: CatalogItem; large?: boolean }) => {
  const slug = item?.slug || ''
  const originalSvg = originalIcons[slug]
  if (originalSvg) {
    return <span aria-hidden="true" className={`glyph svg-glyph ${large ? 'glyph-large' : ''}`} dangerouslySetInnerHTML={{ __html: originalSvg }} />
  }
  const special: Record<string, string> = {
    calendar: '11', countdown: '00', dictionary: 'Az', translate: '文', wikipedia: 'W', sudoku: '9', blackjack: 'A♠J',
    bindings: 'C', folder_pool: '8B', folder_connect4: '4', folder_checkers: 'C', folder_chess: '♜', search: 'S E\nA R C H', notes: '▤',
    chat: 'AI', books: '▥', weather: '☼', calculator: '＋', timer: '◷', tasks: '✓', reader: '▥'
  }
  const text = special[slug] || (item?.kind === 'game' ? item.name.slice(0, 2).toUpperCase() : item?.name.slice(0, 2).toUpperCase() || 'R')
  return <span aria-hidden="true" className={`glyph ${large ? 'glyph-large' : ''} ${text.includes('\n') ? 'glyph-multiline' : ''}`}>{text}</span>
}

const StatusBadge = ({ item }: { item: CatalogItem }) => {
  const label = statusLabel(item.status)
  return label ? <span className={`status status-${item.status}`}>{label}</span> : null
}

const Header = ({ onModal, onHome }: { onModal: (name: ModalName) => void; onHome: () => void }) => {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30000)
    return () => window.clearInterval(timer)
  }, [])
  return (
    <header className="topbar">
      <button className="brand" onClick={onHome} aria-label="Go to ReKindle dashboard">
        <img src="/assets/rekindle-logo.svg" alt="" width="18" height="18" />
        <span>ReKindle</span>
      </button>
      <div className="topbar-links">
        <button onClick={() => onModal('settings')}>Settings</button>
        <button onClick={() => onModal('help')}>Help</button>
      </div>
      <div className="topbar-right">
        <span className="clock" aria-label="Current time">{now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
        <button className="guest" onClick={() => onModal('settings')}><span className="guest-dot" /> Guest Mode</button>
        <button className="login-link" onClick={() => onModal('login')}>LOG IN / REGISTER</button>
      </div>
    </header>
  )
}

const CategoryNav = ({ active, onChange }: { active: TabName; onChange: (tab: TabName) => void }) => (
  <nav className="category-nav" aria-label="App categories">
    <button className="nav-square" onClick={() => onChange('all')} aria-label="Show all apps">⌂</button>
    {navTabs.slice(1).map(tab => <button key={tab.id} className={active === tab.id ? 'active' : ''} onClick={() => onChange(tab.id)}>{tab.label}</button>)}
  </nav>
)

const FeatureCard = ({ title, blurb, status, onClick }: { title: string; blurb: string; status?: string; onClick?: () => void }) => (
  <button className="feature-card" onClick={onClick}>
    <span aria-hidden="true" className="feature-glyph">{title === 'RSS Reader' ? '◔' : title === 'Mail' ? '✉' : title === 'Substack' ? '▤' : '□'}</span>
    <span className="feature-copy"><strong>{title}</strong><small>{blurb}</small></span>
    {status && <span className="feature-status">{status}</span>}
  </button>
)

const AppTile = ({ item, editing, hidden, onOpen, onHide }: { item: CatalogItem; editing: boolean; hidden: boolean; onOpen: () => void; onHide: () => void }) => {
  if (hidden) return null
  return (
    <div className={`app-tile-wrap ${editing ? 'is-editing' : ''}`}>
      <a className="app-tile" href={`/${item.kind === 'game' ? 'game' : 'app'}/${item.slug}`} onClick={event => { if (event.button === 0 && !event.metaKey && !event.ctrlKey) { event.preventDefault(); onOpen() } }} aria-label={`Open ${item.name}`}>
        <span className="tile-icon"><Glyph item={item} /></span>
        <span className="tile-name">{item.name}</span>
        <StatusBadge item={item} />
      </a>
      {editing && <button className="hide-tile" onClick={onHide} aria-label={`Hide ${item.name}`}>×</button>}
    </div>
  )
}

const AppGrid = ({ items, editing, hiddenItems, onOpen, onHide }: { items: CatalogItem[]; editing: boolean; hiddenItems: Set<string>; onOpen: (item: CatalogItem) => void; onHide: (item: CatalogItem) => void }) => (
  <div className="app-grid">
    {items.map(item => <AppTile key={item.slug} item={item} editing={editing} hidden={hiddenItems.has(item.slug)} onOpen={() => onOpen(item)} onHide={() => onHide(item)} />)}
  </div>
)

const HomeView = ({ onOpen, onModal }: { onOpen: (item: CatalogItem) => void; onModal: (name: ModalName) => void }) => {
  const [active, setActive] = useState<TabName>('all')
  const [editing, setEditing] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [hiddenItems, setHiddenItems] = useState<Set<string>>(new Set())
  const shownItems = useMemo(() => {
    let source = allItems
    if (active === 'dashboard') source = [...apps.slice(0, 18), ...games.slice(0, 8)]
    if (active === 'essentials' || active === 'tools' || active === 'lifestyle') source = apps.filter(item => item.category === active)
    if (active === 'games' || active === 'two_player') source = games
    if (query.trim()) source = source.filter(item => `${item.name} ${item.category} ${item.status}`.toLowerCase().includes(query.toLowerCase()))
    return source
  }, [active, query])
  const appItems = active === 'all' && !query ? shownItems.filter(item => item.kind === 'app') : shownItems
  const gameItems = active === 'all' && !query ? shownItems.filter(item => item.kind === 'game') : []
  const hideItem = (item: CatalogItem) => setHiddenItems(previous => new Set(previous).add(item.slug))
  return (
    <main id="main-content" className="home-panel">
      <CategoryNav active={active} onChange={setActive} />
      <section className="plus-banner">
        <div><strong>ReKindle+</strong><span>Mail, files and 11 more.</span></div>
        <button onClick={() => onModal('membership')}>This week: AI Assistant</button>
        <button className="see-plans" onClick={() => onModal('membership')}>See plans</button>
        <button className="banner-close" aria-label="Dismiss banner">×</button>
      </section>
      <section className="feature-grid" aria-label="Featured apps">
        <FeatureCard title="RSS Reader" blurb="Stay in the know" onClick={() => onOpen(appBySlug('newspaper')!)} />
        <FeatureCard title="Substack" blurb="Read your Substack subscriptions." status="PLUS" onClick={() => onOpen(appBySlug('readlater')!)} />
        <FeatureCard title="Mail" blurb="All your mailboxes in one place." status="PLUS" onClick={() => onModal('membership')} />
        <FeatureCard title="KindleChat" blurb="Now with more pixels!" onClick={() => onModal('help')} />
        <FeatureCard title="Topics" blurb="Discuss anything!" onClick={() => onModal('help')} />
        <FeatureCard title="Neighbourhood" blurb="Post & make connections" onClick={() => onModal('help')} />
      </section>
      <section className="catalog-heading">
        <div><h1>{active === 'games' || active === 'two_player' ? 'All Games' : active === 'all' ? 'All Applications' : `${active[0].toUpperCase()}${active.slice(1)}`}</h1><span className="count">{shownItems.length} items</span></div>
        <div className="catalog-tools">
          {searchOpen && <input name="catalog-search" autoComplete="off" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search apps and games…" aria-label="Search apps and games" />}
          <button className="icon-button" onClick={() => { setSearchOpen(open => !open); if (searchOpen) setQuery('') }} aria-label="Search">⌕</button>
          <button className="edit-button" onClick={() => setEditing(edit => !edit)}>{editing ? 'Done' : 'Edit'}</button>
        </div>
      </section>
      {(active === 'all' && !query) ? <>
        <section className="catalog-section"><div className="section-label">Applications <span>{appItems.length}</span></div><AppGrid items={appItems} editing={editing} hiddenItems={hiddenItems} onOpen={onOpen} onHide={hideItem} /></section>
        <section className="catalog-section games-section"><div className="section-label">Games <span>{gameItems.length}</span></div><AppGrid items={gameItems} editing={editing} hiddenItems={hiddenItems} onOpen={onOpen} onHide={hideItem} /></section>
      </> : <section className="catalog-section"><AppGrid items={shownItems} editing={editing} hiddenItems={hiddenItems} onOpen={onOpen} onHide={hideItem} /></section>}
    </main>
  )
}

const WindowFrame = ({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) => (
  <main id="main-content" className="window-page"><div className="mini-window"><div className="mini-window-bar"><span>{title}</span><button onClick={onClose} aria-label="Close">×</button></div><div className="mini-window-body">{children}</div></div></main>
)

const NotesApp = () => {
  const [value, setValue] = useState(() => localStorage.getItem('rekindle-notes') || '')
  const [saved, setSaved] = useState(false)
  const save = () => { localStorage.setItem('rekindle-notes', value); setSaved(true); window.setTimeout(() => setSaved(false), 1200) }
  return <div className="tool-app"><div className="tool-toolbar"><span>Untitled note</span><button onClick={save}>{saved ? 'Saved' : 'Save'}</button></div><textarea name="note" value={value} onChange={event => setValue(event.target.value)} placeholder="Type a note for later…" aria-label="Note text" /><p className="tool-hint">Stored on this device. Guest mode keeps your notes local.</p></div>
}

const TasksApp = () => {
  const [tasks, setTasks] = useState(() => ['Read 10 pages', 'Check the RSS reader', 'Take a short break'].map((text, index) => ({ id: index, text, done: false })))
  const [draft, setDraft] = useState('')
  const add = () => { if (!draft.trim()) return; setTasks(list => [...list, { id: Date.now(), text: draft.trim(), done: false }]); setDraft('') }
  return <div className="tool-app"><div className="add-row"><input name="task" autoComplete="off" value={draft} onChange={event => setDraft(event.target.value)} onKeyDown={event => event.key === 'Enter' && add()} placeholder="Add a task…" aria-label="New task" /><button onClick={add}>Add</button></div><div className="task-list">{tasks.map(task => <label key={task.id} className={task.done ? 'done' : ''}><input type="checkbox" checked={task.done} onChange={() => setTasks(list => list.map(entry => entry.id === task.id ? { ...entry, done: !entry.done } : entry))} /><span>{task.text}</span></label>)}</div></div>
}

const JournalApp = () => { const [value, setValue] = useState(''); return <div className="tool-app journal-app"><div className="journal-date">{new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</div><textarea name="journal-entry" value={value} onChange={event => setValue(event.target.value)} placeholder="What is on your mind today?" aria-label="Journal entry" /><div className="journal-foot"><span>{value.length} characters</span><button onClick={() => localStorage.setItem('rekindle-journal', value)}>Save entry</button></div></div> }

const CalculatorApp = () => {
  const [input, setInput] = useState('')
  const [result, setResult] = useState('0')
  const calculate = () => { if (!/^[0-9+\-*/().%\s]+$/.test(input)) { setResult('ERR'); return } try { setResult(String(Function(`"use strict"; return (${input})`)())) } catch { setResult('ERR') } }
  return <div className="calculator-app"><div className="calculator-display"><small>{input || '0'}</small><strong>{result}</strong></div><div className="keypad">{['7','8','9','/','4','5','6','*','1','2','3','-','0','.','=','+'].map(key => <button key={key} onClick={() => key === '=' ? calculate() : setInput(value => value + key)}>{key}</button>)}<button className="clear-key" onClick={() => { setInput(''); setResult('0') }}>Clear</button></div></div>
}

const CountdownApp = ({ timer = false }: { timer?: boolean }) => {
  const [seconds, setSeconds] = useState(timer ? 300 : 60)
  const [running, setRunning] = useState(false)
  useEffect(() => { if (!running || seconds <= 0) return; const id = window.setInterval(() => setSeconds(value => Math.max(0, value - 1)), 1000); return () => window.clearInterval(id) }, [running, seconds])
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0'); const secs = (seconds % 60).toString().padStart(2, '0')
  return <div className="countdown-app"><div className="big-digits">{mins}:{secs}</div><div className="countdown-actions"><button onClick={() => setRunning(value => !value)}>{running ? 'Pause' : 'Start'}</button><button onClick={() => { setRunning(false); setSeconds(timer ? 300 : 60) }}>Reset</button></div><label>Set minutes <input type="number" min="0" value={Math.floor(seconds / 60)} onChange={event => { setRunning(false); setSeconds(Number(event.target.value) * 60) }} /></label></div>
}

const CalendarApp = () => { const days = Array.from({ length: 30 }, (_, i) => i + 1); return <div className="calendar-app"><div className="calendar-head"><button aria-label="Previous month">‹</button><strong>{new Date().toLocaleDateString([], { month: 'long', year: 'numeric' })}</strong><button aria-label="Next month">›</button></div><div className="week-head">{['S','M','T','W','T','F','S'].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}</div><div className="month-grid">{days.map(day => <button key={day} className={day === new Date().getDate() ? 'today' : ''} aria-label={`Day ${day}`}>{day}</button>)}</div></div> }

const FlashcardsApp = () => { const cards = [['DEAR READER', 'A person who reads.'], ['E-INK', 'A low-power screen made for quiet focus.'], ['REKINDLE', 'To bring something back to life.']]; const [index, setIndex] = useState(0); const [flipped, setFlipped] = useState(false); return <div className="flashcards-app"><button className="flashcard" onClick={() => setFlipped(value => !value)}><span>{flipped ? cards[index][1] : cards[index][0]}</span><small>Tap to flip</small></button><div className="flashcard-actions"><button onClick={() => { setFlipped(false); setIndex((index + cards.length - 1) % cards.length) }}>Previous</button><span>{index + 1} / {cards.length}</span><button onClick={() => { setFlipped(false); setIndex((index + 1) % cards.length) }}>Next</button></div></div> }

const ReaderApp = () => <div className="reader-app"><p className="eyebrow">A tiny reader</p><h2>The future is quiet</h2><p>There is a special pleasure in a tool that does less, but does it clearly. ReKindle keeps the page close, the contrast high, and the path back to reading short.</p><p>Open another title from the catalog when you are ready. Your reading list remains yours.</p><button onClick={() => localStorage.setItem('rekindle-read', 'true')}>Mark as read</button></div>

const SketchpadApp = () => { const canvasRef = useRef<HTMLCanvasElement>(null); const drawing = useRef(false); const draw = (event: ReactPointerEvent<HTMLCanvasElement>) => { const canvas = canvasRef.current; if (!canvas || !drawing.current) return; const rect = canvas.getBoundingClientRect(); const context = canvas.getContext('2d'); if (!context) return; context.fillStyle = '#000'; context.fillRect(event.clientX - rect.left, event.clientY - rect.top, 3, 3) }; return <div className="sketchpad-app"><canvas ref={canvasRef} width={640} height={280} onPointerDown={() => { drawing.current = true }} onPointerUp={() => { drawing.current = false }} onPointerLeave={() => { drawing.current = false }} onPointerMove={draw} /><button onClick={() => { const canvas = canvasRef.current; const ctx = canvas?.getContext('2d'); if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height) }}>Clear sketch</button></div> }

const PixelApp = () => { const [cells, setCells] = useState<boolean[]>(Array(64).fill(false)); return <div className="pixel-app"><div className="pixel-grid">{cells.map((on, index) => <button key={index} className={on ? 'on' : ''} onClick={() => setCells(list => list.map((value, i) => i === index ? !value : value))} aria-label={`Pixel ${index + 1}`} />)}</div><button onClick={() => setCells(Array(64).fill(false))}>Clear</button></div> }

const WeatherApp = () => <div className="weather-app"><div className="weather-main"><span className="weather-symbol">☼</span><div><strong>22°C</strong><span>São Paulo, Brazil</span></div></div><div className="weather-days">{['Today','Tue','Wed','Thu','Fri'].map((day, index) => <div key={day}><span>{day}</span><strong>{22 - index}°</strong><small>{index % 2 ? 'Cloudy' : 'Clear'}</small></div>)}</div><p className="tool-hint">Demo forecast for the local-first shell.</p></div>

const GenericApp = ({ item }: { item: CatalogItem }) => <div className="generic-app"><div className="generic-hero"><Glyph item={item} large /><div><p className="eyebrow">{item.category} / {item.status === 'plus' ? 'membership' : 'local preview'}</p><h2>{item.name}</h2><p>{item.blurb}</p></div></div><div className="generic-note"><strong>{item.status === 'plus' ? 'ReKindle+ feature' : 'Catalog route ready'}</strong><span>{item.status === 'plus' ? 'This preview keeps the integration honest. Connect a provider or open membership to unlock the full service.' : 'This app is represented in the clone catalog and has a dedicated route. Its source-specific workflow can be added without changing the shell.'}</span></div><button onClick={() => alert(item.status === 'plus' ? 'This is a PLUS integration preview.' : `${item.name} is ready for a local implementation.`)}>Open preview</button></div>

const TicTacToe = () => { const [board, setBoard] = useState<string[]>(Array(9).fill('')); const [turn, setTurn] = useState('X'); const winner = [[0,1,2],[3,4,5],[6,7,8]].concat([[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]).find(([a,b,c]) => board[a] && board[a] === board[b] && board[a] === board[c]); const play = (index: number) => { if (board[index] || winner) return; setBoard(list => list.map((cell, i) => i === index ? turn : cell)); setTurn(value => value === 'X' ? 'O' : 'X') }; return <div className="tic-app"><div className="tic-board">{board.map((cell, i) => <button key={i} onClick={() => play(i)}>{cell}</button>)}</div><p>{winner ? `${winner[0]} wins.` : board.every(Boolean) ? 'Draw.' : `${turn}'s turn.`}</p><button onClick={() => { setBoard(Array(9).fill('')); setTurn('X') }}>Reset game</button></div> }

const MemoryGame = () => { const values = ['A','A','B','B','C','C','D','D','E','E','F','F']; const [cards, setCards] = useState(() => values.sort(() => Math.random() - .5)); const [open, setOpen] = useState<number[]>([]); const [matched, setMatched] = useState<number[]>([]); useEffect(() => { if (open.length !== 2) return; if (cards[open[0]] === cards[open[1]]) { setMatched(value => [...value, ...open]); setOpen([]) } else { const id = window.setTimeout(() => setOpen([]), 650); return () => window.clearTimeout(id) } }, [open, cards]); const flip = (index: number) => { if (open.length >= 2 || matched.includes(index) || open.includes(index)) return; setOpen(value => [...value, index]) }; return <div className="memory-app"><div className="memory-grid">{cards.map((value, index) => <button key={`${value}-${index}`} className={open.includes(index) || matched.includes(index) ? 'open' : ''} onClick={() => flip(index)}>{open.includes(index) || matched.includes(index) ? value : '?'}</button>)}</div><button onClick={() => { setCards([...values].sort(() => Math.random() - .5)); setOpen([]); setMatched([]) }}>New game</button></div> }

const WordleGame = () => { const answer = 'KINDL'; const [guess, setGuess] = useState(''); const [guesses, setGuesses] = useState<string[]>([]); const submit = () => { if (guess.length !== 5 || guesses.length >= 6) return; setGuesses(list => [...list, guess.toUpperCase()]); setGuess('') }; return <div className="wordle-app"><div className="wordle-grid">{Array.from({ length: 6 }, (_, row) => <div className="word-row" key={row}>{Array.from({ length: 5 }, (_, col) => { const value = guesses[row]?.[col] || ''; const state = value && (value === answer[col] ? 'correct' : answer.includes(value) ? 'present' : 'wrong'); return <span key={`${row}-${col}`} aria-hidden="true" className={state}>{value}</span> })}</div>)}</div><div className="wordle-input"><input name="wordle-guess" autoComplete="off" spellCheck={false} maxLength={5} value={guess} onChange={event => setGuess(event.target.value.replace(/[^a-z]/gi, ''))} onKeyDown={event => event.key === 'Enter' && submit()} placeholder="5 letters…" aria-label="Five letter guess" /><button onClick={submit}>Guess</button></div><p className="tool-hint">A tiny word game. The answer is a Kindle-flavoured word.</p></div> }

const Game2048 = () => { const empty = () => Array(16).fill(0); const [grid, setGrid] = useState(() => { const initial = empty(); initial[0] = 2; initial[5] = 2; return initial }); const move = (direction: 'left'|'right'|'up'|'down') => { const next = [...grid]; const lines = direction === 'left' || direction === 'right' ? [0,1,2,3].map(row => next.slice(row*4,row*4+4)) : [0,1,2,3].map(col => [next[col],next[col+4],next[col+8],next[col+12]]); const compact = (line: number[]) => { const values = line.filter(Boolean); const result: number[] = []; for (let i=0;i<values.length;i++) { if (values[i] === values[i+1]) { result.push(values[i]*2); i++ } else result.push(values[i]) } return [...result,0,0,0,0].slice(0,4) }; const moved = lines.map(line => compact(direction === 'right' || direction === 'down' ? line.reverse() : line)); const output = empty(); moved.forEach((line, i) => { const ordered = direction === 'right' || direction === 'down' ? line.reverse() : line; ordered.forEach((value, j) => direction === 'left' || direction === 'right' ? output[i*4+j] = value : output[i+j*4] = value) }); const emptySlots = output.map((v,i) => v ? -1 : i).filter(v => v >= 0); if (emptySlots.length) output[emptySlots[Math.floor(Math.random()*emptySlots.length)]] = 2; setGrid(output) }; useEffect(() => { const key = (event: KeyboardEvent) => { const map: Record<string, 'left'|'right'|'up'|'down'> = { ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down' }; if (map[event.key]) { event.preventDefault(); move(map[event.key]) } }; window.addEventListener('keydown', key); return () => window.removeEventListener('keydown', key) }); return <div className="game-2048"><div className="board-2048" aria-label="2048 board">{grid.map((value, index) => <span key={index} className={value ? `cell-${value}` : ''}>{value || ''}</span>)}</div><div className="game-controls"><button aria-label="Move left" onClick={() => move('left')}>←</button><button aria-label="Move up" onClick={() => move('up')}>↑</button><button aria-label="Move down" onClick={() => move('down')}>↓</button><button aria-label="Move right" onClick={() => move('right')}>→</button></div><button onClick={() => { const initial = empty(); initial[0]=2; initial[5]=2; setGrid(initial) }}>New game</button></div> }

const GameView = ({ item }: { item: CatalogItem }) => { const game = item.slug === '2048' ? <Game2048 /> : item.slug === 'tictactoe' ? <TicTacToe /> : item.slug === 'memory' ? <MemoryGame /> : item.slug === 'wordle' ? <WordleGame /> : <GenericApp item={item} />; return <div className="game-view"><div className="game-intro"><div><p className="eyebrow">Games / local play</p><h2>{item.name}</h2><p>{item.blurb}</p></div><StatusBadge item={item} /></div>{game}</div> }

const AppView = ({ item, onClose }: { item: CatalogItem; onClose: () => void }) => <WindowFrame title={item.name} onClose={onClose}>{item.kind === 'game' ? <GameView item={item} /> : item.slug === 'notes' ? <NotesApp /> : item.slug === 'tasks' || item.slug === 'quicktodo' ? <TasksApp /> : item.slug === 'journal' ? <JournalApp /> : item.slug === 'calculator' ? <CalculatorApp /> : item.slug === 'countdown' ? <CountdownApp /> : item.slug === 'timer' ? <CountdownApp timer /> : item.slug === 'calendar' ? <CalendarApp /> : item.slug === 'flashcards' ? <FlashcardsApp /> : item.slug === 'reader' || item.slug === 'readlater' ? <ReaderApp /> : item.slug === 'napkin' ? <SketchpadApp /> : item.slug === 'pixel' ? <PixelApp /> : item.slug === 'weather' ? <WeatherApp /> : <GenericApp item={item} />}</WindowFrame>

const SettingsView = ({ onClose }: { onClose: () => void }) => <WindowFrame title="Settings" onClose={onClose}><div className="settings-view"><h2>Guest mode</h2><p>Your settings and local app data stay on this device until you sign in.</p><label className="setting-row"><span>High contrast</span><input type="checkbox" defaultChecked /></label><label className="setting-row"><span>Reduce motion</span><input type="checkbox" onChange={event => document.documentElement.classList.toggle('reduce-motion', event.target.checked)} /></label><button onClick={() => localStorage.clear()}>Clear local data</button></div></WindowFrame>

const Modal = ({ name, onClose }: { name: ModalName; onClose: () => void }) => { if (!name) return null; const content = name === 'login' ? <><h2>Sign In</h2><p>Sign in to sync your apps and data across every device. Or continue as a guest.</p><ul><li>Free cloud sync for notes, journal, lists and settings.</li><li>No data loss when a cache is wiped or a device changes.</li><li>Community access to KindleChat, Neighbourhood and Topics.</li></ul><div className="modal-actions"><button onClick={onClose}>Sign In</button><button className="secondary" onClick={onClose}>Continue as guest</button></div></> : name === 'membership' ? <><h2>ReKindle+</h2><p>Extra apps, cloud storage and AI for people who want more from their e-ink dashboard.</p><div className="membership-line"><strong>Free</strong><span>Core apps, local storage and games.</span></div><div className="membership-line"><strong>PLUS</strong><span>Mail, files, AI Assistant and more.</span></div><button onClick={onClose}>Keep exploring</button></> : name === 'settings' ? <><h2>Settings</h2><p>Open the settings panel from the dashboard to change local preferences.</p><button onClick={onClose}>Close</button></> : <><h2>Help</h2><p>Choose an app or game from the catalog. PLUS integrations are represented honestly until their provider is connected.</p><button onClick={onClose}>Got it</button></>; return <div className="modal-backdrop" role="presentation" onClick={event => { if (event.target === event.currentTarget) onClose() }}><section className="modal-card" role="dialog" aria-modal="true"> <button className="modal-close" onClick={onClose} aria-label="Close">×</button>{content}</section></div> }

const App = () => {
  const location = useLocation()
  const [modal, setModal] = useState<ModalName>(null)
  const [toast, setToast] = useState('')
  const path = location.split('?')[0]
  const query = new URLSearchParams(location.split('?')[1] || '')
  const item = path.startsWith('/app/') ? appBySlug(path.replace('/app/', '')) : path.startsWith('/game/') ? gameBySlug(path.replace('/game/', '')) : path === '/preview.html' && query.get('app') === 'chat' ? appBySlug('chat') : undefined
  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(''), 1800); return () => window.clearTimeout(timer) }, [toast])
  const openItem = (entry: CatalogItem) => navigate(`/${entry.kind === 'game' ? 'game' : 'app'}/${entry.slug}`)
  const goHome = () => navigate('/')
  return <div className="site-shell"><a className="skip-link" href="#main-content">Skip to main content</a><Header onModal={setModal} onHome={goHome} />{item ? <AppView item={item} onClose={goHome} /> : path === '/settings' ? <SettingsView onClose={goHome} /> : path === '/membership' ? <WindowFrame title="ReKindle+" onClose={goHome}><div className="membership-page"><h2>Mail, files and 11 more.</h2><p>ReKindle+ adds cloud-connected apps and AI without taking away the quiet local-first dashboard.</p><button onClick={() => setModal('login')}>Sign in to continue</button></div></WindowFrame> : path === '/help' ? <WindowFrame title="Help" onClose={goHome}><div className="help-page"><h2>How ReKindle works</h2><p>Use the category bar to browse, search to find a tool, and choose Edit to hide shortcuts from your dashboard.</p></div></WindowFrame> : <HomeView onOpen={openItem} onModal={setModal} />}<Modal name={modal} onClose={() => setModal(null)} />{toast && <div aria-live="polite" className="toast">{toast}</div>}</div>
}

export default App
