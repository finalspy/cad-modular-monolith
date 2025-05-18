const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new user
exports.registerUser = async (req, res) => {
    const { username, password, email } = req.body;

    try {
        // Check if the username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).render('register', { error: 'Username or email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, email });
        await newUser.save();
        // Redirect to the home page after successful registration
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
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        //const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        //res.status(200).json({ token });
        // Store user in session
        req.session.user = { id: user._id, username: user.username };
        res.redirect('/'); // Redirect to home page after successful login
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};

exports.logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error during logout:', err);
            return res.status(500).render('login', { error: 'An error occurred while logging out. Please try again.' });
        }
        res.redirect('/'); // Redirect to the login page after logout
    });
};