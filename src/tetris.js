const BOARD_X = 10; // ten columns
const BOARD_Y = 20; // twnty rows

const SHAPES = [
  {
    fill: 'stick',
    stuck: 2,
    steps: [
      [[1, 1, 1, 1]],
      [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
      ],
      [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
      ],
      [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
      ],
    ],
  },
  {
    fill: 'square',
    stuck: 3,
    steps: [
      [
        [1, 1],
        [1, 1],
      ],
      [
        [1, 1],
        [1, 1],
      ],
      [
        [1, 1],
        [1, 1],
      ],
      [
        [1, 1],
        [1, 1],
      ],
    ],
  },
  {
    fill: 'ti',
    stuck: 4,
    steps: [
      [
        [1, 1, 1],
        [0, 1, 0],
      ],
      [
        [0, 0, 1],
        [0, 1, 1],
        [0, 0, 1],
      ],
      [
        [0, 0, 0],
        [0, 1, 0],
        [1, 1, 1],
      ],
      [
        [1, 0, 0],
        [1, 1, 0],
        [1, 0, 0],
      ],
    ],
  },
  {
    fill: 'es',
    stuck: 5,
    steps: [
      [
        [1, 1, 0],
        [0, 1, 1],
      ],
      [
        [0, 0, 1],
        [0, 1, 1],
        [0, 1, 0],
      ],
      [
        [1, 1, 0],
        [0, 1, 1],
      ],
      [
        [0, 0, 1],
        [0, 1, 1],
        [0, 1, 0],
      ],
    ],
  },
  {
    fill: 'el',
    stuck: 6,
    steps: [
      [
        [0, 0, 1],
        [1, 1, 1],
      ],
      [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1],
      ],
      [
        [1, 1, 1],
        [1, 0, 0],
      ],
      [
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
      ],
    ],
  },
];

export default class Tetris {
  constructor() {
    this.board = Array(BOARD_Y)
      .fill('')
      .map(() => Array(BOARD_X).fill(0));
    this.generatePiece();
  }

  generatePiece() {
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    //const shape = SHAPES[4];
    console.log(shape);
    this.piece = {
      x: BOARD_X / 2,
      y: 0,
      step: 0,
      shape: shape.steps[0],
      ...shape,
    };

    this.place();
  }

  place({ remove = false, stick = false } = {}) {
    const { shape, stuck } = this.piece;
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[0].length; x++) {
        if (shape[y][x]) {
          const newY = this.piece.y + y;
          const newX = this.piece.x + x;
          this.board[newY][newX] = remove ? 0 : stick ? stuck : shape[y][x];
        }
      }
    }
  }

  check({ dx, dy, shape = this.piece.shape }) {
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[0].length; x++) {
        if (shape[y][x]) {
          const newY = this.piece.y + y + dy;
          const newX = this.piece.x + x + dx;

          if (newX < 0 || newX >= BOARD_X) {
            return false;
          }

          if (newY >= BOARD_Y) {
            return false;
          }

          if (this.board[newY][newX] > 1) {
            return false;
          }
        }
      }
    }
    return true;
  }

  clearLines() {
    this.board.forEach((row, i) => {
      if (row.every((cell) => cell > 1)) {
        this.board.splice(i, 1);
        this.board.unshift(Array(BOARD_X).fill(0));
      }
    });
  }

  rotatedShape() {
    const { shape, steps, step } = this.piece;
    this.piece.step = step + 1 === steps.length ? 0 : step + 1;
    const rotatedShape = steps[this.piece.step];

    return rotatedShape;
  }

  move({ dx = 0, dy = 0, rotate = false } = {}) {
    const shape = rotate ? this.rotatedShape() : this.piece.shape;
    const valid = this.check({ dx, dy, shape });

    if (!valid && dy) {
      this.place({ stick: true });
      this.clearLines();
      this.generatePiece();
    }

    if (!valid) {
      return;
    }

    this.place({ remove: true });
    this.piece.x += dx;
    this.piece.y += dy;
    this.piece.shape = shape;
    this.place();
  }

  moveLeft() {
    this.move({ dx: -1 });
  }

  moveRight() {
    this.move({ dx: 1 });
  }

  moveDown() {
    this.move({ dy: 1 });
  }

  rotate() {
    this.move({ rotate: true });
  }
}
