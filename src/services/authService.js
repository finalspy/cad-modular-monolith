const bcrypt = require('bcrypt');
const User = require('../models/user');

const authService = {
    registerUser: async (username, password, email) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, email });
        return await newUser.save();
    },

    loginUser: async (username, password) => {
        const user = await User.findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
            return user;
        }
        throw new Error('Invalid username or password');
    },

    validateUser: async (username) => {
        const user = await User.findOne({ username });
        return user !== null;
    }
};

module.exports = authService;