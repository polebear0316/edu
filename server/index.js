const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// 프론트엔드 정적 파일 서비스 (부모 디렉토리의 파일들을 제공)
app.use(express.static(path.join(__dirname, '../')));

// 1. Register or find user
app.post('/api/register', (req, res) => {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: 'Username is required' });

    let user = db.getUserByUsername(username);
    if (!user) {
        user = db.createUser(username);
    }
    res.json({ userId: user.id, username: user.username });
});

// 2. Submit score
app.post('/api/score', (req, res) => {
    const { userId, score } = req.body;
    if (!userId || score === undefined) return res.status(400).json({ error: 'User ID and score are required' });

    const newScore = db.addScore(userId, score);
    res.json({ scoreId: newScore.id, message: 'Score saved' });
});

// 3. Get leaderboard
app.get('/api/leaderboard', (req, res) => {
    const leaderboard = db.getLeaderboard();
    res.json(leaderboard);
});

app.listen(PORT, () => {
    console.log(`Tetris Backend (JSON Store) running at http://localhost:${PORT}`);
});
