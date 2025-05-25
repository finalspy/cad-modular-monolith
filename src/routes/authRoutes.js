const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Render the login page
router.get('/login', (req, res) => {
    res.render('login');
});

// Render the register page
router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

module.exports = router;