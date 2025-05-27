class Presentation {
    constructor(id, title, content, isPublic, authorId, username) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.isPublic = isPublic;
        this.authorId = authorId;
        this.username = username;
    }

    static create(title, content, isPublic, authorId, username) {
        return new Presentation(null, title, content, isPublic, authorId, username);
    }
}

module.exports = Presentation; 