const PresentationRepositoryPort = require('../../../../domain/presentations/ports/out/presentation-repository-port');
const PresentationModel = require('./presentation-model');  // Maintenant le chemin est correct

class MongoPresentationRepository extends PresentationRepositoryPort {
    async save(presentation) {
        const presentationModel = new PresentationModel({
            title: presentation.title,
            content: presentation.content,
            isPublic: presentation.isPublic,
            authorId: presentation.authorId,
            username: presentation.username
        });
        return await presentationModel.save();
    }

    async findById(id) {
        return await PresentationModel.findById(id);
    }

    async findAll(criteria) {
        return await PresentationModel.find(criteria);
    }
}

module.exports = MongoPresentationRepository; 