import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const WIN_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function App() {
  const [showGame, setShowGame] = useState(false);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winnerInfo, setWinnerInfo] = useState({ winner: null, line: [] });
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [scores, setScores] = useState({ X: 0, O: 0 });

  const moveSound = useRef();
  const winSound = useRef();
  const drawSound = useRef();

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : 'light';
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const handleClick = (i) => {
    if (squares[i] || winnerInfo.winner) return;

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
    moveSound.current.play();

    const result = calculateWinner(nextSquares);
    if (result) {
      setWinnerInfo(result);
      setScores((prev) => ({ ...prev, [result.winner]: prev[result.winner] + 1 }));
      setTimeout(() => winSound.current.play(), 300);
    } else if (nextSquares.every(Boolean)) {
      drawSound.current.play();
    }
  };

  const restartGame = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setWinnerInfo({ winner: null, line: [] });
  };

  const resetScores = () => {
    setScores({ X: 0, O: 0 });
    restartGame();
  };

  const status = winnerInfo.winner
    ? `Winner: ${winnerInfo.winner}`
    : squares.every(Boolean)
    ? 'Draw!'
    : `Next player: ${xIsNext ? 'X' : 'O'}`;

  if (!showGame) {
    return (
      <div className="welcome-screen">
        <h1>Welcome to Blink Tac Toe! 🎮</h1>
        <button className="start-btn" onClick={() => setShowGame(true)}>Start Game</button>
      </div>
    );
  }

  return (
    <div className="game">
      <audio ref={moveSound} src="../public/sounds/movesound.mp3" />
      <audio ref={winSound} src="../public/sounds/finishGame.mp3" />
      <audio ref={drawSound} src="../public/sounds/draw.mp3" />

      <h1>Blink Tic-Tac-Toe</h1>

      <div className="toggle-container">
        <label className="switch">
          <input type="checkbox" checked={darkMode} onChange={() => setDarkMode((prev) => !prev)} />
          <span className="slider"></span>
        </label>
        <span className="mode-label">{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
      </div>

      <div className="scoreboard">
        <div className="score">X: {scores.X}</div>
        <div className="score">O: {scores.O}</div>
      </div>

      <div className="status">{status}</div>

      <div className="board">
        {squares.map((_, i) => (
          <button
            key={i}
            className={`square ${winnerInfo.line.includes(i) ? 'blink' : ''}`}
            onClick={() => handleClick(i)}
          >
            {squares[i]}
          </button>
        ))}
      </div>

      <div className="button-group">
        <button className="restart" onClick={restartGame}>Restart</button>
        <button className="reset-score" onClick={resetScores}>Reset Score</button>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  for (let [a, b, c] of WIN_COMBINATIONS) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

export default App;
