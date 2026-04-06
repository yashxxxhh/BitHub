# BitHub

A web-based collaborative code editor. Multiple users can write code in the same file at the same time — changes sync instantly, cursors are visible, and a room chat keeps the conversation going.


## How it works

Users create or join a **room** using a unique ID. Once inside, every keystroke is sent over a WebSocket to the server, which broadcasts it to everyone else in the room. Cursor positions follow the same path. On join, the server sends the current state of the code so late arrivals are always in sync. Rooms and active users live in memory on the server — no page refresh needed for anything.

Authentication uses JWTs. On login the server signs a token; the client stores it and attaches it to every subsequent request. Protected routes check the token before responding.


## Tech stack

**Frontend** — React (Vite), Tailwind CSS, Monaco Editor, Socket.io client  
**Backend** — Node.js, Express, Socket.io  
**Auth** — JWT + bcrypt  
**Storage** — In-memory
