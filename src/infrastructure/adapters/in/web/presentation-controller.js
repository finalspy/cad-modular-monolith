class PresentationController {
    constructor(presentationService) {
        this.presentationService = presentationService;
    }

    async createPresentation(req, res) {
        const { title } = req.body;
        const isPublic = req.body.isPublic === 'on';
        const authorId = req.session.user?.id;

        if (!authorId) {
            return res.status(401).json({ message: 'Unauthorized: Please log in to create a presentation.' });
        }

        try {
            let content = '';
            if (req.files?.htmlFile) {
                const htmlFile = req.files.htmlFile;
                if (htmlFile.mimetype !== 'text/html') {
                    return res.status(400).json({ message: 'Uploaded file must be an HTML file.' });
                }
                content = htmlFile.data.toString('utf-8');
                if (!/<section>.*<\/section>/s.test(content)) {
                    return res.status(400).json({ message: 'HTML file must contain <section> tags for Reveal.js slides.' });
                }
            } else {
                return res.status(400).json({ message: 'No HTML file uploaded.' });
            }

            await this.presentationService.createPresentation({ title, content, isPublic, authorId });
            res.redirect('/');
        } catch (error) {
            console.error('Error creating presentation:', error);
            res.status(500).json({ message: 'Error creating presentation', error });
        }
    }

    async listPresentations(req, res) {
        try {
            const userId = req.session.user ? req.session.user.id : null;
            const presentations = await this.presentationService.listPresentations(userId);
            res.render('listPresentations', {
                presentations: presentations.length > 0 ? presentations : null,
                message: presentations.length === 0 ? 'No presentations to display.' : null,
            });
        } catch (error) {
            console.error('Error retrieving presentations:', error);
            res.status(500).render('listPresentations', {
                presentations: null,
                message: 'An error occurred while retrieving presentations.'
            });
        }
    }

    async viewPresentation(req, res) {
        const { id } = req.params;
        const userId = req.session.user ? req.session.user.id : null;

        try {
            const presentation = await this.presentationService.viewPresentation(id, userId);
            if (!presentation) {
                return res.status(404).json({ message: 'Presentation not found' });
            }
            res.render('reveal', { 
                content: presentation.content, 
                title: presentation.title 
            });
        } catch (error) {
            console.error('Error retrieving presentation:', error);
            if (error.message === 'You do not have permission to view this presentation') {
                return res.status(403).json({ message: error.message });
            }
            res.status(500).json({ message: 'Error retrieving presentation', error: error.message });
        }
    }
}

module.exports = PresentationController; 