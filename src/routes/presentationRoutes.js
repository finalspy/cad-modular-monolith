const express = require('express');
const router = express.Router();
const presentationController = require('../controllers/presentationController');

// Route to create a new presentation
router.post('/presentations', presentationController.createPresentation);

// Route to list all presentations
router.get('/presentations', presentationController.listPresentations);

// Route to view a specific presentation
router.get('/presentations/:id', presentationController.viewPresentation);

module.exports = router;