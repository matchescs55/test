'use client';

import { useEffect, useRef, useState } from 'react';

const HOLES = 9;
const GAME_SECONDS = 30;

export default function Page() {
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS);
  const [active, setActive] = useState(null);
  const [whacked, setWhacked] = useState(null);
  const scoreRef = useRef(0);

  // Moles get faster as time runs out
  const speed = timeLeft > 15 ? 800 : timeLeft > 7 ? 600 : 450;

  // Countdown
  useEffect(() => {
    if (!playing) return;
    const tick = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(tick);
          setPlaying(false);
          setActive(null);
          setBest((b) => Math.max(b, scoreRef.current));
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [playing]);

  // Mole spawner
  useEffect(() => {
    if (!playing) return;
    const spawn = setInterval(() => {
      setWhacked(null);
      setActive((prev) => {
        let next;
        do {
          next = Math.floor(Math.random() * HOLES);
        } while (next === prev);
        return next;
      });
    }, speed);
    return () => clearInterval(spawn);
  }, [playing, speed]);

  function start() {
    scoreRef.current = 0;
    setScore(0);
    setTimeLeft(GAME_SECONDS);
    setWhacked(null);
    setPlaying(true);
  }

  function whack(i) {
    if (!playing || i !== active) return;
    scoreRef.current += 1;
    setScore(scoreRef.current);
    setWhacked(i);
    setActive(null);
  }

  return (
    <main className="wrap">
      <h1>Whack-a-Mole</h1>

      <div className="stats">
        <span>Score: <b>{score}</b></span>
        <span>Time: <b>{timeLeft}s</b></span>
        <span>Best: <b>{best}</b></span>
      </div>

      <div className="board" role="group" aria-label="Mole holes">
        {Array.from({ length: HOLES }, (_, i) => (
          <button
            key={i}
            className={`hole ${active === i ? 'up' : ''} ${whacked === i ? 'hit' : ''}`}
            onClick={() => whack(i)}
            aria-label={active === i ? 'Mole! Whack it' : 'Empty hole'}
          >
            <span className="mole">{whacked === i ? '💥' : '🐹'}</span>
          </button>
        ))}
      </div>

      <button className="start" onClick={start} disabled={playing}>
        {playing ? 'Go go go!' : timeLeft === 0 ? 'Play again' : 'Start game'}
      </button>
    </main>
  );
}
