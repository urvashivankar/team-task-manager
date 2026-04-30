# Team Task Manager

A full-stack production-ready web application built with FastAPI (Backend), MongoDB (Database), and React.js (Frontend).

## 🚀 Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Axios, React Router Dom
- **Backend**: FastAPI, Python 3.9+, Motor (Async MongoDB Driver), Pydantic
- **Database**: MongoDB
- **Authentication**: JWT-based Authentication, Bcrypt for password hashing

## 🔑 Test Credentials

For evaluation purposes, you can use the following accounts to test the Role-Based Access Control (RBAC):

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@test.com` | `123456` |
| **Member** | `urvashi@test.com` | `123456` |

> [!NOTE]
> The **Admin** user can create projects, add members, and assign tasks. The **Member** user can only see projects they belong to and update task statuses.

## 📦 Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Mac/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the MongoDB database. You can run MongoDB locally or use a cloud provider like MongoDB Atlas.
5. Create a `.env` file in the backend directory with your configurations (see example inside).
6. Start the FastAPI development server:
   ```bash
   uvicorn main:app --reload
   ```

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node.js dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## 🌍 API Endpoints

Once the backend is running, you can access the interactive Swagger UI documentation at:
**http://localhost:8000/docs**

### Auth
- `POST /api/auth/signup`: Register a new user
- `POST /api/auth/login`: Login and receive a JWT token
- `GET /api/auth/me`: Get current logged-in user

### Projects
- `GET /api/projects/`: List all projects
- `POST /api/projects/`: Create a new project (Admin only)
- `GET /api/projects/{id}`: Get project details
- `POST /api/projects/{id}/members/{user_id}`: Add a user to a project (Admin only)

### Tasks
- `GET /api/tasks/`: List tasks (supports filtering)
- `POST /api/tasks/`: Create a new task (Admin only)
- `PUT /api/tasks/{id}`: Update task status/details
- `DELETE /api/tasks/{id}`: Delete a task (Admin only)

### Users
- `GET /api/users/`: List all users for assignments

## ☁️ Deployment Guide

### Backend on Railway

1. Push your code to a GitHub repository.
2. Sign in to [Railway.app](https://railway.app/).
3. Click **New Project** > **Deploy from GitHub repo** and select your repository.
4. **Important**: Since the backend is in a subfolder, configure the Root Directory in Railway settings to `/backend`.
5. Add a MongoDB database to your Railway project by clicking **New** > **Database** > **MongoDB**.
6. Railway will provide a connection string (`MONGO_URL`). Go to your Backend service's **Variables** section and add:
   - `MONGODB_URL`: Your Railway MongoDB connection string
   - `DATABASE_NAME`: `team_task_manager`
   - `SECRET_KEY`: A strong random string
   - `ALGORITHM`: `HS256`
   - `ACCESS_TOKEN_EXPIRE_MINUTES`: `60`
7. In the Railway service settings, set the **Start Command** to:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
8. Deploy the backend and copy the public URL provided by Railway.

### Frontend on Vercel

1. Go to [Vercel.com](https://vercel.com/) and click **Add New** > **Project**.
2. Import the same GitHub repository.
3. Edit the **Framework Preset** to Vite.
4. Edit the **Root Directory** to `frontend`.
5. Before deploying, update your `src/api.js` file to replace `http://localhost:8000/api` with your new Railway backend URL (e.g., `https://your-backend-url.up.railway.app/api`).
   *(For a better approach, use Environment Variables in Vercel like `VITE_API_URL` and configure Axios to use `import.meta.env.VITE_API_URL`)*.
6. Click **Deploy**.

## 🎥 Demo Script / Explanation

**Introduction**: 
"Welcome to the Team Task Manager demo. This application is built with a modern, decoupled architecture using React and Tailwind CSS on the frontend, and FastAPI with MongoDB on the backend."

**Features**:
1. **Authentication**: Users can securely sign up and log in. JWT tokens are used to maintain session state.
2. **Role-Based Access Control**: Notice the difference between an Admin and a standard Member. Admins have the ability to create projects, assign tasks, and add members. Members can only view their assigned projects and update task statuses.
3. **Dashboard**: The dashboard provides a real-time overview of tasks broken down by status (Todo, In Progress, Done) and lists tasks specifically assigned to the logged-in user.
4. **Project Detail (Kanban)**: Inside a project, tasks are organized into lanes. Admins can seamlessly create new tasks and assign them to team members from a dropdown populated via the `/api/users/` endpoint.

**Architecture Benefits**:
- **FastAPI**: Provides automatic API documentation, asynchronous performance, and type safety with Pydantic.
- **MongoDB**: The NoSQL approach allowed us to rapidly prototype our data models, efficiently nesting member arrays directly within the project documents.
- **Vite & React**: Ensures an incredibly fast development loop and a highly responsive, single-page application experience for the user.
