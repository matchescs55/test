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

  // Mole spawner: gets faster as time runs out
  useEffect(() => {
    if (!playing) return;
    const speed = timeLeft > 15 ? 800 : timeLeft > 7 ? 600 : 450;
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
  }, [playing, timeLeft > 15, timeLeft > 7]);

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

      <style jsx global>{`
        body {
          margin: 0;
          background: #2f4a2b;
          color: #f3ead3;
          font-family: 'Trebuchet MS', 'Segoe UI', sans-serif;
        }
      `}</style>

      <style jsx>{`
        .wrap {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
          padding: 2rem 1rem;
        }
        h1 {
          margin: 0;
          font-size: 2.25rem;
          letter-spacing: 0.02em;
        }
        .stats {
          display: flex;
          gap: 1.5rem;
          font-size: 1.1rem;
        }
        .board {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
          width: min(92vw, 380px);
          padding: 1rem;
          background: #5a3d24;
          border-radius: 18px;
        }
        .hole {
          position: relative;
          aspect-ratio: 1;
          overflow: hidden;
          border: none;
          border-radius: 50%;
          background: radial-gradient(circle at 50% 70%, #1b1008 55%, #3a2614 100%);
          cursor: pointer;
          padding: 0;
        }
        .hole:focus-visible {
          outline: 3px solid #f3ead3;
          outline-offset: 2px;
        }
        .mole {
          position: absolute;
          left: 0;
          right: 0;
          bottom: -70%;
          font-size: clamp(2rem, 11vw, 3.4rem);
          line-height: 1;
          transition: bottom 0.12s ease-out;
        }
        .up .mole,
        .hit .mole {
          bottom: 8%;
        }
        .start {
          padding: 0.7rem 1.8rem;
          font-size: 1.1rem;
          font-weight: 700;
          color: #2f4a2b;
          background: #f3ead3;
          border: none;
          border-radius: 999px;
          cursor: pointer;
        }
        .start:disabled {
          opacity: 0.6;
          cursor: default;
        }
        @media (prefers-reduced-motion: reduce) {
          .mole {
            transition: none;
          }
        }
      `}</style>
    </main>
  );
}
