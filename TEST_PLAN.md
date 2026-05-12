# Tetris Game Test Plan

This document outlines the testing strategy for the Tetris web application, focusing on mobile responsiveness, core game logic, and the newly added main menu.

## 1. Functional Testing (Core Logic)
Verify that the fundamental game mechanics work correctly.

- [ ] **Tetromino Generation**: Confirm pieces are generated randomly and move correctly.
- [ ] **Movement**:
    - [ ] Left/Right arrows and buttons move the piece by 1 column.
    - [ ] Down arrow/button moves the piece down by 1 row.
    - [ ] Space/Drop button drops the piece to the bottom immediately.
- [ ] **Rotation**:
    - [ ] Up arrow/Rotate button rotates the piece 90 degrees clockwise.
    - [ ] Pieces do not rotate into walls or other blocks (Collision check).
- [ ] **Collision Detection**:
    - [ ] Pieces stop when they hit the bottom.
    - [ ] Pieces stop when they hit other landed blocks.
- [ ] **Line Clearing**:
    - [ ] Complete horizontal lines are removed.
    - [ ] Score increases by 100 per cleared line.
- [ ] **Game Over**:
    - [ ] Game ends when a new piece cannot be placed.
    - [ ] Alert shows the final score.
    - [ ] Game returns to the main menu.

## 2. Mobile & Responsive Testing
Verify that the game is playable and looks good on various screen sizes.

- [ ] **Dynamic Sizing**:
    - [ ] Resizing the browser window updates the board size.
    - [ ] On small screens (< 500px), the layout stays within the viewport.
- [ ] **D-pad Controls**:
    - [ ] Rotate button is centered at the top.
    - [ ] Left, Down, Right buttons are in a row.
    - [ ] Drop button is at the bottom and easy to press.
    - [ ] Buttons have visual feedback when touched/clicked.
- [ ] **Touch Interaction**:
    - [ ] Buttons respond instantly to `pointerdown`.
    - [ ] No unwanted zooming or scrolling occurs during gameplay.

## 3. UI/UX Testing
- [ ] **Main Menu**:
    - [ ] Instructions are clear and readable.
    - [ ] 'Start' button successfully hides the menu and starts the game.
- [ ] **Score Display**:
    - [ ] Score updates correctly in the side panel.
- [ ] **Next Piece**:
    - [ ] The upcoming piece is correctly shown in the 'NEXT' box.

## 4. Automated Verification (Test Suite)
Run `test-runner.html` to verify:
- Collision logic
- Rotation logic
- Line clearing logic
