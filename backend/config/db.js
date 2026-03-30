/**
 * BitHub In-Memory Data Store
 * Architecture designed for easy migration to MongoDB.
 * Simply swap these collections with Mongoose models.
 */

const store = {
  users: [],     // { id, username, email, passwordHash, createdAt }
  rooms: [],     // { id, name, language, code, createdBy, createdAt }
};

module.exports = store;
