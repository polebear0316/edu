const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.json');

// Initialize database if it doesn't exist
if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({ users: [], scores: [] }, null, 2));
}

const db = {
    read: () => {
        const data = fs.readFileSync(dbPath, 'utf8');
        return JSON.parse(data);
    },
    write: (data) => {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    },
    
    // User functions
    getUserByUsername: (username) => {
        const data = db.read();
        return data.users.find(u => u.username === username);
    },
    createUser: (username) => {
        const data = db.read();
        const newUser = {
            id: data.users.length + 1,
            username,
            created_at: new Date().toISOString()
        };
        data.users.push(newUser);
        db.write(data);
        return newUser;
    },
    
    // Score functions
    addScore: (userId, score) => {
        const data = db.read();
        const newScore = {
            id: data.scores.length + 1,
            user_id: userId,
            score,
            achieved_at: new Date().toISOString()
        };
        data.scores.push(newScore);
        db.write(data);
        return newScore;
    },
    getLeaderboard: (limit = 10) => {
        const data = db.read();
        // Get max score for each user
        const userMaxScores = {};
        data.scores.forEach(s => {
            if (!userMaxScores[s.user_id] || s.score > userMaxScores[s.user_id]) {
                userMaxScores[s.user_id] = s.score;
            }
        });
        
        // Map to username and sort
        const leaderboard = Object.keys(userMaxScores).map(userId => {
            const user = data.users.find(u => u.id === parseInt(userId));
            return {
                username: user ? user.username : 'Unknown',
                top_score: userMaxScores[userId]
            };
        });
        
        return leaderboard.sort((a, b) => b.top_score - a.top_score).slice(0, limit);
    }
};

module.exports = db;
