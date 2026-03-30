const { v4: uuidv4 } = require('uuid');

/**
 * User Model
 * In-memory implementation — mirrors a MongoDB document schema.
 */
class User {
  constructor({ username, email, passwordHash }) {
    this.id = uuidv4();
    this.username = username;
    this.email = email;
    this.passwordHash = passwordHash;
    this.createdAt = new Date().toISOString();
  }

  // Return a safe public representation (no password hash)
  toPublic() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      createdAt: this.createdAt,
    };
  }
}

module.exports = User;
