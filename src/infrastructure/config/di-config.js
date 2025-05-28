const PresentationService = require('../../domain/presentations/services/presentation-service');
const MongoPresentationRepository = require('../adapters/out/persistence/mongo-presentation-repository');
const PresentationController = require('../adapters/in/web/presentation-controller');
const UserRepository = require('../adapters/out/persistence/mongo-user-repository'); // À créer plus tard

// Configuration des repositories
const presentationRepository = new MongoPresentationRepository();
const userRepository = new UserRepository();

// Configuration des services
const presentationService = new PresentationService(
    presentationRepository,
    userRepository
);

// Configuration des controllers
const presentationController = new PresentationController(presentationService);

module.exports = {
    presentationController,
    presentationService
}; 