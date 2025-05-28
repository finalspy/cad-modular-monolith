const express = require('express');
const session = require('express-session');
const fileUpload = require('express-fileupload');

const bodyParser = require('body-parser');

const authRoutes = require('./routes/authRoutes');
const presentationRoutes = require('./routes/presentationRoutes');
const userRoutes = require('./routes/userRoutes');

const presentationService = require('./services/presentationService');

require('dotenv').config();


if (!process.env.SESSION_SECRET || !process.env.DATABASE_URL) {
    console.error('Missing required environment variables: SESSION_SECRET or DATABASE_URL');
    process.exit(1);
}

const app = express();
app.use(fileUpload());

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));
app.use((req, res, next) => {
    res.locals.currentRoute = req.path; // Set currentRoute to the current request path
    res.locals.session = req.session; // Make session available in all templates
    // Log the current user connected
    if (req.session && req.session.user) {
        console.log('Current User:', req.session.user);
    } else {
        console.log('No user is currently connected.');
    }
    next();
});

// Set view engine
app.set('view engine', 'ejs');
app.set('views', './views'); // Ensure the views directory is correctly set

// Routes
app.get('/', async (req, res) => {
        try {
        const userId = req.session.user ? req.session.user.id : null;
        const presentations = await presentationService.listPresentations(userId);
        console.log('Presentations:', presentations);

        res.render('index', {
            presentations,
            message: null, // Default value for message
        });
    } catch (error) {
        console.error('Error retrieving presentations for home page:', error);
        res.render('index', {
            presentations: [],
            message: 'An error occurred while retrieving presentations.',
        });
    }
});
app.use('/auth', authRoutes);
app.use('/presentations', presentationRoutes);
app.use('/users', userRoutes);

// Serve static files
app.use(express.static('public'));

module.exports = app;
