import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [points, setPoints] = useState(10);
  const [inputPoints, setInputPoints] = useState(10);
  const [time, setTime] = useState(0);
  const [circles, setCircles] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [nextCircle, setNextCircle] = useState(1);
  const [clickedCircles, setClickedCircles] = useState([]);

  useEffect(() => {
    resetGame();
  }, []);

  useEffect(() => {
    let timer;
    if (timerRunning) {
      timer = setInterval(() => setTime((prev) => prev + 0.1), 100);
    }
    return () => clearInterval(timer);
  }, [timerRunning]);

  const resetGame = () => {
    setPoints(inputPoints);
    setNextCircle(1);
    setTime(0);
    setTimerRunning(false);
    setGameOver(false);
    setGameWon(false);
    setClickedCircles([]);

    const newCircles = Array.from({ length: inputPoints }, (_, index) => ({
      id: index + 1,
      x: Math.random() * 400,
      y: Math.random() * 400,
    }));
    setCircles(newCircles);
  };

  const startGame = () => {
    setTimerRunning(true);
  };

  const handleClickCircle = (id) => {
    if (gameOver || gameWon) return;

    if (id === nextCircle) {
      setClickedCircles((prev) => [...prev, id]);
      setNextCircle((prev) => prev + 1);

      setTimeout(() => {
        setCircles((prevCircles) => prevCircles.filter((circle) => circle.id !== id));
        
        setPoints((prevPoints) => {
          const newPoints = prevPoints - 1;
          if (newPoints === 0) {
            setGameWon(true);
            setTimerRunning(false);
          }
          return newPoints;
        });
      }, 800);
    } else {
      setGameOver(true);
      setTimerRunning(false);
    }
  };

  const handleInputChange = (e) => {
    setInputPoints(parseInt(e.target.value) || 0);
  };

  return (
    <div className="App">
      <h1 className={gameWon ? "game-won" : gameOver ? "game-over" : ""}>
        {gameWon ? "ALL CLEARED" : gameOver ? "GAME OVER" : "LET'S PLAY"}
      </h1>
      <div>
        <label>
          Points: 
          <input 
            type="number" 
            value={inputPoints} 
            onChange={handleInputChange} 
            disabled={timerRunning} 
          />
        </label>
        <br />
        Time: {time.toFixed(1)}s
      </div>
      <button onClick={() => { resetGame(); startGame(); }}>Restart</button>
      <div className="game-area">
        {circles.map((circle) => (
          <div
            key={circle.id}
            className={`circle ${clickedCircles.includes(circle.id) ? "clicked" : ""}`}
            style={{ top: circle.y, left: circle.x }}
            onClick={() => handleClickCircle(circle.id)}
          >
            {circle.id}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
