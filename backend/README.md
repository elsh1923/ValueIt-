# Backend - Cost-Based Valuation System

This is the FastAPI-based backend for the property valuation system.

## Tech Stack

- **Framework**: FastAPI
- **ORM**: SQLAlchemy
- **Database**: PostgreSQL (via `asyncpg`)
- **Migrations**: Alembic
- **Authentication**: JWT (OAuth2 with Password Flow)

## Getting Started

### 1. Prerequisites

Ensure you have Python 3.10+ and a PostgreSQL server running.

### 2. Environment Configuration

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost/dbname
SECRET_KEY=your-super-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 3. Installation

```bash
python -m venv venv
# Linux/Mac
source venv/bin/activate
# Windows
venv\Scripts\activate

pip install -r requirements.txt
```

### 4. Database Migrations

```bash
alembic upgrade head
```

### 5. Running the API

```bash
python -m uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

## API Documentation

- **Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

## Project Structure

- `app/api/`: API endpoints (routers).
- `app/core/`: Security, config, and database engine.
- `app/models/`: SQLAlchemy database models.
- `app/schemas/`: Pydantic models for data validation.
- `app/main.py`: Application entry point.
