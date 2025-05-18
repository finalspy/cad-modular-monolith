const Presentation = require('../models/presentation');

const createPresentation = async (data) => {
    const { title, content, isPublic, authorId } = data;
    // Fetch the author's username
    const author = await User.findById(authorId, 'username');
    if (!author) {
        throw new Error('Author not found');
    }
    const presentation = new Presentation({ title, content, isPublic, authorId, authorUsername: author.username });
    return await presentation.save();
};

const listPresentations = async (userId) => {
    return await Presentation.find({ 
        $or: [{ isPublic: true }, { authorId: userId }] 
    });
};

const viewPresentation = async (presentationId, userId) => {
    const presentation = await Presentation.findById(presentationId);
    if (!presentation) {
        throw new Error('Presentation not found');
    }
    if (!presentation.isPublic && presentation.authorId.toString() !== userId) {
        throw new Error('You do not have permission to view this presentation');
    }
    return presentation;
};

module.exports = {
    createPresentation,
    listPresentations,
    viewPresentation,
};