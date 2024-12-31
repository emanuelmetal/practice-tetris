import { useEffect, useState } from 'react';
import Tetris from './tetris.js';
import './App.css';

const tetris = new Tetris();

const getCellClass = (cell) => {
  switch (cell) {
    case 1:
      return `tetris-cell__${tetris.piece.fill}`;
    case 2:
      return 'tetris-cell__stick';
    case 3:
      return 'tetris-cell__square';
    case 4:
      return 'tetris-cell__ti';
    case 5:
      return 'tetris-cell__es';
    case 6:
      return 'tetris-cell__el';
    default:
      return 'tetris-cell__empty';
  }
};

export default function App() {
  const [_, render] = useState({});
  useEffect(() => {
    const keyDownHandler = (e) => {
      if (e.key === 'ArrowDown') {
        tetris.moveDown();
      }

      if (e.key === 'ArrowLeft') {
        tetris.moveLeft();
      }

      if (e.key === 'ArrowRight') {
        tetris.moveRight();
      }

      if (e.key === 'ArrowUp') {
        tetris.rotate();
      }
      render({});
    };
    document.addEventListener('keydown', keyDownHandler);

    return () => document.removeEventListener('keydown', keyDownHandler);
  }, []);

  useEffect(() => {
    const tickInterval = setInterval(() => {
      tetris.move({ dy: 1 });
      render({});
      return () => clearInterval(tickInterval);
    }, 1000);
  }, []);

  return (
    <>
      <h1>Tetris</h1>
      <div>
        {tetris.board.map((row, i) => (
          <div className="tetris-board" key={i}>
            {row.map((cell, j) => (
              <div key={j} className={`tetris-cell ${getCellClass(cell)} `} />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
