const express = require('express');
const router = express.Router();
const Table = require('../models/Table');
const { protect } = require('../middleware/authMiddleware');

// Get unique table capacities
router.get('/capacities', protect, async (req, res) => {
  try {
    const tables = await Table.find().select('capacity -_id');
    const capacities = [...new Set(tables.map(t => t.capacity))].sort((a, b) => a - b);
    res.json(capacities);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch table capacities' });
  }
});

module.exports = router;
