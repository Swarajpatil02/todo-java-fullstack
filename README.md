# TaskFlow — Full-Stack To-Do Application

A complete To-Do web app using **React + Vite** (frontend), **Java + Spring Boot** (backend), and **MySQL** (database).

## Features
- Add, edit, delete tasks
- Mark tasks complete/incomplete
- Filter All / Pending / Completed
- Persist tasks in MySQL
- REST API with validation and clear error responses
- Responsive UI

## Requirements
- Java 17 or newer
- Maven 3.9+ (or use your IDE's Maven support)
- Node.js 20+ and npm
- MySQL 8+ (or Docker Desktop)

## 1. Start MySQL

### Option A — Docker (recommended)
From the project root:
```bash
docker compose up -d
```
This starts MySQL on port `3306` and creates database `todo_db`.

### Option B — Existing MySQL
Create the database:
```sql
CREATE DATABASE todo_db;
```
Then update `backend/src/main/resources/application.properties` with your MySQL username/password.

## 2. Run the Java backend
Open a terminal in `backend`:
```bash
mvn spring-boot:run
```
Backend URL: `http://localhost:8080`
API endpoint: `http://localhost:8080/api/tasks`

## 3. Run the React frontend
Open another terminal in `frontend`:
```bash
npm install
npm run dev
```
Open the URL Vite prints, normally `http://localhost:5173`.

## REST API
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/tasks` | List tasks |
| GET | `/api/tasks/{id}` | Get one task |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/{id}` | Update title/description |
| PATCH | `/api/tasks/{id}/toggle` | Toggle completion |
| DELETE | `/api/tasks/{id}` | Delete task |

### Example POST body
```json
{
  "title": "Complete Java assignment",
  "description": "Finish the REST API practical"
}
```

## Troubleshooting
- **MySQL connection error:** make sure MySQL/Docker is running and credentials match `application.properties`.
- **Port 8080 already in use:** stop the other app using it, or change `server.port`.
- **Port 5173 already in use:** Vite will offer another port.
- **`mvn` not recognized:** install Maven, or run the project from IntelliJ IDEA using the Maven panel.
- **CORS:** the backend permits the Vite dev server at `http://localhost:5173`.

## Project structure
```text
todo-java-fullstack/
├── backend/       # Java Spring Boot REST API
├── frontend/      # React UI
├── docker-compose.yml
└── README.md
```
