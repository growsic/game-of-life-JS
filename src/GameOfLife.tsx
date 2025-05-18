import { useEffect, useRef } from 'react';

const SCREEN_SIZE = 1500;
const SIDE_CELLS = 200;
const CELL_SIZE = SCREEN_SIZE / SIDE_CELLS;
const FPS = 10;

const LIVE = 1;
const DIE = 0;

export default function GameOfLife() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fieldRef = useRef<number[][]>([]);
  const tempFieldRef = useRef<number[][]>([]);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.height = SCREEN_SIZE;
    const scaleRate = Math.min(window.innerWidth / SCREEN_SIZE, window.innerHeight / SCREEN_SIZE);
    canvas.style.width = canvas.style.height = SCREEN_SIZE * scaleRate + 'px';

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    contextRef.current = ctx;
    ctx.fillStyle = 'rgb(211, 85, 149)';

    fieldRef.current = initialize2DArray();
    tempFieldRef.current = initialize2DArray();
    fieldRef.current = insertRandomValue();

    update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = () => {
    const field = fieldRef.current;
    const tempField = tempFieldRef.current;
    if (!field || !tempField) return;
    duplicate2Darray(tempField, field);
    setNextStatus(field, tempField);
    draw(field);
    setTimeout(update, 1000 / FPS);
  };

  function draw(field: number[][]) {
    const ctx = contextRef.current;
    if (!ctx) return;
    ctx.clearRect(0, 0, SCREEN_SIZE, SCREEN_SIZE);
    for (let row = 0; row < field.length; row++) {
      for (let column = 0; column < field.length; column++) {
        const x = row * CELL_SIZE;
        const y = column * CELL_SIZE;
        if (field[row][column] === LIVE) {
          ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
        }
      }
    }
  }

  return <canvas ref={canvasRef} style={{ display: 'block', margin: 'auto' }} />;
}

function initialize2DArray(): number[][] {
  const field: number[][] = new Array(SIDE_CELLS);
  for (let i = 0; i < SIDE_CELLS; i++) {
    field[i] = new Array(SIDE_CELLS).fill(0);
  }
  return field;
}

function insertRandomValue(): number[][] {
  const array = initialize2DArray();
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length; j++) {
      array[i][j] = Math.floor(Math.random() * 2);
    }
  }
  return array;
}

function duplicate2Darray(dest: number[][], src: number[][]) {
  for (let row = 0; row < dest.length; row++) {
    for (let column = 0; column < dest[0].length; column++) {
      dest[row][column] = src[row][column];
    }
  }
}

function setNextStatus(field: number[][], tempField: number[][]) {
  for (let row = 0; row < tempField.length; row++) {
    for (let column = 0; column < tempField[0].length; column++) {
      field[row][column] = decideNextStatus(row, column, tempField);
    }
  }
}

function decideNextStatus(row: number, column: number, tempField: number[][]): number {
  const currentStatus = tempField[row][column];
  const liveCells = countLiveCells(row, column, tempField);
  switch (liveCells) {
    case 2:
      return currentStatus === DIE ? DIE : LIVE;
    case 3:
      return LIVE;
    default:
      return DIE;
  }
}

function countLiveCells(row: number, column: number, tempField: number[][]): number {
  let liveCounter = 0;
  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = column - 1; j <= column + 1; j++) {
      if (i < 0 || j < 0 || SIDE_CELLS <= i || SIDE_CELLS <= j) continue;
      if (i === row && j === column) continue;
      if (tempField[i][j] === LIVE) liveCounter++;
    }
  }
  return liveCounter;
}

