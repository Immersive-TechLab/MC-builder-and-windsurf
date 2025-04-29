from flask import Flask, request, jsonify
from flask_cors import CORS
from pydantic import ValidationError
import yfinance as yf
import pandas as pd
import json
import os
from difflib import SequenceMatcher

from models import (
    SearchFundsResponse,
    GraphDataRequest, GraphDataResponse,
    SearchMarketEventResponse,
    Fund, FundType, GraphDataPoint, MarketEvent
)

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
        
        # Extract ETFs, mutual funds, and stocks
        etfs = lookup_results.get_etf(count=20)
        mutual_funds = lookup_results.get_mutualfund(count=20)
        stocks = lookup_results.get_stock(count=20)
        
        # Convert to our Fund model
        funds = []
        
        # Helper function to safely get a string value from DataFrame cell
        def safe_get_str(row, col, default=None):
            val = row.get(col, default)
            # Check if it's NaN (pandas uses float('nan') for missing values)
            if val is None or (isinstance(val, float) and pd.isna(val)):
                return default or f"Unknown {col}"
            return str(val)  # Ensure string type
        
        # Process ETFs - handle as pandas DataFrame
        if etfs is not None and not etfs.empty:
            for symbol, row in etfs.iterrows():
                funds.append(Fund(
                    name=safe_get_str(row, 'shortName', f"{symbol} ETF"),
                    ticker=str(symbol),
                    fund_type=FundType.ETF
                ))
        
        # Process mutual funds - handle as pandas DataFrame
        if mutual_funds is not None and not mutual_funds.empty:
            for symbol, row in mutual_funds.iterrows():
                funds.append(Fund(
                    name=safe_get_str(row, 'shortName', f"{symbol} Fund"),
                    ticker=str(symbol),
                    fund_type=FundType.MUTUAL_FUND
                ))
                    
        # Process stocks - handle as pandas DataFrame
        if stocks is not None and not stocks.empty:
            for symbol, row in stocks.iterrows():
                funds.append(Fund(
                    name=safe_get_str(row, 'shortName', f"{symbol} Stock"),
                    ticker=str(symbol),
                    fund_type=FundType.STOCK
                ))
        
        # Create response
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
    Get graph data for a list of tickers and return the composite portfolio value
    """
    try:
        # Parse request
        req = GraphDataRequest.model_validate(request.json)
        
        # Extract list of tickers
        tickers = req.holdings
        
        if not tickers:
            return jsonify({"error": "No tickers provided"}), 400
            
        # Download historical data for all tickers
        try:
            # Get historical data (using max period to get all available history)
            data = yf.download(
                tickers=' '.join(tickers),
                period="max",  # Get the maximum available historical data
                interval="1d",  # daily data
                group_by='ticker',
                auto_adjust=True,  # adjust prices for splits and dividends
                progress=False
            )
            
            # If only one ticker, the data structure is different
            if len(tickers) == 1:
                # Convert single ticker format to match multi-ticker format
                ticker = tickers[0]
                close_data = data['Close'].to_frame()
                close_data.columns = pd.MultiIndex.from_product([[ticker], ['Close']])
                data = close_data
            
            # Extract close prices for each ticker
            portfolio_values = pd.DataFrame()
            
            # Process each ticker
            for ticker in tickers:
                if ticker in data:
                    # Extract close price series for this ticker
                    ticker_close = data[ticker]['Close']
                    # Add to portfolio values (sum across tickers)
                    if portfolio_values.empty:
                        portfolio_values = ticker_close.to_frame(name='Value')
                    else:
                        # Handle NaN values by filling with last available value
                        portfolio_values['Value'] = portfolio_values['Value'].add(
                            ticker_close.fillna(method='ffill'), 
                            fill_value=0
                        )
            
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

@app.route('/market-events', methods=['GET'])
def search_market_events():
    """
    Search for market events based on a query string
    """
    query = request.args.get('query', '').lower()
    
    try:
        # Load market events from JSON file
        json_path = os.path.join(os.path.dirname(__file__), 'market_events.json')
        with open(json_path, 'r') as file:
            data = json.load(file)
            
        # Get all events
        all_events = data['events']
        
        # If query is empty, return first 5 events
        if not query:
            events = [MarketEvent(**event) for event in all_events[:5]]
            return jsonify(SearchMarketEventResponse(events=events, total=len(events)).model_dump())
        
        # Scoring function for relevance
        def score_event(event):
            name_similarity = SequenceMatcher(None, query, event['name'].lower()).ratio()
            
            # Check if query appears in description
            desc_match = 1.0 if query in event['description'].lower() else 0
            
            # Higher weight to name matches (0.7) than description matches (0.3)
            return (name_similarity * 0.7) + (desc_match * 0.3)
        
        # Score and sort events by relevance
        scored_events = [(event, score_event(event)) for event in all_events]
        scored_events.sort(key=lambda x: x[1], reverse=True)
        
        # Get top 5 most relevant events
        top_events = [MarketEvent(**event) for event, _ in scored_events[:5]]
        
        # Create response
        response = SearchMarketEventResponse(events=top_events, total=len(top_events))
        return jsonify(response.model_dump())
        
    except Exception as e:
        print(f"Error searching market events: {str(e)}")
        return jsonify(SearchMarketEventResponse(events=[], total=0).model_dump())

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
