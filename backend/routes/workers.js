const express = require('express');
const router = express.Router();
const { getDb } = require('../config/db');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

// Get all workers
router.get('/', authenticate, authorizeAdmin, async (req, res) => {
    try {
        const db = await getDb();
        const workers = await db.all('SELECT * FROM workers ORDER BY name ASC');
        res.json(workers);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching workers' });
    }
});

// Add a worker
router.post('/', authenticate, authorizeAdmin, async (req, res) => {
    const { name, contact, specialization } = req.body;
    try {
        const db = await getDb();
        await db.run(
            'INSERT INTO workers (name, contact, specialization) VALUES (?, ?, ?)',
            [name, contact, specialization]
        );
        res.status(201).json({ message: 'Worker added successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error adding worker' });
    }
});

// Update a worker
router.put('/:id', authenticate, authorizeAdmin, async (req, res) => {
    const { name, contact, specialization, status } = req.body;
    try {
        const db = await getDb();
        await db.run(
            'UPDATE workers SET name = ?, contact = ?, specialization = ?, status = ? WHERE id = ?',
            [name, contact, specialization, status, req.params.id]
        );
        res.json({ message: 'Worker updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating worker' });
    }
});

// Delete a worker
router.delete('/:id', authenticate, authorizeAdmin, async (req, res) => {
    try {
        const db = await getDb();
        await db.run('DELETE FROM workers WHERE id = ?', [req.params.id]);
        res.json({ message: 'Worker deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting worker' });
    }
});

module.exports = router;
