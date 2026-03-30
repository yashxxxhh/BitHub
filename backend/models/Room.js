const { v4: uuidv4 } = require('uuid');

/**
 * Room Model
 * Represents a collaborative coding session.
 */
class Room {
  constructor({ name, language = 'javascript', createdBy }) {
    this.id = uuidv4();
    this.name = name;
    this.language = language;
    this.code = getDefaultCode(language);
    this.createdBy = createdBy;
    this.createdAt = new Date().toISOString();
    this.activeUsers = []; // { socketId, userId, username, color }
  }
}

function getDefaultCode(language) {
  const templates = {
    javascript: `// Welcome to BitHub!\n// Start coding collaboratively...\n\nfunction greet(name) {\n  return \`Hello, \${name}! Welcome to BitHub.\`;\n}\n\nconsole.log(greet('World'));\n`,
    python: `# Welcome to BitHub!\n# Start coding collaboratively...\n\ndef greet(name):\n    return f"Hello, {name}! Welcome to BitHub."\n\nprint(greet("World"))\n`,
    cpp: `// Welcome to BitHub!\n// Start coding collaboratively...\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World! Welcome to BitHub." << endl;\n    return 0;\n}\n`,
    java: `// Welcome to BitHub!\n// Start coding collaboratively...\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World! Welcome to BitHub.");\n    }\n}\n`,
    typescript: `// Welcome to BitHub!\n// Start coding collaboratively...\n\nconst greet = (name: string): string => {\n  return \`Hello, \${name}! Welcome to BitHub.\`;\n};\n\nconsole.log(greet('World'));\n`,
    html: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>BitHub</title>\n</head>\n<body>\n  <h1>Hello, World! Welcome to BitHub.</h1>\n</body>\n</html>\n`,
  };
  return templates[language] || templates['javascript'];
}

module.exports = Room;
