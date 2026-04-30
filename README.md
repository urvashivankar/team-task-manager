# Team Task Manager

A full-stack production-ready web application built with FastAPI (Backend), MongoDB (Database), and React.js (Frontend).

## Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Axios, React Router Dom
- **Backend**: FastAPI, Python 3.9+, Motor (Async MongoDB Driver), Pydantic
- **Database**: MongoDB
- **Authentication**: JWT-based Authentication, Bcrypt for password hashing

## Test Credentials

For evaluation purposes, you can use the following accounts to test the Role-Based Access Control (RBAC):

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@test.com` | `123456` |
| **Member** | `urvashi@test.com` | `123456` |

> [!NOTE]
> The **Admin** user can create projects, add members, and assign tasks. The **Member** user can only see projects they belong to and update task statuses.

## Setup Instructions

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

## API Endpoints

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

 j  
