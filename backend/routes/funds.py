from fastapi import APIRouter, HTTPException, Query
import yfinance as yf
import pandas as pd
from models import Fund, FundType, SearchFundsResponse

router = APIRouter(tags=["Funds"])

@router.get("/funds", response_model=SearchFundsResponse)
async def search_funds(query: str = Query(..., description="The search term to use for finding funds")):
    """
    Search for funds, ETFs, and stocks based on a query string using Yahoo Finance
    """
    try:
        print(f"Searching for funds with query: {query}")
        
        mock_funds = []
        
        try:
            lookup_results = yf.Lookup(query)
            all_results = lookup_results.get_all(count=20)
            
            def safe_get_str(row, col, default=None):
                val = row.get(col, default)
                if val is None or (isinstance(val, float) and pd.isna(val)):
                    return default or f"Unknown {col}"
                return str(val)  # Ensure string type
            
            if all_results is not None and not all_results.empty:
                for symbol, row in all_results.iterrows():
                    quote_type = safe_get_str(row, 'quoteType', '').lower()
                    
                    if quote_type in ['etf', 'mutualfund', 'equity']:
                        name = safe_get_str(row, 'shortName', f"{symbol}")
                        
                        if quote_type == 'etf':
                            fund_type = FundType.ETF
                        elif quote_type == 'mutualfund':
                            fund_type = FundType.MUTUAL_FUND
                        else:  # equity or stock
                            fund_type = FundType.STOCK
                        
                        mock_funds.append(Fund(
                            name=name,
                            ticker=str(symbol),
                            fund_type=fund_type
                        ))
        except Exception as yf_error:
            print(f"YFinance error: {str(yf_error)}")
            
            if not mock_funds and query.upper() in ["AAPL", "MSFT", "GOOGL", "AMZN", "SPY", "QQQ", "VTI"]:
                ticker = query.upper()
                if ticker in ["SPY", "QQQ", "VTI"]:
                    fund_type = FundType.ETF
                    name = {
                        "SPY": "SPDR S&P 500 ETF Trust",
                        "QQQ": "Invesco QQQ Trust",
                        "VTI": "Vanguard Total Stock Market ETF"
                    }.get(ticker, f"{ticker} ETF")
                else:
                    fund_type = FundType.STOCK
                    name = {
                        "AAPL": "Apple Inc.",
                        "MSFT": "Microsoft Corporation",
                        "GOOGL": "Alphabet Inc.",
                        "AMZN": "Amazon.com, Inc."
                    }.get(ticker, f"{ticker} Stock")
                
                mock_funds.append(Fund(
                    name=name,
                    ticker=ticker,
                    fund_type=fund_type
                ))
        
        response = SearchFundsResponse(funds=mock_funds, total=len(mock_funds))
        print(f"Returning {len(mock_funds)} funds")
        
        import json
        from pydantic import BaseModel
        
        class PydanticEncoder(json.JSONEncoder):
            def default(self, obj):
                if isinstance(obj, BaseModel):
                    return obj.model_dump()
                return super().default(obj)
        
        response_json = json.dumps(response.model_dump(), cls=PydanticEncoder, indent=2)
        print(f"Response JSON: {response_json}")
        
        for fund in mock_funds:
            print(f"Fund: {fund.name}, ticker: {fund.ticker}, fund_type: {fund.fund_type}, type: {fund.type}")
        
        return response
    
    except Exception as e:
        print(f"Error searching funds: {str(e)}")
        response = SearchFundsResponse(funds=[], total=0)
        return response
