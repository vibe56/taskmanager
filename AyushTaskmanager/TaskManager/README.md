# Taskhive — Task Manager (Node.js Edition)

Full-stack task management app with **Node.js + Express** backend and **React + Vite** frontend.

---

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 18, Vite, Axios               |
| Backend  | Node.js, Express 4                  |
| Database | SQLite via better-sqlite3           |
| Validation | express-validator                 |

---

## Project Structure

```
TaskManager-Node/
├── backend/
│   ├── db/
│   │   └── database.js        ← SQLite setup + seed data
│   ├── models/
│   │   └── TaskModel.js       ← All DB queries
│   ├── middleware/
│   │   └── validate.js        ← Input validation rules
│   ├── routes/
│   │   └── tasks.js           ← All API endpoints
│   ├── server.js              ← Entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/tasks.js
    │   ├── hooks/useTasks.js
    │   ├── components/
    │   │   ├── Sidebar.jsx
    │   │   ├── Header.jsx
    │   │   ├── TaskBoard.jsx
    │   │   ├── TaskCard.jsx
    │   │   ├── TaskForm.jsx
    │   │   └── Toast.jsx
    │   ├── App.jsx
    │   └── index.css
    └── package.json
```

---

## Setup & Running

### Prerequisites
- Node.js 18+ — check with `node --version`

---

### 1. Start the Backend

```bash
cd backend
npm install
npm run dev        # uses nodemon for auto-reload on save
# or
npm start          # plain node, no auto-reload
```

API starts at **http://localhost:5000**

---

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

App opens at **http://localhost:5173**

---

## API Endpoints

| Method | Route                   | Description                          |
|--------|-------------------------|--------------------------------------|
| GET    | /api/tasks              | List all tasks (filterable/sortable) |
| GET    | /api/tasks/stats        | Dashboard summary counts             |
| GET    | /api/tasks/:id          | Get one task                         |
| POST   | /api/tasks              | Create a task                        |
| PUT    | /api/tasks/:id          | Update a task                        |
| DELETE | /api/tasks/:id          | Delete a task                        |
| PATCH  | /api/tasks/:id/toggle   | Toggle Pending ↔ Completed           |

### Query Parameters (GET /api/tasks)

| Param    | Example values              | Description        |
|----------|-----------------------------|--------------------|
| status   | `Pending`, `Completed`      | Filter by status   |
| priority | `High`, `Medium`, `Low`     | Filter by priority |
| sortBy   | `dueDate`, `priority`, `title` | Sort order      |
| search   | `fix bug`                   | Search title/desc  |

---

## Assumptions

- SQLite is used for portability — no separate DB server needed.
- The `db/tasks.db` file is auto-created with 5 seed tasks on first run.
- No authentication implemented (out of scope for this assignment).
