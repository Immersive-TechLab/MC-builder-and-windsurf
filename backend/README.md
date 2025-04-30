# Market Comparison Builder API

This is the FastAPI backend for the Market Comparison Builder application.

## Features

- Fund search using Yahoo Finance API
- Graph data generation for portfolio holdings
- Market event search and generation

## Getting Started

### Prerequisites

- Python 3.12+
- Poetry (for dependency management)

### Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:

```bash
cd backend
poetry install
```

### Running the API

```bash
poetry run uvicorn main:app --reload --host 0.0.0.0 --port 5000
```

Or directly with Python:

```bash
python -m uvicorn main:app --reload --host 0.0.0.0 --port 5000
```

### API Documentation

FastAPI automatically generates interactive API documentation:

- Swagger UI: http://localhost:5000/docs
- ReDoc: http://localhost:5000/redoc

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
OPENAI_API_KEY=your_openai_api_key
```

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /funds` - Search for funds by name or ticker
- `POST /graph-data` - Generate graph data for a portfolio
- `GET /market-event` - Generate a market event based on a query
- `GET /market-events` - Get a list of market events
