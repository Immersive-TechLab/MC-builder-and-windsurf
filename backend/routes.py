from flask import Flask, request, jsonify
from flask_cors import CORS
from pydantic import ValidationError
import yfinance as yf
import pandas as pd
import os
import openai
from dotenv import load_dotenv
from models import (
    Fund, FundType, GraphDataPoint, MarketEventResponse,
    SearchFundsResponse,
    GraphDataRequest, GraphDataResponse,
)

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Helper function to parse Pydantic model from request
def parse_request_model(model_cls, request_data):
    try:
        return model_cls.model_validate(request_data)
    except ValidationError as e:
        return None, str(e)

@app.route('/funds', methods=['GET'])
def search_funds():
    """
    Search for funds, ETFs, and stocks based on a query string using Yahoo Finance
    """
    query = request.args.get('query', '')
    
    # Use yfinance Lookup to search for funds
    try:
        # Get all relevant results
        lookup_results = yf.Lookup(query)
        
        # Get all results at once instead of separate calls
        all_results = lookup_results.get_all(count=20)
        
        # Convert to our Fund model
        funds = []
        
        # Helper function to safely get a string value from DataFrame cell
        def safe_get_str(row, col, default=None):
            val = row.get(col, default)
            # Check if it's NaN (pandas uses float('nan') for missing values)
            if val is None or (isinstance(val, float) and pd.isna(val)):
                return default or f"Unknown {col}"
            return str(val)  # Ensure string type
        
        # Process all results if we have any
        if all_results is not None and not all_results.empty:
            for symbol, row in all_results.iterrows():
                # Get the quoteType to determine the fund type
                quote_type = safe_get_str(row, 'quoteType', '').lower()
                
                # Only process ETFs, mutual funds, and stocks
                if quote_type in ['etf', 'mutualfund', 'equity']:
                    name = safe_get_str(row, 'shortName', f"{symbol}")
                    
                    # Map quote_type to our FundType enum
                    if quote_type == 'etf':
                        fund_type = FundType.ETF
                    elif quote_type == 'mutualfund':
                        fund_type = FundType.MUTUAL_FUND
                    else:  # equity or stock
                        fund_type = FundType.STOCK
                    
                    funds.append(Fund(
                        name=name,
                        ticker=str(symbol),
                        fund_type=fund_type
                    ))
        
        response = SearchFundsResponse(funds=funds, total=len(funds))
        return jsonify(response.model_dump())
    
    except Exception as e:
        # Log the error (in a production app)
        print(f"Error searching funds: {str(e)}")
        # Return an empty result rather than an error
        response = SearchFundsResponse(funds=[], total=0)
        return jsonify(response.model_dump())

@app.route('/graph-data', methods=['POST'])
def get_graph_data():
    """
    Get graph data for a portfolio of holdings within a specified date range
    """
    try:
        # Parse request
        req = GraphDataRequest.model_validate(request.json)
        
        # Extract list of holdings
        holdings = req.holdings
        start_date = req.start_date
        end_date = req.end_date
        
        if not holdings:
            return jsonify({"error": "No holdings provided"}), 400
            
        # Get list of tickers
        tickers = [holding.ticker for holding in holdings]
        
        # Create mapping of tickers to purchase values
        ticker_to_value = {holding.ticker: holding.purchase_value for holding in holdings}
        
        # Download historical data for all tickers
        try:
            # Get historical data for the given date range
            data = yf.download(
                tickers=' '.join(tickers),
                start=start_date,
                end=end_date,
                interval="1d",  # daily data
                group_by='ticker',
                auto_adjust=True,  # adjust prices for splits and dividends
                progress=False
            )
            
            # Initialize portfolio value DataFrame
            portfolio_values = pd.DataFrame()
            
            # Process each ticker
            for ticker in tickers:
                print(f"Processing ticker: {ticker}")
                if ticker in data:
                    # Extract close price series for this ticker
                    ticker_close = data[ticker]['Close']
                    print(f"Found ticker {ticker} in data. Data points: {len(ticker_close)}")
                    
                    if not ticker_close.empty:
                        # Get the initial price at start date (or first available date)
                        initial_price = ticker_close.iloc[0]
                        print(f"Initial price for {ticker}: {initial_price}")
                        
                        # Calculate number of shares that could be purchased with purchase_value
                        purchase_value = ticker_to_value[ticker]
                        num_shares = purchase_value / initial_price if initial_price > 0 else 0
                        print(f"Calculated {num_shares} shares for {ticker} with purchase value {purchase_value}")
                        
                        # Calculate the value of these shares over time
                        ticker_value = ticker_close * num_shares
                        
                        # Add to portfolio values (sum across tickers)
                        if portfolio_values.empty:
                            portfolio_values = ticker_value.to_frame(name='Value')
                        else:
                            # Handle NaN values by filling with last available value
                            portfolio_values['Value'] = portfolio_values['Value'].add(
                                ticker_value.fillna(method='ffill'), 
                                fill_value=0
                            )
                    else:
                        print(f"Ticker {ticker} data is empty")
                else:
                    print(f"Ticker {ticker} not found in data structure. Available keys: {list(data.keys()) if hasattr(data, 'keys') else 'No keys, data type: ' + str(type(data))}")
            
            # Convert the DataFrame to the required response format
            data_points = []
            
            # Skip if no data was found
            if not portfolio_values.empty:
                # Reset index to get the date as a column
                portfolio_values = portfolio_values.reset_index()
                
                # Convert to the required model format
                for _, row in portfolio_values.iterrows():
                    date_str = row['Date'].strftime('%Y-%m-%d')
                    value = float(row['Value'])
                    data_points.append(GraphDataPoint(date=date_str, value=value))
            
            # Create response
            response = GraphDataResponse(data=data_points)
            return jsonify(response.model_dump())
            
        except Exception as e:
            print(f"Error fetching historical data: {str(e)}")
            return jsonify({"error": f"Failed to fetch historical data: {str(e)}"}), 500
            
    except ValidationError as e:
        return jsonify({"error": str(e)}), 400

@app.route('/market-event', methods=['GET'])
def generate_market_event():
    """
    Generate a market event based on a query string using OpenAI
    """
    query = request.args.get('query', '')
    
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400
    
    try:
        # Get API key from environment variables
        api_key = os.environ.get("OPENAI_API_KEY")
        if not api_key:
            return jsonify({"error": "OpenAI API key not found. Please set OPENAI_API_KEY in your .env file."}), 500
        
        # Initialize OpenAI client
        client = openai.OpenAI(api_key=api_key)
        
        # Prompt to generate a market event
        sysprompt = """
        Generate realistic financial market event information based on a user query.
        
        The response should be in JSON format with the following fields:
        1. start_date: When the event began (in YYYY-MM-DD format)
        2. end_date: When the event ended (in YYYY-MM-DD format)
        3. name: A clear, concise name for the event (derived from the user query when possible)
        4. description: A detailed description (2-3 sentences) explaining what this market event was and how it affected financial markets
        
        The dates MUST be historically accurate for a real market event. Use your internet search tool to try and find information about the event, since it may have occured after your knowledge cutoff date.
        """

        userprompt = f"""
        The user query is: {query}
        """
        
        # Call OpenAI to generate the market event
        response = client.responses.parse(
            model="gpt-4.1-2025-04-14",
            input=[
                {"role": "system", "content": sysprompt},
                {"role": "user", "content": userprompt}
            ],
            tools=[{"type": "web_search_preview"}],
            text_format=MarketEventResponse
        )
        
        # Parse the generated content
        market_event = response.output_parsed
        
        # Create response with a single event
        return jsonify(market_event.model_dump())
        
    except Exception as e:
        print(f"Error generating market event: {str(e)}")
        return jsonify(MarketEventResponse().model_dump())

# Helper function to calculate text similarity score
def calculate_similarity(text, search_query):
    from difflib import SequenceMatcher
    # Convert both to lowercase for case-insensitive comparison
    text = text.lower()
    search_query = search_query.lower()
    
    # Direct match gets highest score
    if search_query in text:
        # Prioritize exact matches or matches at the beginning
        if text.startswith(search_query):
            return 1.0
        return 0.9
    
    # Otherwise use sequence matcher for fuzzy matching
    return SequenceMatcher(None, text, search_query).ratio()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
