from fastapi import APIRouter, HTTPException, Query
import os
import openai
import json
from models import MarketEventResponse

router = APIRouter(tags=["Market Events"])

@router.get("/market-event", response_model=MarketEventResponse)
async def generate_market_event(query: str = Query(..., description="The search term to generate a relevant market event")):
    """
    Generate a market event based on a query string using OpenAI
    """
    if not query:
        raise HTTPException(status_code=400, detail="Query parameter is required")
    
    try:
        api_key = os.environ.get("OPENAI_API_KEY")
        if not api_key:
            raise HTTPException(
                status_code=500, 
                detail="OpenAI API key not found. Please set OPENAI_API_KEY in your .env file."
            )
        
        client = openai.OpenAI(api_key=api_key)
        
        sysprompt = """
        Generate realistic financial market event information based on a user query.
        
        The response should be in JSON format with the following fields:
        1. start_date: When the event began (in YYYY-MM-DD format)
        2. end_date: When the market fully recovered from the event (in YYYY-MM-DD format)
        3. name: A clear, concise name for the event (derived from the user query when possible)
        4. description: A detailed description (2-3 sentences) explaining what this market event was and how it affected financial markets
        
        The dates MUST be historically accurate for a real market event. Use your internet search tool to try and find information about the event, since it may have occured after your knowledge cutoff date.
        """

        userprompt = f"""
        The user query is: {query}
        """
        
        response = client.responses.parse(
            model="gpt-4.1-2025-04-14",
            input=[
                {"role": "system", "content": sysprompt},
                {"role": "user", "content": userprompt}
            ],
            tools=[{"type": "web_search_preview"}],
            text_format=MarketEventResponse
        )
        
        market_event = response.output_parsed
        
        return market_event
        
    except Exception as e:
        print(f"Error generating market event: {str(e)}")
        return MarketEventResponse()

@router.get("/market-events")
async def get_market_events(q: str = Query(None, description="Optional search term for market events")):
    """
    Get market events matching the search query
    """
    try:
        with open("market_events.json", "r") as f:
            events = json.load(f)
        
        if q:
            filtered_events = [
                event for event in events
                if q.lower() in event.get("name", "").lower() or 
                   q.lower() in event.get("description", "").lower()
            ]
            return filtered_events
        
        return events
    except Exception as e:
        print(f"Error fetching market events: {str(e)}")
        return []
