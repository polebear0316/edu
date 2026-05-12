/**
 * Tetris Core Logic Test Suite
 * This script tests the mathematical logic of the game independently of the UI.
 */

const TEST_CONFIG = {
    ROW: 20,
    COL: 10
};

// Mock board
let board = Array.from({ length: TEST_CONFIG.ROW }, () => Array(TEST_CONFIG.COL).fill(0));

function resetBoard() {
    board = Array.from({ length: TEST_CONFIG.ROW }, () => Array(TEST_CONFIG.COL).fill(0));
}

// Logic to test (Copied from script.js for independent testing)
function collide(piece, x, y, shape = piece.shape) {
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c]) {
                const newX = piece.x + x + c;
                const newY = piece.y + y + r;
                if (newX < 0 || newX >= TEST_CONFIG.COL || newY >= TEST_CONFIG.ROW || (newY >= 0 && board[newY][newX])) {
                    return true;
                }
            }
        }
    }
    return false;
}

function rotateShape(shape) {
    return shape[0].map((_, i) => shape.map(row => row[i]).reverse());
}

function clearLinesLogic(testBoard) {
    let linesCleared = 0;
    for (let r = testBoard.length - 1; r >= 0; r--) {
        if (testBoard[r].every(cell => cell !== 0)) {
            testBoard.splice(r, 1);
            testBoard.unshift(Array(TEST_CONFIG.COL).fill(0));
            linesCleared++;
            r++;
        }
    }
    return linesCleared;
}

// Simple test runner
function assert(condition, message) {
    if (condition) {
        console.log('✅ PASS: ' + message);
        return true;
    } else {
        console.error('❌ FAIL: ' + message);
        return false;
    }
}

function runTests() {
    console.log('--- Starting Tetris Logic Tests ---');
    let totalPass = 0;
    let totalTests = 0;

    const test = (msg, fn) => {
        totalTests++;
        if (fn()) totalPass++;
    };

    // Test 1: Wall Collision
    test('Should detect left wall collision', () => {
        const piece = { x: 0, y: 5, shape: [[1, 1], [1, 1]] };
        return assert(collide(piece, -1, 0), 'Collision at x < 0 detected');
    });

    test('Should detect right wall collision', () => {
        const piece = { x: 8, y: 5, shape: [[1, 1], [1, 1]] };
        return assert(collide(piece, 1, 0), 'Collision at x >= COL detected');
    });

    // Test 2: Floor Collision
    test('Should detect floor collision', () => {
        const piece = { x: 5, y: 18, shape: [[1, 1], [1, 1]] };
        return assert(collide(piece, 0, 1), 'Collision at y >= ROW detected');
    });

    // Test 3: Rotation logic
    test('Should rotate I-piece correctly', () => {
        const shape = [[1, 1, 1, 1]];
        const rotated = rotateShape(shape);
        return assert(rotated.length === 4 && rotated[0][0] === 1, 'Horizontal I becomes vertical');
    });

    // Test 4: Line Clearing
    test('Should clear a full line', () => {
        resetBoard();
        const fullLine = Array(TEST_CONFIG.COL).fill(1);
        board[19] = [...fullLine];
        const cleared = clearLinesLogic(board);
        return assert(cleared === 1 && board[19].every(c => c === 0), 'Full line removed and replaced with empty');
    });

    console.log(`\n--- Tests Finished: ${totalPass}/${totalTests} Passed ---`);
}

// Run in browser console if loaded
if (typeof window !== 'undefined') {
    window.runTetrisTests = runTests;
} else {
    runTests();
}
