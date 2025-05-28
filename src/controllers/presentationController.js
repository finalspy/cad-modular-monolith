// const Presentation = require('../models/presentation');
// const presentationService = require('../services/presentationService');

// // Create a new presentation
// exports.createPresentation = async (req, res) => {
//     const { title } = req.body;
//     const isPublic = req.body.isPublic === 'on'; // Convert "on" to true, otherwise false
//     const authorId = req.session.user ? req.session.user.id : null; // Use session to get user ID

//     if (!authorId) {
//         return res.status(401).json({ message: 'Unauthorized: Please log in to create a presentation.' });
//     }

//     try {
//         let content = '';

//         // Check if a file was uploaded
//         if (req.files && req.files.htmlFile) {
//             const htmlFile = req.files.htmlFile;

//             // Ensure the file is an HTML file
//             if (htmlFile.mimetype !== 'text/html') {
//                 return res.status(400).json({ message: 'Uploaded file must be an HTML file.' });
//             }

//             // Read the file content as a string
//             content = htmlFile.data.toString('utf-8');

//             // Validate that the content contains <section> tags
//             if (!/<section>.*<\/section>/s.test(content)) {
//                 return res.status(400).json({ message: 'HTML file must contain <section> tags for Reveal.js slides.' });
//             }
//         } else {
//             return res.status(400).json({ message: 'No HTML file uploaded.' });
//         }

//         // Create the presentation
//         const newPresentation = await presentationService.createPresentation({ title, content, isPublic, authorId });
//         res.redirect('/'); // Redirect to presentations list after creation
//     } catch (error) {
//         console.error('Error creating presentation:', error);
//         res.status(500).json({ message: 'Error creating presentation', error });
//     }
// };

// // List all presentations
// exports.listPresentations = async (req, res) => {
//     try {
//         const presentations = await presentationService.listPresentations();
//         // Render the EJS view with presentations or a message if none exist
//         res.render('listPresentations', {
//             presentations: presentations.length > 0 ? presentations : null,
//             message: presentations.length === 0 ? 'No presentations to display.' : null,
//         });
//     } catch (error) {
//         console.error('Error retrieving presentations:', error); // Log the error details
//         res.status(500).render('listPresentations', { presentations: null, message: 'An error occurred while retrieving presentations.' });
//     }
// };

// // View a specific presentation
// exports.viewPresentation = async (req, res) => {
//     const { id } = req.params;
//     const userId = req.session.user ? req.session.user.id : null;

//     try {
//         const presentation = await presentationService.viewPresentation(id, userId);
//         if (!presentation) {
//             return res.status(404).json({ message: 'Presentation not found' });
//         }
//         if (!presentation.isPublic && (!userId || presentation.authorId.toString() !== userId)) {
//             throw new Error('Unauthorized access to this presentation');
//         }
//         res.render('reveal', { content: presentation.content, title: presentation.title });
//     } catch (error) {
//         console.error('Error retrieving presentation:', error); // Log the error details
//         res.status(500).json({ message: 'Error retrieving presentation', error });
//     }
// };