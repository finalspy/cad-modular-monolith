const mongoose = require('mongoose');

// On garde temporairement l'ancien modèle User jusqu'à ce qu'on refactore la partie User
const UserModel = mongoose.model('User');

class MongoUserRepository {
    async findById(id) {
        try {
            return await UserModel.findById(id).select('username');
        } catch (error) {
            console.error('Error in UserRepository findById:', error);
            throw error;
        }
    }
}

module.exports = MongoUserRepository; 