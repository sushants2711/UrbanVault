# Ticket System (Full Stack Take-Home Assignment)

This is a full-stack ticketing system built with React, Material UI, Python, Django, and Django REST Framework.

## Features Implemented
- **Paginated API-Backed Listing**: The tickets list is paginated and powered by DRF's `PageNumberPagination`.
- **Relational Models**: Tickets have relationships with Users, Issues, Floors, and Activities.
- **Role-Based State Transitions**: 
  - Clients create tickets.
  - Department POCs assign workers and mark tickets resolved.
  - Workers submit assessments.
- **Server-Side Validation**: A ticket cannot be created without at least one Issue and Floor (enforced at the Serializer level).
- **Activity Feed**: Every state change or comment adds an entry to the ticket's activity timeline.

## Prerequisites
- Node.js (v18+)
- Python (v3.10+)

## Installation & Run Instructions

### 1. Backend Setup
Navigate to the `backend` directory and set up the Python environment:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt # (or install django djangorestframework django-cors-headers directly)
```
Run migrations and seed the database with sample data (30+ tickets, users, issues, floors):
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py seed_data
```
Start the development server:
```bash
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

## Test Commands
Run the automated tests for the backend (verifies validation and pagination):
```bash
cd backend
source venv/bin/activate
python manage.py test
```

## API Endpoints
- `GET /api/tickets/` - Paginated ticket list. Use `?status=open|closed` or `?search=term`.
- `POST /api/tickets/` - Create a ticket.
- `GET /api/tickets/<id>/` - Retrieve a ticket with full activity feed.
- `POST /api/tickets/<id>/perform_action/` - Perform a state change (e.g. ASSIGN_WORKER, SUBMIT_ASSESSMENT, MARK_RESOLVED) and/or add a comment.
- `GET /api/issues/`, `GET /api/floors/`, `GET /api/users/` - Lookup endpoints.
- `POST /api/activities/` - Post a comment directly.

## Data Model Explanation
- **User**: Simulates roles (Client, POC, Worker).
- **Issue** / **Floor**: Lookup tables to ensure data consistency instead of free-text tags.
- **Ticket**: The core entity. Belongs to an `assignee` (User). Has Many-to-Many relationships with `Issue` and `Floor`.
- **Activity**: Records any event or comment linked to a ticket (One-to-Many).

## Assumptions & Limitations
- **Authentication**: As per instructions, authentication was omitted. Instead, a "Simulate User Role" dropdown is included in the AppBar to easily test different role views (Client, POC, Worker) and their respective actions (Assign, Submit Assessment, Mark Resolved).
- **Styling**: Material UI was used to quickly assemble a clean, accessible interface that mirrors the wireframe's structural intent.

## Time Spent & Future Improvements
- **Time Spent**: ~1.5 hours.
- **Improvements with more time**:
  - Implement full JWT Authentication and role-based permissions at the DRF level.
  - Implement real-time updates (WebSockets) for the activity feed.
  - Add more robust frontend form validation (e.g., using `react-hook-form` + `zod` for better UX).

## AI-Assisted Development
AI tooling was used to scaffold the boilerplate (Vite, Django startup scripts) and to quickly generate the initial Draft models and Material UI grid layouts, allowing me to focus on the core business logic (state transitions) and integration.
