const express = require('express');
const router = express.Router();
const presentationController = require('../controllers/presentationController');
const authMiddleware = require('../middleware/authMiddleware');

// Render the "Create Presentation" page
router.get('/create', authMiddleware, (req, res) => {
    res.render('createPresentation', { session: req.session });
});

// Route to create a new presentation
router.post('/', authMiddleware, presentationController.createPresentation);

// Route to view a specific presentation
router.get('/:id', authMiddleware, presentationController.viewPresentation);

module.exports = router;