const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route to get user information
router.get('/:id', userController.getUser);

// Route to update user information
router.put('/:id', userController.updateUser);

module.exports = router;