import { createRoot } from 'react-dom/client'
import { useEffect, useRef, useState } from 'react'
import { createSpinnerAudio } from './audio.js'
import { heroes } from './heroes.js'
import './styles.css'

function App() {
  const [selected, setSelected] = useState(() => new Set(heroes.map(({ name }) => name)))
  const [rounds, setRounds] = useState(3)
  const [allowDuplicates, setAllowDuplicates] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const audio = useRef(null)
  const [spinning, setSpinning] = useState(false)
  const [winner, setWinner] = useState(heroes[0])
  const [results, setResults] = useState([])
  const [spinId, setSpinId] = useState(0)
  const [reelHeroes, setReelHeroes] = useState([])

  const pool = heroes.filter((hero) => selected.has(hero.name))
  const maxRounds = allowDuplicates ? undefined : Math.max(1, pool.length)
  const roundCount = Math.min(rounds, maxRounds ?? Number.MAX_SAFE_INTEGER)

  useEffect(() => () => audio.current?.dispose(), [])

  useEffect(() => {
    if (pool.length && !selected.has(winner.name)) setWinner(pool[0])
  }, [selected, winner.name, pool])

  function toggleHero(name) {
    if (spinning) return
    setSelected((current) => {
      const next = new Set(current)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })
  }

  async function spin() {
    if (!pool.length || spinning) return
    setSpinning(true)
    setResults([])
    audio.current ??= createSpinnerAudio()
    audio.current.setEnabled(soundEnabled)
    if (soundEnabled) await audio.current.unlock()
    const available = [...pool]
    const nextResults = []
    for (let round = 0; round < roundCount; round += 1) {
      const index = Math.floor(Math.random() * available.length)
      const choice = allowDuplicates ? available[index] : available.splice(index, 1)[0]
      setReelHeroes([...pool, ...pool, choice])
      setSpinId((id) => id + 1)
      audio.current.spin()
      await new Promise((resolve) => setTimeout(resolve, 1350))
      setWinner(choice)
      setReelHeroes([])
      nextResults.push(choice)
      setResults([...nextResults])
      audio.current.result()
      if (round < roundCount - 1) await new Promise((resolve) => setTimeout(resolve, 450))
    }
    setSpinning(false)
  }

  return <main>
    <section className="hero-copy">
      <p className="eyebrow">Bullet Echo randomizer</p>
      <h1>WHO DROPS<br /><span>IN NEXT?</span></h1>
      <p className="intro">Build your squad pool, set the number of rounds, then let the machine call the hero.</p>
      <div className="source">ROSTER: BULLET ECHO WIKI</div>
    </section>

    <section className="machine-section">
      <div className={`machine ${reelHeroes.length ? 'is-spinning' : ''}`}>
        <div className="machine-top"><span>HERO SELECTOR</span><i></i><span>ONLINE</span></div>
        <div className="reel-window">
          <div className="marker marker-left"></div><div className="marker marker-right"></div>
          <div className="reel" key={spinId} style={{ '--spin-distance': `calc(var(--reel-height) * -${Math.max(0, reelHeroes.length - 1)})` }}>
            {(reelHeroes.length ? reelHeroes : [winner]).map((hero, index) => <div className="reel-card" key={`${hero.name}-${index}`}>
              <img src={hero.image} alt={hero.name} /><strong>{hero.name}</strong>
            </div>)}
          </div>
        </div>
        <div className="machine-bottom"><span>{spinning ? `ROUND ${Math.min(results.length + 1, roundCount)} / ${roundCount}` : 'LOCKED ON TARGET'}</span><span className="signal">●</span></div>
      </div>
      <button className="spin-button" onClick={spin} disabled={!pool.length || spinning}>
        {spinning ? 'SPINNING...' : `SPIN ${roundCount} ROUND${roundCount === 1 ? '' : 'S'}`}
      </button>
      <section className="results" aria-label="Round results" aria-live="polite">
        <h2>ROUND RESULTS</h2>
        {results.length ? <div className="result-grid">{results.map((hero, index) => <article className="result-card" key={`${hero.name}-${index}`}>
          <img src={hero.image} alt={hero.name} />
          <div><b>ROUND {String(index + 1).padStart(2, '0')}</b><strong>{hero.name}</strong></div>
        </article>)}</div> : <p>RESULTS WILL APPEAR HERE</p>}
      </section>
    </section>

    <aside className="control-panel">
      <div className="panel-heading"><span>LOADOUT</span><small>{pool.length} / {heroes.length} SELECTED</small></div>
      <div className="round-control">
        <label htmlFor="rounds">ROUNDS</label>
        <button onClick={() => setRounds(Math.max(1, roundCount - 1))} disabled={spinning || roundCount === 1}>−</button>
        <input id="rounds" type="number" min="1" max={maxRounds} step="1" value={roundCount} onChange={(event) => setRounds(Math.min(maxRounds ?? Number.MAX_SAFE_INTEGER, Math.max(1, Math.floor(Number(event.target.value)) || 1)))} disabled={spinning} />
        <button onClick={() => setRounds(roundCount + 1)} disabled={spinning || roundCount >= (maxRounds ?? Number.MAX_SAFE_INTEGER)}>+</button>
      </div>
      <div className="run-options">
        <label><span>ALLOW DUPLICATES</span><input type="checkbox" role="switch" checked={allowDuplicates} onChange={(event) => setAllowDuplicates(event.target.checked)} disabled={spinning} /></label>
        <p>{allowDuplicates ? 'Heroes can win again in later rounds.' : 'Each hero can win once per run.'}</p>
        <label><span>SOUND EFFECTS</span><input type="checkbox" role="switch" checked={soundEnabled} onChange={(event) => {
          setSoundEnabled(event.target.checked)
          audio.current?.setEnabled(event.target.checked)
          if (event.target.checked) void audio.current?.unlock()
        }} /></label>
      </div>
      <div className="quick-actions"><button onClick={() => setSelected(new Set(heroes.map(({ name }) => name)))} disabled={spinning}>ALL</button><button onClick={() => setSelected(new Set())} disabled={spinning}>NONE</button></div>
      <div className="hero-grid">{heroes.map((hero) => <button key={hero.name} className={selected.has(hero.name) ? 'chosen' : ''} onClick={() => toggleHero(hero.name)} disabled={spinning}>
        <img src={hero.image} alt="" /><span>{hero.name}</span><i>✓</i>
      </button>)}</div>
    </aside>
  </main>
}

createRoot(document.getElementById('root')).render(<App />)
