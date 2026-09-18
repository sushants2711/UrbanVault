# UrbanVault Ticketing System (Full Stack)

This is a premium, full-stack facility ticketing system built with **React**, **Tailwind CSS**, **Python**, **Django**, and **Django REST Framework**. 

## Features Implemented
- **Premium Dynamic UI**: Fully custom-built responsive user interface using Tailwind CSS, featuring glassmorphism, dynamic micro-animations, and modern layout structures. (Material UI was completely removed in favor of a bespoke aesthetic).
- **Modular Frontend Architecture**: Component-driven React architecture with dedicated feature folders (`/ticket-list`, `/ticket-detail`, `/create-ticket`) replacing monolithic single-page components.
- **Advanced Backend Search & Filtering**: Multi-field server-side searching using Django `Q` objects combined with frontend debouncing (800ms) for optimized performance.
- **Paginated API-Backed Listing**: The tickets list is paginated (10 per page) and powered by DRF's `PageNumberPagination`.
- **Relational Models & Full CRUD**: Tickets have relationships with Users, Issues, Floors, and Activities. The backend provides full CRUD capabilities (Create, Read, Update, Delete) for all models.
- **Dynamic Form Population**: The "Create Ticket" form dynamically fetches available Floors and Issues directly from the backend API.
- **Role-Based State Transitions**: 
  - Clients create tickets.
  - Department POCs assign workers and mark tickets resolved.
  - Workers submit assessments.
- **Django Admin Panel**: A fully configured `/admin` panel for managing all underlying data (Users, Issues, Floors, Tickets, Activities) with search bars and filters.
- **Docker Ready**: Includes `Dockerfile` and `Dockerfile.dev` for both frontend and backend for easy containerized deployments.

## Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- Docker (Optional)

## Installation & Run Instructions

### 1. Backend Setup
Navigate to the `backend` directory and set up the Python environment:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```
Run migrations and start the development server:
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

### 2. Frontend Setup
Navigate to the `frontend` directory:
```bash
cd frontend
npm install
```
Start the Vite development server:
```bash
npm run dev
```

The app will run at `http://localhost:5173/`.

### 3. Running with Docker
Both the `frontend` and `backend` directories contain `Dockerfile` (for production) and `Dockerfile.dev` (for development).

### 4. Admin Panel Access
The application comes with a built-in Django Admin Panel that allows you to manage all database records through a graphical interface.

- **URL:** `http://localhost:8000/admin`
- **Username:** `admin`
- **Password:** `admin`

**Available Management Features:**
- **Users**: Create, update, or delete system users and their roles (`CLIENT`, `POC`, `WORKER`).
- **Issues & Floors**: Add new issue categories (e.g., HVAC, Electrical) or facility floors so they dynamically populate in the frontend's "Create Ticket" dropdowns.
- **Tickets & Activities**: View all tickets, update their statuses directly, re-assign them, and monitor the activity feeds.

## API Endpoints
- `GET /api/tickets/` - Paginated ticket list. Use `?status=open|closed`, `?floor=1F`, or `?search=term`.
- `POST /api/tickets/` - Create a ticket.
- `PATCH /api/tickets/<id>/` - Update a ticket.
- `DELETE /api/tickets/<id>/` - Delete a ticket.
- `GET /api/tickets/<id>/` - Retrieve a ticket with full activity feed.
- `POST /api/tickets/<id>/perform_action/` - Perform a state change (e.g. ASSIGN_WORKER) and add a comment.
- `GET, POST, PATCH, DELETE` for `/api/issues/`, `/api/floors/`, `/api/users/` - Full CRUD lookup endpoints.

## Data Model Explanation
- **User**: Simulates roles (Client, POC, Worker).
- **Issue** / **Floor**: Lookup tables to ensure data consistency instead of free-text tags.
- **Ticket**: The core entity. Belongs to an `assignee` (User). Has Many-to-Many relationships with `Issue` and `Floor`.
- **Activity**: Records any event or comment linked to a ticket (One-to-Many).

## Testing
I cannot write the test cases because I don't know some things. Normally, you would use:
- Backend: `python manage.py test` or `pytest`
- Frontend: `npm run test`

## Assumptions & Limitations
- **Authentication**: Authentication was omitted. Instead, a "Simulating Role" dropdown is included in the AppBar to easily test different role views (Client, POC, Worker) when viewing a ticket.
- **Performance**: We are not applying Redis for fast data access yet, which could be a limitation for high-traffic environments.

## Actual Time Spent
- 4 hours

## Areas for Improvement
- Apply Redis for fast data access and caching to improve performance.
- Write unit and integration tests to ensure code reliability.
- Implement robust authentication (e.g., JWT) to secure API endpoints.
