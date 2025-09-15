const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Simple user endpoint for MVP (no authentication)
router.get('/profile', async (req, res) => {
  try {
    // For MVP, return a default user
    const user = {
      id: 1,
      email: 'demo@example.com',
      created_at: new Date().toISOString()
    };
    
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch user' });
  }
});

// Get user stats/dashboard data
router.get('/stats', async (req, res) => {
  try {
    const userId = req.query.user_id || 1; // Simplified for MVP
    
    // Get medication count
    const medicationCount = await db.get(
      'SELECT COUNT(*) as count FROM medications WHERE user_id = ?',
      [userId]
    );

    // Get logs from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentLogs = await db.get(
      'SELECT COUNT(*) as count FROM medication_logs WHERE user_id = ? AND taken_at >= ?',
      [userId, sevenDaysAgo.toISOString()]
    );

    // Get today's logs
    const today = new Date().toDateString();
    const todayLogs = await db.get(
      `SELECT COUNT(*) as count FROM medication_logs 
       WHERE user_id = ? AND date(taken_at) = date('now')`,
      [userId]
    );

    const stats = {
      total_medications: medicationCount.count,
      logs_last_7_days: recentLogs.count,
      logs_today: todayLogs.count,
      streak_days: 0 // TODO: Implement streak calculation
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch user stats' });
  }
});

module.exports = router;