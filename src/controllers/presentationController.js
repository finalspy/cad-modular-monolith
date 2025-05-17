const Presentation = require('../models/presentation');
const presentationService = require('../services/presentationService');

// Create a new presentation
exports.createPresentation = async (req, res) => {
    const { title, content, isPublic } = req.body;
    const authorId = req.user.id; // Assuming user ID is stored in req.user

    try {
        const newPresentation = await presentationService.createPresentation({ title, content, isPublic, authorId });
        res.status(201).json(newPresentation);
    } catch (error) {
        res.status(500).json({ message: 'Error creating presentation', error });
    }
};

// List all presentations
exports.listPresentations = async (req, res) => {
    try {
        const presentations = await presentationService.getAllPresentations();
        res.status(200).json(presentations);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving presentations', error });
    }
};

// View a specific presentation
exports.viewPresentation = async (req, res) => {
    const { id } = req.params;

    try {
        const presentation = await presentationService.getPresentationById(id);
        if (!presentation) {
            return res.status(404).json({ message: 'Presentation not found' });
        }
        res.status(200).json(presentation);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving presentation', error });
    }
};