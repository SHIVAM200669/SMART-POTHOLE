const express = require('express');
const multer = require('multer');
const path = require('path');
const { getDb } = require('../config/db');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');
const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');

const router = express.Router();

// Multer config for local uploads
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// Gemini AI Validation
const validatePotholeAI = async (filePath, mimeType) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return "Pending Validation (Add GEMINI_API_KEY to .env)";
        }
        
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const imageBuffer = fs.readFileSync(filePath);
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                'You are a pothole validation system. Analyze this image. Does this image clearly show a real pothole on a road? Reply exactly with either "Valid Pothole" or "Invalid/Fake" followed by a space and then your confidence percentage in parentheses (e.g., "(85% confidence)").',
                {
                    inlineData: {
                        data: imageBuffer.toString("base64"),
                        mimeType: mimeType
                    }
                }
            ]
        });
        
        return response.text.trim();
    } catch (err) {
        console.error("AI Validation Error:", err);
        return "Validation Failed";
    }
};

// 1. Create Complaint (User)
router.post('/', authenticate, upload.single('image'), async (req, res) => {
    try {
        const { latitude, longitude, description } = req.body;
        const userId = req.user.id;
        const db = await getDb();
        
        let imageUrl = '';
        let aiStatus = 'Pending Validation (No Image)';
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
            aiStatus = await validatePotholeAI(req.file.path, req.file.mimetype);
        }

        // If the AI explicitly rejected it, block the submission
        if (aiStatus.includes('Invalid/Fake')) {
            if (req.file) fs.unlinkSync(req.file.path); // Delete the fake image
            return res.status(400).json({ message: `Image Rejected: ${aiStatus}` });
        }

        const result = await db.run(
            'INSERT INTO complaints (user_id, image_url, latitude, longitude, description, ai_status) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, imageUrl, latitude, longitude, description, aiStatus]
        );

        res.status(201).json({ message: 'Complaint submitted successfully', complaintId: result.lastID, aiStatus });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// 2. Get Complaints (Admin sees all, User sees own)
router.get('/', authenticate, async (req, res) => {
    try {
        const db = await getDb();
        let query = 'SELECT c.*, u.name as user_name, u.email as user_email FROM complaints c JOIN users u ON c.user_id = u.id WHERE c.deleted_at IS NULL ORDER BY c.created_at DESC';
        let params = [];

        if (req.user.role !== 'admin') {
            query = 'SELECT * FROM complaints WHERE user_id = ? AND deleted_at IS NULL ORDER BY created_at DESC';
            params = [req.user.id];
        }

        const complaints = await db.all(query, params);
        res.json(complaints);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// 3. Update Complaint (Admin updates status/workers, User updates description)
router.put('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, workers_assigned, estimated_completion_time, description } = req.body;
        const db = await getDb();

        const complaint = await db.get('SELECT * FROM complaints WHERE id = ?', [id]);
        if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

        if (req.user.role === 'admin') {
            const finalStatus = status !== undefined ? status : complaint.status;
            const finalWorkers = workers_assigned !== undefined ? workers_assigned : complaint.workers_assigned;
            const finalEstimate = estimated_completion_time !== undefined ? estimated_completion_time : complaint.estimated_completion_time;
            const completedAt = finalStatus === 'Completed' ? new Date().toISOString() : complaint.completed_at;

            await db.run(
                'UPDATE complaints SET status = ?, workers_assigned = ?, estimated_completion_time = ?, completed_at = ? WHERE id = ?',
                [finalStatus, finalWorkers, finalEstimate, completedAt, id]
            );
        } else {
            // Users can only edit their own pending reports
            if (complaint.user_id !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });
            if (complaint.status !== 'Pending') return res.status(400).json({ message: 'Can only edit pending reports' });

            await db.run('UPDATE complaints SET description = ? WHERE id = ?', [description, id]);
        }

        res.json({ message: 'Complaint updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// 4. Delete Complaint (Admin or Owner)
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const db = await getDb();

        const complaint = await db.get('SELECT * FROM complaints WHERE id = ?', [id]);
        if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

        if (req.user.role !== 'admin' && complaint.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Soft delete
        await db.run('UPDATE complaints SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?', [id]);

        res.json({ message: 'Complaint deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// 5. Get Stats (Admin sees global, User sees own)
router.get('/stats', authenticate, async (req, res) => {
    try {
        const db = await getDb();
        let query = `
            SELECT 
                COUNT(*) as total, 
                SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending, 
                SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed,
                AVG(CASE WHEN status = 'Completed' THEN (julianday(completed_at) - julianday(created_at)) ELSE NULL END) as avg_resolution,
                AVG(CAST(estimated_completion_time AS FLOAT)) as avg_estimated
            FROM complaints
            WHERE deleted_at IS NULL
        `;
        let params = [];

        if (req.user.role !== 'admin') {
            query = `
                SELECT 
                    COUNT(*) as total, 
                    SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending, 
                    SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed,
                    AVG(CASE WHEN status = 'Completed' THEN (julianday(completed_at) - julianday(created_at)) ELSE NULL END) as avg_resolution,
                    AVG(CAST(estimated_completion_time AS FLOAT)) as avg_estimated
                FROM complaints
                WHERE deleted_at IS NULL AND user_id = ?
            `;
            params = [req.user.id];
        }

        const stats = await db.get(query, params);
        
        let totalUsers = 0;
        if (req.user.role === 'admin') {
            const userCount = await db.get('SELECT COUNT(*) as count FROM users WHERE role = "user"');
            totalUsers = userCount.count;
        }

        res.json({
            total: stats.total || 0,
            pending: stats.pending || 0,
            completed: stats.completed || 0,
            avgResolution: stats.avg_resolution ? stats.avg_resolution.toFixed(1) : 'N/A',
            avgEstimated: stats.avg_estimated ? stats.avg_estimated.toFixed(1) : 'N/A',
            totalUsers
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
