const mongoose = require('mongoose');

const presentationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    username: {
        type: String,
        required: true
    },
}, { timestamps: true });

const Presentation = mongoose.model('Presentation', presentationSchema);

module.exports = Presentation;