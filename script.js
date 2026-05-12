const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('next-block');
const nextCtx = nextCanvas.getContext('2d');
const scoreElement = document.getElementById('score');

const ROW = 20;
const COL = 10;
let BLOCK_SIZE = 30;
let NEXT_BLOCK_SIZE = 25;

// 무지개 색상 매핑
const COLORS = [
    null,
    '#FF0000', // Red (I)
    '#FF7F00', // Orange (J)
    '#FFFF00', // Yellow (L)
    '#00FF00', // Green (O)
    '#0000FF', // Blue (S)
    '#4B0082', // Indigo (T)
    '#8B00FF'  // Violet (Z)
];

const TETROMINOES = {
    'I': [[1, 1, 1, 1]],
    'J': [[2, 0, 0], [2, 2, 2]],
    'L': [[0, 0, 3], [3, 3, 3]],
    'O': [[4, 4], [4, 4]],
    'S': [[0, 5, 5], [5, 5, 0]],
    'T': [[0, 6, 0], [6, 6, 6]],
    'Z': [[7, 7, 0], [0, 7, 7]]
};

let board = Array.from({ length: ROW }, () => Array(COL).fill(0));
let score = 0;
let currentPiece = null;
let nextPiece = null;
let gameLoop = null;

function resize() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // 계산 로직: 화면 높이의 약 70% 정도를 게임판이 차지하게 함
    // 또는 너비의 일정 비율 중 작은 값을 선택
    const maxWidth = windowWidth * 0.9;
    const maxHeight = windowHeight * 0.6;
    
    const sizeByWidth = Math.floor(maxWidth / (COL + 5)); // 사이드 패널 포함 고려
    const sizeByHeight = Math.floor(maxHeight / ROW);
    
    BLOCK_SIZE = Math.min(sizeByWidth, sizeByHeight, 30); // 최대 30px
    if (BLOCK_SIZE < 15) BLOCK_SIZE = 15; // 최소 크기 보장
    
    NEXT_BLOCK_SIZE = Math.floor(BLOCK_SIZE * 0.8);
    
    canvas.width = BLOCK_SIZE * COL;
    canvas.height = BLOCK_SIZE * ROW;
    
    nextCanvas.width = NEXT_BLOCK_SIZE * 4;
    nextCanvas.height = NEXT_BLOCK_SIZE * 4;
    
    drawBoard();
    drawNextPiece();
}

window.addEventListener('resize', resize);

function createPiece() {
    const keys = Object.keys(TETROMINOES);
    const type = keys[Math.floor(Math.random() * keys.length)];
    const shape = TETROMINOES[type];
    return {
        type,
        shape,
        x: Math.floor(COL / 2) - Math.floor(shape[0].length / 2),
        y: 0
    };
}

function drawBlock(ctx, x, y, colorIndex, size) {
    ctx.fillStyle = COLORS[colorIndex];
    ctx.fillRect(x * size, y * size, size, size);
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1;
    ctx.strokeRect(x * size, y * size, size, size);
}

function drawBoard() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 보드 그리기
    for (let r = 0; r < ROW; r++) {
        for (let c = 0; c < COL; c++) {
            if (board[r][c]) {
                drawBlock(ctx, c, r, board[r][c], BLOCK_SIZE);
            }
        }
    }
    // 현재 블록 그리기
    if (currentPiece) {
        currentPiece.shape.forEach((row, r) => {
            row.forEach((value, c) => {
                if (value) {
                    drawBlock(ctx, currentPiece.x + c, currentPiece.y + r, value, BLOCK_SIZE);
                }
            });
        });
    }
}

function drawNextPiece() {
    if (!nextCtx) return;
    nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
    if (nextPiece) {
        const shape = nextPiece.shape;
        const offsetX = (nextCanvas.width / NEXT_BLOCK_SIZE - shape[0].length) / 2;
        const offsetY = (nextCanvas.height / NEXT_BLOCK_SIZE - shape.length) / 2;
        shape.forEach((row, r) => {
            row.forEach((value, c) => {
                if (value) {
                    drawBlock(nextCtx, offsetX + c, offsetY + r, value, NEXT_BLOCK_SIZE);
                }
            });
        });
    }
}

function collide(piece, x, y, shape = piece.shape) {
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c]) {
                const newX = piece.x + x + c;
                const newY = piece.y + y + r;
                if (newX < 0 || newX >= COL || newY >= ROW || (newY >= 0 && board[newY][newX])) {
                    return true;
                }
            }
        }
    }
    return false;
}

function merge() {
    currentPiece.shape.forEach((row, r) => {
        row.forEach((value, c) => {
            if (value) {
                if (currentPiece.y + r >= 0) {
                    board[currentPiece.y + r][currentPiece.x + c] = value;
                }
            }
        });
    });
}

function clearLines() {
    let linesCleared = 0;
    for (let r = ROW - 1; r >= 0; r--) {
        if (board[r].every(cell => cell !== 0)) {
            board.splice(r, 1);
            board.unshift(Array(COL).fill(0));
            linesCleared++;
            r++; // 다시 검사
        }
    }
    if (linesCleared > 0) {
        score += linesCleared * 100;
        scoreElement.innerText = score;
    }
}

function rotate() {
    const shape = currentPiece.shape;
    const newShape = shape[0].map((_, i) => shape.map(row => row[i]).reverse());
    if (!collide(currentPiece, 0, 0, newShape)) {
        currentPiece.shape = newShape;
    }
    drawBoard();
}

function move(dir) {
    if (!collide(currentPiece, dir, 0)) {
        currentPiece.x += dir;
    }
    drawBoard();
}

function drop() {
    if (!collide(currentPiece, 0, 1)) {
        currentPiece.y++;
    } else {
        merge();
        clearLines();
        currentPiece = nextPiece;
        nextPiece = createPiece();
        drawNextPiece();
        if (collide(currentPiece, 0, 0)) {
            alert('게임 오버! 점수: ' + score);
            board = Array.from({ length: ROW }, () => Array(COL).fill(0));
            score = 0;
            scoreElement.innerText = score;
        }
    }
    drawBoard();
}

function hardDrop() {
    while (!collide(currentPiece, 0, 1)) {
        currentPiece.y++;
    }
    drop();
}

// 이벤트 리스너 - Touch/Click 통합 대응
const addBtnListener = (id, action) => {
    const btn = document.getElementById(id);
    btn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        action();
    });
};

addBtnListener('btn-left', () => move(-1));
addBtnListener('btn-right', () => move(1));
addBtnListener('btn-down', drop);
addBtnListener('btn-rotate', rotate);
addBtnListener('btn-drop', hardDrop);

// 키보드 지원
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') move(-1);
    if (e.key === 'ArrowRight') move(1);
    if (e.key === 'ArrowDown') drop();
    if (e.key === 'ArrowUp') rotate();
    if (e.key === ' ') {
        e.preventDefault(); // Space scrolling 방지
        hardDrop();
    }
});

// 초기화
function start() {
    resize();
    currentPiece = createPiece();
    nextPiece = createPiece();
    drawNextPiece();
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(drop, 1000);
    drawBoard();
}

start();
