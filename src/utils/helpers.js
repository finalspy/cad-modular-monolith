module.exports = {
    validatePresentationContent: (content) => {
        if (!content || typeof content !== 'string') {
            throw new Error('Invalid presentation content. It must be a non-empty string.');
        }
        // Additional validation logic can be added here
    },

    validateUserInput: (username, password, email) => {
        if (!username || !password || !email) {
            throw new Error('All fields are required.');
        }
        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters long.');
        }
        // Additional validation logic can be added here
    },

    isPublicPresentation: (presentation) => {
        return presentation.isPublic === true;
    },

    isOwner: (userId, presentation) => {
        return presentation.authorId === userId;
    }
};