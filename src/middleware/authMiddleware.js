module.exports = (req, res, next) => {
    if (req.session && req.session.user) {
        next(); // User is authenticated, proceed to the next middleware
    } else {
        res.redirect('/auth/login'); // Redirect to login if not authenticated
    }
};