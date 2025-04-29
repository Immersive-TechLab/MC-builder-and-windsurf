from pydantic import BaseModel
import enum

# ------ some basic data types ------

class FundType(str, enum.Enum):
    INDEX = "Index"
    ETF = "ETF"
    MUTUAL_FUND = "Mutual Fund"
    STOCK = "Stock"

class Fund(BaseModel):
    name: str # name of the fund
    ticker: str # ticker of the fund
    fund_type: FundType # type of the fund
    
class GraphDataPoint(BaseModel):
    date: str # date of the data point
    value: float # value of the data point

class MarketEvent(BaseModel):
    name: str # name of the market event
    start_date: str # start date of the market event
    end_date: str # end date of the market event
    description: str # description of the market event

# ------ request and response models ------

# GET /funds

class SearchFundsRequest(BaseModel):
    query: str # search query

class SearchFundsResponse(BaseModel):
    funds: list[Fund] # list of fund names matching the search term
    total: int # total number of funds matching the search term

# GET /graph-data

class GraphDataRequest(BaseModel):
    holdings: list[str] # list of ticker symbols to get data for

class GraphDataResponse(BaseModel):
    data: list[GraphDataPoint]
    
# GET /market-events

class SearchMarketEventRequest(BaseModel):
    query: str # name of the market event

class SearchMarketEventResponse(BaseModel):
    events: list[MarketEvent] # list of market events matching the search term
    total: int # total number of market events matching the search term
    