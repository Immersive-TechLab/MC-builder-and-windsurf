from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import ValidationError
import os
from dotenv import load_dotenv

from models import (
    Fund, FundType, GraphDataPoint, MarketEventResponse,
    SearchFundsResponse, GraphDataRequest, GraphDataResponse,
)

load_dotenv()

app = FastAPI(
    title="Market Comparison Builder API",
    description="API for searching funds, retrieving historical data, and finding market events",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint to verify the API is running
    """
    return {"status": "healthy", "message": "API is running"}

from routes.funds import router as funds_router
from routes.graph_data import router as graph_data_router
from routes.market_event import router as market_event_router

app.include_router(funds_router)
app.include_router(graph_data_router)
app.include_router(market_event_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
