# BitHub – Real-Time Collaborative Code Editor

A production-structured, full-stack web application for real-time collaborative coding. Multiple users can edit the same code file simultaneously, see each other's cursors, and communicate via a built-in room chat.

---

## Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 18 + Vite, Tailwind CSS, Monaco Editor, Socket.io-client |
| Backend   | Node.js, Express.js, Socket.io          |
| Auth      | JWT (jsonwebtoken) + bcryptjs           |
| Storage   | In-memory (easily swappable for MongoDB)|

---

## Project Structure

```
BitHub/
├── backend/
│   ├── server.js               # Express + Socket.io entry point
│   ├── config/db.js            # In-memory store (MongoDB-ready schema)
│   ├── models/
│   │   ├── User.js             # User model
│   │   └── Room.js             # Room model with language templates
│   ├── controllers/
│   │   ├── authController.js   # Register / Login / Me
│   │   └── roomController.js   # Create / Get / List / Save
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── roomRoutes.js
│   ├── middleware/auth.js       # JWT verification middleware
│   ├── services/editorService.js  # Business logic: users, cursors, code sync
│   └── sockets/socketManager.js   # All WebSocket event handlers
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx              # Router + providers
        ├── context/
        │   └── AuthContext.jsx  # Global auth state
        ├── pages/
        │   ├── LoginPage.jsx
        │   ├── RegisterPage.jsx
        │   ├── Home.jsx         # Dashboard with room list
        │   └── EditorPage.jsx   # Main collaborative editor
        ├── components/
        │   ├── Editor.jsx       # Monaco editor with remote cursors
        │   ├── Navbar.jsx       # Top bar with save/download
        │   ├── RoomJoin.jsx     # Create/Join room UI
        │   ├── UserPanel.jsx    # Live users sidebar
        │   ├── ChatPanel.jsx    # Room chat
        │   ├── AuthForm.jsx     # Login/Register form
        │   ├── PrivateRoute.jsx # Auth guard
        │   └── Toast.jsx        # Notification toasts
        ├── services/
        │   ├── api.js           # HTTP API calls
        │   └── socketClient.js  # Socket.io client helpers
        ├── hooks/
        │   └── useToast.js
        └── styles/
            └── globals.css
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm v9+

### 1. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Start the backend

```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

### 3. Start the frontend

```bash
cd frontend
npm run dev
# App runs on http://localhost:3000
```

### 4. Open in browser

Go to `http://localhost:3000`

1. **Register** a new account
2. **Create a room** (pick a name and language)
3. **Copy the Room ID** from the navbar
4. Open a second browser tab, log in as a different user, and **Join Room** with the copied ID
5. Both users are now editing the same code in real time!

---

## WebSocket Events

| Event (Client → Server) | Payload                              | Description                     |
|--------------------------|--------------------------------------|---------------------------------|
| `join_room`              | `{ roomId, userId, username }`       | Join a collaborative room        |
| `code_change`            | `{ roomId, code }`                   | Broadcast code changes           |
| `cursor_move`            | `{ roomId, cursor, username, color }`| Broadcast cursor position        |
| `language_change`        | `{ roomId, language }`               | Sync language selector           |
| `send_message`           | `{ roomId, message, username, color}`| Send a chat message              |

| Event (Server → Client) | Payload                              | Description                     |
|--------------------------|--------------------------------------|---------------------------------|
| `sync_code`              | `{ code }`                           | Initial code on join             |
| `code_updated`           | `{ code }`                           | Remote code change               |
| `active_users`           | `{ users }`                          | Current user list                |
| `user_joined`            | `{ user, message }`                  | Someone joined notification      |
| `user_left`              | `{ user, message }`                  | Someone left notification        |
| `cursor_updated`         | `{ socketId, cursor, username, color}`| Remote cursor moved             |
| `language_changed`       | `{ language }`                       | Language switched                |
| `receive_message`        | chat message object                  | New chat message                 |

---

## REST API

### Auth
| Method | Endpoint              | Body                          | Auth |
|--------|-----------------------|-------------------------------|------|
| POST   | `/api/auth/register`  | `{username, email, password}` | ❌   |
| POST   | `/api/auth/login`     | `{email, password}`           | ❌   |
| GET    | `/api/auth/me`        | —                             | ✅   |

### Rooms
| Method | Endpoint                  | Body             | Auth |
|--------|---------------------------|------------------|------|
| POST   | `/api/rooms/create`       | `{name,language}`| ✅   |
| GET    | `/api/rooms`              | —                | ✅   |
| GET    | `/api/rooms/:id`          | —                | ✅   |
| POST   | `/api/rooms/:id/save`     | `{code}`         | ✅   |

---

## Features

- ✅ JWT Authentication (register / login)
- ✅ Room creation with language selection
- ✅ Join rooms via Room ID
- ✅ Real-time code synchronization (Socket.io)
- ✅ Live cursor presence with colored labels per user
- ✅ Active users sidebar with join/leave notifications
- ✅ In-room chat panel
- ✅ Language switcher (JS, TS, Python, C++, Java, HTML)
- ✅ Save code to server
- ✅ Download code as file
- ✅ VS Code-style Monaco editor with custom dark theme
- ✅ Responsive, dark developer UI

---

## Migrating to MongoDB

The in-memory store (`backend/config/db.js`) mirrors a MongoDB document schema.  
To migrate:

1. `npm install mongoose` in the backend
2. Update `config/db.js` to export a Mongoose connection
3. Convert `models/User.js` and `models/Room.js` to Mongoose schemas
4. Replace array operations in controllers/services with `Model.findOne()`, `Model.save()`, etc.

No changes needed to routes, socket manager, or frontend.

---

## Author

Built as a final-year project demonstrating real-time WebSocket communication, layered architecture, and modern full-stack development.
