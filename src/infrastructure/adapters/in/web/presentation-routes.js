const express = require('express');
const router = express.Router();
const { presentationController } = require('../../../config/di-config');
const authMiddleware = require('../../../../middleware/authMiddleware');

// Render the "Create Presentation" page
router.get('/create', authMiddleware, (req, res) => {
    res.render('createPresentation', { session: req.session });
});

// Route to list all presentations
router.get('/', (req, res) => presentationController.listPresentations(req, res));

// Route to create a new presentation
router.post('/', authMiddleware, (req, res) => presentationController.createPresentation(req, res));

// Route to view a specific presentation
router.get('/:id', (req, res) => presentationController.viewPresentation(req, res));

module.exports = router;