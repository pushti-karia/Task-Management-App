# TaskFlow – Real-Time Task Management System

A full-stack Trello-like task management app built with React, Node.js, MongoDB, and Socket.io.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Redux Toolkit, Tailwind CSS, Framer Motion, @dnd-kit |
| Backend | Node.js, Express.js, JWT Auth |
| Database | MongoDB + Mongoose |
| Real-time | Socket.io |
| Deployment | Vercel (frontend) + Render (backend) + MongoDB Atlas |

---

## Project Structure

```
Task Management App/
├── taskflow-frontend/       # React app
│   └── src/
│       ├── components/      # Reusable UI components
│       │   ├── Auth/        # ProtectedRoute
│       │   ├── Board/       # BoardCard, CreateBoardModal, InviteMemberModal
│       │   ├── Common/      # Avatar, Button, Input, Modal, PriorityBadge, Spinner
│       │   ├── Layout/      # AppLayout, Sidebar, Navbar
│       │   └── Task/        # TaskCard, TaskColumn, TaskModal, CommentSection
│       ├── pages/           # LandingPage, LoginPage, RegisterPage, DashboardPage, BoardPage, ProfilePage
│       ├── store/           # Redux store + slices (auth, boards, tasks, notifications, ui)
│       ├── hooks/           # useAuth, useSocket
│       ├── services/        # api.js (axios), socket.js (socket.io-client)
│       └── utils/           # helpers.js (dates, priority config, etc.)
│
└── taskflow-backend/        # Express API
    └── server/
        ├── config/          # db.js, seed.js
        ├── controllers/     # authController, boardController, taskController, commentController, notificationController
        ├── middleware/       # auth.js, error.js, upload.js
        ├── models/          # User, Board, Task, Comment, Notification
        ├── routes/          # auth, boards, tasks, comments, notifications
        ├── sockets/         # socketHandler.js
        └── index.js         # Entry point
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Git

---

### 1. Clone & Setup

```bash
git clone <your-repo-url>
cd "Task Management App"
```

### 2. Backend Setup

```bash
cd taskflow-backend
npm install

# Copy and fill in environment variables
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, etc.

# (Optional) Seed demo data
npm run seed

# Start development server
npm run dev
```

Backend runs on: `http://localhost:5000`

### 3. Frontend Setup

```bash
cd taskflow-frontend
npm install

# Copy environment variables
cp .env.example .env
# REACT_APP_API_URL=http://localhost:5000/api
# REACT_APP_SOCKET_URL=http://localhost:5000

# Start development server
npm start
```

Frontend runs on: `http://localhost:3000`

---

## Environment Variables

### Backend `.env`
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/taskflow
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

### Frontend `.env`
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |
| PUT | `/api/auth/password` | Change password |
| GET | `/api/auth/search?q=` | Search users |

### Boards
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/boards` | Get all user boards |
| POST | `/api/boards` | Create board |
| GET | `/api/boards/:id` | Get single board |
| PUT | `/api/boards/:id` | Update board |
| DELETE | `/api/boards/:id` | Delete board |
| POST | `/api/boards/:id/invite` | Invite member |
| DELETE | `/api/boards/:id/members/:userId` | Remove member |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks/board/:boardId` | Get board tasks |
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks/:id` | Get task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| PUT | `/api/tasks/:id/move` | Move task |
| PUT | `/api/tasks/reorder` | Reorder tasks |

### Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/comments/task/:taskId` | Get task comments |
| POST | `/api/comments` | Add comment |
| PUT | `/api/comments/:id` | Edit comment |
| DELETE | `/api/comments/:id` | Delete comment |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get notifications |
| PUT | `/api/notifications/read-all` | Mark all read |
| PUT | `/api/notifications/:id/read` | Mark one read |

---

## Socket.io Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join_board` | Client → Server | Join a board room |
| `leave_board` | Client → Server | Leave a board room |
| `task_created` | Client ↔ Server | New task broadcast |
| `task_updated` | Client ↔ Server | Task update broadcast |
| `task_deleted` | Client ↔ Server | Task delete broadcast |
| `task_moved` | Client ↔ Server | Drag & drop broadcast |
| `typing_start` | Client → Server | Comment typing indicator |
| `typing_stop` | Client → Server | Stop typing indicator |
| `new_comment` | Client ↔ Server | New comment broadcast |
| `notification` | Server → Client | Push notification |
| `online_users` | Server → Client | Online users list |

---

## Deployment

### Frontend → Vercel
```bash
cd taskflow-frontend
npm run build
# Push to GitHub, connect repo to Vercel
# Set environment variables in Vercel dashboard
```

### Backend → Render
1. Push backend to GitHub
2. Create new Web Service on Render
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add all environment variables from `.env`

### Database → MongoDB Atlas
1. Create free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create database user
3. Whitelist IP `0.0.0.0/0` for Render
4. Copy connection string to `MONGO_URI`

---

## Demo Credentials
After running `npm run seed`:
- **Email:** `demo@taskflow.com`
- **Password:** `demo1234`

---

## Features
- ✅ JWT Authentication (register/login)
- ✅ Kanban board with drag-and-drop (@dnd-kit)
- ✅ Real-time collaboration (Socket.io)
- ✅ Task priorities, labels, due dates
- ✅ Comments with typing indicators
- ✅ Team member invitations
- ✅ Notification system
- ✅ Dark mode
- ✅ Responsive design
- ✅ Search & filter tasks
- ✅ Activity history per task
- ✅ Protected routes
