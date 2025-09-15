const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Get all medications for a user (simplified - no auth for MVP)
router.get('/', async (req, res) => {
  try {
    const userId = req.query.user_id || 1; // Simplified for MVP
    const medications = await db.all(
      'SELECT * FROM medications WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    res.json({ success: true, data: medications });
  } catch (error) {
    console.error('Error fetching medications:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch medications' });
  }
});

// Add a new medication
router.post('/', async (req, res) => {
  try {
    const { name, dosage, frequency, notes } = req.body;
    const userId = req.body.user_id || 1; // Simplified for MVP
    
    if (!name) {
      return res.status(400).json({ 
        success: false, 
        error: 'Medication name is required' 
      });
    }

    const result = await db.run(
      'INSERT INTO medications (user_id, name, dosage, frequency, notes) VALUES (?, ?, ?, ?, ?)',
      [userId, name, dosage, frequency, notes]
    );

    const newMedication = await db.get(
      'SELECT * FROM medications WHERE id = ?',
      [result.id]
    );

    res.status(201).json({ success: true, data: newMedication });
  } catch (error) {
    console.error('Error creating medication:', error);
    res.status(500).json({ success: false, error: 'Failed to create medication' });
  }
});

// Log a medication dose
router.post('/:id/log', async (req, res) => {
  try {
    const medicationId = req.params.id;
    const { taken_at, notes } = req.body;
    const userId = req.body.user_id || 1; // Simplified for MVP
    
    const takenAtTime = taken_at || new Date().toISOString();

    const result = await db.run(
      'INSERT INTO medication_logs (user_id, medication_id, taken_at, notes) VALUES (?, ?, ?, ?)',
      [userId, medicationId, takenAtTime, notes]
    );

    const newLog = await db.get(
      `SELECT ml.*, m.name as medication_name 
       FROM medication_logs ml 
       JOIN medications m ON ml.medication_id = m.id 
       WHERE ml.id = ?`,
      [result.id]
    );

    res.status(201).json({ success: true, data: newLog });
  } catch (error) {
    console.error('Error logging medication:', error);
    res.status(500).json({ success: false, error: 'Failed to log medication' });
  }
});

// Get medication logs (history)
router.get('/logs', async (req, res) => {
  try {
    const userId = req.query.user_id || 1; // Simplified for MVP
    const limit = req.query.limit || 50;
    
    const logs = await db.all(
      `SELECT ml.*, m.name as medication_name, m.dosage 
       FROM medication_logs ml 
       JOIN medications m ON ml.medication_id = m.id 
       WHERE ml.user_id = ? 
       ORDER BY ml.taken_at DESC 
       LIMIT ?`,
      [userId, limit]
    );

    res.json({ success: true, data: logs });
  } catch (error) {
    console.error('Error fetching medication logs:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch medication logs' });
  }
});

// Update medication
router.put('/:id', async (req, res) => {
  try {
    const medicationId = req.params.id;
    const { name, dosage, frequency, notes } = req.body;
    const userId = req.body.user_id || 1; // Simplified for MVP

    if (!name) {
      return res.status(400).json({ 
        success: false, 
        error: 'Medication name is required' 
      });
    }

    await db.run(
      'UPDATE medications SET name = ?, dosage = ?, frequency = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
      [name, dosage, frequency, notes, medicationId, userId]
    );

    const updatedMedication = await db.get(
      'SELECT * FROM medications WHERE id = ? AND user_id = ?',
      [medicationId, userId]
    );

    if (!updatedMedication) {
      return res.status(404).json({ success: false, error: 'Medication not found' });
    }

    res.json({ success: true, data: updatedMedication });
  } catch (error) {
    console.error('Error updating medication:', error);
    res.status(500).json({ success: false, error: 'Failed to update medication' });
  }
});

// Delete medication
router.delete('/:id', async (req, res) => {
  try {
    const medicationId = req.params.id;
    const userId = req.query.user_id || 1; // Simplified for MVP

    const result = await db.run(
      'DELETE FROM medications WHERE id = ? AND user_id = ?',
      [medicationId, userId]
    );

    if (result.changes === 0) {
      return res.status(404).json({ success: false, error: 'Medication not found' });
    }

    res.json({ success: true, message: 'Medication deleted successfully' });
  } catch (error) {
    console.error('Error deleting medication:', error);
    res.status(500).json({ success: false, error: 'Failed to delete medication' });
  }
});

module.exports = router;