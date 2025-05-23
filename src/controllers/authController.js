const authService = require('../services/authService');
const User = require('../models/user');

// Register a new user
exports.registerUser = async (req, res) => {
    const { username, password, email } = req.body;

    try {
        // Check if the username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).render('register', { error: 'Username or email already exists' });
        }

        await authService.registerUser(username, password, email);
        res.redirect('/');
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).render('register', { error: 'An unexpected error occurred. Please try again.' });
    }
};

// Login user
exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await authService.loginUser(username, password);
        req.session.user = { id: user._id, username: user.username };
        res.redirect('/');
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

exports.logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error during logout:', err);
            return res.status(500).render('login', { error: 'An error occurred while logging out. Please try again.' });
        }
        res.redirect('/');
    });
};