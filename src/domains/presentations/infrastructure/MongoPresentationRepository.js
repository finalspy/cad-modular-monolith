const PresentationRepository = require('../domain/PresentationRepository');
const Presentation = require('../domain/Presentation');
const MongoPresentation = require('../../../models/presentation'); // Utiliser le modèle existant pour la transition

class MongoPresentationRepository extends PresentationRepository {
  async save(presentation) {
    const mongoPres = await MongoPresentation.create({
      title: presentation.title,
      content: presentation.content,
      isPublic: presentation.isPublic,
      authorId: presentation.authorId,
      username: presentation.username
    });

    return new Presentation({
      id: mongoPres._id.toString(),
      ...mongoPres.toObject()
    });
  }

  async findById(id) {
    const presentation = await MongoPresentation.findById(id);
    if (!presentation) return null;

    return new Presentation({
      id: presentation._id.toString(),
      ...presentation.toObject()
    });
  }

  // ... autres méthodes
}

module.exports = MongoPresentationRepository;