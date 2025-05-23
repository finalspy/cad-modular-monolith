class Presentation {
  constructor(props) {
    this.id = props.id;
    this.title = props.title;
    this.content = props.content;
    this.isPublic = props.isPublic;
    this.authorId = props.authorId;
    this.username = props.username;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props) {
    // Domain validation
    if (!props.title) {
      throw new Error('Presentation title is required');
    }
    if (!props.content) {
      throw new Error('Presentation content is required');
    }
    if (!props.authorId) {
      throw new Error('Author ID is required');
    }

    return new Presentation(props);
  }

  canBeViewedBy(userId) {
    return this.isPublic || this.authorId.toString() === userId?.toString();
  }
}

module.exports = Presentation; 