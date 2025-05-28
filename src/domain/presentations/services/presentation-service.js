const Presentation = require('../entities/presentation');

class PresentationService {
    constructor(presentationRepository, userRepository) {
        this.presentationRepository = presentationRepository;
        this.userRepository = userRepository;
    }

    async createPresentation(data) {
        const { title, content, isPublic, authorId } = data;
        const author = await this.userRepository.findById(authorId);
        
        if (!author) {
            throw new Error('Author not found');
        }

        const presentation = Presentation.create(
            title, 
            content, 
            isPublic, 
            authorId, 
            author.username
        );

        return await this.presentationRepository.save(presentation);
    }

    async listPresentations(userId) {
        return await this.presentationRepository.findAll({ 
            $or: [{ isPublic: true }, { authorId: userId }] 
        });
    }

    async viewPresentation(presentationId, userId) {
        const presentation = await this.presentationRepository.findById(presentationId);
        
        if (!presentation) {
            throw new Error('Presentation not found');
        }

        if (!presentation.isPublic && presentation.authorId.toString() !== userId) {
            throw new Error('You do not have permission to view this presentation');
        }

        return presentation;
    }
}

module.exports = PresentationService; 